import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ijtse'; // Assuming default local MongoDB

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const db = mongoose.connection.db;

    // Check SiteSettings
    const settings = await db.collection('sitesettings').findOne({ _singleton: 'global'});
    console.log('SiteSettings:', settings);

    // Check Content
    const content = await db.collection('contents').find({}).toArray();
    console.log('Content Items:');
    content.forEach(c => console.log(` - ${c.type}: ${c.title}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
