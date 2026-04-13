const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Number, // Reference to Postgres User ID
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Avoid duplicate tag names per user
tagSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);
