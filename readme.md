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
  return gulp.src('src/*.js')
    .pipe(forEach(function(stream){
      return stream
        .pipe(doSomethingWithEachFileIndividually());
    }))
    .pipe(gulp.dest('dist'));
});
```


## API

The forEach method takes one argument, a function. This function is called once for each file piped to forEach and is passed a stream as its only argument. The stream contains only one file.

You can optionally return a stream from the `forEach` function. All the streams returned from `forEach` will be combined and their contents will be emited by `forEach`. 

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
