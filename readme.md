# [gulp](http://gulpjs.com)-forEach

> Send each file in a stream down its own stream


## Install

```bash
$ npm install --save-dev gulp-forEach
```


## Usage

```js
var gulp = require('gulp');
var forEach = require('gulp-forEach');

gulp.task('default', function () {
  return gulp.src('src/app.ext')
    .pipe(forEach(function(stream){
      return stream
        .pipe(gulp.dest('dist'));
    }));
});
```


## API

The forEach method takes one argument, a function. This function is called once for each file piped to forEach. The function is passed a stream as its only argument, and it must return a stream. 

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
