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
      var src = james.read(file).pipe(coffee.createStream());
      src.pipe(dist);
      src.pipe(uglify.createStream()).pipe(min);
    });
  });
});

james.task('watch', function() {
  james.watch('test/**/*.coffee', function(event, file) {
    james.read(file)
      .pipe(coffee.createStream())
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

James uses node.js streams for transformations.
Create a [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform),
or use `james.createStream` helper.

```javascript
// james-coffee/index.js
var james  = require('james'),
    coffee = require('coffee-script');

coffee.createStream = function() {
  james.createStream(function(file, callback) {

    // Process the input and call the callback with the result.
    callback(coffee.compile(file));
  });
};

james.read('./hello.coffee').pipe(coffee.createStream()).pipe(process.stdout);
```
