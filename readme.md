# [gulp](http://gulpjs.com)-flatmap

> map each file in a stream into multiple files that are piped out

## Install

```bash
$ npm install --save-dev gulp-flatmap
```


## Usage

```js
var gulp = require('gulp');
var flatmap = require('gulp-flatmap');
var uglify = require('gulp-uglify');
var path = require('path');
var concat = require('gulp-concat');

gulp.task('default', function () {
  return gulp.src('*.json')
    .pipe(flatmap(function(stream, file){
      var contents = JSON.parse(file.contents.toString('utf8'));
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

The flatmap method takes one argument, a function. This function is called once for each file piped to `flatmap` and is passed a stream as its first argument and the [vinyl file](https://github.com/wearefractal/vinyl) as its second argument. The stream contains only one file.

You can now pipe this stream through as many steps as you want, before returning it from the function. All the streams returned from `flatmap` will be combined and their contents will be emited by `flatmap`.

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
