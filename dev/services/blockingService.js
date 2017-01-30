'use strict';

const config = require('../config.js');
const Mailer = require('../services/mailer.js');
const Promise = require('promise');
const lettersStorage = require('../services/lettersStorage.js');

module.exports = {
  sendNotification: (emailDriver, emailAdmin) => {

    let driverPromise = new Promise((resolve, reject) => {

      const mail = {
        from: config.mail, // sender address
        to: emailDriver, // list of receivers
        subject: 'Blocking notification', // Subject line
        text: lettersStorage.letterNames.BlockingLetterToDriver, // plaintext body
        html: '<div style="white-space: pre;">' + lettersStorage.letterNames.BlockingLetterToDriver + '</div>'
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          resolve({"status": "success"});
        }, (err) => {
          reject(err);
         }
       );
    });

    let adminPromise = new Promise((resolve, reject) => {

      const mail = {
        from: config.mail, // sender address
        to: emailAdmin, // list of receivers
        subject: 'Blocking notification', // Subject line
        text: lettersStorage.letterNames.BlockingLetterToAdmin, // plaintext body
        html: '<div style="white-space: pre;">' + lettersStorage.letterNames.BlockingLetterToAdmin + '</div>'
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          resolve({"status": "success"});
        }, (err) => {
          reject(err);
         }
       );
    });

    return Promise.all([driverPromise, adminPromise]);
  }
};