var assert = require('assert'),
    fs     = require('fs')
    james  = require('../index'),
    Bacon  = require('baconjs').Bacon

describe('james', function(){

  describe('#files', function(){

    it('should return matching files for glob a glob pattern', function(){

      james.files('test/fixtures/**/*.js').onValue(function(files){

        assert.deepEqual(files,
          [
            { name: 'test/fixtures/hello.js',
              content: 'console.log("Hello ");\n' },
            { name: 'test/fixtures/world.js',
              content: 'console.log("World!");\n' }
          ])
      })
    })
  })

  describe('#watch', function(){

    it('should return changed file for a glob pattern', function(done){

      var now = new Date();
      james.watch('test/fixtures/*.js').onValue(function(files){
        assert.deepEqual(files,
          [ { name: '/Users/pyykkis/work/james.js/test/fixtures/hello.js',
              content: 'console.log("Hello ");\n' }
          ]);

        done();
      });

      setTimeout(function(){fs.utimesSync('test/fixtures/hello.js', now, now)}, 100);
    })
  })
})
