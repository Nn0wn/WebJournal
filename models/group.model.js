const mongoose = require('mongoose');
const student = require('./student.model');

const groupSchema = new mongoose.Schema({
  number: Number,
  course: String,
  year: Number,
  students: [student.studentSchema]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };
