# Synopsis

[![Build Status](https://travis-ci.org/leonidas/james.js.png?branch=master)](https://travis-ci.org/leonidas/james.js)

James.js is a composable build tool which prefers code over configuration.

```javascript
// Jamesfile.js
var james  = require('james'),
    coffee = require('james-coffee'),
    uglify = require('james-uglify');

james.task('build', function() {

  james.list('src/**/*.coffee', function(files) {
    files.forEach(function(file) {

      james.read(file)
        .transform(coffee({bare: true}))
        .transform(uglify)
        .write(file.replace('src', 'dist').replace('.coffee', '.min.js'));
    });
  });
});

james.task('watch', function() {
  james.watch('test/**/*.coffee', function(event, file) {
    james.read(file)
      .transform(coffee({bare: true}))
      .write(file.replace('.coffee', '.js')));
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

Existing transformations are listed in the [wiki](https://github.com/leonidas/james.js/wiki).

###

James uses node.js streams for transformations.
Create a [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform),
or use `james.createStream` helper.

```javascript
// james-coffee/index.js
var james  = require('james'),
    coffee = require('coffee-script');

coffee.createStream = function() {
  return james.createStream(function(file, callback) {

    // Process the input and call the callback with the result.
    callback(coffee.compile(file));
  });
};

james.read('./hello.coffee')
  .transform(coffee.createStream)
  .write(process.stdout);
```
