import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    volume: { type: Number, required: true, min: 1 },
    issueNumber: { type: Number, required: true, min: 1 },
    year: { type: Number, required: true, min: 1900 },
    title: { type: String, trim: true, maxlength: 200 },
    isCurrent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

issueSchema.index({ volume: 1, issueNumber: 1, year: 1 }, { unique: true });

export default mongoose.model('Issue', issueSchema);
