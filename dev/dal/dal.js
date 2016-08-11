'use strict';

let DAL = {};

// Properties
const Property = require('./property.js');

DAL.properties = {
  get: (cb) => {
    return Property.find({}, cb);
  },
  getById: (id, cb) => {
    return Property.findOne({_id: id }, cb);
  },
  create: (model, cb) => {
    const propertyIns = new Property(model);

    propertyIns.save(cb);
  },
  edit: (id, model, cb) => {
    return Property.findOneAndUpdate({_id: id}, model, cb);
  },
  remove: (id, cb) => {
    return Property.findOneAndRemove({_id: id}, cb);
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
