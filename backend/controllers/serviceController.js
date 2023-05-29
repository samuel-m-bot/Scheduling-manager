const Service = require('../models/Service')
const asyncHandler = require('express-async-handler')

const getAllServices =asyncHandler( async (req, res, next) => {
    try {
        const services = await Service.find()
        if (!services?.length) {
            return res.status(400).json({ message: 'No services found' })
        }
        res.status(200).json(services)
    } catch (err) {
        next(err)
    }
})

const createNewService =asyncHandler( async (req, res, next) => {
    try {
        const newService = await Service.create(req.body);
        res.status(201).json(newService)
    } catch (err) {
        next(err)
    }
})

const getServiceById =asyncHandler( async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (err) {
        next(err);
    }
})

const updateService =asyncHandler( async (req, res, next) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (err) {
        next(err);
    }
})

const deleteService =asyncHandler( async (req, res, next) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(204).json({ message: 'Service deleted successfully' });
    } catch (err) {
        next(err);
    }
})

module.exports = {
    getAllServices,
    createNewService,
    getServiceById,
    updateService,
    deleteService
}