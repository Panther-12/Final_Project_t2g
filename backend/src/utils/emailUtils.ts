import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv'
dotenv.config()

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your SMTP server details here
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    type: 'login', // 'oauth2' or 'login
    user: process.env.NODEMAILER_USER as string,
    pass: process.env.NODEMAILER_PASS as string,
  },
});

// Function to send password reset email
export const sendPasswordResetEmail = async (recipientEmail: string, resetCode: string) => {
  try {
    // Render email template with EJS
    const emailTemplate = path.join(__dirname, '../emails/resetPassword.ejs');
    const renderedHtml = await ejs.renderFile(emailTemplate, { userName: recipientEmail, resetCode });

    // Send email
    const mailOptions = {
      from: process.env.NODEMAILER_USER as string,
      to: recipientEmail,
      subject: 'Password Reset Request for Agenda',
      html: renderedHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendRegistrationConfirmationEmail = async (recipientEmail: string, userName: string) => {
    try {
      const emailTemplate = path.join(__dirname, '../emails/registrationConfirmation.ejs');
      const renderedHtml = await ejs.renderFile(emailTemplate, { userName });
  
      const mailOptions = {
        from: process.env.NODEMAILER_USER as string,
        to: recipientEmail,
        subject: 'Welcome to Agenda - Registration Confirmation',
        html: renderedHtml,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Registration confirmation email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending registration confirmation email:', error);
      throw new Error('Failed to send registration confirmation email');
    }
  };
  
  export const sendEventCreationConfirmationEmail = async (organizerEmail: string, eventName: string, eventStartDate: string, eventEndDate: string, location: string) => {
    const emailTemplate = path.join(__dirname, '../emails/eventCreationConfirmation.ejs');
    const renderedHtml = await ejs.renderFile(emailTemplate, { eventName, eventStartDate, eventEndDate, location });

    const mailOptions = {
      from: process.env.NODEMAILER_USER as string,
      to: organizerEmail,
      subject: 'Event Creation Confirmation',
      html: renderedHtml,
    };

    await transporter.sendMail(mailOptions);
  };
  
  export const sendEventRegistrationConfirmationEmail = async (attendeeName: string, attendeeEmail: string, eventName: string, eventStartDate: string, eventEndDate: string, location: string) => {
    const emailTemplate = path.join(__dirname, '../emails/eventRegistrationConfirmation.ejs');
    const renderedHtml = await ejs.renderFile(emailTemplate, { attendeeName, attendeeEmail, eventName, eventStartDate, eventEndDate, location });

    const mailOptions = {
      from: process.env.NODEMAILER_USER as string,
      to: attendeeEmail,
      subject: 'Event Registration Confirmation',
      html: renderedHtml,
    };

    await transporter.sendMail(mailOptions);
  };
  
  export const sendEventCancellationNotificationEmail = async (attendeeName: string, attendeeEmail: string, eventName: string, eventStartDate: string) => {
    const emailTemplate = path.join(__dirname, '../emails/eventCancellationNotification.ejs');
    const renderedHtml = await ejs.renderFile(emailTemplate, { attendeeName, eventName, eventStartDate});

    const mailOptions = {
      from: process.env.NODEMAILER_USER as string,
      to: attendeeEmail,
      subject: 'Event Cancellation Confirmation',
      html: renderedHtml,
    };

    await transporter.sendMail(mailOptions);
  };