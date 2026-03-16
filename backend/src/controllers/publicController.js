import Issue from '../models/Issue.js';
import Paper from '../models/Paper.js';

export const getHomeData = async (_req, res, next) => {
  try {
    const latestPapers = await Paper.find()
      .populate('issue')
      .sort({ publishedAt: -1 })
      .limit(6);

    const currentIssue = await Issue.findOne({ isCurrent: true }).sort({ year: -1, volume: -1, issueNumber: -1 });

    return res.json({ success: true, latestPapers, currentIssue });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentIssueWithPapers = async (_req, res, next) => {
  try {
    const issue = await Issue.findOne({ isCurrent: true }).sort({ year: -1, volume: -1, issueNumber: -1 });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Current issue not found' });
    }

    const papers = await Paper.find({ issue: issue._id }).sort({ publishedAt: -1 });
    return res.json({ success: true, issue, papers });
  } catch (error) {
    return next(error);
  }
};

export const getArchiveData = async (req, res, next) => {
  try {
    const { year, volume, issueNumber, page = 1, limit = 12, search = '' } = req.query;
    const issueQuery = {};
    const hasIssueFilters = Boolean(year || volume || issueNumber);
    if (year) issueQuery.year = Number(year);
    if (volume) issueQuery.volume = Number(volume);
    if (issueNumber) issueQuery.issueNumber = Number(issueNumber);

    const matchedIssues = await Issue.find(issueQuery).select('_id');
    const issueIds = matchedIssues.map((item) => item._id);

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);

    if (hasIssueFilters && !issueIds.length) {
      const filterMeta = await Issue.aggregate([
        {
          $group: {
            _id: null,
            years: { $addToSet: '$year' },
            volumes: { $addToSet: '$volume' },
            issueNumbers: { $addToSet: '$issueNumber' }
          }
        }
      ]);

      const options = filterMeta[0] || { years: [], volumes: [], issueNumbers: [] };
      return res.json({
        success: true,
        papers: [],
        filters: {
          years: options.years.sort((a, b) => b - a),
          volumes: options.volumes.sort((a, b) => b - a),
          issueNumbers: options.issueNumbers.sort((a, b) => b - a)
        },
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: 0,
          totalPages: 0
        }
      });
    }

    const paperQuery = {};
    if (issueIds.length) paperQuery.issue = { $in: issueIds };
    if (search) paperQuery.$text = { $search: search };

    const [papers, total, filterMeta] = await Promise.all([
      Paper.find(paperQuery)
        .populate('issue')
        .sort({ publishedAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Paper.countDocuments(paperQuery),
      Issue.aggregate([
        {
          $group: {
            _id: null,
            years: { $addToSet: '$year' },
            volumes: { $addToSet: '$volume' },
            issueNumbers: { $addToSet: '$issueNumber' }
          }
        }
      ])
    ]);

    const options = filterMeta[0] || { years: [], volumes: [], issueNumbers: [] };
    return res.json({
      success: true,
      papers,
      filters: {
        years: options.years.sort((a, b) => b - a),
        volumes: options.volumes.sort((a, b) => b - a),
        issueNumbers: options.issueNumbers.sort((a, b) => b - a)
      },
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    return next(error);
  }
};
