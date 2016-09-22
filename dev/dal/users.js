'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  email: { type: String, required: true, unique: true, max: 255 },
  password: { type: String, max: 255 },
  token: { type: String, max: 255 },
  resetToken: {type: String, max: 255 },
  roles: [ {type: Schema.Types.ObjectId, ref: 'Roles'} ]
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const users = {
  get: (cb) => {
    model.find({}, cb);
  },
  getUserByToken: (token, cb) => {
    model.findOne({token: token}).populate('roles').exec(cb);
  },
  updateToken: (token, email, cb) => {
    model.findOneAndUpdate({email: email}, {token: token}, {new: true}).populate('roles').exec(cb);
  },
  getUserByEmail: (email, cb) => {
    model.findOne({email: email}, cb);
  },
  createUser: (user, cb) => {
  // createUser: (email, password, token, cb) => {
  //   model.create({email: email, password: password, token: token}, cb);
    const propertyIns = new model(user);

    propertyIns.save(cb);
  },
  getUserByResetToken: (resetToken, cb) => {
    model.findOne({resetToken: resetToken}, cb);
  },
  resetPassword: (data, cb) => {
    if (data.newPassword === data.confirmPassword) {
      model.findOneAndUpdate({resetToken : data.resetToken}, {password: data.newPassword}, cb);
    } else {
      cb(new Error('Passwords do not match'));
    }
  }
};

module.exports = users;