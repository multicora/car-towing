const Promise = require('promise');

const exec = require('child_process').exec;

module.exports = {
  run: function (command) {
    return new Promise(function (resolve, reject) {
      console.log('----- Run task -----\n');
      console.log(command);
      exec(command, function(error, stdout, stderr) {
        if (!stdout) {
          console.log('-- Error --');
          console.log(error.message);
          reject(error.message);
        } else {
          console.log(stdout);
          resolve(stdout);
        }
        console.log('----- End task -----\n');
      });
    });
  }
}