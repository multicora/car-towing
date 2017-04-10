'use strict';

const config = require('../config.js');
const Mailer = require('../services/mailer.js');
const Promise = require('promise');
const DAL = require('../dal/dal.js');
const Utils = require('../services/utils.js');
const lettersStorage = require('../services/lettersStorage.js');

module.exports = {
  sendNotification: (propertyId, propertyName, emailAdmin) => {
    let driverPromiseArr = [];

    let driverPromise = (driverEmail) => {
      return new Promise((resolve, reject) => {
        const mail = {
          from: config.mail, // sender address
          to: driverEmail, // list of receivers
          subject: 'Blocking towing notification', // Subject line
          text: lettersStorage.letterNames.BlockingTowing + propertyName, // plaintext body
          html: '<div style="white-space: pre;">' + lettersStorage.letterNames.BlockingTowing + propertyName + '</div>'
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

    let adminPromise = new Promise((resolve, reject) => {
      const mail = {
        from: config.mail, // sender address
        to: emailAdmin, // list of receivers
        subject: 'Blocking towing notification', // Subject line
        text: lettersStorage.letterNames.BlockingTowing + propertyName, // plaintext body
        html: '<div style="white-space: pre;">' + lettersStorage.letterNames.BlockingTowing + propertyName + '</div>'
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          resolve({"status": "success"});
        }, (err) => {
          reject(err);
         }
       );
    });

    return new Promise((resolve, reject) => {
      DAL.roles.getByName(Utils.rolesNames.driver, function(err, role) {
        !err ? resolve(role) : reject(err);
      });
    }).then((role) => {
      return DAL.users.getByRole(role._id);
    }).then((drivers) => {
      drivers.map((driver) => {
        driverPromiseArr.push(driverPromise(driver.email));
      });

      return Promise.all([driverPromiseArr, adminPromise]);
    }).then(() => {
      return {"status":"success"};
    });

  }
};