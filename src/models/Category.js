const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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

// Avoid duplicate category names per user
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
