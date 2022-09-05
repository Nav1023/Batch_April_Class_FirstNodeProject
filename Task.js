const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: Date
});

module.exports = Task = mongoose.model('task', TaskSchema);
