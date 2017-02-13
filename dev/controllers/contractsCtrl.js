'use strict';

const DAL = require('../dal/dal.js');
const contractsTimeCalculate = require('../services/contractsTimeCalculate.js')();
const Promise = require('promise');
const config = require('../config.js');
const Mailer = require('../services/mailer.js');

module.exports = {
  sendNotifications: function () {
    getProperties().then(function (properties) {
      var promises = properties.map(function (property) {
        return notifyProperty(property);
      });

      return Promise.all(promises);
    });
  }
};

function getDeysInMs(days) {
  return days * 24 * 60 * 60 * 1000;
}

function getProperties() {
  return new Promise(function (resolve, reject) {
    DAL.properties.get(function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
}

function notifyProperty(property) {
  let timeForNotification = [
    {
      tag: '3month',
      time: getDeysInMs(30 * 3)
    },
    {
      tag: '2month',
      time: getDeysInMs(30 * 2)
    },
    {
      tag: '1month',
      time: getDeysInMs(30 * 1)
    },
    {
      tag: '1week',
      time: getDeysInMs(7)
    },
    {
      tag: '1day',
      time: getDeysInMs(1)
    }
  ];

  return getLatectContract(property.id).then(function (res) {
    if (res && !res.notExpire) {
      getNotifications(property.id, res._id, timeForNotification).then(function (notifications) {
        try {
          let time = contractsTimeCalculate.calculate([res]);
          let tag;

          for (let i = 0; i < timeForNotification.length; i++) {
            tag = timeForNotification[i].tag + '_' + property.id + '_' + res._id;
            if (timeForNotification[i].time > time) {
              let notificationsWithTag = notifications.filter(function (item) {
                return item && (item.tag === tag);
              });
              if ( notificationsWithTag.length === 0 ) {
                notifyUser(property, timeForNotification[i].tag, res._id);
                break;
              }
            }
          }
        } catch(err) {
          console.error(err);
        }
      });
    }
  });
}

function notifyUser(property, term, contractId) {
  let message = {
    '3month': 'Before the end of the contract remains 3 months',
    '2month': 'Before the end of the contract remains 2 months',
    '1month': 'Before the end of the contract remains 1 month',
    '1week': 'Before the end of the contract remains 1 week',
    '1day': 'Before the end of the contract remains 1 day'
  }
  let user;

  return new Promise(function (resolve, reject) {
    DAL.users.getUserById(property.manager, function (err, res) {
      user = res;
      err ? reject(err) : resolve(res);
    });
  }).then(function (user) {
    return DAL.notifications.create({
      tag: term + '_' + property.id + '_' + contractId,
      text: message[term],
      user: user._id
    });
  }).then(function () {
    return sendEmail(user, message[term]);
  });
}

function sendEmail(user, message) {
  const mail = {
    from: '"No-reply" <no.reply.ultimatetowing@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Contract expiration notification', // Subject line
    text: message, // plaintext body
    html: '<div style="white-space: pre;">' + message + '</div>' // html body
  };

  return Mailer(config.mail).send(mail);
}

function getNotifications(propId, contractId, timeForNotification) {
  var promises = timeForNotification.map(function (time) {
    var tag = time.tag + '_' + propId + '_' + contractId;
    return DAL.notifications.getByTag(tag);
  });

  return Promise.all(promises);
}

function getLatectContract(propId) {
  return new Promise(function (resolve, reject) {
    return DAL.contract.getByPropId(propId, function (err, res) {
      var latestIndex = 0;
      var latestDate;

      if (res.length > 0) {
        res.forEach(function (item) {
          item.endDate = new Date(new Date(item.activationDate).getTime() + item.term);
        });
        latestDate = res[latestIndex];
        res.forEach(function (item, index) {
          if (item.notExpire || (item.endDate > latestDate)) {
            latestIndex = index;
            latestDate = item.endDate;
          }
        });
        resolve(res[latestIndex]);
      } else {
        resolve(null);
      }
    });
  });
}