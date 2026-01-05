import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

/**
 * Initialize PostgreSQL connection pool
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const config: any = {
      max: 10, // Reduced pool size for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000, // 30 seconds for Neon cold starts
      statement_timeout: 30000, // 30 second query timeout
    };

    if (process.env.DATABASE_URL) {
      config.connectionString = process.env.DATABASE_URL;
      // Neon/Cloud DBs usually require SSL
      if (process.env.DATABASE_URL.includes('sslmode=require')) {
         config.ssl = { rejectUnauthorized: false };
      }
    } else {
      config.host = process.env.DB_HOST || 'localhost';
      config.port = parseInt(process.env.DB_PORT || '5432');
      config.database = process.env.DB_NAME || 'quizbuzz';
      config.user = process.env.DB_USER || 'postgres';
      config.password = process.env.DB_PASSWORD;
      config.ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
    }

    pool = new Pool(config);

    // Test connection
    const client: PoolClient = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('PostgreSQL connected successfully');

    // Initialize database schema
    await initializeSchema();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

/**
 * Get database pool instance
 */
export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase() first.');
  }
  return pool;
};

/**
 * Execute a query with timeout
 */
export const query = async (text: string, params?: any[]) => {
  const client = await getPool().connect();
  try {
    // Set statement timeout to 25 seconds
    await client.query('SET statement_timeout = 25000');
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

/**
 * Initialize database schema
 */
const initializeSchema = async (): Promise<void> => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    // Create quizzes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        quiz_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        version INTEGER DEFAULT 1,
        created_by VARCHAR(255),
        
        -- Indexes for performance
        CONSTRAINT unique_slug UNIQUE (slug)
      );
    `);

    // Ensure columns exist (migration for existing tables)
    await client.query(`
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS quiz_data JSONB;
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);
      CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);
      CREATE INDEX IF NOT EXISTS idx_quiz_data_gin ON quizzes USING gin(quiz_data);
    `);

    // Create analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_analytics (
        id SERIAL PRIMARY KEY,
        quiz_slug VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (quiz_slug) REFERENCES quizzes(slug) ON DELETE CASCADE
      );
    `);

    // Create analytics indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_quiz_slug ON quiz_analytics(quiz_slug);
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON quiz_analytics(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON quiz_analytics(created_at);
    `);

    // Create quiz versions table (for rollback functionality)
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_versions (
        id SERIAL PRIMARY KEY,
        quiz_slug VARCHAR(255) NOT NULL,
        version INTEGER NOT NULL,
        quiz_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        change_summary TEXT,
        
        FOREIGN KEY (quiz_slug) REFERENCES quizzes(slug) ON DELETE CASCADE,
        CONSTRAINT unique_quiz_version UNIQUE (quiz_slug, version)
      );
    `);

    // Create ads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        slot VARCHAR(255),
        content JSONB,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        ctr FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ads indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ads_slot ON ads(slot);
      CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
    `);

    await client.query('COMMIT');
    console.log('Database schema initialized');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Schema initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Warmup database connection by running a simple query
 * This helps avoid cold start delays on serverless databases like Neon
 */
export const warmupDatabase = async (): Promise<void> => {
  try {
    console.log('Warming up database connection...');
    const start = Date.now();
    await query('SELECT 1');
    console.log(`Database warmup completed in ${Date.now() - start}ms`);
  } catch (error) {
    console.warn('Database warmup failed:', error);
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
};
