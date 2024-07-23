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
exports.userController = void 0;
const userService_1 = require("../services/userService");
const auth_1 = require("../middlewares/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailUtils_1 = require("../utils/emailUtils");
exports.userController = {
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const isValid = yield userService_1.userService.verifyPassword(email, password);
                if (!isValid) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                const user = yield userService_1.userService.getUserByEmail(email);
                if ((user === null || user === void 0 ? void 0 : user.accountStatus) === 'deactivated') {
                    return res.status(403).json({ error: 'Account is deactivated' });
                }
                const accessToken = (0, auth_1.generateAccessToken)(user.id);
                res.json({ token: accessToken, userId: user.id, role: user.role });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to authenticate' });
            }
        });
    },
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = req.body;
            try {
                const user = yield userService_1.userService.createUser(firstName, lastName, email, password, 'user');
                if (user)
                    (0, emailUtils_1.sendRegistrationConfirmationEmail)(user.email, firstName);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create user' });
            }
        });
    },
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const user = yield userService_1.userService.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch user' });
            }
        });
    },
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const { email, password } = req.body;
            try {
                let hashedPassword;
                if (password) {
                    const saltRounds = 10;
                    hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                }
                const updatedUser = yield userService_1.userService.updateUser(userId, { email, password: hashedPassword });
                res.json(updatedUser);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update user' });
            }
        });
    },
    deactivateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deactivatedUser = yield userService_1.userService.deactivateUser(id);
                res.status(200).json(deactivatedUser);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to deactivate account' });
            }
        });
    },
    activateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const activatedUser = yield userService_1.userService.activateUser(id);
                res.status(200).json(activatedUser);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to activate account' });
            }
        });
    },
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const { firstName, lastName, bio, phone, image } = req.body;
            try {
                const updatedProfile = yield userService_1.userService.updateUserProfile(userId, { firstName, lastName, bio, phone, image });
                res.json(updatedProfile);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update profile' });
            }
        });
    },
    assignRoleOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const assignOrganizer = yield userService_1.userService.assignRoleOrganizer(userId);
                res.json(assignOrganizer);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to assign user role organizer' });
            }
        });
    },
    assignRoleAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const assignAdmin = yield userService_1.userService.assignRoleAdmin(userId);
                res.json(assignAdmin);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to assign user role admin' });
            }
        });
    },
    generateResetCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield userService_1.userService.generateAndStoreResetCode(email);
                res.status(200).json({ message: 'Reset code sent to email', user });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to generate reset code' });
            }
        });
    },
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resetCode, email, newPassword } = req.body;
            try {
                const user = yield userService_1.userService.resetPassword(resetCode, email, newPassword);
                res.status(200).json({ message: 'Password reset successfully', user });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to reset password' });
            }
        });
    },
    getAllUsersExceptAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.userService.getAllUsersExceptAdmins();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving users', error });
            }
        });
    },
    getAttendeesForOrganizerEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizerId } = req.params;
            try {
                const attendees = yield userService_1.userService.getAttendeesForOrganizerEvents(organizerId);
                res.status(200).json(attendees);
            }
            catch (error) {
                console.error('Error fetching attendees for organizer events', error);
                res.status(500).json({ error: 'Failed to fetch attendees for organizer events' });
            }
        });
    }
};
