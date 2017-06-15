'use strict';

const DAL = require('../dal/dal.js');
const Promise = require('promise');
const config = require('../config.js');
const Mailer = require('../services/mailer.js');

module.exports = {
  sendMatrixChangeNotifications: function (propertyId) {
    let admins;
    let drivers;

    return getRoleByName('admin').then(function (role) {
      return DAL.users.getByRole(role._id);
    }).then(function (res) {
      admins = res;
      return getRoleByName('driver');
    }).then(function (role) {
      return DAL.users.getByRole(role._id);
    }).then(function (res) {
      drivers = res;
      return new Promise(function (resolve, reject) {
        DAL.properties.getById(propertyId, function (err, property) {
          err ? reject() : resolve(property);
        });
      });
    }).then(
      function (property) {
        let emails = [];
        let text = 'Towing matrix changed for property ' + property.name;

        admins.concat(drivers).forEach(function (item) {
          if ( emails.indexOf(item.email) < 0 ) {
            emails.push(item.email);
          }
        });

        return sendNotifications(emails, text);
      },
      function (err) {
        console.error(err);
      }
    );
  }
};


function sendNotifications(emails, text) {
  try {
    let promises = emails.map(function (email) {
      const mail = {
        to: email, // list of receivers
        subject: text, // Subject line
        text: text, // plaintext body
        html: '<div style="white-space: pre;">' + text + '</div>' // html body
      };
      Mailer(config.mail).send(mail);
    });

    return Promise.all(promises);
  } catch(err) {
    console.error(err);
  }
}

function getRoleByName(name) {
  return new Promise(function (resolve, reject) {
    DAL.roles.getByName(name, function (err, role) {
      err ? reject() : resolve(role);
    });
  });
}