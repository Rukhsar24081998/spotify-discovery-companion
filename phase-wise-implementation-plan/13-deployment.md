# Phase 13 — Deployment

**Reference docs:** `tech-stack.md` (Deployment, Environment Variables, Security, Definition of Done), `implementation-plan.md` (Definition of Done), `cursor-rules.md` (Deployment, Definition of Success).

---

## Objective

Ship a production deployment on Vercel that matches the documented Definition of Done, with all integrations verified live and no secrets in the repository.

## Scope

- In: Vercel project configuration, environment variables, production build verification, live end-to-end verification.
- Out: any feature work or scope changes.

## Deliverables

- A publicly accessible, working production deployment of the Spotify Discovery Companion.

## Files to create or modify

- Vercel project settings (dashboard).
- `README.md` — deployment notes and required env vars.
- Optional: `vercel.json` if specific configuration is needed.

## Components involved

- None (operational phase).

## Backend work

- Confirm API routes run correctly as Vercel serverless functions.
- Confirm the in-memory Spotify token cache behaves acceptably per serverless instance (cold starts re-fetch the token).

## APIs

- Spotify + Groq verified with production credentials.

## AI integrations

- Verify Groq calls succeed in the production environment.

## Dependencies

- All prior phases (01–12).

## Implementation notes

- Configure environment variables in Vercel: `GROQ_API_KEY`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` — never committed to the repo.
- Ensure the production build passes and no secrets appear in client bundles.
- Validate the full documented journey on the deployed URL, not just locally.
- Confirm previews work where Spotify provides URLs and degrade gracefully where they do not.

## Edge cases

- Missing/incorrect env vars in production → fail fast with clear server logs (never expose details to clients).
- Serverless cold start → token re-fetch path verified.
- Region differences may affect preview availability → verify against the deployed environment.

## Testing checklist (mirrors `tech-stack.md` deployment checklist)

- [ ] Environment variables configured in Vercel.
- [ ] Production build passes.
- [ ] Spotify credentials verified in production.
- [ ] Groq API key verified in production.
- [ ] Preview URLs tested on the live deployment.
- [ ] Mobile responsiveness verified on the deployed URL.
- [ ] Full journey (Home → input → recommendations → preview → feedback → Continue in Spotify) works end-to-end in production.

## Definition of Done

The application is deployed on Vercel, the entire documented user journey works in production, integrations are verified live, and no secrets exist in the repository — demonstrating clean separation between AI reasoning and Spotify infrastructure.

## Risks

- **Low–Medium.** Risks are environment-config errors and serverless behavior differences (e.g. token cache per instance, region-based preview availability). Mitigation: explicit deployment checklist and live verification of the full journey.
