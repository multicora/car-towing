'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  key: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Content need to be sanitized
  content: String,
  // Content for WYSIWYG editor
  editableContent: String,
  // Custom data, need to be sanitized
  customJson: String
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

module.exports = model;