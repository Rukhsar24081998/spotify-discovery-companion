# Phase 05 — Spotify API Integration

**Reference docs:** `tech-stack.md` (Music Provider, Performance Guidelines, Spotify API Edge Cases, Security, `GET /api/spotify/search`), `ai-workflow.md` (Retrieve Candidate Tracks), `cursor-rules.md` (Spotify Rules, API Rules, Error Handling).

---

## Objective

Implement the real Spotify service layer (client-credentials auth with token caching, track Search, candidate mapping) in isolation, and **empirically validate `preview_url` availability** — the project's top documented risk — before the pipeline depends on it.

## Scope

- In: `lib/spotify.ts` (token cache, search, mapping, filtering), `GET /api/spotify/search` route, wiring real autocomplete into `ArtistSearch`.
- Out: Groq calls (Phase 06), `/api/discover` orchestration (Phase 07).

## Deliverables

- A reusable Spotify service returning ~20 mapped candidate tracks.
- A live artist autocomplete route.
- A measured report of how many search results carry a non-null `preview_url`.

## Files to create or modify

- `lib/spotify.ts` — implement token fetch + in-memory cache, `searchTracks`, `searchArtists`, response→internal mapping, candidate filtering.
- `app/api/spotify/search/route.ts` — artist autocomplete handler.
- `components/ArtistSearch.tsx` — swap mock for the live route.

## Components involved

- `ArtistSearch` (wired to live data).

## Backend work

- Client-credentials token retrieval; in-memory cache until expiry minus a 60s safety margin.
- Track search returning ~20 candidates with: Track ID, title, artist, album artwork, preview URL, Spotify URL, popularity.
- Filter out unavailable/region-restricted tracks.
- Map responses to the internal shape from `types/`.

## APIs

- Spotify Web API: token endpoint, Search (tracks + artists).

## AI integrations

- None.

## Dependencies

- Phases 01–02. `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`.

## Implementation notes

- Auth = Client Credentials flow (no user login, per MVP scope).
- Token cache lives in server memory; refresh proactively before expiry.
- Keep all Spotify access inside `lib/spotify.ts`; routes orchestrate, the service encapsulates I/O.
- `/api/spotify/search`: validate `q` (trim, ≤ 80 chars), `type=artist`, return ≤ 5 suggestions; empty `q` → empty list with no Spotify call; client debounced ≥ 250 ms.
- Never expose the client secret; all calls server-side; log errors server-only.
- **Critical validation:** record the proportion of results with a usable `preview_url` and confirm current API access — this directly affects the preview feature and Definition of Done.

## Edge cases

- **Missing `preview_url`:** keep the field nullable; do not drop the track here (handled in UI, Phase 10).
- **Empty search results:** return empty; broadened-search logic lives in Phase 07/08 orchestration.
- **Rate limit (429):** respect `Retry-After`, retry once (cap ~2s), else `RATE_LIMITED`.
- **Auth failure:** retry once, else `SPOTIFY_AUTH_FAILED`.
- **Unavailable/region-restricted tracks:** filtered out during mapping.

## Testing checklist

- [ ] Token is cached and reused; refresh near expiry verified.
- [ ] `searchTracks` returns ~20 candidates with all required fields mapped.
- [ ] `preview_url` availability measured and documented.
- [ ] `/api/spotify/search` returns suggestions; empty `q` makes no call.
- [ ] 429, empty-result, and auth-failure paths return correct error envelopes.
- [ ] No secret reaches the client (network inspection).

## Definition of Done

The Spotify service returns real, mapped candidate tracks; artist autocomplete is live; all documented Spotify edge cases are handled; and preview availability has been empirically confirmed.

## Risks

- **Medium–High.** Spotify `preview_url` may be widely null or access-restricted (externally controlled). Mitigation: measure early; the feature degrades gracefully in Phase 10 and is never removed. Secondary risk: rate limits — mitigated by token caching.
