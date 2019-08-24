const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = new Schema({
  name: String,
  groups: String,
  eduInfo: [
    {
      semester: Number,
      subjects: [String]
    }
  ]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, courseSchema };
