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
exports.sendEventCancellationNotificationEmail = exports.sendEventRegistrationConfirmationEmail = exports.sendEventCreationConfirmationEmail = exports.sendRegistrationConfirmationEmail = exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const generateTicketPDF_1 = require("./generateTicketPDF");
dotenv_1.default.config();
// Create a nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    // Configure your SMTP server details here
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        type: 'login', // 'oauth2' or 'login
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});
// Function to send password reset email
const sendPasswordResetEmail = (recipientEmail, resetCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Render email template with EJS
        const emailTemplate = path_1.default.join(__dirname, '../emails/resetPassword.ejs');
        const renderedHtml = yield ejs_1.default.renderFile(emailTemplate, { userName: recipientEmail, resetCode });
        // Send email
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: recipientEmail,
            subject: 'Password Reset Request for Agenda',
            html: renderedHtml,
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${recipientEmail}`);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendRegistrationConfirmationEmail = (recipientEmail, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailTemplate = path_1.default.join(__dirname, '../emails/registrationConfirmation.ejs');
        const renderedHtml = yield ejs_1.default.renderFile(emailTemplate, { userName });
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: recipientEmail,
            subject: 'Welcome to Agenda - Registration Confirmation',
            html: renderedHtml,
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Registration confirmation email sent to ${recipientEmail}`);
    }
    catch (error) {
        console.error('Error sending registration confirmation email:', error);
        throw new Error('Failed to send registration confirmation email');
    }
});
exports.sendRegistrationConfirmationEmail = sendRegistrationConfirmationEmail;
const sendEventCreationConfirmationEmail = (organizerEmail, eventName, eventStartDate, eventEndDate, location) => __awaiter(void 0, void 0, void 0, function* () {
    const emailTemplate = path_1.default.join(__dirname, '../emails/eventCreationConfirmation.ejs');
    const renderedHtml = yield ejs_1.default.renderFile(emailTemplate, { eventName, eventStartDate, eventEndDate, location });
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: organizerEmail,
        subject: 'Event Creation Confirmation',
        html: renderedHtml,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEventCreationConfirmationEmail = sendEventCreationConfirmationEmail;
const sendEventRegistrationConfirmationEmail = (attendeeName, attendeeEmail, eventName, eventStartDate, eventEndDate, location) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate the PDF
    const ticketPDFPath = yield (0, generateTicketPDF_1.generateTicketPDF)(attendeeName, eventName, eventStartDate, eventEndDate, location);
    console.log(ticketPDFPath);
    const emailTemplate = path_1.default.join(__dirname, '../emails/eventRegistrationConfirmation.ejs');
    const renderedHtml = yield ejs_1.default.renderFile(emailTemplate, { attendeeName, attendeeEmail, eventName, eventStartDate, eventEndDate, location });
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: attendeeEmail,
        subject: 'Event Registration Confirmation',
        html: renderedHtml,
        attachments: [
            {
                filename: 'ticket.pdf',
                path: ticketPDFPath,
            },
        ],
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEventRegistrationConfirmationEmail = sendEventRegistrationConfirmationEmail;
const sendEventCancellationNotificationEmail = (attendeeName, attendeeEmail, eventName, eventStartDate) => __awaiter(void 0, void 0, void 0, function* () {
    const emailTemplate = path_1.default.join(__dirname, '../emails/eventCancellationNotification.ejs');
    const renderedHtml = yield ejs_1.default.renderFile(emailTemplate, { attendeeName, eventName, eventStartDate });
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: attendeeEmail,
        subject: 'Event Cancellation Confirmation',
        html: renderedHtml,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEventCancellationNotificationEmail = sendEventCancellationNotificationEmail;
