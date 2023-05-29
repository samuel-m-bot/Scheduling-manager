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
    try {
        const { userId, employeeId, serviceId, appointmentTime } = req.body;

        // Retrieve the employee
        const employee = await User.findById(employeeId);

        // Check the employee's availability
        const appointmentDateTime = new Date(appointmentTime);
        const isEmployeeAvailable = employee.availability.some(interval => {
            const startTime = new Date(interval.startTime);
            const endTime = new Date(interval.endTime);

            // Check if the appointment time is within the employee's available time slot
            return appointmentDateTime >= startTime && appointmentDateTime <= endTime;
        });

        if (!isEmployeeAvailable) {
            // If the employee is not available at the requested time, send an error response
            return res.status(400).json({ message: "The employee is not available at the requested time." });
        }

        // If the employee is available, proceed with creating the appointment
        const appointment = new Appointment({
            user: userId,
            employee: employeeId,
            service: serviceId,
            appointmentTime: appointmentDateTime,
        });

        // Save appointment
        const savedAppointment = await appointment.save();

        // Update user's and employee's appointments
        await User.updateOne(
            { _id: userId },
            { $push: { appointments: savedAppointment._id } }
        );
        await User.updateOne(
            { _id: employeeId },
            { $push: { appointments: savedAppointment._id } }
        );

        res.json(savedAppointment);
        } catch (err) {
        next(err);
    }
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
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    await User.updateOne(
      { _id: deletedAppointment.user },
      { $pull: { appointments: deletedAppointment._id } }
    );
    await User.updateOne(
      { _id: deletedAppointment.employee },
      { $pull: { appointments: deletedAppointment._id } }
    );
    res.json(deletedAppointment);
  } catch (err) {
    next(err);
  }
})

const getAvailableTimeslots =asyncHandler( async(req, res, next) => {
    try {
      const { employeeId, serviceId } = req.query;
      const employee = await User.findById(employeeId);
      const service = await Service.findById(serviceId);
  
      if (!employee || !service) {
        return res.status(400).json({ message: 'Invalid employee or service ID.' });
      }
  
      const availableTimeslots = employee.availability.map(slot => ({
        startTime: slot.startTime,
        endTime: new Date(slot.startTime.getTime() + service.duration * 60000)  // assumes duration is in minutes
      }));
  
      res.json(availableTimeslots);
    } catch (error) {
      next(error);
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
