import Paper from '../models/Paper.js';
import Issue from '../models/Issue.js';
import Submission from '../models/Submission.js';

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [totalPapers, totalIssues, totalSubmissions, pendingSubmissions, underReviewSubmissions, approvedSubmissions, rejectedSubmissions] = await Promise.all([
      Paper.countDocuments(),
      Issue.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'Pending' }),
      Submission.countDocuments({ status: 'Under Review' }),
      Submission.countDocuments({ status: 'Approved' }),
      Submission.countDocuments({ status: 'Rejected' })
    ]);

    return res.json({
      success: true,
      stats: {
        totalPapers,
        totalIssues,
        totalSubmissions,
        pendingSubmissions,
        underReviewSubmissions,
        approvedSubmissions,
        rejectedSubmissions
      }
    });
  } catch (error) {
    return next(error);
  }
};

