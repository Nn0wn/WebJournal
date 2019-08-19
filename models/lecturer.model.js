const mongoose = require('mongoose');

const { Schema } = mongoose;

const lecturerSchema = new Schema({
  name: String,
  surname: String,
  patronymic: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department'
  },
  subjects: [String]
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = { Lecturer, lecturerSchema };
