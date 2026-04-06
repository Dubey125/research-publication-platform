import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const canSendEmail = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  return Boolean(
    user && 
    pass && 
    user !== 'your_email@gmail.com' && 
    pass !== 'your_gmail_app_password'
  );
};

const getTransport = () => {
  const service = process.env.EMAIL_SERVICE?.trim();
  const host = process.env.EMAIL_HOST?.trim();
  const port = parseNumber(process.env.EMAIL_PORT, 587);
  const secure = parseBoolean(process.env.EMAIL_SECURE, port === 465);
  const rejectUnauthorized = parseBoolean(process.env.EMAIL_TLS_REJECT_UNAUTHORIZED, true);

  const transportOptions = {
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim()
    },
    connectionTimeout: parseNumber(process.env.EMAIL_CONNECTION_TIMEOUT_MS, 10000),
    greetingTimeout: parseNumber(process.env.EMAIL_GREETING_TIMEOUT_MS, 10000),
    socketTimeout: parseNumber(process.env.EMAIL_SOCKET_TIMEOUT_MS, 15000)
  };

  if (host) {
    transportOptions.host = host;
    transportOptions.port = port;
    transportOptions.secure = secure;
    transportOptions.tls = { rejectUnauthorized };
  } else {
    transportOptions.service = service || 'gmail';
  }

  return nodemailer.createTransport(transportOptions);
};

export const verifyMailTransport = async () => {
  if (!canSendEmail()) {
    console.warn('[Mail] Transport verification skipped. EMAIL_USER or EMAIL_PASS is missing.');
    return false;
  }

  try {
    const transporter = getTransport();
    await transporter.verify();
    console.log('[Mail] SMTP transport verified successfully.');
    return true;
  } catch (error) {
    console.error('[Mail] SMTP verification failed:', {
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response
    });
    return false;
  }
};

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
    console.error(`[Mail] Error sending email to ${to}:`, {
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      response: error?.response
    });
    // Don't throw error to avoid breaking the user flow
  }
};

// Keep backwards compatibility
export const sendMail = async ({ to, subject, text, html }) => {
  return sendEmail(to, subject, html || `<p>${text}</p>`);
};
