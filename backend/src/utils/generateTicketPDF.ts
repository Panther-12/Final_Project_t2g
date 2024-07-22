import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const generateTicketPDF = async (
  attendeeName: string,
  eventName: string,
  eventStartDate: string,
  eventEndDate: string,
  location: string
): Promise<string> => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filePath = path.join(__dirname, `../tickets/${attendeeName.replace(/ /g, '_')}_ticket.pdf`);

  // Ensure the directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const writeStream = fs.createWriteStream(filePath);
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
  const qrCodeImage = await QRCode.toBuffer(qrCodeData);

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
};
