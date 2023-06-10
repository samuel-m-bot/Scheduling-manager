const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')
const verifyJWT = require('../middleware/verifyJWT')

// Public Routes
router.route('/')
    .get(serviceController.getAllServices)

router.route('/:id')
    .get(serviceController.getServiceById)

// Private Routes
router.use(verifyJWT)

router.route('/')
    .post(serviceController.createNewService)

router.route('/:id')
    .patch(serviceController.updateService)
    .delete(serviceController.deleteService)

module.exports = router