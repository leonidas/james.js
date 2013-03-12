james  = require './index'
coffee = require('james-coffee').createStream

james.task 'build', ->
  james.list './*.coffee', (files) ->
    files.forEach (file) ->
      james.read(file)
        .transform(coffee)
        .write(process.stdout)

james.task 'watch', ->
  james.watch 'lib/**/*.js', (event, file) -> console.log event, file

james.task 'default', ['build']
