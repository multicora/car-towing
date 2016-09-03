const runCmd = require('./run-cmd');

module.exports = {
  gitCheckout: function (branchName, cb) {
    runCmd.run('git checkout ' + branchName).then(
      function (res) {
        cb(res);
      },
      function (res) {
        cb(res);
      }
    );
  }
}