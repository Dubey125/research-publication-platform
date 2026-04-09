import Submission from '../models/Submission.js';
import { sendEmail } from '../services/mailService.js';
import { verifyRecaptchaToken } from '../services/recaptchaService.js';

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
      return res.status(400).json({ success: false, message: 'Manuscript file is required' });
    }

    const recaptchaToken = String(req.body.recaptchaToken || '').trim();
    const recaptchaResult = await verifyRecaptchaToken({
      token: recaptchaToken,
      remoteIp: req.ip
    });

    const expectedHostname = (process.env.RECAPTCHA_EXPECTED_HOSTNAME || '').trim();

    if (!recaptchaResult.success) {
      return res.status(400).json({ success: false, message: 'Robot verification failed. Please try again.' });
    }

    if (expectedHostname && recaptchaResult.hostname && recaptchaResult.hostname !== expectedHostname) {
      return res.status(400).json({ success: false, message: 'Robot verification failed for this domain.' });
    }

    const keywords = parseKeywords(req.body.keywords);
    if (!keywords.length) {
      return res.status(400).json({ success: false, message: 'At least one keyword is required' });
    }

    const lastSub = await Submission.findOne().sort({ createdAt: -1 });
    let idNum = 1;
    if (lastSub && lastSub.trackingId) {
      const match = lastSub.trackingId.match(/\d+/);
      if (match) idNum = parseInt(match[0], 10) + 1;
    }
    const trackingId = `ID${idNum}`;

    const submission = await Submission.create({
      trackingId,
      authorName: req.body.authorName,
      email: req.body.email,
      affiliation: req.body.affiliation,
      paperTitle: req.body.paperTitle,
      abstract: req.body.abstract,
      keywords,
      manuscriptUrl: `/uploads/${req.file.filename}`,
      declarationAccepted: req.body.declarationAccepted === true || req.body.declarationAccepted === 'true'
    });

    // 1. Send email to ADMIN (fire and forget)
    const adminSubject = "New Paper Submission Received";
    const adminMessage = `
      <p>A new paper has been submitted to the journal.</p>
      <p><strong>Tracking ID:</strong> ${trackingId}</p>
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
      <div style="background-color: #f8f9fa; padding: 10px 15px; border-left: 4px solid #4f46e5; margin-top: 20px;">
        <p style="margin: 0;"><strong>Your Submission Tracking ID is: ${trackingId}</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Please use this ID in any future correspondence regarding this submission.</p>
      </div>
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

    const idStr = submission.trackingId ? ` (ID: ${submission.trackingId})` : '';
    const adminNotesHtml = adminNotes 
      ? `<div style="background-color: #fdf2f8; padding: 15px; border-left: 4px solid #db2777; margin-top: 20px; font-size: 14px;"><strong>Message from the Editorial Board:</strong><br/><br/>${adminNotes.replace(/\n/g, '<br/>')}</div>` 
      : '';

    const statusMessages = {
      'Under Review': {
        subject: 'Your Paper is Under Review',
        title: 'Your Paper is Under Review',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>Your paper titled "${submission.paperTitle}"${idStr} is currently under peer review.</p>
          ${adminNotesHtml}
        `
      },
      Accepted: {
        subject: 'Congratulations! Paper Accepted',
        title: 'Congratulations! Paper Accepted',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>We are delighted to inform you that your paper "${submission.paperTitle}"${idStr} has been accepted for publication.</p>
          ${adminNotesHtml}
        `
      },
      Rejected: {
        subject: 'Paper Submission Update',
        title: 'Paper Submission Update',
        htmlMessage: `
          <p>Dear ${submission.authorName},</p>
          <p>Thank you for submitting your work to us. We regret to inform you that, following editorial review, your paper "${submission.paperTitle}"${idStr} was not accepted for publication.</p>
          ${adminNotesHtml}
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
