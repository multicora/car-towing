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
    user: 'no.reply.ultimatetowing@gmail.com',
    pass: 'noreplyultimatetowing',
    resetLink: '#/new_password/'
  },
  debugMode: false
};

module.exports = merge(config, userConfig);