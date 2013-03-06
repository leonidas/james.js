james = require './index'

module.exports = tasks = {}

tasks.default = -> console.log('Hello from "default!"')

tasks.watch   = ->
  james.watch('lib/**/*.js').log()

