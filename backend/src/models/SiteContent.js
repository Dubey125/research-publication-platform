import mongoose from 'mongoose';

const CONTENT_TYPES = [
  'policies',
  'copyright-form',
  'licensing',
  'publication-ethics',
  'author-guidelines',
  'peer-review-policy'
];

const siteContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: CONTENT_TYPES,
      trim: true
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 50000 }
  },
  { timestamps: true }
);

export { CONTENT_TYPES };
export default mongoose.model('SiteContent', siteContentSchema);
