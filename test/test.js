var assert = require('assert'),
    fs     = require('fs'),
    path   = require('path'),
    james  = require('../index'),
    Bacon  = require('baconjs').Bacon,
    Q      = require('q');

describe('james', function(){

  describe('files', function(){

    it('should return matching files for glob a glob pattern', function(){

      james.files('test/fixtures/**/*.js').onValue(function(files){
        Q.all(files).then(function(files) {
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
  })

  describe('watch', function(){

    it('should return changed file for a glob pattern', function(done){

      var now = new Date();
      Bacon.once(james.watch('test/**/hello.*').onValue(function(files){
        assert.deepEqual(files,
          [ { name: path.resolve('test/fixtures/hello.js'),
              content: 'console.log("Hello ");\n' }
          ]);
        done();
      }));

      setTimeout(function(){fs.utimesSync('test/fixtures/hello.js', now, now)}, 100);
    })
  })

  describe('write', function(){

    it('should write files to their destination', function(done){
      var files, fileStream;

      files = [
        Q.when({ name: 'test/fixtures/foo.js',
          content: 'console.log("foo");\n' }),
        Q.when({ name: 'test/fixtures/bar.js',
          content: 'console.log("bar");\n' })
      ];

      Bacon.once(files).onValue(james.write);

      setTimeout(function(){
        files.map(function(file){
          file.then(function(file){
            assert.equal(fs.readFileSync(file.name, 'utf8'), file.content);
            fs.unlinkSync(file.name);
          })
        });
        done();
      }, 100)
    })
  })
})
