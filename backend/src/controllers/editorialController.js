import EditorialMember from '../models/EditorialMember.js';

export const createEditorialMember = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.photoUrl = req.file.path;
    }
    const member = await EditorialMember.create(payload);
    res.status(201).json({ success: true, member });
  } catch (error) {
    next(error);
  }
};

export const getEditorialMembers = async (_req, res, next) => {
  try {
    const members = await EditorialMember.find().sort({ role: 1, order: 1, createdAt: 1 });
    res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
};

export const updateEditorialMember = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.photoUrl = req.file.path;
    }
    const member = await EditorialMember.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    return res.json({ success: true, member });
  } catch (error) {
    return next(error);
  }
};

export const deleteEditorialMember = async (req, res, next) => {
  try {
    const member = await EditorialMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    return res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    return next(error);
  }
};
