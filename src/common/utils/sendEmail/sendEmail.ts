import * as nodemailer from "nodemailer";
import { EventEmitter } from "node:events";
import { EmailType } from "./email.enums";

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

interface TransporterConfig {
    host: string;
    service: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
    const config: TransporterConfig = {
        host: "smtp.ethereal.email",
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL as string,
            pass: process.env.PASSWORD as string,
        },
    };
    const transporter = nodemailer.createTransport(config);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export const emailEvent = new EventEmitter();

emailEvent.on('confirmEmail', (options: EmailOptions) => {
    void sendEmail({ ...options, subject: options.subject || EmailType.CONFIRM_EMAIL });
});

emailEvent.on('resetPassword', (options: EmailOptions) => {
    void sendEmail({ ...options, subject: options.subject || EmailType.RESET_PASSWORD });
});
