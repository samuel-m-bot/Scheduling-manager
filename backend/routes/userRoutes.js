const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser)

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router
  .route('/:id/availability')
  .patch(userController.updateAvailability)
  .delete(userController.deleteAvailability)

router
  .route('/:id/appointments')
  .get(userController.getAppointments)
  .post(userController.createNewAppointmentRequest)
  .delete(userController.cancelAppointmentRequest)

module.exports = router