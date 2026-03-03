import sendEmail from '../utils/sendEmail.js';

export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    await sendEmail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `IJAIF Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return next(error);
  }
};
