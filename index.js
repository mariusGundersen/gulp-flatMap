'use strict';
var gutil = require('gulp-util');
var through = require('through');
var Stream = require('stream');
var utils = require('util');
var Readable = Stream.Readable;



module.exports = function (func) {
  
  if (!func || typeof func != 'function') {
    throw new gutil.PluginError('gulp-fork', '`fork` must be called with one parameter, a function');
  }
  
  var openStreams = [];
  var ended = false;
  
    
  function closeStreamIfNoMoreOpenStreams(stream){
    if(openStreams.length == 0){
      console.log("close", ended);
      if(ended){
        stream.queue(null);
      }
    }
  }
  
  return through(function(data){
    console.log("file", data);
    var self = this;    
    var notYetRead = true;
    
    
    var readStream = new Readable({objectMode: true});
    readStream._read = function(){
      console.log("read", notYetRead);
      if(notYetRead){
        notYetRead = false;
        readStream.push(data);
      }else{
        readStream.push(null);
      }
    };
        
    var resultStream = func(readStream);
    
    if(resultStream){
    
      openStreams.push(resultStream);

      resultStream.on('end', function(){
        openStreams.splice(openStreams.indexOf(resultStream), 1);
        closeStreamIfNoMoreOpenStreams(self);
      });

      resultStream.on('data', function(result){
        console.log("result", result);
        self.queue(result);
      });
    }else{
      closeStreamIfNoMoreOpenStreams(self);
    }      
        
  }, function(){
    console.log('end', openStreams.length);
    ended = true;
    closeStreamIfNoMoreOpenStreams(this);
  });
};
