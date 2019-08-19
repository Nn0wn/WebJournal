const mongoose = require('mongoose');

const { Schema } = mongoose;

const fakultSchema = new Schema({
  name: String,
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course'
    }
  ]
});

const Fakult = mongoose.model('Fakult', fakultSchema);

module.exports = { Fakult, fakultSchema };
