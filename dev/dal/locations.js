'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true}
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const locations = {
  get: (cb) => {
    return model.find({}, cb);
  },
  getById: (id, cb) => {
    return model.findOne({_id: id }, cb);
  },
  create: (location, cb) => {
    const locationInstance = new model(location);
    if (typeof cb === 'function') {
      locationInstance.save(cb);
    } else {
      return locationInstance.save();
    }
  },
  remove: (id, cb) => {
    return model.findOneAndRemove({_id: id}, cb);
  },
  edit: (id, data, cb) => {
    return model.findOneAndUpdate({_id: id}, data, cb);
  }
};

module.exports = locations;
