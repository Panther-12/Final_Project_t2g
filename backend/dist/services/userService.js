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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordUtils_1 = require("../utils/passwordUtils");
const emailUtils_1 = require("../utils/emailUtils");
const prisma = new client_1.PrismaClient();
exports.userService = {
    createUser(firstName, lastName, email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newuser = yield prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });
            yield prisma.profile.create({
                data: {
                    firstName,
                    lastName,
                    userId: newuser.id
                }
            });
            return newuser;
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({
                where: { id },
                include: {
                    profile: true,
                },
            });
        });
    },
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.update({
                where: { id },
                data,
            });
        });
    },
    updateUserProfile(userId, profileInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProfile = yield prisma.profile.upsert({
                where: { userId },
                update: Object.assign(Object.assign({}, profileInput), { updatedAt: new Date() }),
                create: Object.assign(Object.assign({}, profileInput), { userId, createdAt: new Date(), updatedAt: new Date() }),
            });
            return updatedProfile;
        });
    },
    deactivateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            const user = yield prisma.user.findUnique({ where: { id } });
            if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                message = 'Cannot deactivate an admin user';
                return { message: message };
            }
            return prisma.user.update({
                where: { id },
                data: {
                    accountStatus: 'deactivated',
                },
            });
        });
    },
    activateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            const user = yield prisma.user.findUnique({ where: { id } });
            if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                message = 'User is an admin';
                return { message: message };
            }
            return prisma.user.update({
                where: { id },
                data: {
                    accountStatus: 'activated',
                },
            });
        });
    },
    verifyPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (!user)
                return false;
            const isValid = yield bcryptjs_1.default.compare(password, user.password);
            return isValid;
        });
    },
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({
                where: { email },
            });
        });
    },
    assignRoleOrganizer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            const user = yield prisma.user.findUnique({ where: { id } });
            if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                message = 'Cannot change role of an admin user';
                return { message: message };
            }
            return prisma.user.update({
                where: { id },
                data: {
                    role: 'organizer',
                },
            });
        });
    },
    assignRoleAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            const user = yield prisma.user.findUnique({ where: { id } });
            if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                message = 'Cannot change role of an admin user';
                return { message: message };
            }
            return prisma.user.update({
                where: { id },
                data: {
                    role: 'admin',
                },
            });
        });
    },
    generateAndStoreResetCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetCode = (0, passwordUtils_1.generatePasswordResetCode)();
            const user = yield prisma.user.update({
                where: { email },
                data: { resetCode },
            });
            (0, emailUtils_1.sendPasswordResetEmail)(email, resetCode);
            return user;
        });
    },
    resetPassword(resetCode, email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error('User not found');
            if (user.resetCode !== resetCode) {
                throw new Error('Invalid or expired reset code');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            return prisma.user.update({
                where: { email },
                data: { password: hashedPassword, resetCode: null },
            });
        });
    },
    getAllUsersExceptAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findMany({
                where: {
                    role: { not: 'admin' },
                },
                include: {
                    profile: true,
                },
            });
        });
    },
    getAttendeesForOrganizerEvents(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield prisma.event.findMany({
                where: {
                    organizerId,
                },
                include: {
                    registrations: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                    registrations: true
                                },
                            },
                        },
                    },
                },
            });
            const attendees = events.flatMap(event => event.registrations.map(registration => registration.user));
            return attendees;
        });
    },
};
