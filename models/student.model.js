const mongoose = require('mongoose');
const subject = require('./subject.model');

const { Schema } = mongoose;

const studentSchema = new Schema({
  name: String,
  surname: String,
  patronymic: String,
  semester: String,
  fakult: String,
  spec: String,
  course: String,
  subjects: [subject.subjectSchema]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student, studentSchema };
