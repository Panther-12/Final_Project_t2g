import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

export const nodemailerConfig = {
  transport: nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER as string,
            pass: process.env.NODEMAILER_PASS as string
        }
    }),
}