import SiteSettings from '../models/SiteSettings.js';

/* ── GET /api/settings  (public) ────────────────────────────── */
export const getSettings = async (_req, res, next) => {
  try {
    // findOneAndUpdate with upsert guarantees a doc always exists
    const settings = await SiteSettings.findOneAndUpdate(
      { _singleton: 'global' },
      { $setOnInsert: { _singleton: 'global' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/settings  (admin protected) ───────────────────── */
export const updateSettings = async (req, res, next) => {
  try {
    // Strip fields that must not be updated by this route
    const { _singleton, _id, createdAt, updatedAt, __v, ...payload } = req.body;

    const settings = await SiteSettings.findOneAndUpdate(
      { _singleton: 'global' },
      { $set: payload },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};
