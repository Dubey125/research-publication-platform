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
      subject: 'New Reviewer Application Received - IJTSE',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; line-height: 1.6;">
          <h2 style="color: #4F46E5;">New Reviewer Application Received</h2>
          <p>A new application to join the reviewer panel has been submitted.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${application.fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${application.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Affiliation</td><td style="padding: 8px; border: 1px solid #ddd;">${application.affiliation}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Designation</td><td style="padding: 8px; border: 1px solid #ddd;">${application.designation}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Expertise Areas</td><td style="padding: 8px; border: 1px solid #ddd;">${application.expertiseAreas.join(', ')}</td></tr>
          </table>
          <p style="margin-top: 20px;">Please login to the admin panel to review the full details and approve or reject the application.</p>
        </div>
      `
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
