'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var forEach = require('./index');
var through = require('through');

it('should call the function once per file', function (cb) {
  
  var count = 0;
    
  var stream = forEach(function(stream){
    count++;
  });

  stream.on('end', cb);

  assert.equal(count, 0);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 1);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 2);

  stream.end();
});

it('should be possible to return a stream from the function', function (cb) {
    
  var count = 0;
  
  var stream = forEach(function(stream){
    return stream;
  });

  stream.on('data', function (file) {
    count++;
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), 'unicorns');
  });

  stream.on('end', cb);

  assert.equal(count, 0);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 1);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 2);

  stream.end();
});

it('should support multiple outputs', function (cb) {
  
  var count = 0;
    
  var stream = forEach(function(stream){
    return stream.pipe(through(function(file){
      console.log("file contents", file.contents.toString());
      this.queue(file);
      this.queue(file);
    }));
  });

  stream.on('data', function (file) {
    console.log("data");
    count++;
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), 'unicorns');
  });

  assert.equal(count, 0);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
    
  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));

  stream.end();
  
  stream.on('end', function(){
    assert.equal(count, 4);
    cb();
  });
  
});


it('should throw an error if not called with a function', function(){
  
  assert.throws(forEach);
  assert.throws(forEach.bind(null, {}));
  
});

it('should pass the file as the second argument to the function', function(cb){
    
  var stream = forEach(function(stream, file){
    return stream.pipe(through(function(data){
      assert.equal(data, file);
    }));
  });

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));
    
  stream.end();
  
  stream.on('end', function(){
    cb();
  });
});