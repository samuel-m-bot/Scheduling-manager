const Appointment = require('../models/Appointment');
const User = require('../models/Users');
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler')

// Get all appointments
const getAppointments =asyncHandler( async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', ['firstName', 'surname', 'email'])
      .populate('employee', ['firstName', 'surname', 'email'])
      .populate('service', ['name', 'description', 'price', 'duration']);
    if (!appointments?.length) {
      return res.status(400).json({ message: 'No appointments found' })
    }
    res.json(appointments);
  } catch (err) {
    next(err);
  }
})

// Get specific appointment
const getAppointment =asyncHandler( async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', ['firstName', 'surname', 'email'])
      .populate('employee', ['firstName', 'surname', 'email'])
      .populate('service', ['name', 'description', 'price', 'duration']);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
})

// Create new appointment
const createAppointment =asyncHandler( async (req, res, next) => {
  const { user, employee, service, appointmentTime } = req.body;
  
  // Check for overlap with existing appointments
  const overlap = await Appointment.findOne({
    employee: employee,
    $or: [{
      appointmentStartTime: {
        $lte: appointmentTime,
        $gt: appointmentTime
      }
    }, {
      appointmentEndTime: {
        $lt: appointmentTime,
        $gte: appointmentTime
      }
    }]
  });

  if (overlap) {
    return res.status(400).json({ error: 'Overlapping appointment' });
  }

  // Create appointment
  const appointment = await Appointment.create({ user, employee, service, appointmentTime });

  // Update employee availability
  await User.updateOne(
    { _id: employee },
    { $push: { availability: { startTime: appointment.appointmentStartTime, endTime: appointment.appointmentEndTime } } }
  );

  res.status(200).json(appointment);
})

// Update appointment
const updateAppointment =asyncHandler( async (req, res, next) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (err) {
    next(err);
  }
})

// Delete appointment
const deleteAppointment =asyncHandler( async (req, res, next) => {
  const { id } = req.params;
  
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  
  // Remove corresponding availability
  await User.updateOne(
    { _id: appointment.employee },
    { $pull: { availability: { startTime: appointment.appointmentStartTime, endTime: appointment.appointmentEndTime } } }
  );

  // Delete appointment
  await Appointment.deleteOne({ _id: id });

  res.status(200).json({ message: 'Appointment deleted' });
})

const getAvailableTimeslots =asyncHandler( async(req, res, next) => {
  try {
    // Get the selected service's duration
    const service = await Service.findById(req.params.serviceId);
    const serviceDuration = service.duration;

    const dateParam = new Date(req.params.date);
    const nextDate = new Date(dateParam);
    nextDate.setDate(nextDate.getDate() + 1);

    const pipeline = [
      { 
        $match: { 
          role: 'employee',
          'availability.startTime': { $gte: dateParam, $lt: nextDate }
        }
      },
      { 
        $project: { 
          _id: 1, 
          availableSlots: {
            $filter: {
              input: "$availability",
              as: "availability",
              cond: {
                $and: [
                  { $gte: [ "$$availability.startTime", dateParam ] },
                  { $lt: [ "$$availability.endTime", nextDate ] }
                ]
              }
            }
          }
        }
      },
      { 
        $lookup: {
          from: 'appointments',
          let: { employeeId: '$_id', availableSlots: '$availableSlots' },
          pipeline: [
            { 
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ '$employee', '$$employeeId' ] },
                    { $gte: [ '$appointmentTime', dateParam ] },
                    { $lt: [ '$appointmentTime', nextDate ] }
                  ]
                }
              }
            }
          ],
          as: 'bookedSlots'
        }
      },
      {
        $project: {
          _id: 1,
          availableSlots: {
            $filter: {
              input: "$availableSlots",
              as: "slot",
              cond: {
                $not: {
                  $in: [ "$$slot.startTime", "$bookedSlots.appointmentTime" ]
                }
              }
            }
          }
        }
      }
    ];

    const result = await User.aggregate(pipeline);

    // We still need to split each available interval into slots of 'serviceDuration' length
    let availableSlots = [];

    result.forEach(employee => {
      employee.availableSlots.forEach(interval => {
        let slotStart = new Date(interval.startTime);
        let slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

        while(slotEnd <= interval.endTime) {
          availableSlots.push({
            employee: employee._id,
            slotStart: slotStart,
            slotEnd: slotEnd
          });

          slotStart = slotEnd;
          slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);
        }
      });
    });

    res.status(200).json(availableSlots);
  } catch(err) {
    // Handle errors
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
  })
module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAvailableTimeslots
}
