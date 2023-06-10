const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    slots: [Date],  // Each date represents a available slot
  });

module.exports = mongoose.model('Availability', AvailabilitySchema);