james = require './index'
Q     = require 'q'

module.exports = tasks = {}

tasks.default = -> james.files('lib/**/*.js').onValue (files) ->
  Q.all(files).then (files) -> console.log files

tasks.watch   = -> james.watch('lib/**/*.js').onValue tasks.default

