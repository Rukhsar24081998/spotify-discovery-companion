# AI Workflow

# Spotify Discovery Companion

## Objective

The AI Discovery Companion is designed to complement Spotify's existing recommendation engine by understanding a user's **current listening intent** rather than relying solely on historical listening behavior.

Instead of replacing Spotify's recommendation system, the AI acts as an intelligent reasoning layer that:

* Understands user intent.
* Creates a contextual discovery strategy.
* Selects the most relevant songs from Spotify's catalog.
* Explains recommendations in natural language.
* Learns from explicit user feedback during the session.

---

# Why AI Is Required

Traditional recommendation systems primarily optimize for:

* Listening history
* Collaborative filtering
* Similar users
* Audio similarity

These systems answer:

> "What has the user liked before?"

The Discovery Companion answers a different question:

> **"What does the user want to listen to right now?"**

This requires contextual reasoning, which is where an LLM provides value.

---

# Responsibility Matrix

Each layer owns a single, well-defined responsibility. This separation keeps the architecture maintainable and prevents secrets or business logic from leaking into the browser.

| Layer | Responsible for | Explicitly NOT responsible for |
| --- | --- | --- |
| **Frontend** | Capturing context (mood, activity, artists), rendering screens, running the preview player, holding **client-side session state** (candidate pool, shown/skipped tracks, skip count), calling backend routes | Calling Groq or Spotify directly; holding secrets; ranking logic |
| **Backend (Next.js API Routes)** | Orchestration, Spotify token management + caching, calling Spotify Search, calling Groq, validating/sanitizing input, validating AI output against the candidate set, composing `Recommendation` objects, error handling | Generating recommendations itself; persisting data across sessions |
| **Groq (LLM)** | Reasoning over intent → strategy → search query (Call 1); ranking candidates, scoring, and explanations (Call 2); re-ranking on feedback | Inventing songs/artists/URLs; fetching music data; storing state |
| **Spotify Web API** | Catalog (source of truth), Search, track metadata, album artwork, preview URLs, Spotify playback links | Reasoning, ranking, or explanations |

**Hard rule:** All Groq and Spotify calls happen server-side. The browser never receives API keys or the Spotify client secret.

---

# AI Responsibilities

The AI performs five logical tasks, executed in **exactly two Groq calls** to minimize latency:

* **Groq Call 1 — Planning:** Steps 1–3 (Understand Intent → Generate Discovery Strategy → Generate Search Query) are produced in a **single** call that returns one combined JSON object. These steps share the same context and must not be split into separate network round-trips.
* **Spotify Search** runs between the two Groq calls (it is a Spotify call, not a Groq call).
* **Groq Call 2 — Ranking:** Step 5 (rank + score + explain) is a single call over the retrieved candidates.

This keeps the critical path to **two Groq calls + one Spotify search** per discovery. Feedback re-ranking adds at most **one** additional Groq call and reuses the cached candidate pool (no new Spotify search unless the pool is exhausted).

## Step 1 — Understand User Intent

The Discovery Companion receives:

```json
{
  "mood": "Energetic",
  "activity": "Workout",
  "favoriteArtists": [
    "Arijit Singh"
  ]
}
```

The AI should infer:

* Desired energy
* Emotional tone
* Listening context
* Familiarity preference
* Discovery intent

The AI should never simply map moods to genres.

It should reason about the user's overall listening goal.

---

## Step 2 — Generate Discovery Strategy

Instead of immediately searching Spotify,

the AI creates an internal discovery strategy.

Example:

```json
{
  "energy": "High",
  "context": "Workout",
  "goal": "Discover unfamiliar artists",
  "language": [
    "Hindi",
    "English"
  ],
  "avoid": [
    "Recently played artists"
  ],
  "tempo": "120-140 BPM"
}
```

This strategy guides the search process.

---

## Step 3 — Generate Spotify Search Query

The AI converts the discovery strategy into a Spotify-friendly search query.

Example:

```text
High energy workout pop motivational Hindi English
```

This query is sent to the Spotify Search API.

---

## Groq Call 1 — Combined Planning Output

Steps 1–3 are returned together in one structured JSON object:

```json
{
  "intent": {
    "energy": "High",
    "emotionalTone": "Motivational",
    "listeningContext": "Workout",
    "familiarityPreference": "Lean discovery",
    "discoveryIntent": "Introduce new artists adjacent to favorites"
  },
  "strategy": {
    "energy": "High",
    "context": "Workout",
    "goal": "Discover unfamiliar artists",
    "language": ["Hindi", "English"],
    "avoid": ["Recently played artists"],
    "tempo": "120-140 BPM"
  },
  "searchQuery": "High energy workout pop motivational Hindi English"
}
```

The backend uses `searchQuery` to call Spotify, and carries `intent` + `strategy` into Groq Call 2 so the ranker has full context without re-deriving it.

---

## Step 4 — Retrieve Candidate Tracks

Spotify returns approximately 20 candidate tracks.

Each track includes:

* Track ID
* Song title
* Artist
* Album artwork
* Preview URL
* Spotify URL
* Popularity

Spotify remains the source of truth for music metadata.

---

## Step 5 — AI Ranking

The AI evaluates every candidate.

Each song is scored using several dimensions.

### Context Match

Does the song fit the user's current mood?

---

### Activity Match

Is it appropriate for the selected activity?

---

### Discovery Potential

Does it introduce something new without feeling completely unfamiliar?

---

### Familiarity Balance

Does it stay close enough to the user's comfort zone?

---

### Variety

Avoid recommending multiple songs that feel nearly identical.

---

The AI selects the top recommendations.

---

# Discovery Match Scoring Methodology

The **Discovery Match** score (`discoveryScore`) is a single integer from **0–100** shown to the user as a percentage. It must be consistent, explainable, and reproducible from the same inputs.

## Per-Track Dimension Scores

The AI scores each candidate on four dimensions, each from 0–100:

| Dimension | Weight | Meaning |
| --- | --- | --- |
| **Context Match** | 0.30 | How well the track fits the user's current **mood**. |
| **Activity Match** | 0.25 | How appropriate the track is for the selected **activity** (energy/tempo fit). |
| **Discovery Potential** | 0.30 | How effectively it introduces something new (favors artists outside the user's favorites and lower popularity within reason). |
| **Familiarity Balance** | 0.15 | How safely it stays within reach of the user's taste so it doesn't feel alien. |

## Formula

```text
discoveryScore = round(
    0.30 * contextMatch
  + 0.25 * activityMatch
  + 0.30 * discoveryPotential
  + 0.15 * familiarityBalance
)
```

* All dimension inputs are 0–100; the weighted result is therefore 0–100.
* The model returns the final rounded `discoveryScore` per track. The backend may recompute the weighted sum from returned dimension scores to verify consistency and reject malformed scores.
* Scores are **relative quality signals**, not probabilities. Do not expose dimension breakdowns or weights to the user.

## Variety (Set-Level Rule)

**Variety** is enforced during selection, not as a per-track score:

* No more than **one** track per artist in the final set.
* Avoid near-duplicate tracks (same artist + near-identical title/version).
* The final set should span the strategy (e.g. both languages when the strategy lists multiple).

---

# Recommendation Logic

* **Target recommendations:** **5**.
* **Minimum acceptable recommendations:** **3**.
* **Selection:** Rank all candidates by `discoveryScore` (descending), apply the Variety rule, then take the top 5.
* **Familiarity vs discovery balance:** The default posture is **discovery-leaning** (Discovery Potential is weighted at 0.30). To prevent alienation, **at least one** track in the final set should score high on Familiarity Balance. The AI must never return a set composed entirely of the user's favorite artists — that defeats the discovery goal.
* **Fallback behavior:**
  * If after ranking **fewer than 3** valid candidates remain, the backend **broadens the search** once (relax language/tempo constraints, drop the most restrictive term) and re-runs Spotify Search, then re-ranks.
  * If still fewer than 3, return whatever valid recommendations exist (1–2) **plus a UI notice** that discovery results were limited (see `ui-guidelines.md`).
  * If **zero** valid candidates exist, return an empty list with a friendly empty-state (see Spotify Edge Cases in `tech-stack.md`).
* **Validation:** Every `trackId` returned by Groq **must** exist in the Spotify candidate set. The backend discards any unknown `trackId` before composing cards — this enforces the "never invent" rule defensively.

---

# Recommendation Explanation

Every recommendation should include a concise explanation.

Example:

> This track matches your workout energy while introducing an artist outside your regular listening habits.

Another example:

> Since you're feeling nostalgic while driving, we selected songs with emotional storytelling and a relaxed tempo similar to artists you already enjoy.

The explanation should never exceed three sentences.

---

# Preview Workflow

The recommendation card should display:

```text
▶ Preview (30 sec)
```

The preview is a confidence-building step.

It allows users to validate recommendations before opening the full song.

When the preview ends:

```text
Preview finished.

Continue listening on Spotify
```

The AI does not generate audio.

Spotify provides the preview URL.

---

# Feedback Loop

## Trigger Threshold

The feedback dialog appears after the user skips **2** recommendations within the session ("multiple" = 2). It is shown **once** per session unless the user skips 2 more after a refinement. The dialog is always **optional** — the user can dismiss it.

## Feedback Options

```text
Why wasn't this a good fit?

○ Too energetic

○ Wrong mood

○ Didn't like the vocals

○ Already know this artist
```

## How Feedback Changes Ranking

Each reason maps to a deterministic adjustment applied to the **remaining cached candidates** during Groq Call 2 (re-rank):

| Reason | Ranking adjustment |
| --- | --- |
| Too energetic | Lower preferred energy/tempo band; down-weight high-energy tracks. |
| Wrong mood | Re-weight Context Match toward a corrected mood interpretation; down-weight the rejected mood signature. |
| Didn't like the vocals | Down-weight tracks sharing vocal/artist similarity with skipped tracks. |
| Already know this artist | Increase Discovery Potential weight; exclude artists already shown or in favorites. |

The AI **re-ranks the remaining candidate pool only** and returns a fresh top set, excluding already-shown and skipped tracks.

## Session State (Stateless Backend)

The MVP has **no authentication and no database**. Session state lives **on the client** and is passed to the backend per request:

* `context` — original mood, activity, favoriteArtists.
* `candidatePool` — the candidate tracks returned by Spotify (the backend returns these to the client so they can be replayed to `/api/feedback`).
* `shownTrackIds` — tracks already displayed.
* `skippedTrackIds` + their reasons.
* `skipCount` — drives the feedback trigger.

This keeps the backend **stateless and horizontally scalable** on Vercel. State is discarded when the session (tab) ends — consistent with the "no cross-session learning" scope.

## Re-Ranking Cost

No new Spotify search is required unless the remaining pool can no longer produce the minimum of 3 recommendations, in which case the backend performs **one** broadened search (see Recommendation Logic → Fallback behavior).

---

# Complete AI Pipeline

```text
User (Mood + Activity + Optional Artists)
        │
        ▼
Frontend → POST /api/discover
        │
        ▼
┌─────────────────────────────────────────────┐
│ Backend Orchestration (Next.js API Route)    │
│                                              │
│  GROQ CALL 1 (Planning)                      │
│   Understand Intent → Strategy → Search Query│
│        │                                     │
│        ▼                                     │
│  Spotify Search API → ~20 candidate tracks   │
│   (token cached; broadened search on fallback)│
│        │                                     │
│        ▼                                     │
│  GROQ CALL 2 (Ranking)                       │
│   Rank → Score (Discovery Match) → Explain   │
│        │                                     │
│        ▼                                     │
│  Validate trackIds + compose Recommendations │
└─────────────────────────────────────────────┘
        │
        ▼
Recommendation Cards → Preview → Continue in Spotify
        │
        ▼ (after 2 skips, optional)
User Feedback → POST /api/feedback
        │
        ▼
GROQ CALL 3 (Re-rank cached pool, no new search)
        │
        ▼
Updated Recommendations
```

---

# Groq Configuration

| Setting | Value | Rationale |
| --- | --- | --- |
| **Model** | `llama-3.3-70b-versatile` | Strong reasoning + reliable structured JSON; available on Groq. |
| **Temperature** | `0.3` | Low enough for consistent, reproducible ranking/scoring; high enough for natural explanations. |
| **Response format** | `{ "type": "json_object" }` | Forces valid JSON output (JSON mode). |
| **max_tokens** | ~1024 (planning), ~1536 (ranking) | Bounds latency and cost; explanations are short. |
| **Calls per discovery** | 2 (planning + ranking) | See "AI Responsibilities". |

If `llama-3.3-70b-versatile` is unavailable, fall back to `llama-3.1-8b-instant` for the planning call; the ranking call should stay on the larger model for quality.

## JSON Validation Rules

The backend must validate every Groq response before use:

1. Response must parse as JSON. On parse failure, **retry once** with the same input.
2. Required keys must be present and correctly typed:
   * Planning: `intent` (object), `strategy` (object), `searchQuery` (non-empty string).
   * Ranking: `recommendations` (array) where each item has `trackId` (string), `score` (integer 0–100), `explanation` (string, ≤3 sentences).
3. `score` outside 0–100 is clamped; non-integer is rounded.
4. Every `trackId` must exist in the Spotify candidate set; unknown IDs are discarded.
5. If validation still fails after one retry, the backend returns a graceful error to the frontend (see `tech-stack.md` → Error Handling). The AI never blocks the UI indefinitely.

---

# Prompting Strategy

The system prompt should instruct the model to behave as an intelligent music discovery assistant.

Objectives:

* Understand user intent.
* Encourage exploration.
* Avoid repetitive listening.
* Recommend songs appropriate to the current context.
* Keep explanations concise.
* Prioritize discovery over familiarity while remaining relevant.

The AI should never invent songs.

All recommendations must come from Spotify search results.

---

# Expected AI Output

The model should return structured JSON.

Example:

```json
{
  "recommendations": [
    {
      "trackId": "spotify-track-id",
      "score": 94,
      "explanation": "Matches your workout energy while introducing a fresh artist."
    },
    {
      "trackId": "spotify-track-id",
      "score": 91,
      "explanation": "Maintains the upbeat tempo you enjoy but expands your listening beyond familiar playlists."
    }
  ]
}
```

The frontend combines this output with Spotify metadata to render the recommendation cards.

---

# AI Design Principles

The AI should:

* Reason before recommending.
* Explain every recommendation.
* Encourage discovery rather than repetition.
* Adapt to explicit feedback.
* Complement Spotify instead of replacing it.
* Keep explanations concise and actionable.
* Never generate fictional artists or tracks.

---

# Success Criteria

The AI workflow is successful when it:

* Understands real-time user intent.
* Produces contextual discovery strategies.
* Returns explainable recommendations.
* Helps users confidently explore unfamiliar music.
* Learns from user feedback within the session.
* Demonstrates clear value beyond traditional recommendation systems.
