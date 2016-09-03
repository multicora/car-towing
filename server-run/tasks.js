const cmd = require('node-cmd');


module.exports = {
  gitCheckout: function (branchName, cb) {
    const commands = [
      'git pull'
      // 'git pull',
      // 'git checkout' + branchName
    ];
    cmd.get( commands.join('\n'), cb );
  }
}