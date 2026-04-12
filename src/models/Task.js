const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  userId: {
    type: Number, // Reference to Postgres User ID
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
