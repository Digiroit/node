const express = require('express');
const router = express.Router();
const eventController = require('./../controllers/event.controller');

router
    .route('/')
    .get(eventController.getAllEvents).post(eventController.createNewEvent)

router
    .route('/:eventId')
    .patch(eventController.updateEvent).delete(eventController.deleteEvent)


module.exports = router;
