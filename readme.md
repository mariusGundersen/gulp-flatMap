# [gulp](http://gulpjs.com)-fork [![Build Status](https://travis-ci.org/mariusGundersen/gulp-fork.svg?branch=master)](https://travis-ci.org/mariusGundersen/gulp-fork)

> Send each file in a stream down its own stream


## Install

```bash
$ npm install --save-dev gulp-fork
```


## Usage

```js
var gulp = require('gulp');
var fork = require('gulp-fork');

gulp.task('default', function () {
  return gulp.src('src/app.ext')
    .pipe(fork(function(stream){
      return stream
        .pipe(gulp.dest('dist'));
    }));
});
```


## API

The fork method takes one argument, a function. This function is called once for each file piped to fork. The function is passed a stream as its only argument, and it must return a stream. 

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
