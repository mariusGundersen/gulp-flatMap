# [gulp](http://gulpjs.com)-foreach

> Send each file in a stream down its own stream


## Install

```bash
$ npm install --save-dev gulp-foreach
```


## Usage

```js
var gulp = require('gulp');
var foreach = require('gulp-foreach');
var uglify = require('gulp-uglify');
var path = require('path');
var concat = require('gulp-concat');

gulp.task('default', function () {
  return gulp.src('*.json')
    .pipe(foreach(function(stream, file){
      var contents = JSON.parse(file.concents.toString('utf8'));
      //contents.files is an array
      return gulp.src(contents.files)
        //uglify each file individually
        .pipe(uglify())
        //combine the files
        .pipe(concat(path.basename(file.path)));
    }))
    .pipe(gulp.dest('dist'));
});
```


## API

The foreach method takes one argument, a function. This function is called once for each file piped to `foreach` and is passed a stream as its first argument and the [vinyl file](https://github.com/wearefractal/vinyl) as its second argument. The stream contains only one file.

You can optionally return a stream from the `foreach` function. All the streams returned from `foreach` will be combined and their contents will be emited by `foreach`.

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
