var james = require('../index.js');

function Pipeline(src) {
  this.src = src;
}

Pipeline.prototype.transform = function(dest) {
  if (typeof dest === 'function') {
    dest = dest();
  }

  this.src.pipe(dest);
  return new Pipeline(dest);
};

Pipeline.prototype.write = function(dest) {
  if (typeof dest === 'string' ) {
    dest = james.write(dest);
  }
  this.src.pipe(dest);
  return dest;
};

module.exports = Pipeline;
