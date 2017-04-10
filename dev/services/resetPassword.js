'use strict';

const config = require('../config.js');
const Mailer = require('../services/mailer.js');
const Utils = require('../services/utils.js');
const Promise = require('promise');
const DAL = require('../dal/dal.js');
const lettersStorage = require('../services/lettersStorage.js');

module.exports = {
  resetPassword: (email, serverUrl) => {
    return new Promise((resolve, reject) => {
      let resetToken = Utils.newToken();
      DAL.users.updateResetToken(resetToken, email, function(err, res) {
        if (res) {
          const message = [
            lettersStorage.letterNames.SetPasswordLetter + serverUrl + '/' + config.mail.resetLink + resetToken,
          ].join('\n');

          const mail = {
            from: config.mail, // sender address
            to: email, // list of receivers
            subject: 'Reset password', // Subject line
            text: message, // plaintext body
            html: '<div style="white-space: pre;">' + message + '</div>'
          };

          Mailer(config.mail).send(mail).then(
            (res) => {
              resolve({"status": "success"});
            }, (err) => {
              reject(err);
             }
           );
         } else {
           reject(err);
         }
       }, (err) => {
         reject(err);
       });
    });
  }
};
