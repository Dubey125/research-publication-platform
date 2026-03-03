import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    authors: [{ type: String, trim: true, required: true }],
    abstract: { type: String, required: true, maxlength: 5000 },
    keywords: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: [
        'Engineering & Technology',
        'Computer Science & Artificial Intelligence',
        'Management & Commerce',
        'Applied Sciences',
        'Social Sciences & Humanities',
        'Environmental & Sustainability Studies',
        'Interdisciplinary Innovations'
      ],
      required: true
    },
    pdfUrl: { type: String, required: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

paperSchema.index({ title: 'text', abstract: 'text', keywords: 'text', authors: 'text' });

export default mongoose.model('Paper', paperSchema);
