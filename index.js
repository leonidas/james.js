(function() {
  var Bacon, Gaze, child_process, fs, glob, mkdirp, path, runner, watch;

  Bacon = require('baconjs').Bacon;

  Gaze = require('gaze').Gaze;

  fs = require('fs');

  child_process = require('child_process');

  path = require('path');

  mkdirp = require('mkdirp');

  glob = require('glob');

  exports.watch = watch = function(pattern) {
    var gazer, gazerStream;
    gazer = new Gaze(pattern);
    return gazerStream = Bacon.fromEventTarget(gazer, 'all', function(event, filename) {
      return [
        {
          name: filename,
          content: fs.readFileSync(filename, 'utf8')
        }
      ];
    }).toProperty([]);
  };

  exports.files = function(pattern) {
    return watch(pattern).map(function() {
      return glob.sync(pattern).map(function(filename) {
        return {
          name: filename,
          content: fs.readFileSync(filename, 'utf8')
        };
      });
    });
  };

  exports.write = function(files) {
    return files.map(function(file) {
      mkdirp.sync(path.dirname(file.name));
      return fs.writeFileSync(file.name, file.content, 'utf8');
    });
  };

  runner = null;

  exports.execute = function(files) {
    return files.map(function(file) {
      if (runner) {
        console.log("Reloading Jamesfile");
        runner.kill();
      } else {
        console.log("Loading Jamesfile");
      }
      return runner = child_process.spawn('node', ['-e', file.content], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
    });
  };

}).call(this);
