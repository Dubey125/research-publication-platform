import { sendMail } from '../services/mailService.js';

export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    await sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `International Journal of Transdisciplinary Science and Engineering Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return next(error);
  }
};
