'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name: { type: String, required: true, max: 255 },
  address: String,
  logo: String,
  objId: String,
  rules: [String],
  location: Schema.Types.ObjectId,
  /*manager: Schema.Types.ObjectId,
  license: Schema.Types.ObjectId,*/
  blocked: { type: Boolean, default: false },
  updated: { type: Date, default: Date.now }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

module.exports = model;
