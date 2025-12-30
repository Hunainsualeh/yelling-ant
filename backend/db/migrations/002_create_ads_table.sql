BEGIN;

CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, paused, scheduled
  slot VARCHAR(255), -- e.g., 'homepage_sidebar', 'quiz_result', 'hero'
  content JSONB, -- { type: 'image', url: '...', link: '...' } or { type: 'html', html: '...' }
  impressions INTEGER DEFAULT 0,
  ctr FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ads_slot ON ads(slot);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);

COMMIT;
