import mongoose from 'mongoose';

const editorialMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: {
      type: String,
      enum: ['Editor-in-Chief', 'Associate Editor', 'Reviewer'],
      required: true
    },
    affiliation: { type: String, required: true, trim: true, maxlength: 200 },
    bio: { type: String, trim: true, maxlength: 1000 },
    photoUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

editorialMemberSchema.index({ role: 1, order: 1 });

export default mongoose.model('EditorialMember', editorialMemberSchema);
