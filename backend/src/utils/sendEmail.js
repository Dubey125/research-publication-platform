import nodemailer from 'nodemailer';

const hasSmtp =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasSmtp) {
    console.log('SMTP not configured. Skipping email send.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `IJAIF <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  });
};

export default sendEmail;
