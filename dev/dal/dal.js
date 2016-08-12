'use strict';

let DAL = {};

// Properties
const Property = require('./property.js');

DAL.properties = {
  get: (cb) => {
    return Property.find({}, cb);
  },
  create: (model, cb) => {
    const propertyIns = new Property(model);

    propertyIns.save(cb);
  },
  getById: (objId, cb) => {
    return Property.findOne({objId: objId}, cb);
  }
};

// Blockers
// Documents
// Photos
// Users
// Roles
// Licenses
// Settings
const Settings = require('./settings.js');

DAL.settings = {
  get: (cb) => {
    return Settings.find({}, cb);
  },
  update: function (model, cb) {
    const settingsIns = new Settings(model);
    settingsIns.save(cb);
  }
};
module.exports = DAL;
