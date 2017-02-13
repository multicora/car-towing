'use strict';

const DAL = require('../dal/dal.js');
const Promise = require('promise');

module.exports = {
  getStatus: (propId) => {
    return new Promise((resolve, reject) => {
      DAL.blocking.getByPropId(propId, (err, blockingArray) => {
        let result = blockingArray.filter((blocking) => {
          let date = new Date(blocking.to);

          return  date.getTime() > Date.now();
        }).filter((blocking) => {
          let date = new Date(blocking.from);

          return  date.getTime() < Date.now();
        });
        resolve(result.length > 0);
      });
    });
  }
};
