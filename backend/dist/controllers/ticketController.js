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
exports.ticketController = void 0;
const ticketService_1 = require("../services/ticketService");
exports.ticketController = {
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, type, price, quantity } = req.body;
            try {
                const ticket = yield ticketService_1.ticketService.createTicket(eventId, type, price, quantity);
                res.status(201).json(ticket);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create ticket' });
            }
        });
    },
    getTicketById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.id;
            try {
                const ticket = yield ticketService_1.ticketService.getTicketById(ticketId);
                if (!ticket) {
                    return res.status(404).json({ error: 'Ticket not found' });
                }
                res.json(ticket);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch ticket' });
            }
        });
    },
    updateTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.id;
            const { type, price, quantity } = req.body;
            try {
                const updatedTicket = yield ticketService_1.ticketService.updateTicket(ticketId, { type, price, quantity });
                res.json(updatedTicket);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update ticket' });
            }
        });
    },
    deleteTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.id;
            try {
                yield ticketService_1.ticketService.deleteTicket(ticketId);
                res.json({ message: 'Ticket deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete ticket' });
            }
        });
    },
    getAllTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield ticketService_1.ticketService.getAllTickets();
                res.json(tickets);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch tickets' });
            }
        });
    },
    getAllTicketsForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.eventId;
            try {
                const tickets = yield ticketService_1.ticketService.getAllTicketsForEvent(eventId);
                res.json(tickets);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch tickets for event' });
            }
        });
    },
    getAllTicketsForOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizerId } = req.params;
            try {
                const tickets = yield ticketService_1.ticketService.getAllTicketsForOrganizer(organizerId);
                res.status(200).json(tickets);
            }
            catch (error) {
                console.error('Error fetching tickets for organizer', error);
                res.status(500).json({ error: 'Failed to fetch tickets for organizer' });
            }
        });
    },
};
