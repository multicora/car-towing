'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const property = new Schema({
  name: String,
  logo: String,
  rules: [String],
  manager: Schema.Types.ObjectId,
  license:
  updated: { type: Date, default: Date.now }
  // comments: [{ body: String, date: Date }],
  // date: { type: Date, default: Date.now },
  // hidden: Boolean,
  // meta: {
  //   votes: Number,
  //   favs:  Number
  // }
});