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
exports.venueController = void 0;
const venueService_1 = require("../services/venueService");
exports.venueController = {
    createVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address, capacity, type } = req.body;
            try {
                const venue = yield venueService_1.venueService.createVenue(name, address, capacity, type);
                res.status(201).json(venue);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create venue' });
            }
        });
    },
    getVenueById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const venueId = req.params.id;
            try {
                const venue = yield venueService_1.venueService.getVenueById(venueId);
                if (!venue) {
                    return res.status(404).json({ error: 'Venue not found' });
                }
                res.json(venue);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch venue' });
            }
        });
    },
    getAllVenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const venues = yield venueService_1.venueService.getAllVenues();
                res.json(venues);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch venues' });
            }
        });
    },
    updateVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const venueId = req.params.id;
            const { name, address, capacity } = req.body;
            try {
                const updatedVenue = yield venueService_1.venueService.updateVenue(venueId, { name, address, capacity });
                res.json(updatedVenue);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update venue' });
            }
        });
    },
    deleteVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const venueId = req.params.id;
            try {
                yield venueService_1.venueService.deleteVenue(venueId);
                res.json({ message: 'Venue deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete venue' });
            }
        });
    },
};
