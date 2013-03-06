var Bacon  = require('baconjs').Bacon,
    Gaze   = require('gaze').Gaze,
    fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    glob   = require('glob');

exports.watch = function(pattern) {
  var gazer, gazerStream;
  gazer = new Gaze(pattern);
  return gazerStream = Bacon.fromEventTarget(gazer, 'all', function(event, filename) {
    return [
      {
        name: filename,
        content: fs.readFileSync(filename, 'utf8')
      }
    ];
  }).toProperty(files(pattern));
};

exports.files = files = function(pattern) {
  var files = glob.sync(pattern).map(function(filename) {
    return {
      name: filename,
      content: fs.readFileSync(filename, 'utf8')
    };
  });

  return Bacon.once(files);
};

exports.write = function(files) {
  return files.map(function(file) {
    mkdirp.sync(path.dirname(file.name));
    fs.writeFileSync(file.name, file.content, 'utf8');
  });
};

