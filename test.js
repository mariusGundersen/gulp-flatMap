'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var flatMap = require('./index');
var through = require('through2');

it('should call the function once per file', function (cb) {

  var count = 0;

  var stream = flatMap(function(stream){
    count++;
    return stream;
  });

  stream.on('data', function(){

  });

  stream.on('end', function(){
    assert.equal(count, 2);
    cb();
  });

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
});

it('should require the function returns a stream', function (cb) {

  var stream = flatMap(function(stream){
  });

  stream.on('data', function (file) {
  });

  stream.on('error', function(){
    cb();
  });

  stream.on('end', function(){
    cb.fail();
  });

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));

  stream.end();
});

it('should support multiple outputs', function (cb) {

  var count = 0;

  var stream = flatMap(function(stream){
    return stream.pipe(through.obj(function(file, enc, done){
      this.push(file);
      this.push(file);
      done();
    }));
  });

  stream.on('data', function (file) {
    count++;
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), 'unicorns');
  });

  stream.on('end', function(){
    assert.equal(count, 4);
    cb();
  });

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
});


it('should throw an error if not called with a function', function(){

  assert.throws(flatMap);
  assert.throws(flatMap.bind(null, {}));

});

it('should pass the file as the second argument to the function', function(cb){

  var stream = flatMap(function(stream, file){
    return stream.pipe(through.obj(function(data, enc, done){
      assert.equal(data, file);
      done();
    }));
  });

  stream.on('data', function(){

  });

  stream.on('end', function(){
    cb();
  });

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('unicorns')
  }));

  stream.end();
});

it('should handle many files', function(cb){
  var stream = flatMap(function(stream, file){
    return stream;
  });

  var count = 0;

  stream.on('data', function(file){
    count++;
  });

  stream.on('end', function(){
    assert.equal(32, count);
    cb();
  });

  for(var i = 0; i < 32; i++){
    stream.write(new gutil.File({
      base: __dirname,
      path: 'file'+i+'.ext',
      contents: new Buffer(i+'unicorns')
    }));
  }

  stream.end();
});