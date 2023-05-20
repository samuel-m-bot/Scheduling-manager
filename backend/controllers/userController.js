const User = require('../models/Users')
const Appointments = require('../models/Appointment')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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
const updateUser = asyncHandler( async(req, res) => {
    const {id, firstName, surname, email, password, role} = req.body

    if(!firstName ||!surname || !email ||!password ||!role){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exex()

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

    res.json({ message: `${updatedUser.firstName} updated` })
})

//@desc Update a users
//@route PATCH /users
//@access Private
const updateAvailability = asyncHandler(async (req, res) => {
    const { availability } = req.body;
  
    try {
      // Check if user exists and is an employee
      let user = await User.findOne({ _id: req.params.id });
  
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }
  
      if (user.role !== 'employee') {
        return res.status(400).json({ msg: 'Only employees can update availability' });
      }
  
      // Update the user's availability
      user.availability = availability;
  
      // Save the updated user to the database
      await user.save();
  
      res.json({ msg: 'Availability updated successfully', user });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
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

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    updateAvailability,
    deleteUser
}