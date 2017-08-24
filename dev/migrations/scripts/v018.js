'use strict';

const DAL = require('./../../dal/dal.js');

module.exports = {
  version: 18,

  message: 'Clear files',
  script: next => {
    DAL.files.model.collection.dropIndexes();
    DAL.files.model.remove({}, err => next(err));
  },
};
