var merge = require('merge');

var userConfig;

try {
  userConfig = require('./userConfig.js');
} catch (ex) {
  userConfig = {};
}

var config = {
  mail: {
    host: 'smtp.gmail.com',
    port: 465,
    resetLink: '#/new_password/'
  },
  debugMode: false
};

module.exports = merge(config, userConfig);