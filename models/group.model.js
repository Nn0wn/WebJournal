const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new mongoose.Schema({
  name: String,
  spec: String,
  course: String,
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  subjects: [
    {
      name: String,
      lecturers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Lecturer'
        }
      ]
    }
  ]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };
