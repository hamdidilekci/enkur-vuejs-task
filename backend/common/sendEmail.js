import nodemailer from "nodemailer";
import { mail } from "../config/default.js";

// Define your email sending configuration
const transporter = nodemailer.createTransport({
    service: mail.EMAIL_SERVICE,
    host: mail.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: mail.EMAIL_USERNAME,
        pass: mail.EMAIL_PASSWORD,
    },
});

// Function to send an email containing the OTP code
export const sendEmail = async (to, subject, text) => {
    try {
        // Send email
        await transporter.sendMail({
            from: mail.FROM_EMAIL,
            to,
            subject,
            text,
        });

        console.log("Email sent successfully");
    } catch (error) {
        throw new Error("Failed to send email");
    }
};
