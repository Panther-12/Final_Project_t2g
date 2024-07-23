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
exports.registrationService = void 0;
const client_1 = require("@prisma/client");
const emailUtils_1 = require("../utils/emailUtils");
const prisma = new client_1.PrismaClient();
exports.registrationService = {
    registerUserForEvent(eventId, userId, ticketIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            try {
                // Fetch the event details to check its status
                const event = yield prisma.event.findUnique({
                    where: { id: eventId },
                    select: { status: true },
                });
                if (!event) {
                    message = `Event with id ${eventId} not found`;
                    return { message: message };
                }
                if (event.status === 'cancelled') {
                    message = 'Cannot register for a cancelled event';
                    return { message: message };
                }
                // Check if the user is already registered for this event
                const existingRegistration = yield prisma.registration.findFirst({
                    where: {
                        eventId,
                        userId,
                    },
                });
                if (existingRegistration) {
                    if (existingRegistration.status === 'active') {
                        message = 'User is already registered for this event';
                        return { message: message };
                    }
                    else {
                        // Update the existing registration to active
                        yield prisma.registration.update({
                            where: { id: existingRegistration.id },
                            data: { status: 'active' },
                        });
                        message = 'User registration status updated to active';
                        return { message: message };
                    }
                }
                // Check ticket availability and update quantities
                for (const ticketId of ticketIds) {
                    const ticket = yield prisma.ticket.findUnique({ where: { id: ticketId } });
                    if (!ticket) {
                        message = `Ticket with id ${ticketId} not found`;
                        return { message: message };
                    }
                    if (ticket.quantity < 1) {
                        message = `Insufficient quantity for ticket id ${ticketId}`;
                        return { message: message };
                    }
                    yield prisma.ticket.update({
                        where: { id: ticketId },
                        data: { quantity: ticket.quantity - 1 },
                    });
                }
                // Create the registration
                const registration = yield prisma.registration.create({
                    data: {
                        eventId,
                        userId,
                        status: 'active',
                        tickets: {
                            connect: ticketIds.map(ticketId => ({ id: ticketId })),
                        },
                    },
                    include: {
                        tickets: true,
                    },
                });
                // Fetch user details
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                    select: { profile: true, email: true },
                });
                if (!user) {
                    message = `User with id ${userId} not found`;
                    return { message: message };
                }
                const event2 = yield prisma.event.findUnique({
                    where: { id: eventId },
                    include: {
                        venue: true
                    }
                });
                if (!event2) {
                    message = `Event with id ${eventId} not found`;
                    return { message: message };
                }
                // Send the confirmation email
                yield (0, emailUtils_1.sendEventRegistrationConfirmationEmail)((user.profile).firstName, user.email, event2.title, event2.startDateTime.toISOString(), event2.endDateTime.toISOString(), event2.venue.address);
                return registration;
            }
            catch (error) {
                throw new Error(`Failed to register user for event: ${error}`);
            }
        });
    },
    getRegistrationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.findUnique({
                where: { id },
                include: {
                    event: true,
                    user: true,
                    tickets: true,
                },
            });
        });
    },
    updateRegistration(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.update({
                where: { id },
                data,
                include: {
                    event: true,
                    user: true,
                    tickets: true,
                },
            });
        });
    },
    deleteRegistration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.update({
                where: { id },
                data: {
                    status: 'cancelled',
                },
                include: {
                    event: true,
                    user: true,
                    tickets: true,
                },
            });
        });
    },
    getAllRegistrationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.findMany({
                where: { userId },
                include: {
                    event: {
                        include: {
                            venue: true,
                            images: true
                        }
                    },
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    tickets: true,
                },
            });
        });
    },
    getAllRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.findMany({
                include: {
                    event: {
                        include: {
                            venue: true,
                            images: true
                        }
                    },
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    tickets: true,
                },
            });
        });
    },
    getAllRegistrationsByOrganizer(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.registration.findMany({
                where: {
                    event: {
                        organizerId: organizerId,
                    },
                },
                include: {
                    event: {
                        include: {
                            venue: true,
                            images: true
                        }
                    },
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    tickets: true,
                },
            });
        });
    },
};
