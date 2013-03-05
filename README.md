# Synopsis

James.js is a composable build tool which prefers code over configuration.

```coffeescript
// Jamesfile.coffee
{files, write} = require './src/james'
coffee = require 'james-coffee'
concat = require 'james-concat'

files('src/**/*.coffee')
  .map(coffee)
  .map(concat 'index.js')
  .onValue write

```

```
> coffee Jamesfile.coffee
```

# TODO

* Autoreloading runner
* Separate watching from tasks
* Moar plugins
