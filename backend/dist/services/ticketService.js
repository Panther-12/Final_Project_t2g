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
exports.ticketService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ticketService = {
    createTicket(eventId, type, price, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.create({
                data: {
                    eventId,
                    type,
                    price,
                    quantity,
                },
                include: {
                    event: true,
                    registrations: true,
                },
            });
        });
    },
    getTicketById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.findUnique({
                where: { id },
                include: {
                    event: true,
                    registrations: true,
                },
            });
        });
    },
    updateTicket(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.update({
                where: { id },
                data,
                include: {
                    event: true,
                    registrations: true,
                },
            });
        });
    },
    deleteTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.delete({
                where: { id },
            });
        });
    },
    getAllTicketsForEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.findMany({
                where: { eventId },
                include: {
                    event: true,
                    registrations: true,
                },
            });
        });
    },
    getAllTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.ticket.findMany({
                include: {
                    event: true,
                    registrations: true,
                },
            });
        });
    },
    getAllTicketsForOrganizer(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all events for the given organizer
            const events = yield prisma.event.findMany({
                where: {
                    organizerId,
                },
                include: {
                    tickets: {
                        include: {
                            event: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    },
                },
            });
            const ticketsWithEventTitle = events.flatMap(event => event.tickets.map(ticket => (Object.assign(Object.assign({}, ticket), { eventTitle: event.title }))));
            return ticketsWithEventTitle;
        });
    },
};
