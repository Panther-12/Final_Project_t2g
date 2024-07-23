"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', eventController_1.eventController.getAllEvents);
router.get('/:id', eventController_1.eventController.getEventById);
router.post('/', auth_1.isOrganizer, eventController_1.eventController.createEvent);
router.put('/:id', auth_1.isOrganizer, eventController_1.eventController.updateEvent);
router.delete('/:id', auth_1.isOrganizer, eventController_1.eventController.deleteEvent);
router.get('/organizer/:organizerId', auth_1.isOrganizerOrAdmin, eventController_1.eventController.getEventsByOrganizer);
router.get('/user/:userId', auth_1.authenticateToken, eventController_1.eventController.getAllEventsForUser);
exports.default = router;
