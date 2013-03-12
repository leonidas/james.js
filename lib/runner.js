require('coffee-script');

var james     = require('../index'),
    jamesfile = require(process.cwd() + '/Jamesfile'),
    tasks     = process.argv.slice(2),
    task;

if (!tasks.length) {
  tasks.push('default');
}

for (var i=0; i < tasks.length; ++i) {
  james.run(tasks[i]);
}
