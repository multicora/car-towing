'use strict';

const mongoose = require('mongoose');
const path = require('path');

/*const Property = require('./property.js');*/

const Schema = mongoose.Schema;

const schema = new Schema({
	text: { type: String },
	propertyId: { type: Schema.Types.ObjectId, ref: 'Property' }
});

let model = mongoose.model(path.basename(module.filename, '.js'), schema);

module.exports = model;