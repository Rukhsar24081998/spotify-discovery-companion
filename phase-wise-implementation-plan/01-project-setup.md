# Phase 01 — Project Setup

**Reference docs:** `tech-stack.md` (Technology Stack, Project Structure, Environment Variables, Deployment), `cursor-rules.md` (Coding Standards, Tailwind Rules, Development Order).

---

## Objective

Stand up a deployable Next.js 15 application skeleton with the exact documented toolchain, strict TypeScript, Tailwind dark theme, and the full folder structure — producing a clean local and production build before any feature work begins.

## Scope

- In: toolchain install, configuration, folder skeleton, theme baseline, environment variable scaffolding.
- Out: any UI screens, components, services, or API logic (later phases).

## Deliverables

- A runnable Next.js 15 App Router project.
- Passing `npm run dev` and `npm run build` with strict TypeScript.
- The documented folder structure and empty route placeholders.
- `.env.example` and a git-ignored `.env.local`.

## Files to create or modify

- `package.json`, `tsconfig.json` (strict mode), `next.config.js`
- `tailwind.config.ts`, `postcss.config.js`
- `app/layout.tsx` (root layout, dark theme), `app/page.tsx` (placeholder)
- `styles/globals.css` (Tailwind directives + theme tokens)
- Folder skeleton: `app/`, `app/discover/`, `app/api/discover/`, `app/api/spotify/`, `app/api/feedback/`, `components/`, `lib/`, `types/`, `public/`, `styles/`
- `.gitignore`, `.env.example`, `README.md`

## Components involved

- Root layout only (no feature components).

## Backend work

- Create empty API route folders as placeholders. No handlers yet.

## APIs

- None.

## AI integrations

- None.

## Dependencies

- `next@15`, `react@19`, `react-dom@19`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`.
- Dev: ESLint + Prettier config aligned to `cursor-rules.md`.

## Implementation notes

- Enable TypeScript `strict` and forbid `any` (lint rule). This is enforced from Phase 1 to prevent debt.
- Establish theme tokens now: near-black background, dark-gray cards, Spotify-green accent (`ui-guidelines.md` → Visual Style). No bright gradients.
- Set a max content width utility (~900px) for reuse in later screens.
- Tailwind only — no custom CSS unless strictly necessary (`cursor-rules.md`).
- Do **not** commit secrets; `.env.local` must be git-ignored. Document required keys in `.env.example`: `GROQ_API_KEY`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`.

## Edge cases

- Node/Next version mismatches — pin versions in `package.json`.
- Ensure the build works without env vars present (no top-level code reads secrets at import time).

## Testing checklist

- [ ] `npm run dev` serves a dark-themed placeholder page.
- [ ] `npm run build` succeeds with strict TS and zero `any`.
- [ ] ESLint and Prettier run clean.
- [ ] All documented folders exist; route placeholders present.
- [ ] `.env.local` is git-ignored; `.env.example` lists the three keys.

## Definition of Done

A clean production build runs locally, the documented folder structure exists, strict TypeScript and Tailwind dark theme are configured, and no secrets are committed.

## Risks

- **Low.** Primary risk is version drift between Next 15 / React 19 and tooling — mitigated by pinning versions and verifying the build early.
