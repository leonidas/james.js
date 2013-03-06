var assert = require('assert'),
    james  = require('../index')

describe('James', function(){
  describe('#files', function(){
    it('should return matching files for glob', function(){

      james.files('test/fixtures/**/*.js').onValue(function(files){
        assert.deepEqual(files, [
          { name: 'test/fixtures/hello.js',
            content: 'console.log("Hello ");\n' },
          { name: 'test/fixtures/world.js',
            content: 'console.log("World!");\n' }
        ])
      })
    })
  })
})
