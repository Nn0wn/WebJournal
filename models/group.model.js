const mongoose = require('mongoose');
const student = require('./student.model');

const groupSchema = new mongoose.Schema({
  number: Number,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course'
  },
  year: Number,
  students: [student.studentSchema]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };
