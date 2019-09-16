const mongoose = require('mongoose');

const { Schema } = mongoose;

const fakultSchema = new Schema({
  name: String,
  specs: [String]
});

const Fakult = mongoose.model('Fakult', fakultSchema);

module.exports = { Fakult, fakultSchema };
