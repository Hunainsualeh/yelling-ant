const { Pool } = require('./backend/node_modules/pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iedTHw89FZQg@ep-autumn-pond-adufugvh-pooler.c-2.us-east-1.aws.neon.tech/Yellingant?sslmode=require'
});

async function main() {
  try {
    // Check tables
    const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log('Existing tables:', tables.rows.map(r => r.table_name));

    // Create ads table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        slot VARCHAR(255),
        content JSONB,
        impressions INTEGER DEFAULT 0,
        ctr FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Ads table created/exists');

    // Verify
    const check = await pool.query(`SELECT COUNT(*) FROM ads`);
    console.log('Ads count:', check.rows[0].count);

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();
