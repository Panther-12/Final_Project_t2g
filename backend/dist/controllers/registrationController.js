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
exports.registrationController = void 0;
const registrationService_1 = require("../services/registrationService");
exports.registrationController = {
    registerUserForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, userId, status, ticketIds } = req.body;
            try {
                const registration = yield registrationService_1.registrationService.registerUserForEvent(eventId, userId, ticketIds);
                res.status(201).json(registration);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to register user for event' });
            }
        });
    },
    getRegistrationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationId = req.params.id;
            try {
                const registration = yield registrationService_1.registrationService.getRegistrationById(registrationId);
                if (!registration) {
                    return res.status(404).json({ error: 'Registration not found' });
                }
                res.json(registration);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch registration' });
            }
        });
    },
    updateRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationId = req.params.id;
            const { status } = req.body;
            try {
                const updatedRegistration = yield registrationService_1.registrationService.updateRegistration(registrationId, { status });
                res.json(updatedRegistration);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update registration' });
            }
        });
    },
    deleteRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationId = req.params.id;
            try {
                yield registrationService_1.registrationService.deleteRegistration(registrationId);
                res.json({ message: 'Registration deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete registration' });
            }
        });
    },
    getAllRegistrationsForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const registrations = yield registrationService_1.registrationService.getAllRegistrationsForUser(userId);
                res.json(registrations);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch registrations' });
            }
        });
    },
    getAllRegistrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield registrationService_1.registrationService.getAllRegistrations();
                res.json(registrations);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch registrations' });
            }
        });
    },
    getAllRegistrationsByOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizerId = req.params.organizerId;
            try {
                const registrations = yield registrationService_1.registrationService.getAllRegistrationsByOrganizer(organizerId);
                res.json(registrations);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch registrations for organizer' });
            }
        });
    },
};
