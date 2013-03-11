var gaze    = require('gaze'),
    fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp'),
    glob    = require('glob'),
    Q       = require('q');

exports.list = function(pattern, cb) {
  Q.nfcall(glob, pattern).then(cb).done();
};

exports.watch = function(pattern, cb) {
  Q.nfcall(gaze, pattern)
  .then(function(watcher) {
    watcher.on('all', function(event, file) {

      // Convert from absolute to relative path
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
