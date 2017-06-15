'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const schema = new Schema({
  fileId: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'property'
  },
  updated: {
    type: Date
  }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

module.exports = {
  save: (fileId, ownerId, propertyId, updated, cb) => {
    let inst = new model({
      fileId: fileId,
      ownerId: ownerId,
      property: propertyId,
      updated: updated
    });

    inst.save(cb)
  },
  getByOwnerId: (id, cb) => {
    model.find({ownerId: id}, cb);
  },
  getByPropertyId: (id, cb) => {
    model.find({property: id}, cb);
  },
  getById: (id, cb) => {
    model.find({_id: id}, cb);
  }
};