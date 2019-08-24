const mongoose = require('mongoose');

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: String,
  lecturers: String
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = { Department, departmentSchema };
