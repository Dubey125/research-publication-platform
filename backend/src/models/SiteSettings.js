import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    /*  There will always be exactly ONE document (singleton).
        We use a constant key to enforce that. */
    _singleton: { type: String, default: 'global', immutable: true },

    /* ── About ─────────────────────────────────────────────────── */
    aboutTitle:   { type: String, trim: true, maxlength: 200, default: 'About International Journal of Transdisciplinary Science and Engineering' },
    aboutText:    { type: String, trim: true, maxlength: 5000, default: '' },
    missionText:  { type: String, trim: true, maxlength: 2000, default: '' },
    visionText:   { type: String, trim: true, maxlength: 2000, default: '' },

    /* ── Contact ───────────────────────────────────────────────── */
    contactEmail:   { type: String, trim: true, maxlength: 200, default: '' },
    contactPhone:   { type: String, trim: true, maxlength: 50,  default: '' },
    contactAddress: { type: String, trim: true, maxlength: 500, default: '' },
    contactCity:    { type: String, trim: true, maxlength: 100, default: '' },
    contactCountry: { type: String, trim: true, maxlength: 100, default: '' },

    /* ── Social media ──────────────────────────────────────────── */
    socialFacebook:  { type: String, trim: true, maxlength: 300, default: '' },
    socialTwitter:   { type: String, trim: true, maxlength: 300, default: '' },
    socialLinkedIn:  { type: String, trim: true, maxlength: 300, default: '' },
    socialInstagram: { type: String, trim: true, maxlength: 300, default: '' },
    socialYouTube:   { type: String, trim: true, maxlength: 300, default: '' },
    socialResearchGate: { type: String, trim: true, maxlength: 300, default: '' },

    /* ── Extra ─────────────────────────────────────────────────── */
    journalISSN:   { type: String, trim: true, maxlength: 50,  default: '' },
    journalDOI:    { type: String, trim: true, maxlength: 100, default: '' },
    publisherName: { type: String, trim: true, maxlength: 200, default: '' },
  },
  { timestamps: true }
);

siteSettingsSchema.index({ _singleton: 1 }, { unique: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
