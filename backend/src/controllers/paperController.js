import Paper from '../models/Paper.js';

const parseCsvField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const createPaper = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const { title, abstract, category, issue } = req.body;
    const authors = parseCsvField(req.body.authors);
    const keywords = parseCsvField(req.body.keywords);

    const paper = await Paper.create({
      title,
      abstract,
      category,
      issue,
      authors,
      keywords,
      pdfUrl: `/uploads/${req.file.filename}`
    });

    const populated = await paper.populate('issue');
    return res.status(201).json({ success: true, paper: populated });
  } catch (error) {
    return next(error);
  }
};

export const getPapers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.issue) query.issue = req.query.issue;
    if (req.query.year) query.year = Number(req.query.year);

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const [papers, total] = await Promise.all([
      Paper.find(query)
        .populate('issue')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Paper.countDocuments(query)
    ]);

    return res.json({
      success: true,
      papers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getPaperById = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('issue');
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    return res.json({ success: true, paper });
  } catch (error) {
    return next(error);
  }
};

export const updatePaper = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.authors) payload.authors = parseCsvField(payload.authors);
    if (payload.keywords) payload.keywords = parseCsvField(payload.keywords);
    if (req.file) payload.pdfUrl = `/uploads/${req.file.filename}`;

    const paper = await Paper.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    }).populate('issue');

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    return res.json({ success: true, paper });
  } catch (error) {
    return next(error);
  }
};

export const deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    return res.json({ success: true, message: 'Paper deleted' });
  } catch (error) {
    return next(error);
  }
};
