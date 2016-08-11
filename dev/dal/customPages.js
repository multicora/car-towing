'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  key: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  editableContent: String,
  customJson: String
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

module.exports = model;