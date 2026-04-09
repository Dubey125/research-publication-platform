import ReviewerApplication from '../models/ReviewerApplication.js';
import { sendMail } from '../services/mailService.js';

const parseExpertiseAreas = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const createReviewerApplication = async (req, res, next) => {
  try {
    const expertiseAreas = parseExpertiseAreas(req.body.expertiseAreas);
    if (!expertiseAreas.length) {
      return res.status(400).json({ success: false, message: 'At least one expertise area is required' });
    }

    const application = await ReviewerApplication.create({
      fullName: req.body.fullName,
      email: req.body.email,
      affiliation: req.body.affiliation,
      designation: req.body.designation,
      expertiseAreas,
      experienceSummary: req.body.experienceSummary,
      motivation: req.body.motivation,
      declarationAccepted: req.body.declarationAccepted === true || req.body.declarationAccepted === 'true'
    });

    sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: 'New Reviewer Application Received',
      text: `Name: ${application.fullName}\nEmail: ${application.email}\nAffiliation: ${application.affiliation}\nDesignation: ${application.designation}\nExpertise: ${application.expertiseAreas.join(', ')}\n\nPlease review in admin panel.`
    }).catch(() => {});

    return res.status(201).json({ success: true, message: 'Reviewer application submitted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const getReviewerApplications = async (_req, res, next) => {
  try {
    const applications = await ReviewerApplication.find()
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    return res.json({ success: true, applications });
  } catch (error) {
    return next(error);
  }
};

export const updateReviewerApplicationStatus = async (req, res, next) => {
  try {
    const update = {
      status: req.body.status,
      reviewedBy: req.admin._id
    };
    if (req.body.adminNotes !== undefined) update.adminNotes = req.body.adminNotes;

    const application = await ReviewerApplication.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Reviewer application not found' });
    }

    return res.json({ success: true, application });
  } catch (error) {
    return next(error);
  }
};

export const deleteReviewerApplication = async (req, res, next) => {
  try {
    const application = await ReviewerApplication.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Reviewer application not found' });
    }

    return res.json({ success: true, message: 'Reviewer application deleted' });
  } catch (error) {
    return next(error);
  }
};
