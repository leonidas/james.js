require('coffee-script')

var jamesfile = require(process.cwd() + '/Jamesfile'),
    tasks     = process.argv.slice(2),
    task;

if (!tasks.length) tasks.push('default');

for (var i=0; i < tasks.length; ++i) {
  task = tasks[i];
  if (jamesfile[task]) {
    console.log('Executing task "' + task + '"');
    jamesfile[task]();

  } else {
    console.log('Error: Task "' + task + '" not found in Jamesfile.');
  }
}
