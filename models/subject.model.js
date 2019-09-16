const mongoose = require('mongoose');
const mark = require('./mark.model');

const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: String,
  // semester: String,
  marks: [mark.markSchema]
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = { Subject, subjectSchema };
