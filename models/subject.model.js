const mongoose = require('mongoose');
const mark = require('./mark.model');

const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: String,
  lecturers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      classification: String,
      ref: 'lecturer'
    }
  ],
  semester: Number,
  marks: [mark.markSchema]
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = { Subject, subjectSchema };
