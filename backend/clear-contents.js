import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ijtse';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    
    // Drop sitecontents to let the backend auto-repopulate using the new defaults when accessed
    await db.collection('sitecontents').deleteMany({});
    
    console.log('✅ Dropped existing sitecontents so they will be regenerated with the new rich defaults.');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
