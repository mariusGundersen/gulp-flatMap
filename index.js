'use strict';
var PluginError = require('plugin-error');
var through = require('through2');
var Stream = require('stream');
var utils = require('util');
var Readable = Stream.Readable;
var Duplex = Stream.Duplex;
var Transform = Stream.Transform;

module.exports = function (func) {

  if (!func || typeof func != 'function') {
    throw new PluginError('gulp-flatMap', '`flatMap` must be called with one parameter, a function');
  }

  var openStreams = [];
  var ended = false;
  var error = false;


  function closeStreamIfNoMoreOpenStreams(stream){
    if(openStreams.length == 0){
      if(ended && !error){
        stream.push(null);
      }
    }else{

    }
  }

  return through.obj(function(data, enc, done){

    if (data.isStream()) {
      this.emit('error', new PluginError('gulp-flatMap', 'Streaming not supported'));
      return;
    }

    var self = this;
    var notYetRead = true;
    var readStream = new Readable({objectMode: true});

    readStream._read = function(){
      if(notYetRead){
        notYetRead = false;
        readStream.push(data);
      }else{
        readStream.push(null);
      }
    };

    var resultStream = func(readStream, data);

    if(resultStream
    && typeof resultStream === 'object'
    && 'on' in resultStream
    && typeof resultStream.on === 'function'){
      openStreams.push(resultStream);

      resultStream.on('end', function(){
        openStreams.splice(openStreams.indexOf(resultStream), 1);
        closeStreamIfNoMoreOpenStreams(self);
        done();
      });

      resultStream.on('data', function(result){
        self.push(result);
      });

      resultStream.on('error', function(error){
        console.error("error!");
        done(error);
      });
    }else{
      this.emit('error', new PluginError('gulp-flatMap', 'The function must return a stream'));
      return;
    }
  }, function(){
    ended = true;
    closeStreamIfNoMoreOpenStreams(this);
  });
};
