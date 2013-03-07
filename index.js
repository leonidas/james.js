var Bacon  = require('baconjs').Bacon,
    Gaze   = require('gaze').Gaze,
    fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    glob   = require('glob'),
    Q      = require('q');

exports.watch = function(pattern) {
  var gazer = new Gaze(pattern);
  return Bacon.fromEventTarget(gazer, 'all', function(event, filename) {
    return [
      {
        name: filename,
        content: fs.readFileSync(filename, 'utf8')
      }
    ];
  });
};

exports.files = files = function(pattern) {
  var files = glob.sync(pattern).map(function(filename) {
    return {
      name: filename,
      content: Q.nfcall(fs.readFile(filename, 'utf8'))
    };
  });

  return Bacon.once(files);
};

exports.write = function(files) {
  files.map(function(file) {
    file
      .then(function(file) {
        mkdirp.sync(path.dirname(file.name));
        fs.writeFileSync(file.name, file.content, 'utf8');
      })
      .fail(function(error) {
        console.log(error);
      })
  });
};

