'use strict';

const DAL = require('./../../dal/dal.js');
const Promise = require('promise');

const Locations = ['roam', 'collin', 'city', 'county'];

module.exports = {
  version: 6,
  message: 'Add four default locations \'roam\', \'collin\', \'city\', \'county\'',
  script: function (next) {
    Promise.all(Locations.map((location) => {
      return DAL.locations.create({name: location});
    })).then(()=>{next();});
  },
};