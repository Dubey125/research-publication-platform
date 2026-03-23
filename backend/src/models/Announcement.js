import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

announcementSchema.index({ isActive: 1, date: -1, createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);
