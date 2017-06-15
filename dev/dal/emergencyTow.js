'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  propertyName: {
    type: String,
    required: true,
    max: 255
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: 'files',
    required: true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'locations'
  },
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const properties = {
  get: (cb) => {
    return model.find({}, cb);
  },
  getById: (id, cb) => {
    return model.findOne({_id: id }, cb);
  },
  getByPropertyName: (propertyName, cb) => {
    return model.find({propertyName: propertyName}, cb);
  },
  create: (propertyName, photo, location, cb) => {
    const propertyIns = new model({
      propertyName: propertyName,
      photo: photo,
      location: location
    });

    propertyIns.save(cb);
  },
};

module.exports = properties;
