const mongoose = require('mongoose');

// Define schema for log entries
const LogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'error', 'info', 'debug'], // Valid log categories
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', LogSchema);
