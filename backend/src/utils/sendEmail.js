import { sendMail } from '../services/mailService.js';

const sendEmail = async ({ to, subject, text, html }) =>
  sendMail({ to, subject, text, html });

export default sendEmail;
