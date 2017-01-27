'use strict';

const config = require('../config.js');
const Mailer = require('../services/mailer.js');
const Promise = require('promise');

module.exports = {
  sendNotification: (emailDriver, emailAdmin) => {
    let messageToDriver = [
      'Your accout was blocked!'
    ].join('\n');

    let messageToAdmin = [
      'Driver ' + emailDriver + 'was blocked!'
    ].join('\n');

    let driverPromise = new Promise((resolve, reject) => {

      const mail = {
        from: config.mail, // sender address
        to: emailDriver, // list of receivers
        subject: 'Blocking notification', // Subject line
        text: messageToDriver, // plaintext body
        html: '<div style="white-space: pre;">' + messageToDriver + '</div>'
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
        text: messageToAdmin, // plaintext body
        html: '<div style="white-space: pre;">' + messageToAdmin + '</div>'
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