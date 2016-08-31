'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Property'
  },
  reason: {
    type: String,
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

module.exports = {
  model: model,
  dal: {
    get: (cb) => {
      return model.find({}, cb);
    },
    getByPropId: (id, cb) => {
      return model.find({propertyId: id }, cb);
    },
    create: (data, cb) => {
      const instance = new model(data);

      instance.save(cb);
    },
    edit: (id, model, cb) => {
      return model.findOneAndUpdate({_id: id}, model, cb);
    },
    remove: (id, cb) => {
      return model.findOneAndRemove({_id: id}, cb);
    }
  }
};