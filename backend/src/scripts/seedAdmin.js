import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME || 'IJTSE Admin';
    const forceReset = process.argv.includes('--reset') || process.env.SEED_ADMIN_FORCE_RESET === 'true';

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      if (!forceReset) {
        console.log('Admin already exists. Use --reset to overwrite credentials.');
        process.exit(0);
      }

      existing.name = name;
      existing.email = normalizedEmail;
      existing.password = password;
      existing.failedLoginAttempts = 0;
      existing.lockUntil = null;
      existing.refreshTokenHash = null;
      existing.refreshTokenExpiresAt = null;
      existing.csrfTokenHash = null;
      existing.csrfTokenExpiresAt = null;
      await existing.save();

      console.log('Admin credentials reset successfully.');
      process.exit(0);
    }

    await Admin.create({ name, email: normalizedEmail, password });
    console.log('Admin seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
