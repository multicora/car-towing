'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const property = new Schema({
  name: String,
  logo: String,
  rules: [String],
  manager: Schema.Types.ObjectId,
  license: Schema.Types.ObjectId,
  blocked: { type: Boolean, default: false },
  updated: { type: Date, default: Date.now }
});