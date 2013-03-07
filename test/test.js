var assert = require('assert'),
    fs     = require('fs')
    james  = require('../index'),
    Bacon  = require('baconjs').Bacon

describe('james', function(){

  describe('files', function(){

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

  // describe('watch', function(){

  //   it('should return changed file for a glob pattern', function(done){

  //     var now = new Date();
  //     james.watch('test/fixtures/*.js').onValue(function(files){
  //       assert.deepEqual(files,
  //         [ { name: '/Users/pyykkis/work/james.js/test/fixtures/hello.js',
  //             content: 'console.log("Hello ");\n' }
  //         ]);
  //       done();
  //       return Bacon.noMore;
  //     });

  //     setTimeout(function(){fs.utimesSync('test/fixtures/hello.js', now, now)}, 50);
  //   })
  // })

  describe('write', function(){

    it('should write files to their destination', function(done){
      var files, fileStream;

      files = [
        { name: '/Users/pyykkis/work/james.js/test/fixtures/foo.js',
          content: 'console.log("foo");\n' },
        { name: '/Users/pyykkis/work/james.js/test/fixtures/bar.js',
          content: 'console.log("bar");\n' }
      ];

      Bacon.once(files).onValue(james.write);

      setTimeout(function(){
        for (var i = 0; i < files.length; i++) {
          assert.equal(fs.readFileSync(files[i].name, 'utf8'), files[i].content);
          fs.unlinkSync(files[i].name);
        };

        done();
      }, 100)
    })
  })
})
