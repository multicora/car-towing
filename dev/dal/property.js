'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name    :  { type: String, required: true, max: 255 },
  addres  :  String,
  logo    :  String,
  location:  { type: Schema.Types.ObjectId, ref: 'locations' },
  blocked :  { type: Boolean, default: false },
  updated :  { type: Date, default: Date.now },
  manager :  { type: Schema.Types.ObjectId, ref: 'users' },
  towingMatrix: String,
  deleted :  { type: Boolean, default: false }
  /*manager: Schema.Types.ObjectId,
  license: Schema.Types.ObjectId,*/
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
  create: (property, cb) => {
    const propertyIns = new model(property);

    propertyIns.save(cb);
  },
  edit: (id, data, cb) => {
    return model.findOneAndUpdate({_id: id}, data, cb);
  },
  remove: (id, cb) => {
    return model.findOneAndRemove({_id: id}, cb);
  },
  getByUserId: (id, cb) => {
    return model.findOne({manager: id}, cb);
  },
  updateTowingMatrix: (id, data, cb) => {
    return model.findOneAndUpdate({_id: id}, data, cb);
  },
  delete: (id, cb) => {
    model.findOneAndUpdate({_id: id}, {deleted : true}, cb);
  }
};

module.exports = properties;
