import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'mikayla.frami98@ethereal.email',
        pass: 'pTgNdhBnm5MaUHfzcq'
      }
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const mailOptions = {
      from: '"Fred Foo 👻"',
      to: email,
      subject: "Password reset",
      html: `<a href="http://localhost:3000/reset-password?token=${token}">Reset password</a>`
    }

    await this._transporter.sendMail(mailOptions);
  }
}