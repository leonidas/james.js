var gaze     = require('gaze'),
    fs       = require('fs'),
    path     = require('path'),
    mkdirp   = require('mkdirp'),
    glob     = require('glob'),
    Q        = require('q'),
    stream   = require('readable-stream'), // For node.js 0.8.x support
    colors   = require('colors'),
    Pipeline = require('./lib/pipeline'),
    _        = require('underscore'),
    tasks    = {};

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
    console.error(('Error: Task "' + name + '" not found in Jamesfile.').red)
    console.log('Available tasks: ');
    tasks = _.keys(tasks);
    for (var i = 0; i < tasks.length; i++) {
      console.log('"' + tasks[i] + '"');
    };
  }
}

exports.list = function(pattern) {
  return glob.sync(pattern);
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

exports.read = function(stream) {
  if (typeof stream === 'string') {
    stream = fs.createReadStream(stream);
  }
  return new Pipeline(stream);
}

exports.write = function(filename) {
  // Write first to pass through buffer in order to avoid partial files written
  // in case of errors.
  buf = new stream.PassThrough();

  buf.on('finish', function() {
    mkdirp.sync(path.dirname(filename));
    file = fs.createWriteStream(filename);
    this.pipe(file);
    file.on('close', function() { console.log('Wrote file '.green + filename.green) });
  });
  return buf;
}

_transform = function(chunk, encoding, callback) {
  this._content += chunk;
  callback();
}

_flush = function(f) {
  return function(callback) {
    var self = this;
    try {
      f(this._content, function(result) {
        self.push(result);
        callback();
      });

    } catch (err) {
      callback(err);
    }
  }
}

exports.createStream = function(f) {
  var s = new stream.Transform();
  s._content   = '';
  s._transform = _transform;
  s._flush     = _flush(f);
  s.on('error', function(err){
    console.error("ERROR:".red, err.message.red);
    process.exit(1);
  });
  return s;
}
