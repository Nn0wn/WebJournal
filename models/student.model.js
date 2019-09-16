const mongoose = require('mongoose');
const subject = require('./subject.model');

const { Schema } = mongoose;

const studentSchema = new Schema({
  semesters: [{ number: String, subjects: [subject.subjectSchema] }],
  fakult: String,
  spec: String,
  group: String,
  course: String
});

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student, studentSchema };
