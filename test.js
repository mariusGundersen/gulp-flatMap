'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var fork = require('./index');

it('should call the function once per file', function (cb) {
  
  var count = 0;
  function increment(stream){
    count++;
    return stream;
  }
  
  var stream = fork(increment);

  stream.on('data', function (file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), 'unicorns');
  });

  stream.on('end', cb);

  assert.equal(count, 0);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: __dirname + 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 1);
  
  stream.write(new gutil.File({
    base: __dirname,
    path: __dirname + 'file.ext',
    contents: new Buffer('unicorns')
  }));
  
  assert.equal(count, 2);

  stream.end();
});
