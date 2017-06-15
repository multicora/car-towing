const runCmd = require('./run-cmd');

module.exports = {
  gitPull: function () {
    return runCmd.run('git pull');
  },
  gitCheckout: function (branchName) {
    return runCmd.run('git checkout ' + branchName);
  },
  gulpBuild: function () {
    return runCmd.run('gulp build');
  },
  restart: function () {
    return runCmd.run('pm2 restart all');
  }
}