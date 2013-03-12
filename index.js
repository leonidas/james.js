var gaze   = require('gaze'),
    fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    glob   = require('glob'),
    Q      = require('q'),
    stream = require('readable-stream'), // For node.js 0.8.x support;

tasks = {};

exports.task = function(name, task) {
  tasks[name] = task;
}

exports.run = function(name) {
  var task = tasks[name];
  if (Array.isArray(task)) {
    task.forEach(function(task) {
      exports.run(task);
    });
  }
  else if (typeof task === 'function') {
    console.log('Executing task "' + name + '"');
    task();
  }
  else {
    console.log('Error: Task "' + name + '" not found in Jamesfile.');
  }
}

exports.list = function(pattern, cb) {
  Q.nfcall(glob, pattern).then(cb).done();
}

exports.watch = function(pattern, cb) {
  Q.nfcall(gaze, pattern)
  .then(function(watcher) {
    watcher.on('all', function(event, file) {

      // Convert from absolute to relative path
      cb(event, path.relative(process.cwd(), file));
    });
  })
  .done();
}

exports.read = function(file) {
  return fs.createReadStream(file);
}

exports.write = function(file) {
  mkdirp.sync(path.dirname(file));
  return fs.createWriteStream(file);
}

_transform = function(chunk, encoding, callback) {
  this._file += chunk;
  callback();
}

_flush = function(op) {
  return function(callback) {
    stream = this;
    op(this._file, function(result) {
      stream.push(result);
      callback();
    });
  }
}

exports.createStream = function(op) {
  stream = new stream.Transform();
  stream._file      = '';
  stream._transform = _transform;
  stream._flush     = _flush(op);
  return stream;
}
