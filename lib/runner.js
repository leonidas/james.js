require('coffee-script');

var colors    = require('colors'),
    james     = require(process.cwd() + '/node_modules/james/index.js'),
    jamesfile = require(process.cwd() + '/Jamesfile'),
    tasks     = process.argv.slice(2),
    task;

if (!tasks.length) {
  tasks.push('default');
}

for (var i=0; i < tasks.length; ++i) {
  james.run(tasks[i]);
}

process.on('uncaughtException', function(err){
  console.error("ERROR:".red, err.message.red);
  process.exit(1);
});
