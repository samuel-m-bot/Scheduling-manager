const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointment: Number,
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
  },
  status: {
    type: String,
    enum: ['open', 'completed', 'cancelled'],
    default: 'open'
  },
  outcome: {
    type: String,
    default: ''
  },
});

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

AppointmentSchema.pre('save', async function(next) {
  var doc = this;
  try {
    const counter = await Counter.findByIdAndUpdate({_id: 'appointmentId'}, {$inc: { seq: 1}}, {new: true, upsert: true});
    doc.appointment = counter.seq;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
