-- Migration: 001_create_missing_tables.sql
-- Creates missing application tables referenced by new endpoints

BEGIN;

CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  quiz_slug VARCHAR(255),
  badge_id VARCHAR(255) NOT NULL,
  badge_name VARCHAR(500),
  badge_image VARCHAR(1000),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_quiz_slug ON user_badges(quiz_slug);

-- badges master table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  badge_key VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  image VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_badges_badge_key ON badges(badge_key);

-- quiz_branching mapping table
CREATE TABLE IF NOT EXISTS quiz_branching (
  id SERIAL PRIMARY KEY,
  quiz_slug VARCHAR(255) NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  answer_id VARCHAR(255) NOT NULL,
  next_question_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quiz_branching_quiz_slug ON quiz_branching(quiz_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_branching_question ON quiz_branching(question_id);

CREATE TABLE IF NOT EXISTS colony_quizzes (
  id SERIAL PRIMARY KEY,
  colony_id VARCHAR(255) NOT NULL,
  quiz_slug VARCHAR(255) NOT NULL,
  association_type VARCHAR(50) DEFAULT 'primary',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (colony_id, quiz_slug)
);
CREATE INDEX IF NOT EXISTS idx_colony_quizzes_colony ON colony_quizzes(colony_id);
CREATE INDEX IF NOT EXISTS idx_colony_quizzes_quiz ON colony_quizzes(quiz_slug);


COMMIT;

