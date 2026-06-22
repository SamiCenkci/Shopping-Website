# Wisp 🛍️

A full-stack secondhand marketplace for the Norwegian market, inspired by [Finn.no](https://finn.no). Users can list items for sale or giveaway, search and filter listings, favorite items, manage their own ads, and chat with sellers in real time.

🔗 **Live site:** [wispapp.net](https://wispapp.net)

---

## Overview

Wisp is a complete marketplace platform built from the ground up — frontend, backend, database, file storage, real-time messaging, authentication, and deployment. It is self-hosted and served to the public over HTTPS through a Cloudflare Tunnel.

The project demonstrates an end-to-end product: a typed React frontend, a compiled Go backend with a real relational database, cloud image storage, WebSocket-based live chat, and a production deployment with secure, environment-based configuration.

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4 (custom theme tokens, light/dark mode)
- React Suspense for production-ready client rendering

**Backend**
- Go with the Gin web framework
- Gorilla WebSocket for real-time chat
- JWT authentication (HS256) with bcrypt password hashing
- Optional-auth middleware for personalized public endpoints

**Database & Storage**
- PostgreSQL 18
- SQLC for type-safe, generated query code
- pgx/v5 driver
- `pg_trgm` extension for fuzzy, typo-tolerant search
- AWS S3 for image and file storage via presigned uploads

**Infrastructure**
- Self-hosted, exposed to the internet via Cloudflare Tunnel with automatic HTTPS
- Environment-based configuration (12-factor style)
- CORS configured per environment

---

## Features

### Authentication & Users
- Signup and login with JWT tokens and bcrypt-hashed passwords
- Protected and optional-auth routes
- User profiles with display name, bio, phone, location, avatar, and more
- Editable profile pages with a Finn.no-style layout
- Public profile view (limited fields) vs. private self-view

### Listings
- Full CRUD with multi-image uploads to AWS S3
- "For sale" (Til salgs) and "giveaway" (Gis bort) listing types
- 60-day expiry with status tracking: active, sold, expired
- "My listings" (Mine annonser) dashboard with tabs (all / active / sold / expired) and per-listing actions
- Listing detail pages with image gallery, seller card, and similar-listing recommendations
- "This is your own listing" state instead of a contact button on your own ads
- Norwegian condition labels (Ny, Som ny, God, Brukbar)

### Search & Filtering
- Fuzzy full-text search using PostgreSQL `pg_trgm` similarity matching
- Filters: category, postal code, price range, condition, and listing type
- Sort by newest, price ascending, or price descending
- Filter sidebar that appears with search results
- Recent searches saved locally, surfaced in a navbar dropdown

### Real-Time Chat
- WebSocket-based messaging between buyers and sellers
- File and image attachments (images render inline, other files as download links)
- Conversation list enriched with the other user's name, listing title, image, and last-message preview
- Unread-message indicators: a live count badge in the navbar (updates in real time) and per-conversation badges that clear when opened

### Favorites
- Like / unlike listings, with a unique constraint preventing duplicate likes
- Public like counts visible to everyone
- Private "liked listings" (Likte annonser) view on your own profile
- Heart indicators on listing cards and detail pages that persist across reloads

### Design & UX
- Polished, responsive layout (desktop and mobile)
- Light and dark mode with a no-flash theme loader
- Custom green brand theme using Tailwind v4 design tokens
- Frosted navbar, layered shadows, and refined spacing
- Loading skeletons for perceived performance

---

## Architecture

```
┌─────────────┐     HTTPS      ┌──────────────┐
│   Browser   │ ─────────────► │  Cloudflare  │
└─────────────┘                │    Tunnel    │
                               └──────┬───────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │                                      │
            ┌──────▼──────┐                        ┌──────▼──────┐
            │  Next.js    │ ──── REST / WS ──────► │   Go API    │
            │  Frontend   │                        │   (Gin)     │
            └─────────────┘                        └──────┬──────┘
                                                          │
                                          ┌───────────────┼───────────────┐
                                          │                               │
                                   ┌──────▼──────┐                 ┌──────▼──────┐
                                   │ PostgreSQL  │                 │   AWS S3    │
                                   └─────────────┘                 └─────────────┘
```

---

## Running locally

### Prerequisites
- Node.js and npm
- Go
- PostgreSQL
- An AWS S3 bucket (for image uploads)

### Backend

```bash
cd server
cp .env.example .env   # fill in your own values
go run main.go
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `localhost:3000` and the API on `localhost:8080`.

### Environment variables

See [`server/.env.example`](server/.env.example) for the required configuration (database URL, JWT secret, AWS credentials, allowed origins).

---

## Notes

This is a personal project built to learn full-stack development end to end — from database schema design and a typed API to real-time features and a secure production deployment. The codebase favors clarity and a complete feature set, and reflects real-world concerns like environment-based config, CORS, authentication, and keeping secrets out of version control.

Built by **Sami Cenkci** — [GitHub](https://github.com/SamiCenkci)
