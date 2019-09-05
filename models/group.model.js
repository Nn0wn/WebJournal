const mongoose = require('mongoose');
const student = require('./student.model');

const groupSchema = new mongoose.Schema({
  number: Number,
  spec: String,
  course: String,
  students: [student.studentSchema]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };
