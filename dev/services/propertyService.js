'use strict';

const config = require('../config.js');
const Mailer = require('../services/mailer.js');
const Promise = require('promise');

module.exports = {
  sendConfirmMail: (email, link, serverUrl, userExist) => {
      let message;

      if (userExist) {
        message = [
          'You have new property for management!'
        ].join('\n');
      } else {
        message = [
          'Confirm your property login and set your password: ' + serverUrl + '/#/' + link
        ].join('\n');
      }

    return new Promise((resolve, reject) => {

      const mail = {
        from: config.mail, // sender address
        to: email, // list of receivers
        subject: 'Confirm login', // Subject line
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
    });
  }
};
