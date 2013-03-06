{watch, files, write} = require './index'
coffee = require 'james-coffee'
concat = require 'james-concat'

module.exports = tasks = {}

tasks.build = ->
  console.log "Hello from 'build'"

tasks.watch = ->
  watch('src/**/*.coffee')
    .map(coffee)
    .map(concat 'index.js')
    .onValue write

tasks.default = -> console.log "Hello from 'default'"
