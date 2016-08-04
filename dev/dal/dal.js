'use strict';

let DAL = {};

// Properties
const Property = require('./property.js');

DAL.properties = {
  get: (cb) => {
    // const list = Property.find({}, (err, res) => {
      
    // });
    // console.log(' -| ' + JSON.stringify(Property));
    return Property.find({}, cb);
  },
  create: (model, cb) => {
    const propertyIns = new Property(model);

    propertyIns.save(cb);
  }
};

// Blockers
// Documents
// Photos
// Users
// Roles
// Licenses
module.exports = DAL;
