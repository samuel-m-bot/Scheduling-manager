const User = require('../models/Users')
const Appointments = require('../models/Appointment')
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { isSunday, isBefore, isAfter, setHours } = require('date-fns');

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler( async(req, res)=> {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})


//@desc Create new users
//@route POST /users
//@access Private
const createNewUser = asyncHandler( async(req, res) => {
    const { firstName, surname, email, password, role } = req.body

    if(!firstName ||!surname || !email ||!password ||!role){
        return res.status(400).json({message: 'All fields are required'})
    }
    const duplicate = await User.findOne({email}).lean().exec()
    if(duplicate){
        return res.status(409).json({message: 'User with email already exists'})
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = {firstName, surname, email, "password": hashedPwd, role }

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user for ${email} created`})
    }else{
        res.status(400).json({message: 'Invalid user data received'})
    }

})

//@desc Update a users
//@route PATCH /users
//@access Private
const postAppointmentRequest =asyncHandler(async (req, res, next) => {
    try {
      const { employeeId, serviceId, appointmentTime } = req.body;
      const userId = req.params.id;
      const appointment = new Appointment({
        user: userId,
        employee: employeeId,
        service: serviceId,
        appointmentTime: new Date(appointmentTime),
      });
      const savedAppointment = await appointment.save();
      await User.updateOne(
        { _id: userId },
        { $push: { appointments: savedAppointment._id } }
      );
      res.json(savedAppointment);
    } catch (err) {
      next(err);
    }
  })
  
//@desc Update a users
//@route PATCH /users
//@access Private
const updateUser = asyncHandler( async(req, res) => {
    const {id, firstName, surname, email, password, role} = req.body

    if(!firstName ||!surname || !email ||!role){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const duplicate = await User.findOne({email}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate email'})
    }

    user.firstName = firstName
    user.surname = surname
    user.email = email

    if(role){
        user.role = role
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      }
    const updateUser = await user.save()

    res.json({ message: `${updateUser.firstName} updated` })
})

//@desc Update a users
//@route PATCH /users
//@access Private
function isOverlapping(newSlot, existingSlots) {
    const newStart = new Date(newSlot.startTime);
    const newEnd = new Date(newSlot.endTime);

    for (let i = 0; i < existingSlots.length; i++) {
        const existingStart = new Date(existingSlots[i].startTime);
        const existingEnd = new Date(existingSlots[i].endTime);

        // Overlapping occurs if the new slot starts before an existing slot ends and ends after the existing slot starts.
        if (newStart < existingEnd && newEnd > existingStart) {
            return true;
        }
    }
    
    return false;
}

//@desc Update a employee availability
//@route PATCH /users/id:/availability
//@access Private
const updateAvailability = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { availability } = req.body;
  
      // Retrieve the current availability
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Check each new slot for overlap and valid timing
      for (let i = 0; i < availability.length; i++) {
        const startTime = new Date(availability[i].startTime);
        const endTime = new Date(availability[i].endTime);
  
        if (isOverlapping(availability[i], user.availability)) {
          return res.status(400).send({ message: 'Timeslot overlaps with an existing timeslot' });
        }
  
        if (isSunday(startTime)) {
          return res.status(400).send({ message: 'Cannot book on a Sunday' });
        }
  
        if (startTime.getHours() < 9 || endTime.getHours() > 17) {
          return res.status(400).send({ message: 'Bookings can only be made from 9am to 5pm' });
        }
      }
  
      // If no overlaps and all timings are valid, add the new slots
      await User.findByIdAndUpdate(
        id, 
        { $push: { availability: { $each: availability }}},
        { new: true, runValidators: true, select: '-password' } // exclude password
      );
  
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (err) {
      next(err);
    }
  })
  
//@desc Delete a users
//@route DELETEjj /users
//@access Private
const deleteUser = asyncHandler( async(req, res) => {
    const {id} = req.body

    if(!id){
        return res.status(400).json({message: 'User ID requited'})
    }

    try {
        // Check if user exists
        let user = await User.findById(req.params.id);
    
        if (!user) {
          return res.status(400).json({ msg: 'User not found' });
        }
    
        // Check if user is an employee with assigned appointments
        if (user.role === 'employee') {
          const appointments = await Appointment.find({ employee: user._id });
    
          if (appointments.length > 0) {
            return res.status(400).json({
              msg: 'Cannot delete employee with assigned appointments'
            });
          }
        }
    
        // Delete the user
        await User.findByIdAndRemove(req.params.id);
    
        res.json({ msg: `User deleted successfully with ID ${result._id}` });
    
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
})

const deleteAvailability =asyncHandler( async (req, res, next) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        const user = await User.findByIdAndUpdate(
            id, 
            { $pull: { availability: { $in: availability }}},
            { new: true, runValidators: true, select: '-password' } // exclude password
        );

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
})


const getAppointments =asyncHandler( async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('appointments');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user.appointments);
    } catch (error) {
        next(error);
    }
})

const createNewAppointmentRequest =asyncHandler( async (req, res, next) => {
    try {
        const { userId, employeeId, serviceId, appointmentTime } = req.body;
        const employee = await User.findById(employeeId);
    
        const isAvailable = employee.availability.some(slot =>
          slot.startTime <= appointmentTime && slot.endTime > appointmentTime
        );
    
        if (!isAvailable) {
          return res.status(400).json({ message: 'Selected time slot is not available.' });
        }
    
        const newAppointment = await Appointment.create({
          user: userId,
          employee: employeeId,
          service: serviceId,
          appointmentTime
        });
    
        await User.findByIdAndUpdate(userId, {
          $push: { appointments: newAppointment._id }
        });
    
        res.status(201).json(newAppointment);
      } catch (error) {
        next(error);
      }
})

const cancelAppointmentRequest =asyncHandler( async (req, res, next) => {
    try {
        const { appointmentId } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const appointmentIndex = user.appointments.indexOf(appointmentId);
        if (appointmentIndex === -1) {
            return res.status(404).json({message: 'Appointment not found in user\'s appointment list'});
        }
        user.appointments.splice(appointmentIndex, 1);
        await user.save();

        await Appointment.findByIdAndRemove(appointmentId);

        res.status(200).json({message: 'Appointment cancelled'});
    } catch (error) {
        next(error);
    }
})

module.exports = {
    getAllUsers,
    createNewUser,
    postAppointmentRequest,
    updateUser,
    updateAvailability,
    deleteUser,
    deleteAvailability,
    getAppointments,
    createNewAppointmentRequest,
    cancelAppointmentRequest
}