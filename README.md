# Synopsis

James.js is a composable build tool which prefers code over configuration.

```coffeescript
# Jamesfile.coffee
james  = require 'james'
coffee = require 'james-coffee'
concat = require 'james-concat'
uglify = require 'james-uglify'

module.exports = tasks = {}

tasks.build = ->
  dist = james.files('src/**/*.coffee')
    .map(coffee)
    .map(concat dest: 'dist/my-lib.js')

  min  = dist.map(uglify dest: 'dist/my-lib.min.js')

  dist.onValue james.write
  min.onValue  james.write

# James watches also Jamesfile, if run with `james watch` \o/
tasks.watch = ->
  james.watch('src/**/*.coffee').onValue tasks.build
```

Command-line:

```
> npm install -g james
> james build
```

# TODO

* Moar plugins
