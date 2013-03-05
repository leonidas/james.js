{files, write} = require './src/james'
coffee = require 'james-coffee'
concat = require 'james-concat'

files('src/**/*.coffee')
  .map(coffee)
  .map(concat 'index.js')
  .onValue write
