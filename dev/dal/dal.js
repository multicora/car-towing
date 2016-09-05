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
  getByName: function (name, cb) {
    return Settings.findOne({name: name}, cb);
  },
  update: function (model, cb) {
    Settings.findOneAndUpdate(
      {
        name: model.name
      },
      model,
      {
        upsert:true
      },
      cb
    );
  }
};

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

// parking rules
DAL.parkingRules = require('./parkingRules.js');

// Users
const Users = require('./users.js');

DAL.users = {
  checkToken: (token, cb) => {
    Users.findOne({token: token}, cb);
  },
  updateToken: (token, email, cb) => {
    Users.findOneAndUpdate({email: email}, {token: token}, cb);
  },
  getUserByEmail: (email, cb) => {
    Users.findOne({email: email}, cb);
  },
  createUser: (email, password, token, cb) => {
    Users.create({email: email, password: password, token: token}, cb);
  },
  getUserByResetToken: (resetToken, cb) => {
    Users.findOne({resetToken: resetToken}, cb);
  },
  resetPassword: (data, cb) => {
    if (data.newPassword === data.confirmPassword) {
      Users.findOneAndUpdate({resetToken : data.resetToken}, {password: data.newPassword}, function(err, docs) {
        (docs === null) ? cb(new Error('Incorrect reset token.')) : reply(docs);
      });
    } else {
      cb(new Error('Passwords do not match'));
    }
  }
};

DAL.files = require('./files.js');
// Blocking info
DAL.blocking = require('./blocking.js').dal;

module.exports = DAL;
