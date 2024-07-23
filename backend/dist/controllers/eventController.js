"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const eventService_1 = require("../services/eventService");
exports.eventController = {
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, startDateTime, endDateTime, venueId, organizerId, categoryId, images } = req.body;
            try {
                const event = yield eventService_1.eventService.createEvent(title, description, startDateTime, endDateTime, venueId, organizerId, categoryId, images);
                // // Send confirmation email to the organizer
                // const organizer = await userService.getUserById(organizerId) as User;
                // await sendEventCreationConfirmationEmail(organizer.email, title, startDateTime, endDateTime, venueId);
                res.status(201).json(event);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Failed to create event' });
            }
        });
    },
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.id;
            try {
                const event = yield eventService_1.eventService.getEventById(eventId);
                if (!event) {
                    return res.status(404).json({ error: 'Event not found' });
                }
                res.json(event);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch event' });
            }
        });
    },
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.id;
            const { title, description, startDateTime, endDateTime, venueId, organizerId, images } = req.body;
            try {
                const updatedEvent = yield eventService_1.eventService.updateEvent(eventId, title, description, startDateTime, endDateTime, venueId, organizerId, images);
                res.json(updatedEvent);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update event' });
            }
        });
    },
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.id;
            try {
                yield eventService_1.eventService.deleteEvent(eventId);
                res.json({ message: 'Event cancelled successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to cancel event' });
            }
        });
    },
    getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield eventService_1.eventService.getAllEvents();
                res.json(events);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch events' });
            }
        });
    },
    getEventsByOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizerId } = req.params;
            try {
                const events = yield eventService_1.eventService.getEventsByOrganizer(organizerId);
                res.status(200).json(events);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to get organizer\'s events' });
            }
        });
    },
    getAllEventsForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const events = yield eventService_1.eventService.getAllEventsForUser(userId);
                res.json(events);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch events for user' });
            }
        });
    },
};
