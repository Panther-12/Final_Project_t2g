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
exports.generatePasswordResetCode = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const saltRounds = 10; // Number of salt rounds for bcrypt hashing
/**
 * Hashes a password using bcrypt.
 * @param {string} password - Password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
    return hashedPassword;
});
exports.hashPassword = hashPassword;
/**
 * Generates a random password reset code using uuid and shortens to 6 characters.
 * @returns {string} Randomly generated password reset code.
 */
const generatePasswordResetCode = () => {
    const uuid = (0, uuid_1.v4)();
    const shortCode = uuid.substr(0, 6); // Take the first 6 characters of the uuid
    return shortCode;
};
exports.generatePasswordResetCode = generatePasswordResetCode;
