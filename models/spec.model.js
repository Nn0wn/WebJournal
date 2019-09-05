const mongoose = require('mongoose');

const { Schema } = mongoose;

const specSchema = new Schema({
  name: String,
  groups: String,
  eduInfo: [
    {
      semester: String,
      subjects: [String]
    }
  ]
});

const Spec = mongoose.model('Course', specSchema);

module.exports = { Spec, specSchema };
