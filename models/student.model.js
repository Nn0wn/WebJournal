const mongoose = require('mongoose');
const subject = require('./subject.model');

const { Schema } = mongoose;

const studentSchema = new Schema({
  name: String,
  surname: String,
  patronymic: String,
  course: String,
  semester: Number,
  year: Number,
  subjects: [subject.subjectSchema]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student, studentSchema };
