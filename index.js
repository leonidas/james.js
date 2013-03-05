(function() {
  var Bacon, Gaze, fs, glob, mkdirp, path, watch;

  Bacon = require('baconjs').Bacon;

  Gaze = require('gaze').Gaze;

  fs = require('fs');

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

}).call(this);
