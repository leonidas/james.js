james = require './index'

james.task 'build', ->
  james.list 'lib/**/*.js', (files) -> console.log files

james.task 'watch', ->
  james.watch 'lib/**/*.js', (event, file) -> console.log event, file

james.task 'default', ['build', 'build']
