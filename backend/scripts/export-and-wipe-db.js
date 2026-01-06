const fs = require('fs');
const path = require('path');
// Load environment from backend/.env
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

// Safety: will refuse to run if DATABASE_URL looks like production unless WIPE_CONFIRM=YES
const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_CONNECTION || '';
if (!DATABASE_URL) {
  console.error('No DATABASE_URL found in environment. Aborting.');
  process.exit(1);
}

const lowered = DATABASE_URL.toLowerCase();
const suspicious = ['neon', 'amazonaws', 'herokuapp', '.vercel', 'brewly', 'prod', 'production'];
if (suspicious.some(s => lowered.includes(s)) && process.env.WIPE_CONFIRM !== 'YES') {
  console.error('Refusing to run against a remote/production-looking database. If you really want to proceed, set WIPE_CONFIRM=YES in environment and re-run.');
  process.exit(2);
}

const pool = new Pool({ connectionString: DATABASE_URL });

(async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), '..', 'scripts', 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  try {
    console.log('Exporting ads...');
    const adsRes = await pool.query('SELECT * FROM ads');
    const adsFile = path.join(backupDir, `ads-backup-${timestamp}.json`);
    fs.writeFileSync(adsFile, JSON.stringify(adsRes.rows, null, 2));
    console.log('Saved', adsRes.rows.length, 'ads to', adsFile);

    console.log('Exporting quizzes...');
    const quizzesRes = await pool.query('SELECT * FROM quizzes');
    const quizzesFile = path.join(backupDir, `quizzes-backup-${timestamp}.json`);
    fs.writeFileSync(quizzesFile, JSON.stringify(quizzesRes.rows, null, 2));
    console.log('Saved', quizzesRes.rows.length, 'quizzes to', quizzesFile);

    console.log('\nBackup completed. Now truncating tables...');

    await pool.query('BEGIN');
    await pool.query('TRUNCATE TABLE ads, quizzes RESTART IDENTITY CASCADE');
    await pool.query('COMMIT');

    console.log('Tables ads and quizzes truncated and sequences reset.');
    process.exit(0);
  } catch (err) {
    console.error('Error during export/wipe:', err);
    try { await pool.query('ROLLBACK'); } catch (e) { }
    process.exit(3);
  } finally {
    await pool.end();
  }
})();
