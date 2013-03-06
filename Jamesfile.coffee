{watch, files, write} = require './index'
coffee = require 'james-coffee'
concat = require 'james-concat'

module.exports = tasks = {}

tasks.default = -> console.log "Hello from 'default'!"
