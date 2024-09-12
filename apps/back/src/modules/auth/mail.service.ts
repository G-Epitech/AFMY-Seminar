import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const mailOptions = {
      from: '"Fred Foo 👻"',
      to: email,
      subject: "Password reset",
      html: `<a href="http://localhost:3000/auth/reset-password?token=${token}">Reset password</a>`
    }

    await this._transporter.sendMail(mailOptions);
  }
}