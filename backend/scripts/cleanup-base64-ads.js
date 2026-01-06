/**
 * Cleanup script for ads with base64 data-URLs in content.url
 * 
 * This script connects to the database and finds ads that have inline
 * base64 data-URLs stored in their content. It will list them so you
 * can decide what to do (delete them or re-upload images).
 * 
 * Usage: node scripts/cleanup-base64-ads.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : false,
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  
  try {
    // Find ads with base64 data-URLs or very large content.url
    const result = await client.query(`
      SELECT id, name, slot, status,
             LENGTH(content->>'url') AS url_length,
             content->>'url' LIKE 'data:%' AS is_data_url
      FROM ads
      WHERE content->>'url' LIKE 'data:%'
         OR LENGTH(content->>'url') > 10000
      ORDER BY LENGTH(content->>'url') DESC
    `);

    if (result.rows.length === 0) {
      console.log('✅ No ads with base64 data-URLs found. Database is clean!');
      return;
    }

    console.log(`\n⚠️  Found ${result.rows.length} ads with base64/oversized content:\n`);
    console.log('ID\t| Name\t\t\t\t| Slot\t\t\t| Status\t| URL Size');
    console.log('-'.repeat(100));
    
    result.rows.forEach(row => {
      const sizeKB = (row.url_length / 1024).toFixed(1);
      console.log(`${row.id}\t| ${row.name?.slice(0, 20).padEnd(20)}\t| ${row.slot?.slice(0, 20).padEnd(20)}\t| ${row.status}\t| ${sizeKB} KB`);
    });

    console.log('\n📋 Options:');
    console.log('1. Delete these ads and recreate them using the admin UI (recommended)');
    console.log('2. Run with --delete flag to delete all affected ads');
    console.log('');

    // If --delete flag is passed, delete the ads
    if (process.argv.includes('--delete')) {
      const ids = result.rows.map(r => r.id);
      console.log(`\n🗑️  Deleting ${ids.length} ads...`);
      await client.query('DELETE FROM ads WHERE id = ANY($1::int[])', [ids]);
      console.log('✅ Deleted successfully!');
    }

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
