import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME || 'IJAIF Admin';

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    await Admin.create({ name, email, password });
    console.log('Admin seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
