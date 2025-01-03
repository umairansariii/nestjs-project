import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { SMTP_NAME } from 'src/constants/mail.constant';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendSignupEmail(email: string, firstName: string) {
    const mailOptions = {
      from: SMTP_NAME,
      to: email,
      subject: `Welcome to ${SMTP_NAME}`,
      html: `<p>Hi ${firstName},</p><p>Thank you for signing up on our platform.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: SMTP_NAME,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
