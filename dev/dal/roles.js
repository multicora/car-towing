'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const schema = new Schema({
  name: {type: String, required: true}
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

module.exports = model;