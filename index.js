'use strict';
var gutil = require('gulp-util');
var through = require('through');
var Stream = require('stream');
var utils = require('util');
var Readable = Stream.Readable;



module.exports = function (options, func) {

  // Allow users to omit the options object
  if (typeof options === 'function') {
    func = options;
    options = {};
  }

  if (!func || typeof func != 'function') {
    throw new gutil.PluginError('gulp-forEach', '`forEach` must be called with a function');
  }

  var openStreams = [];
  var ended = false;


  function closeStreamIfNoMoreOpenStreams(stream){
    if(openStreams.length == 0){
      if (options.debug) {
        console.log("close", ended);
      }
      if(ended){
        stream.queue(null);
      }
    }
  }

  return through(function(data){
    if (options.debug) {
      console.log("file", data);
    }

    if (data.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-forEach', 'Streaming not supported'));
      return;
    }

    var self = this;
    var notYetRead = true;


    var readStream = new Readable({objectMode: true});
    readStream._read = function(){
      if (options.debug) {
        console.log("read", notYetRead);
      }

      if(notYetRead){
        notYetRead = false;
        readStream.push(data);
      }else{
        readStream.push(null);
      }
    };

    var resultStream = func(readStream, data);

    if(resultStream){

      openStreams.push(resultStream);

      resultStream.on('end', function(){
        openStreams.splice(openStreams.indexOf(resultStream), 1);
        closeStreamIfNoMoreOpenStreams(self);
      });

      resultStream.on('data', function(result){
        if (options.debug) {
          console.log("result", result);
        }
        self.queue(result);
      });
    }else{
      closeStreamIfNoMoreOpenStreams(self);
    }

  }, function(){
    if (options.debug) {
      console.log('end', openStreams.length);
    }

    ended = true;
    closeStreamIfNoMoreOpenStreams(this);
  });
};
