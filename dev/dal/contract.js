'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  activationAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'property',
    required: true
  },
  activationDate: {
    type: Date,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  notifyTerm: {
    type: Number,
    required: true
  }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const dal = {
  get: (cb) => {
    return model.find({}, cb);
  },
  getById: (id, cb) => {
    return model.findOne({_id: id }, cb);
  },
  getByPropId: (propId, cb) => {
    return model.findOne({property: propId}, cb);
  },
  create: (data, cb) => {
    const instance = new model(data);
    return instance.save(cb);
  },
  remove: (id, cb) => {
    return model.findOneAndRemove({_id: id}, cb);
  }
};

module.exports = dal;
