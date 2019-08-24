const mongoose = require('mongoose');

const { Schema } = mongoose;

const lecturerSchema = new Schema({
  name: String,
  surname: String,
  patronymic: String,
  department: String,
  subjects: [String]
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = { Lecturer, lecturerSchema };
