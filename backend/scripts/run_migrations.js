const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment variables from backend/.env when present
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {
  // ignore
}

async function run() {
  const sqlPath = path.join(__dirname, '..', 'db', 'migrations', '001_create_missing_tables.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Migration file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Coerce env vars to safe types and avoid passing non-string password
  let host = process.env.DB_HOST || process.env.PGHOST || 'localhost';
  let port = parseInt(process.env.DB_PORT || process.env.PGPORT || '5432');
  let user = process.env.DB_USER || process.env.PGUSER || 'postgres';
  let database = process.env.DB_NAME || process.env.PGDATABASE || 'quizbuzz';
  let rawPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD;
  let password = rawPassword === undefined || rawPassword === '' ? undefined : String(rawPassword);
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

  // If DATABASE_URL is provided, prefer it
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      host = parsed.hostname || host;
      port = parsed.port ? parseInt(parsed.port) : port;
      user = parsed.username || user;
      if (parsed.password) password = parsed.password;
      database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : database;
    } catch (e) {
      // ignore parse errors and continue with individual env vars
    }
  }

  console.log('Connecting to Postgres with:', { host, port, user, database, ssl: !!ssl });

  const client = new Client({ host, port, user, password, database, ssl });

  try {
    await client.connect();
    console.log('Connected to Postgres');

    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('Migration applied successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    try {
      await client.query('ROLLBACK');
    } catch (e) {}
    await client.end().catch(() => {});
    process.exit(1);
  }
}

run();
