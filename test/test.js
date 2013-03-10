var assert = require('assert'),
    fs     = require('fs'),
    path   = require('path'),
    james  = require('../index'),
    Bacon  = require('baconjs').Bacon,
    Q      = require('q');

describe('james', function(){

  describe('#files', function(){

    it('should return matching files for glob a glob pattern', function(done){

      james.files('test/fixtures/**/*.js').onValue(function(files){
        Q.all(files)
          .then(function(files){
            assert.deepEqual(files,
              [
                { name: 'test/fixtures/hello.js',
                  content: 'console.log("Hello ");\n' },
                { name: 'test/fixtures/world.js',
                  content: 'console.log("World!");\n' }
              ]);
          })
          .done(done);
      });
    });
  });

  describe('#watch', function(){

    it('should return changed file for a glob pattern', function(done){

      var now = new Date();
      Bacon.once(james.watch('test/**/hello.*').onValue(function(files){
        Q.all(files)
          .then(function(files){
            assert.deepEqual(files,
              [ { name: path.resolve('test/fixtures/hello.js'),
                  content: 'console.log("Hello ");\n' }
              ]);
          })
          .done(done);
      }));

      setTimeout(function(){fs.utimesSync('test/fixtures/hello.js', now, now);}, 100);
    });
  });

  describe('#write', function(){

    it('should write files to their destination', function(done){
      var files, fileStream;

      files = [
        Q.when({ name: 'test/fixtures/foo.js',
          content: 'console.log("foo");\n' }),
        Q.when({ name: 'test/fixtures/bar.js',
          content: 'console.log("bar");\n' })
      ];

      Bacon.once(files).onValue(james.write());

      setTimeout(function(){
        Q.all(files)
          .then(function(files) {
            files.map(function(file){
              assert.equal(fs.readFileSync(file.name, 'utf8'), file.content);
              fs.unlinkSync(file.name);
            });
          })
          .done(done);
        }, 100);
    });
  });

  describe('#write(dest)', function(){

    it('should write files to the specified destination', function(done){
      var files, fileStream;

      files = [
        Q.when({ name: 'test/fixtures/foo.js',
          content: 'console.log("foo");\n' }),
        Q.when({ name: 'test/fixtures/bar.js',
          content: 'console.log("bar");\n' })
      ];

      Bacon.once(files).onValue(james.write('test/fixtures/index.js'));

      setTimeout(function(){
        files[1].then(function(file){
          assert.equal(fs.readFileSync('test/fixtures/index.js', 'utf8'), file.content);
          fs.unlinkSync('test/fixtures/index.js');
        });
        done();
      }, 100);
    });
  });

  describe('sync transformer', function(){

    it('should return the result of the transformation', function(done){
      var files, syncTransformer, fileStream;

      files = [
        Q.when({ name: 'foo.js', content: 'foo' }),
        Q.when({ name: 'bar.js', content: 'bar' })
      ];

      syncTransformer = james.transformer(function(file){
        return {
          name:    file.name + "sync",
          content: file.content + "sync"
        };
      });

      Bacon.once(files).map(syncTransformer).onValue(function(files) {
        Q.all(files)
          .then(function(files) {
            assert.deepEqual(files, [
              { name: 'foo.jssync', content: 'foosync' },
              { name: 'bar.jssync', content: 'barsync' }
            ]);
          })
          .done(done);
      });
    });
  });

  describe('async transformer', function(){

    it('should return the result of the transformation', function(done){
      var files, asyncTransformer, fileStream;

      files = [
        Q.when({ name: 'foo.js', content: 'foo' }),
        Q.when({ name: 'bar.js', content: 'bar' })
      ];

      asyncTransformer = james.transformer(function(file) {
        return Q.delay(50).then(function() {
          return {
            name:    file.name + "async",
            content: file.content + "async"
          };
        });
      });

      Bacon.once(files).map(asyncTransformer).onValue(function(files) {
        Q.all(files)
          .then(function(files) {
            assert.deepEqual(files, [
              { name: 'foo.jsasync', content: 'fooasync' },
              { name: 'bar.jsasync', content: 'barasync' }
            ]);
          })
          .done(done);
      });
    });
  });
});
