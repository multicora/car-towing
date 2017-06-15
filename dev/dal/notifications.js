'use strict';

const mongoose = require('mongoose');
const path = require('path');
const Promise = require('promise');

const Schema = mongoose.Schema;

const schema = new Schema({
  tag: { type: String },
  text: { type: String },
  isRead: { type: Boolean, default: false },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

model.on('index', function(error) {
  if (error) {
    console.log('-| Error creating index');
    console.log(error);
  }
});

module.exports = {
  create: (data) => {
    return new Promise(function (resolve, reject) {
      const actionIns = new model(data);
      actionIns.save(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  },

  getByTag: (tag, cb) => {
    return new Promise(function (resolve, reject) {
      model.findOne({tag: tag }, function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  }
};