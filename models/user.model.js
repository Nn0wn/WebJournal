const mongoose = require('mongoose');
const student = require('./student.model');
const lecturer = require('./lecturer.model');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  surname: String,
  patronymic: String,

  email: {
    type: String,
    required: true
    // unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  studentProfile: student.studentSchema,
  lecturerProfile: lecturer.lecturerSchema
});

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };
