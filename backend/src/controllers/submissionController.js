import Submission from '../models/Submission.js';
import { sendEmail } from '../services/mailService.js';

const parseKeywords = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

// HTML Templates for Emails
const getEmailTemplate = (title, message) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">${title}</h2>
    <div style="font-size: 16px; color: #333; line-height: 1.6;">
      ${message}
    </div>
    <div style="margin-top: 30px; font-size: 14px; color: #7f8c8d; border-top: 1px solid #e0e0e0; padding-top: 10px;">
      <p>Best regards,<br><strong>Editorial Team</strong><br>International Journal of Transdisciplinary Science and Engineering</p>
    </div>
  </div>
`;

export const createSubmission = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF manuscript is required' });
    }

    const submission = await Submission.create({
      authorName: req.body.authorName,
      email: req.body.email,
      affiliation: req.body.affiliation,
      paperTitle: req.body.paperTitle,
      abstract: req.body.abstract,
      keywords: parseKeywords(req.body.keywords),
      manuscriptUrl: `/uploads/${req.file.filename}`,
      declarationAccepted: req.body.declarationAccepted === true || req.body.declarationAccepted === 'true'
    });

    // 1. Send email to ADMIN (fire and forget)
    const adminSubject = "New Paper Submission Received";
    const adminMessage = `
      <p>A new paper has been submitted to the journal.</p>
      <p><strong>Paper Title:</strong> ${submission.paperTitle}</p>
      <p><strong>Author Name:</strong> ${submission.authorName}</p>
      <p><strong>Author Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
      <p>Please log in to the admin panel to review the submission.</p>
    `;
    // We intentionally do not await here so the frontend gets an immediate response
    sendEmail(process.env.ADMIN_NOTIFY_EMAIL, adminSubject, getEmailTemplate(adminSubject, adminMessage))
      .catch(e => console.error("Admin Email Background Error:", e));

    // 2. Send email to AUTHOR (fire and forget)
    const authorSubject = "Paper Submission Received - International Journal of Transdisciplinary Science and Engineering";
    const authorMessage = `
      <p>Dear ${submission.authorName},</p>
      <p>Thank you for submitting your manuscript to the International Journal of Transdisciplinary Science and Engineering.</p>
      <p><strong>Paper Title:</strong> ${submission.paperTitle}</p>
      <p>Your paper is currently under initial review. We will notify you once the status changes or if we require any further information.</p>
    `;
    sendEmail(submission.email, authorSubject, getEmailTemplate("Submission Received", authorMessage))
      .catch(e => console.error("Author Email Background Error:", e));

    return res.status(201).json({ success: true, submission, message: 'Submission received successfully' });
  } catch (error) {
    return next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const status = req.query.status;
    const query = status
      ? status === 'Accepted'
        ? { status: { $in: ['Accepted', 'Approved'] } }
        : { status }
      : {};
    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    const normalized = submissions.map((item) => ({
      ...item.toObject(),
      status: item.status === 'Approved' ? 'Accepted' : item.status
    }));

    return res.json({ success: true, submissions: normalized });
  } catch (error) {
    return next(error);
  }
};

export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const normalizedStatus = status === 'Approved' ? 'Accepted' : status;

    if (!['Accepted', 'Rejected', 'Pending', 'Under Review'].includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const update = { status: normalizedStatus, reviewedBy: req.admin._id };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const statusMessages = {
      'Under Review': {
        subject: 'Your Paper is Under Review',
        title: 'Your Paper is Under Review',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>Your paper titled "${submission.paperTitle}" is currently under review.</p>
        `
      },
      Accepted: {
        subject: 'Congratulations! Paper Accepted',
        title: 'Congratulations! Paper Accepted',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>Your paper "${submission.paperTitle}" has been accepted for publication.</p>
        `
      },
      Rejected: {
        subject: 'Paper Submission Update',
        title: 'Paper Submission Update',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>We regret to inform you that your paper "${submission.paperTitle}" was not accepted.</p>
        `
      }
    };

    if (statusMessages[normalizedStatus]) {
      const { subject, title, htmlMessage } = statusMessages[normalizedStatus];
      sendEmail(submission.email, subject, getEmailTemplate(title, htmlMessage));
    }

    return res.json({ success: true, submission });
  } catch (error) {
    return next(error);
  }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    return res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    return next(error);
  }
};
