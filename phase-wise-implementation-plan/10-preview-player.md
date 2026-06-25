# Phase 10 — Preview Player

**Reference docs:** `ui-guidelines.md` (Preview Player, Preview Unavailable), `ai-workflow.md` (Preview Workflow), `implementation-plan.md` (Step 4 preview), `tech-stack.md` (Spotify API Edge Cases — Missing preview_url).

---

## Objective

Add the inline 30-second preview player inside each recommendation card as a confidence-building step, with graceful degradation when a track has no `preview_url` — without ever removing the preview feature.

## Scope

- In: `PreviewPlayer` component, inline playback with progress + finished state, preview-unavailable handling, single-active-player behavior.
- Out: feedback loop (Phase 11).

## Deliverables

- A working inline preview player integrated into `RecommendationCard`, degrading gracefully when no preview exists.

## Files to create or modify

- `components/PreviewPlayer.tsx`
- `components/RecommendationCard.tsx` — mount `PreviewPlayer` in the reserved slot.

## Components involved

- `PreviewPlayer`, `RecommendationCard`.

## Backend work

- None (uses `previewUrl` from the `Recommendation` object).

## APIs

- Spotify-provided `previewUrl` only; the app does not generate audio.

## AI integrations

- None.

## Dependencies

- Phase 09 (cards), Phase 05 (real `previewUrl` values).

## Implementation notes

- Player shows: play control, progress bar, `0:12 / 0:30` time. After playback: "Preview finished — Continue listening in Spotify."
- The preview is a **supporting** interaction; "Continue in Spotify" remains the primary action.
- Users must always understand they heard a preview, not the full song.
- Only one preview plays at a time — starting a new one stops others.
- Subtle motion only; respect reduced-motion.

## Edge cases

- **`previewUrl` is null:** hide the player; show "Preview unavailable" + keep "Continue in Spotify". Never disable the recommendation.
- Audio load/playback error → fall back to the unavailable state gracefully.
- Rapid play/pause toggling handled without state glitches.
- Navigating away mid-preview stops audio.

## Testing checklist

- [ ] Preview plays, shows progress, and reports time correctly.
- [ ] Finished state shows the documented message.
- [ ] Null `previewUrl` shows "Preview unavailable" with Continue still present.
- [ ] Starting one preview stops any other playing preview.
- [ ] Audio errors degrade to the unavailable state.
- [ ] Keyboard accessible controls; reduced-motion respected.

## Definition of Done

The inline 30-second preview works where Spotify provides a URL and degrades gracefully where it does not, with "Continue in Spotify" always available and the preview clearly distinguished from the full track.

## Risks

- **Medium.** External dependency: many tracks lack `preview_url`. Mitigation: graceful degradation is the designed default; core discovery never depends on preview availability.
