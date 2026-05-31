-- Enable PostgreSQL to generate UUIDs automatically
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ─────────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LISTINGS ──────────────────────────────────────────
CREATE TABLE listings (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT NOT NULL,
    price_ore     INTEGER NOT NULL CHECK (price_ore >= 0),
    category      TEXT NOT NULL,
    subcategory   TEXT,
    condition     TEXT NOT NULL CHECK (condition IN ('new','like_new','good','fair')),
    county        TEXT NOT NULL,
    municipality  TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LISTING IMAGES ────────────────────────────────────
CREATE TABLE listing_images (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    caption     TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ─── FAVORITES ─────────────────────────────────────────
CREATE TABLE favorites (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, listing_id)
);

-- ─── CONVERSATIONS ─────────────────────────────────────
CREATE TABLE conversations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (listing_id, buyer_id)
);

-- ─── MESSAGES ──────────────────────────────────────────
CREATE TABLE messages (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content          TEXT NOT NULL,
    read_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TOKENS (email verify + password reset) ────────────
CREATE TABLE tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    type        TEXT NOT NULL CHECK (type IN ('email_verify','password_reset')),
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES (make lookups fast) ───────────────────────
CREATE INDEX idx_listings_user        ON listings(user_id);
CREATE INDEX idx_listings_category    ON listings(category);
CREATE INDEX idx_listings_created     ON listings(created_at DESC);
CREATE INDEX idx_images_listing       ON listing_images(listing_id);
CREATE INDEX idx_favorites_user       ON favorites(user_id);
CREATE INDEX idx_messages_conv        ON messages(conversation_id);
CREATE INDEX idx_tokens_token         ON tokens(token);