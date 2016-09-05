'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  email: { type: String, required: true, unique: true, max: 255 },
  password: { type: String, max: 255 },
  token: { type: String, required: true, max: 255 },
  resetToken: {type: String, max: 255 },
  rules: [ Schema.Types.ObjectId ]
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

module.exports = model;