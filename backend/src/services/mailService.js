import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const canSendEmail = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return Boolean(
    user && 
    pass && 
    user !== 'your_email@gmail.com' && 
    pass !== 'your_gmail_app_password'
  );
};

const getTransport = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

export const sendEmail = async (to, subject, htmlContent) => {
  if (!canSendEmail()) {
    console.warn(`[Mail] Not sent to ${to}. Email credentials missing in .env.`);
    return;
  }

  const transporter = getTransport();

  try {
    await transporter.sendMail({
      from: `"IJTSE Journal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });
    console.log(`[Mail] Email successfully sent to ${to}`);
  } catch (error) {
    console.error(`[Mail] Error sending email to ${to}:`, error.message);
    // Don't throw error to avoid breaking the user flow
  }
};

// Keep backwards compatibility
export const sendMail = async ({ to, subject, text, html }) => {
  return sendEmail(to, subject, html || `<p>${text}</p>`);
};
