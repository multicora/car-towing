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
  // Content for WYSIWYG editor
  editableContent: String,
  // Custom data, need to be sanitized
  customJson: String
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

module.exports = model;