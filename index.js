var gaze    = require('gaze'),
    fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp'),
    glob    = require('glob'),
    through = require('through'),
    Q       = require('q');

exports.list = function(pattern, cb) {
  Q.nfcall(glob, pattern).then(cb).done();
};

exports.watch = function(pattern, cb) {
  Q.nfcall(gaze, pattern)
  .then(function(watcher) {
    watcher.on('all', function(event, file) {
      // Absolute to relative path
      cb(event, path.relative(process.cwd(), file));
    });
  })
  .done();
};

exports.read = function(file) {
  return fs.createReadStream(file);
}

exports.write = function(file) {
  mkdirp.sync(path.dirname(file));
  return fs.createWriteStream(file);
}

exports.transformer = function(transform) {
  return (function(data){
    return through(function write(chunk){
      data += chunk;
    },
    function end() {
      stream = this;
      Q.when(transform(data))
        .then(function(res) {
          stream.queue(res);
          stream.queue(null);
        })
        .done()
    });
  })('')
};
