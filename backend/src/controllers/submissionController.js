import Submission from '../models/Submission.js';
import sendEmail from '../utils/sendEmail.js';

const parseKeywords = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

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

    await sendEmail({
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `New manuscript submission: ${submission.paperTitle}`,
      text: `A new submission has been received from ${submission.authorName} (${submission.email}).`
    });

    return res.status(201).json({ success: true, submission, message: 'Submission received successfully' });
  } catch (error) {
    return next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};
    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    return res.json({ success: true, submissions });
  } catch (error) {
    return next(error);
  }
};

export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['Approved', 'Rejected', 'Pending', 'Under Review'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const update = { status, reviewedBy: req.admin._id };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
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
