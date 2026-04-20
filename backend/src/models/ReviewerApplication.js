import mongoose from 'mongoose';

const reviewerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    contactNumber: { type: String, required: true, trim: true, maxlength: 25 },
    affiliation: { type: String, required: true, trim: true, maxlength: 200 },
    designation: { type: String, required: true, trim: true, maxlength: 150 },
    expertiseAreas: [{ type: String, trim: true, maxlength: 80 }],
    experienceSummary: { type: String, required: true, trim: true, maxlength: 4000 },
    motivation: { type: String, required: true, trim: true, maxlength: 3000 },
    photoUrl: { type: String, trim: true },
    declarationAccepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: { type: String, trim: true, maxlength: 2000, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

reviewerApplicationSchema.index({ createdAt: -1 });

export default mongoose.model('ReviewerApplication', reviewerApplicationSchema);
