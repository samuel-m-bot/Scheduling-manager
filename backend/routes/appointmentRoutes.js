const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointmentController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(appointmentController.getAppointments)
  .post(appointmentController.createAppointment)

router
  .route('/:id')
  .get(appointmentController.getAppointment)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment)

  router.route('/timeslots/:serviceId/:date')
  .get(appointmentController.getAvailableTimeslots)

module.exports = router