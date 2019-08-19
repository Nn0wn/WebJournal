const mongoose = require('mongoose');

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: String,
  lecturers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lecturer'
    }
  ]
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = { Department, departmentSchema };
