var Bacon    = require('baconjs').Bacon,
    Gaze     = require('gaze').Gaze,
    fs       = require('fs'),
    path     = require('path'),
    mkdirp   = require('mkdirp'),
    glob     = require('glob'),
    Q        = require('q'),
    readFile = Q.nfbind(fs.readFile);

exports.files = function(pattern) {
  var files = glob.sync(pattern).map(function(filename) {
    return readFile(filename, 'utf8')
      .then(function(content) {
        return {
          name: filename,
          content: content
        };
      });
  });

  return Bacon.once(files);
};

exports.watch = function(pattern) {
  var gazer = new Gaze(pattern);
  return Bacon.fromEventTarget(gazer, 'all', function(event, filename) {
    return readFile(filename, 'utf8')
      .then(function(content) {
        return [
          {
            name: filename,
            content: content
          }
        ];
      });
  });
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
      .done();
  });
};

exports.transformer = function(transform) {
  return function(files) {
    return files.map(function(file) {
      return file.then(function(file) {
        return transform(file);
      });
    });
  };
};
