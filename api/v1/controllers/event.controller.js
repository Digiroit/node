const errorFunction = require('../../../utils/apiErrorFunction');
const EventModel = require('./../../../models/event');

exports.getAllEvents = async (req, res, next) => {
    try {
        let userId = req.userId;
        let events = await EventModel.find().populate('user');

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.createNewEvent = async (req, res, next) => {
    try {
        let userId = req.userId;
        const eventData = { ...req.body, user: userId }
        console.log(eventData);
        const event = new EventModel(eventData);
        let result = await event.save();
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log(error,
            '>>>>>')
        errorFunction(res, error);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        let eventId = req.params.eventId;
        let data = { ...req.body, user: req.userId };

        let events = await EventModel.updateOne({ eventId: eventId }, { $set: data });
        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        let eventId = req.params.eventId;
        let userId = req.userId;
        let result = await EventModel.deleteOne({ _id: eventId, userId: userId });
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        errorFunction(res, error);
    }
};
