# Spotify Discovery Companion

An optional, AI-powered reasoning layer that helps daily Spotify users break out of repetitive listening by expressing their current mood and activity, then discovering new music with transparent explanations and 30-second previews.

> Product documentation lives in [`docs/`](./docs) and is the single source of truth. The phased engineering plan lives in [`phase-wise-implementation-plan/`](./phase-wise-implementation-plan).

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** (dark theme only)
- **Lucide React** (icons)
- **Groq API** (AI reasoning) and **Spotify Web API** (music catalog) — integrated in later phases
- Deployed on **Vercel**

## Getting Started

### Prerequisites

- Node.js 18.18+ (developed on Node 24)

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. `.env.local` is git-ignored and must never be committed.

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Groq API key (server-side only) |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |

All keys are read server-side only and are never exposed to the browser.

### Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```

## Project Structure

```text
app/
  page.tsx            # Home (placeholder until the design-system phase)
  layout.tsx          # Root layout + dark theme
  discover/           # Discovery flow (later phase)
  api/
    discover/         # POST /api/discover (later phase)
    spotify/          # GET /api/spotify/search (later phase)
    feedback/         # POST /api/feedback (later phase)
components/           # Reusable UI components (later phases)
lib/                  # Services: spotify, groq, prompts, utils (later phases)
types/                # Shared TypeScript contracts (later phase)
styles/               # Global Tailwind styles + theme
public/               # Static assets
```

## Implementation Status

Built phase by phase per `phase-wise-implementation-plan/`. Current: **Phase 01 — Project Setup** (deployable skeleton).
