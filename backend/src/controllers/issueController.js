import Issue from '../models/Issue.js';

export const createIssue = async (req, res, next) => {
  try {
    const { volume, issueNumber, year, title, isCurrent } = req.body;

    if (isCurrent) {
      await Issue.updateMany({}, { isCurrent: false });
    }

    const issue = await Issue.create({ volume, issueNumber, year, title, isCurrent: !!isCurrent });
    res.status(201).json({ success: true, issue });
  } catch (error) {
    next(error);
  }
};

export const getIssues = async (_req, res, next) => {
  try {
    const issues = await Issue.find().sort({ year: -1, volume: -1, issueNumber: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    next(error);
  }
};

export const updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.isCurrent) {
      await Issue.updateMany({}, { isCurrent: false });
    }
    const issue = await Issue.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    return res.json({ success: true, issue });
  } catch (error) {
    return next(error);
  }
};

export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    return res.json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    return next(error);
  }
};
