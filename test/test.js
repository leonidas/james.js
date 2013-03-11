var assert = require('assert'),
    fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    james  = require('../index');

describe('james', function(){

  describe('#list', function(){
    var files = [
      'test/fixtures/hello.js',
      'test/fixtures/world.js'
    ];

    beforeEach(function(){
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        mkdirp.sync(path.dirname(file));
        fs.writeFileSync(file, 'console.log(hello);', 'utf8');
      }
    });

    afterEach(function(){
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        fs.unlinkSync(file);
      }
    });

    it('should return matching files for glob a glob pattern', function(done){
      james.list('test/fixtures/**/*.js', function(res) {
        assert.deepEqual(res, files);
        done();
      });
    });
  });

  describe('#watch', function(){

    var file = 'test/fixtures/hello.js';

    beforeEach(function(){
      mkdirp.sync(path.dirname(file));
      fs.writeFileSync(file, 'console.log(hello);', 'utf8');
    });

    afterEach(function(){ fs.unlinkSync(file); });

    it('should return added/changed/deleted file for a glob pattern', function(done){

      james.watch('test/**/*.js', function(event, file) {
        assert.equal(event, 'changed');
        assert.equal(file, 'test/fixtures/hello.js');
        done();
      });

      setTimeout(function(){
        var now = new Date();
        fs.utimesSync(file, now, now);
      },
        1000);
    });
  });

  describe('#read', function(){
    var file = {
      name:    'console.log("hello");',
      content: 'test/fixtures/foo.js'
    };

    beforeEach(function(){
      mkdirp.sync(path.dirname(file.name));
      fs.writeFileSync(file.name, file.content, 'utf8');
    });

    afterEach(function(){
      fs.unlinkSync(file.name);
    });

    it.only('should return a read stream for the file', function(done){
      var res   = '',
          input = james.read(file.name);

      input.on('data', function(data){res += data});
      input.on('end', function() {
        assert.equal(res, fs.readFileSync(file.name, 'utf8'));
        done();
      });
    });
  });

  // describe('#write', function(){

  //   it('should write files to their destination', function(done){
  //     var files, fileStream;

  //     files = [
  //       Q.when({ name: 'test/fixtures/foo.js',
  //         content: 'console.log("foo");\n' }),
  //       Q.when({ name: 'test/fixtures/bar.js',
  //         content: 'console.log("bar");\n' })
  //     ];

  //     Bacon.once(files).onValue(james.write());

  //     setTimeout(function(){
  //       Q.all(files)
  //         .then(function(files) {
  //           files.map(function(file){
  //             assert.equal(fs.readFileSync(file.name, 'utf8'), file.content);
  //             fs.unlinkSync(file.name);
  //           });
  //         })
  //         .done(done);
  //       }, 100);
  //   });
  // });

  // describe('#write(dest)', function(){

  //   it('should write files to the specified destination', function(done){
  //     var files, fileStream;

  //     files = [
  //       Q.when({ name: 'test/fixtures/foo.js',
  //         content: 'console.log("foo");\n' }),
  //       Q.when({ name: 'test/fixtures/bar.js',
  //         content: 'console.log("bar");\n' })
  //     ];

  //     Bacon.once(files).onValue(james.write('test/fixtures/index.js'));

  //     setTimeout(function(){
  //       files[1].then(function(file){
  //         assert.equal(fs.readFileSync('test/fixtures/index.js', 'utf8'), file.content);
  //         fs.unlinkSync('test/fixtures/index.js');
  //       });
  //       done();
  //     }, 100);
  //   });
  // });

  // describe('sync transformer', function(){

  //   it('should return the result of the transformation', function(done){
  //     var files, syncTransformer, fileStream;

  //     files = [
  //       Q.when({ name: 'foo.js', content: 'foo' }),
  //       Q.when({ name: 'bar.js', content: 'bar' })
  //     ];

  //     syncTransformer = james.transformer(function(file){
  //       return {
  //         name:    file.name + "sync",
  //         content: file.content + "sync"
  //       };
  //     });

  //     Bacon.once(files).map(syncTransformer).onValue(function(files) {
  //       Q.all(files)
  //         .then(function(files) {
  //           assert.deepEqual(files, [
  //             { name: 'foo.jssync', content: 'foosync' },
  //             { name: 'bar.jssync', content: 'barsync' }
  //           ]);
  //         })
  //         .done(done);
  //     });
  //   });
  // });

  // describe('async transformer', function(){

  //   it('should return the result of the transformation', function(done){
  //     var files, asyncTransformer, fileStream;

  //     files = [
  //       Q.when({ name: 'foo.js', content: 'foo' }),
  //       Q.when({ name: 'bar.js', content: 'bar' })
  //     ];

  //     asyncTransformer = james.transformer(function(file) {
  //       return Q.delay(50).then(function() {
  //         return {
  //           name:    file.name + "async",
  //           content: file.content + "async"
  //         };
  //       });
  //     });

  //     Bacon.once(files).map(asyncTransformer).onValue(function(files) {
  //       Q.all(files)
  //         .then(function(files) {
  //           assert.deepEqual(files, [
  //             { name: 'foo.jsasync', content: 'fooasync' },
  //             { name: 'bar.jsasync', content: 'barasync' }
  //           ]);
  //         })
  //         .done(done);
  //     });
  //   });
  // });
});
