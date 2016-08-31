'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const schema = new Schema({
  fileId: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: {
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
  save: (fileId, ownerId, cb) => {
    let inst = new model({
      fileId: fileId,
      ownerId: ownerId
    });

    inst.save(cb)
  },
  getByOwnerId: (id, cb) => {
    Property.find({ownerId: id}, cb);
  }
};