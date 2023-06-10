const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

AppointmentSchema.plugin(AutoIncrement, {
    inc_field: 'appointment',
    id: 'appointmentNums',
    start_seq: 200
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
