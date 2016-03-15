# [gulp](http://gulpjs.com)-foreach

> Send each file in a stream down its own stream


# This plugin performs a flatMap, but it is misnamed. You probably want [gulp-tap](https://www.npmjs.com/package/gulp-tap)

This is not the plugin you are looking for *jedi hand wave*. I created this plugin for a very specific use case I had, but I gave it a too popular name. You probably want the [gulp-tap](https://www.npmjs.com/package/gulp-tap) plugin instead of this one. I will soon remove this plugin and rename it to gulp-flat-map instead, since that is a more accurate name of what it is doing.

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

The foreach method takes one argument, a function. This function is called once for each file piped to `foreach` and is passed a stream as its first argument and the [vinyl file](https://github.com/wearefractal/vinyl) as its second argument. The stream contains only one file.

You can optionally return a stream from the `foreach` function. All the streams returned from `foreach` will be combined and their contents will be emited by `foreach`.

## License

MIT © [Marius Gundersen](https://github.com/mariusGundersen)
