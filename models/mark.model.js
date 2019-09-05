const mongoose = require('mongoose');

const { Schema } = mongoose;

const markSchema = new Schema({
  value: String,
  date: { type: Date, default: Date.now },
  comments: String
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = { Mark, markSchema };
