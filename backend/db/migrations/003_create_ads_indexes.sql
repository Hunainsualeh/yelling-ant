BEGIN;

-- Index to speed sorting by created_at for ad queries
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);

-- Composite index for common filter + sort pattern (slot + status + created_at desc)
CREATE INDEX IF NOT EXISTS idx_ads_slot_status_created_at ON ads(slot, status, created_at DESC);

COMMIT;
