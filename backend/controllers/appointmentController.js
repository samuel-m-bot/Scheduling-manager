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
  const { user, employee, service, startTime, endTime } = req.body;

  //Check for overlap with existing appointments
  const overlap = await Appointment.findOne({
    employee: employee,
    $or: [
      {
        startTime: {
          $gte: startTime,
          $lt: endTime
        }
      }, 
      {
        endTime: {
          $gt: startTime,
          $lte: endTime
        }
      },
      {
        startTime: {
          $lte: startTime,
        },
        endTime: {
          $gte: endTime
        }
      }
    ]
  });

  if (overlap) {
    return res.status(400).json({ error: 'Overlapping appointment' });
  }

  // Create appointment
  console.log("Before await");
  const appointment = await Appointment.create({ user, employee, service, startTime, endTime })
  .catch(err => console.log(err))
  console.log("After await")

  //Update employee availability
  await User.updateOne(
    { _id: employee },
    { $push: { availability: { startTime: startTime, endTime: endTime } } }
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

const getAvailableTimeslots = asyncHandler( async(req, res, next) => {
  try {
    // Get the selected service's duration
    const service = await Service.findById(req.params.serviceId);
    const serviceDuration = service.duration;

    const dateParam = new Date(req.params.date);
    const nextDate = new Date(dateParam);
    nextDate.setDate(nextDate.getDate() + 1);

    // Fetch the availability for all employees and all booked appointments within the date range
    const employeeAvailability = await User.find({ role: 'employee' }).select('availability');
    const bookedAppointments = await Appointment.find({ startTime: { $gte: dateParam, $lt: nextDate } });

    console.log(bookedAppointments)
    let availableSlots = [];

    employeeAvailability.forEach(emp => {
      emp.availability.forEach(slot => {
    
        // Create an array of potential slots within this employee's availability
        let potentialSlots = [];
        let slotStart = new Date(slot.startTime);
        let slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);
    
        while (slotEnd <= slot.endTime) {
          potentialSlots.push({
            slotStart: new Date(slotStart),
            slotEnd: new Date(slotEnd)
          });
    
          // Increase the start and end times by the serviceDuration
          slotStart = new Date(slotStart.getTime() + serviceDuration * 60000);
          slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);
        }
    
        // For each potential slot, check if it overlaps with a booked appointment
        potentialSlots.forEach(potentialSlot => {
          const isSlotAvailable = bookedAppointments.every(app => {
            let appStart = new Date(app.startTime);
            let appEnd = new Date(app.endTime);
        
            // Check if the appointment overlaps with the potential slot and is for the same employee
            if(potentialSlot.slotStart < appEnd && potentialSlot.slotEnd > appStart && app.employee.equals(emp._id)){
              return false;  // If overlap and same employee, the slot is not available
            }else{
              return true;  // Otherwise, the slot is available
            }
          });
        
          if (isSlotAvailable) {
            availableSlots.push({
              employee: emp._id,
              slotStart: new Date(potentialSlot.slotStart),
              slotEnd: new Date(potentialSlot.slotEnd)
            });
          }
        });
        
      });
    });    
    

    // Group the slots by their start and end times
    const groupedSlots = {};
    availableSlots.forEach(slot => {
      const key = `${slot.slotStart}-${slot.slotEnd}`;
      if (!groupedSlots[key]) {
        groupedSlots[key] = [];
      }
      groupedSlots[key].push(slot);
    });

    // For each group of slots, pick one at random
    const finalSlots = [];
    Object.values(groupedSlots).forEach(slots => {
      const randomIndex = Math.floor(Math.random() * slots.length);
      finalSlots.push(slots[randomIndex]);
    });

    res.status(200).json(finalSlots);
  } catch(err) {
    // Handle errors
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});


  const getAvailableEmployees = asyncHandler(async (req, res, next) => {
    try {
      const slotStartParam = new Date(req.params.slotStart);
      const slotEndParam = new Date(req.params.slotEnd);
  
      const pipeline = [
        // Step 1: Find all employees who are available during the slot
        {
          $match: {
            role: 'employee',
            availability: {
              $elemMatch: {
                startTime: { $lte: slotStartParam },
                endTime: { $gte: slotEndParam },
              },
            },
          },
        },
        // Step 2: Perform a left outer join with the appointments collection to get overlapping appointments
        {
          $lookup: {
            from: 'appointments',
            let: { employeeId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$employee', '$$employeeId'] },
                      { $gte: ['$startTime', slotStartParam] },
                      { $lte: ['$endTime', slotEndParam] },
                    ],
                  },
                },
              },
            ],
            as: 'overlappingAppointments',
          },
        },
        // Step 3: Filter out employees who have overlapping appointments
        {
          $match: {
            overlappingAppointments: { $size: 0 },
          },
        },
        // Step 4: Project the desired fields
        {
          $project: {
            _id: 1,
            fName: '$firstName',
            sName: '$surname',
          },
        },
      ];
  
      const availableEmployees = await User.aggregate(pipeline);
  
      res.status(200).json(availableEmployees);
    } catch (err) {
      // Handle errors
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  
  
module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAvailableTimeslots,
    getAvailableEmployees
}
