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
};

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
    console.error(('Error: Task "' + name + '" not found in Jamesfile.').red);
    console.log('Available tasks: ');
    tasks = _.keys(tasks);
    for (var i = 0; i < tasks.length; i++) {
      console.log('"' + tasks[i] + '"');
    }
  }
};

exports.list = function() {
  return _.chain(arguments)
    .map(function(p){ return glob.sync(p); })
    .flatten()
    .value();
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

exports.read = function(stream) {
  if (typeof stream === 'string') {
    stream = fs.createReadStream(stream);
  }
  return new Pipeline(stream);
};

exports.dest = function(filename) {
  var deferred = Q.defer(),
      file;
  mkdirp.sync(path.dirname(filename));
  file = fs.createWriteStream(filename);
  file.on('error', function(err) {
    deferred.reject(err);
  });
  file.on('close', function() {
    console.log('Wrote file '.green + filename.green);
    deferred.resolve(filename);
  });
  file.promise = deferred.promise;
  return file;
};

function toPromise(op) {
  if (op.promise) {
    return op.promise;
  }
  else {
    return Q.when(op);
  }
}

exports.wait = function(operation) {
  if (Array.isArray(operation)) {
    return Q.all(operation.map(toPromise));
  }
  else {
    return toPromise(operation);
  }
};

function transform(chunk, encoding, callback) {
  this._content += chunk;
  callback();
}

function flush(f) {
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
  };
}

exports.createStream = function(f) {
  var s = new stream.Transform();
  s._content   = '';
  s._transform = transform;
  s._flush     = flush(f);
  s.on('error', function(err){
    console.error("ERROR:".red, err.message.red);
    process.exit(1);
  });
  return s;
};
