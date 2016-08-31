'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const schema = new Schema({
	text: { type: String, required: true },
	propertyId: { type: Schema.Types.ObjectId, ref: 'Property' }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const parkingRules = {
  getAll: (cb) => {
    model.find({}, cb);
  },
  getByPropId: (propertyId, cb) => {
    model.find({propertyId: propertyId}, cb);
  },
  create: (rule, cb) => {
    const propertyIns = new model(rule);
    propertyIns.save(cb);
  },
  setByPropId: (propertyId, rules, cb) => {
    let rulesArr = [];
    DAL.properties.getById(propertyId, function(err, property) {
      if (property) {
        rules.forEach((item) => {
          rulesArr.push({propertyId: propertyId, text: item});
        });
        ParkingRules.remove({propertyId: propertyId}, (err, docs) => {
          !err ? ParkingRules.create(rulesArr, cb) : cb(err, docs);
        });
      } else {
        cb(new Error('Property with this id is not exists.'));
      }
    });
  },
  update: (id, cb) => {
    return model.findOneAndUpdate({_id: id}, cb);
  },
  remove: (id, cb) => {
    return model.findOneAndRemove({_id: id}, cb);
  }
};

module.exports = parkingRules;