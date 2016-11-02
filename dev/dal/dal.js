'use strict';

let DAL = {};

// Properties
DAL.properties = require('./property.js');
// Roles
DAL.roles = require('./roles.js');

// Blockers
// Documents
// Photos
// Users
// Roles
// Licenses
// Settings
DAL.settings = require('./settings.js');

// Custom pages
const CustomPages = require('./customPages.js');

DAL.customPages = {
  get: function (cb) {
    return CustomPages.find({}, cb);
  },
  getByKey: function (key, cb) {
    return CustomPages.findOne({key: key}, cb);
  },
  update: function (model, cb) {
    CustomPages.findOneAndUpdate(
      {
        key: model.key
      },
      model,
      cb
    );
  },
  create: function (model, cb) {
    const instance = new CustomPages(model);

    instance.save(cb);
  }
};


DAL.parkingRules = require('./parkingRules.js');

DAL.users = require('./users.js');

DAL.files = require('./files.js');

DAL.locations = require('./locations.js');

DAL.blocking = require('./blocking.js').dal;

DAL.actions = require('./actions.js');

module.exports = DAL;
