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
exports.isOrganizerOrAdmin = exports.isOrganizer = exports.isAdmin = exports.authenticateToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
});
exports.authenticateToken = authenticateToken;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Only admins allowed' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.isAdmin = isAdmin;
const isOrganizer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const token = (_c = req.header('Authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'organizer') {
            return res.status(403).json({ error: 'Forbidden. Only organizers allowed' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.isOrganizer = isOrganizer;
const isOrganizerOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = (_d = req.header('Authorization')) === null || _d === void 0 ? void 0 : _d.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'organizer' && (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Only admins and organizers allowed' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.isOrganizerOrAdmin = isOrganizerOrAdmin;
