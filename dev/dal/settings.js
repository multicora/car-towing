'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  value: String
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

const settings = {
  get: (cb) => {
    return model.find({}, cb);
  },
  getByName: function (name, cb) {
    return model.findOne({name: name}, cb);
  },
  update: function (setting, cb) {
    model.findOneAndUpdate(
      {
        name: setting.name
      },
      setting,
      {
        upsert:true
      },
      cb
    );
  }
};

module.exports = settings;