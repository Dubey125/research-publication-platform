import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import SiteContent from '../models/SiteContent.js';
import { defaultContentByType } from '../controllers/contentController.js';

dotenv.config();

const parseTypesArg = () => {
  const arg = process.argv.find((item) => item.startsWith('--types='));
  if (!arg) return [];
  return arg
    .replace('--types=', '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const isDryRun = process.argv.includes('--dry-run');
const overwriteAll = process.argv.includes('--all');

const main = async () => {
  try {
    await connectDB();

    const allDefaultTypes = Object.keys(defaultContentByType);
    const selectedTypes = parseTypesArg();
    const targetTypes = selectedTypes.length ? selectedTypes : allDefaultTypes;

    const invalidTypes = targetTypes.filter((type) => !defaultContentByType[type]);
    if (invalidTypes.length) {
      throw new Error(`Invalid type(s): ${invalidTypes.join(', ')}`);
    }

    console.log(`[sync-default-content] Mode: ${isDryRun ? 'dry-run' : 'write'}`);
    console.log(`[sync-default-content] Strategy: ${overwriteAll ? 'overwrite existing' : 'fill missing only'}`);
    console.log(`[sync-default-content] Types: ${targetTypes.join(', ')}`);

    const report = [];

    for (const type of targetTypes) {
      const fallback = defaultContentByType[type];
      const existing = await SiteContent.findOne({ type });

      if (!existing) {
        report.push({ type, action: 'create' });
        if (!isDryRun) {
          await SiteContent.create({ type, title: fallback.title, body: fallback.body });
        }
        continue;
      }

      if (!overwriteAll) {
        report.push({ type, action: 'skip-existing' });
        continue;
      }

      report.push({ type, action: 'update' });
      if (!isDryRun) {
        existing.title = fallback.title;
        existing.body = fallback.body;
        await existing.save();
      }
    }

    console.log('[sync-default-content] Summary:');
    for (const row of report) {
      console.log(`- ${row.type}: ${row.action}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[sync-default-content] Failed:', error.message);
    process.exit(1);
  }
};

main();
