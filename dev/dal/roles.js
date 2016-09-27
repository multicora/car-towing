'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name: {type: String, required: true},
  actions: [ {type: Schema.Types.ObjectId, ref: 'actions'} ]
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const roles = {
  get: (cb) => {
    return model.find({}).populate('actions').exec(cb);
  },
  getByName: (name, cb) => {
    return model.findOne({name: name }, cb);
  },
  create: (role, cb) => {
    const roleInstance = new model(role);

    roleInstance.save(cb);
  },
  update: function (id, data, cb) {
    return model.findOneAndUpdate({ _id: id}, data, cb);
  }
};

module.exports = roles;
