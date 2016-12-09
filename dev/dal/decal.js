'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  decalColor: String,
  decalSeries: String,
  seriesType: String,
  serialNumber: String,
  assignedParkingSpace: String,
  licensePlateNumber: String,
  mark: String,
  model: String,
  color: String,
  year: String,
  fullName: String,
  apartmentNumber: String,
  phoneNumber: String,
  emailAddress: String
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const decal = {
  get: (cb) => {
    return model.find({}, cb);
  },
  getById: (id, cb) => {
    return model.findOne({_id: id }, cb);
  },
  getBySerial: (number, cb) => {
    return model.findOne({serialNumber: number}, cb);
  },
  create: (decal, cb) => {
    const decalIns = new model(decal);

    decalIns.save(cb);
  },
  edit: (id, data, cb) => {
    return model.findOneAndUpdate({_id: id}, data, cb);
  },
  remove: (id, cb) => {
    return model.findOneAndRemove({_id: id}, cb);
  }
};

module.exports = decal;
