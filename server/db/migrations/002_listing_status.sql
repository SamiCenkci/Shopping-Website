ALTER TABLE listings
ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
CHECK (status IN ('active', 'sold', 'expired'));