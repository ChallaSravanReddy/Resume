import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("YOUR_")) {
  console.error("❌ Please add your actual Supabase URL and Key to .env.local first.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadJson(filename) {
  const filePath = path.join(__dirname, '../data', filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function seed() {
  console.log("🚀 Starting data migration to Supabase...");

  // Profile data is a single object
  try {
    const profile = await loadJson('profile.json');
    // We add an id so the row can be referenced/updated easily later
    profile.id = '00000000-0000-0000-0000-000000000000';
    await supabase.from('profile').delete().neq('id', '1'); // Clear existing loosely
    const { error: profileErr } = await supabase.from('profile').insert(profile);
    if (profileErr) console.error("❌ Error migrating profile:", profileErr);
    else console.log("✅ Profile migrated successfully.");
  } catch(e) {
     console.error("❌ Error reading profile:", e);
  }

  // Other collections are arrays of objects
  const collections = ['projects', 'skills', 'experience', 'blogs', 'certifications', 'achievements'];

  for (const collection of collections) {
    try {
      const data = await loadJson(`${collection}.json`);
      if (data && data.length > 0) {
        // Clear existing data in table
        const { error: delErr } = await supabase.from(collection).delete().neq('id', '0');
        if (delErr) {
          console.error(`❌ Error clearing existing ${collection}:`, delErr);
          continue;
        }
        
        // Insert new data
        const { error: insErr } = await supabase.from(collection).insert(data);
        if (insErr) console.error(`❌ Error inserting ${collection}:`, insErr);
        else console.log(`✅ ${collection} migrated successfully (${data.length} records).`);
      } else {
        console.log(`⚠️ No data found to migrate for ${collection}.`);
      }
    } catch(e) {
      console.error(`❌ Error migrating ${collection}:`, e);
    }
  }

  console.log("🎉 Database migration complete!");
}

seed();
