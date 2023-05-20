const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const AppointmentSchema = new mongoose.Schema({
  user: {
    firstName: {
      type: String,
      required: true
    },
    surname: {
        type: String,
        required: true
      },
    email: {
      type: String,
      required: true
    },
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
  appointmentTime: {
    type: Date,
    required: true
  }
});

AppointmentSchema.plugin(AutoIncrement, {
    inc_field: 'appointment',
    id: 'appointmentNums',
    start_seq: 200
})

module.exports = mongoose.model('Appointment', AppointmentSchema);
