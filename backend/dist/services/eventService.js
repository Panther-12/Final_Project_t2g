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
exports.eventService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.eventService = {
    createEvent(title, description, startDateTime, endDateTime, venueId, organizerId, categoryId, images) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = "";
            // Fetch existing events at the venue that are active and within the time frame
            const conflictingEvents = yield prisma.event.findMany({
                where: {
                    venueId,
                    status: 'active',
                    OR: [
                        {
                            startDateTime: { lte: endDateTime },
                            endDateTime: { gte: startDateTime },
                        },
                    ],
                },
            });
            if (conflictingEvents.length > 0) {
                message = 'The venue is already booked during the specified time frame.';
                return { message: message };
            }
            return prisma.event.create({
                data: {
                    title,
                    description,
                    startDateTime,
                    endDateTime,
                    venueId,
                    organizerId,
                    categoryId,
                    images: {
                        create: images.map((url) => ({ url })),
                    }
                },
                include: {
                    venue: true,
                    organizer: true,
                    images: true,
                },
            });
        });
    },
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.event.findUnique({
                where: { id },
                include: {
                    venue: true,
                    organizer: {
                        include: {
                            profile: true,
                        }
                    },
                    tickets: true,
                    registrations: true,
                    images: true,
                    category: true
                },
            });
        });
    },
    updateEvent(id, title, description, startDateTime, endDateTime, venueId, organizerId, images) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                title,
                description,
                startDateTime,
                endDateTime,
                venueId,
                organizerId,
            };
            const updatedEvent = yield prisma.event.update({
                where: { id },
                data: {
                    title,
                    description,
                    startDateTime,
                    endDateTime,
                    venueId,
                    organizerId,
                },
                include: {
                    venue: true,
                    organizer: true,
                },
            });
            if (images !== undefined) {
                const eventImages = images.map((url) => ({
                    eventId: id,
                    url,
                }));
                yield prisma.eventImage.createMany({
                    data: eventImages,
                });
            }
            return updatedEvent;
        });
    },
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.event.update({
                where: { id },
                data: {
                    status: 'cancelled',
                }
            });
        });
    },
    getAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.event.findMany({
                include: {
                    venue: true,
                    organizer: {
                        include: {
                            profile: true
                        }
                    },
                    tickets: true,
                },
            });
        });
    },
    getEventsByOrganizer(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.event.findMany({
                where: { organizerId },
                include: {
                    venue: true,
                    organizer: true,
                    images: true,
                },
            });
        });
    },
    getAllEventsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.event.findMany({
                where: {
                    registrations: {
                        some: {
                            userId: userId,
                            status: {
                                not: 'cancelled',
                            },
                        },
                    },
                },
                include: {
                    venue: true,
                    organizer: true,
                    tickets: true,
                    registrations: true,
                    images: true,
                },
            });
        });
    },
};
