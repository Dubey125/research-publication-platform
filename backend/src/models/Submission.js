import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    affiliation: { type: String, required: true, trim: true, maxlength: 200 },
    paperTitle: { type: String, required: true, trim: true, maxlength: 300 },
    abstract: { type: String, required: true, maxlength: 5000 },
    keywords: [{ type: String, trim: true }],
    manuscriptUrl: { type: String, required: true },
    declarationAccepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: { type: String, trim: true, maxlength: 2000, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

submissionSchema.index({ createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
