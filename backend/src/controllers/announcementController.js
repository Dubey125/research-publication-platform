import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, date, isActive } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      date: date || new Date(),
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json({ success: true, announcement, message: 'Announcement created' });
  } catch (error) {
    return next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ date: -1, createdAt: -1 });

    return res.json({ success: true, announcements });
  } catch (error) {
    return next(error);
  }
};

export const getAllAnnouncements = async (_req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.json({ success: true, announcements });
  } catch (error) {
    return next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, message, date, isActive } = req.body;
    const update = {};

    if (title !== undefined) update.title = title;
    if (message !== undefined) update.message = message;
    if (date !== undefined) update.date = date;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.json({ success: true, announcement, message: 'Announcement updated' });
  } catch (error) {
    return next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    return next(error);
  }
};
