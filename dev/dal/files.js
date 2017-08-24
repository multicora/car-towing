'use strict';

const mongoose = require('mongoose');
const path = require('path');
const Promise = require('promise');

const Schema = mongoose.Schema;

const schema = new Schema({
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
  },
  data: {
    type: String,
    required: true
  }
});

const model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', error => {
  if (error) {
    console.error('-| Error creating index');
    console.error(error);
  }
});

module.exports = {
  model,
  save: (ownerId, propertyId, updated, data) => {
    console.log(ownerId, propertyId, updated);
    const inst = new model({
      ownerId,
      property: propertyId,
      updated,
      data,
    });

    return new Promise((resolve, reject) => {
      inst.save((err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  },
  getByOwnerId: (id, cb) => {
    model.find({ownerId: id}, cb);
  },
  getByPropertyId: (id, cb) => {
    return new Promise((resolve, reject) => {
      model.find({property: id}, (err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  },
  getById(id, cb) {
    return new Promise((resolve, reject) => {
      model.find({_id: id}, (err, res) => {
        err ? reject(err) : resolve(res[0]);
      });
    });
  }
};
