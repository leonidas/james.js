# Synopsis

[![Build Status](https://travis-ci.org/leonidas/james.js.png?branch=master)](https://travis-ci.org/leonidas/james.js)

James.js is a composable build tool which prefers code over configuration.

```javascript
// Jamesfile.js
var james  = require('james'),
    coffee = require('james-coffee').createStream,
    uglify = require('james-uglify').createStream;

james.task('build', function() {
  var dist = james.write('dist/my-lib.js'),
      min  = james.write('dist/my-lib.min.js');

  james.list('src/**/*.coffee', function(files) {

    files.forEach(function(file) {
      var src = james.read(file).pipe(coffee());
      src.pipe(dist);
      src.pipe(uglify()).pipe(min);
    });
  });
});

james.task('watch', function() {
  james.watch('test/**/*.coffee', function(event, file) {
    james.read(file)
      .pipe(coffee())
      .pipe(james.write(file.replace('.coffee', '.js')));
  });
});

james.task('default', ['build', 'watch']);
```

## Command-line

By default, james runs `default` task. Specific tasks can be run by listing them on the command-line.

```
> npm install -g james
> james
> james build watch
```

## Transformations

James uses node.js streams for transformations. Thanks to awesome Streams2 API, writing transformations is trivial.

```javascript
var stream = require('readable-stream'), // For node.js 0.8.x support
    coffee = require('coffee-script');

transform = function(chunk, encoding, callback) {
  this._file += chunk;
  callback();
}

flush = function(callback) {
  this.push(coffee.compile(file));
  callback();
}

exports.createStream = function(options) {
  stream = new stream.Transform();
  stream._file = '';
  stream._transform = transform;
  stream._flush = flush;
  return stream;
}
```
