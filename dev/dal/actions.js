'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const actions = {
  createAction: (action, cb) => {
    const actionIns = new model(action);
    actionIns.save(cb);
  },

  getByName: (name, cb) => {
    return model.findOne({name: name }, cb);
  }
};

module.exports = actions;