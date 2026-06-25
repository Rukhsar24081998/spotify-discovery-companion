# Cursor Rules

# Spotify Discovery Companion

## Purpose

This document defines the engineering and product rules for building the Spotify Discovery Companion.

All implementation decisions should follow these rules.

The markdown files inside the `/docs` folder are the single source of truth.

Do not introduce features that are not documented.

---

# Source of Truth

Always follow these documents in this order of precedence (higher number defers to lower number on conflict):

1. problem-statement.md
2. implementation-plan.md
3. ai-workflow.md
4. ui-guidelines.md
5. tech-stack.md
6. cursor-rules.md (this document — engineering conventions only)

If there is any conflict, the higher-precedence document wins. If a conflict cannot be resolved by precedence, ask for clarification instead of making assumptions.

### Canonical Terminology

These values are canonical and must be identical across all documents and code:

* **Mood order:** Happy, Calm, Focused, Energetic, Nostalgic
* **Activity order:** Workout, Studying, Working, Driving, Relaxing
* **Processing component name:** `LoadingState`
* **Score field name (API + UI):** `discoveryScore` (a number 0–100). The user-facing label is **"Discovery Match"** rendered as a percentage (e.g. `94% Discovery Match`).
* **API routes:** `POST /api/discover`, `POST /api/feedback`, `GET /api/spotify/search`
* **Max favorite artists:** 3
* **Recommendations:** target 5, minimum 3

---

# Product Scope

The MVP is intentionally small.

Do NOT add:

* AI chatbot
* Playlist generation
* Voice assistant
* Social features
* User authentication
* Full Spotify clone
* Music streaming
* Complex onboarding
* Additional recommendation tabs
* Analytics dashboards

Only build the documented MVP.

---

# Product Vision

Spotify already provides excellent recommendations.

Discovery Companion should complement Spotify rather than replace it.

The feature should feel like an optional Spotify capability.

---

# UI Principles

Follow Spotify's design language.

The UI should feel native.

Do not redesign Spotify.

Do not change Spotify navigation.

Only add:

Discovery Companion

Everything else remains familiar.

---

# Component Rules

Build reusable components.

Examples:

* DiscoveryCard
* MoodSelector
* ActivitySelector
* ArtistSearch
* LoadingState
* RecommendationCard
* PreviewPlayer
* FeedbackDialog

Component names must match `tech-stack.md` exactly. The processing/loading component is named `LoadingState` everywhere (not `LoadingScreen`).

Avoid duplicated code.

---

# Coding Standards

Use:

* TypeScript
* Functional Components
* React Hooks
* Next.js App Router

Avoid:

* Any
* Inline styles
* Large files
* Repeated logic

Keep components small and focused.

---

# Tailwind Rules

Use Tailwind CSS only.

Do not write custom CSS unless absolutely necessary.

Prefer utility classes.

Use consistent spacing.

Use responsive utilities.

---

# Architecture

Frontend

↓

Next.js

↓

API Routes

↓

Groq

*

Spotify

↓

Frontend

Business logic belongs inside API routes.

Never expose secrets in frontend code.

---

# AI Rules

The AI should:

Understand intent.

Generate discovery strategy.

Rank candidate songs.

Generate explanations.

Refine recommendations.

The AI should never:

Invent songs.

Invent artists.

Generate fake Spotify URLs.

Generate fake previews.

---

# Spotify Rules

Spotify is responsible for:

Music catalog

Preview URLs

Album artwork

Track metadata

Playback links

Never replace Spotify functionality.

---

# API Rules

Never call Groq directly from the browser.

Never expose:

* API keys
* Spotify secrets

Always use backend routes.

---

# Error Handling

Handle:

Spotify unavailable

Groq unavailable

Missing preview URLs

Empty search results

Network failures

Show friendly UI instead of crashes.

---

# Performance

Cache Spotify access tokens.

Avoid unnecessary API calls.

Lazy-load images.

Keep AI prompts concise.

Minimize re-renders.

---

# Accessibility

Use semantic HTML.

Keyboard navigation.

Visible focus states.

Accessible labels.

Sufficient color contrast.

---

# Code Quality

Every file should have one responsibility.

Avoid files larger than 300 lines whenever practical.

Extract reusable logic into hooks or utility functions.

Prefer composition over duplication.

---

# Naming Conventions

Components:

PascalCase

Example:

RecommendationCard.tsx

Functions:

camelCase

Variables:

camelCase

Types:

PascalCase

Constants:

UPPER_SNAKE_CASE

---

# Comments

Write comments only where necessary.

Prefer self-explanatory code.

Avoid redundant comments.

---

# Git Practices

Write clean commits.

Keep changes focused.

Avoid unrelated modifications.

---

# Deployment

Application must be deployable on Vercel.

Environment variables should be loaded from `.env.local`.

No secrets should appear in the repository.

---

# Before Writing Code

Always:

1. Read the `/docs` folder.
2. Understand the current task.
3. Build only the requested feature.
4. Keep the MVP scope unchanged.
5. Ask questions if requirements are ambiguous.

---

# Development Order

Implement features in the following order:

1. Project setup
2. Folder structure
3. UI screens
4. Spotify API integration
5. Groq integration
6. AI ranking
7. Preview player
8. Feedback refinement
9. Final polish
10. Deployment

Never skip directly to the final application.

---

# Definition of Success

A successful implementation:

* Matches the documented user journey.
* Preserves Spotify's experience.
* Demonstrates AI reasoning.
* Uses real Spotify previews where available.
* Is responsive.
* Is accessible.
* Is production-ready.
* Can be deployed to Vercel without additional changes.
