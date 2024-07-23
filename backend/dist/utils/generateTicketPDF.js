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
exports.generateTicketPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateTicketPDF = (attendeeName, eventName, eventStartDate, eventEndDate, location) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
    const filePath = path_1.default.join(__dirname, `../tickets/${attendeeName.replace(/ /g, '_')}_ticket.pdf`);
    // Ensure the directory exists
    if (!fs_1.default.existsSync(path_1.default.dirname(filePath))) {
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
    }
    const writeStream = fs_1.default.createWriteStream(filePath);
    doc.pipe(writeStream);
    // Add background and header
    doc
        .rect(0, 0, doc.page.width, 100)
        .fill('#6b3eb8')
        .fillOpacity(0.8);
    doc
        .fontSize(32)
        .fillColor('white')
        .text('Event Ticket', { align: 'center', continued: true })
        .fontSize(16)
        .text(' - ' + eventName, { align: 'center' })
        .moveDown(1);
    // Add ticket details
    doc
        .fillColor('#333')
        .fontSize(16)
        .text(`Attendee: ${attendeeName}`, { align: 'left' })
        .text(`Event: ${eventName}`, { align: 'left' })
        .text(`Start Date: ${eventStartDate}`, { align: 'left' })
        .text(`End Date: ${eventEndDate}`, { align: 'left' })
        .text(`Location: ${location}`, { align: 'left' })
        .moveDown();
    // Generate QR Code
    const qrCodeData = `Attendee: ${attendeeName}, Event: ${eventName}, Location: ${location}`;
    const qrCodeImage = yield qrcode_1.default.toBuffer(qrCodeData);
    doc
        .image(qrCodeImage, {
        fit: [100, 100],
        align: 'right',
        valign: 'bottom',
    });
    // Add footer with instructions
    doc
        .fontSize(12)
        .fillColor('#6b3eb8')
        .text('Please present this ticket at the event for entry.', {
        align: 'center',
        continued: true,
    })
        .moveDown();
    doc.end();
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', (err) => reject(err));
    });
});
exports.generateTicketPDF = generateTicketPDF;
