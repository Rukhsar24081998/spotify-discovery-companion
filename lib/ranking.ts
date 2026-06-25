/**
 * Deterministic ranking stub (Phase 07).
 *
 * This is a TEMPORARY seam that makes the /api/discover request path testable
 * before real AI ranking exists. It orders candidates by popularity and applies
 * the set-level variety rule (one track per artist). It deliberately returns
 * ordered CandidateTrack[] — it does NOT produce Recommendation objects,
 * Discovery Scores, or explanations. Those are AI concepts introduced in
 * Phase 08, which replaces this stub.
 */

import { TARGET_RECOMMENDATIONS, type CandidateTrack } from "@/types";

function primaryArtist(track: CandidateTrack): string {
  return track.artist.split(",")[0]?.trim().toLowerCase() ?? "";
}

/**
 * Order candidates by popularity (desc) and select up to `limit`, enforcing the
 * variety rule of at most one track per (primary) artist.
 */
export function rankCandidatesStub(
  candidates: CandidateTrack[],
  limit = TARGET_RECOMMENDATIONS,
): CandidateTrack[] {
  const sorted = [...candidates].sort((a, b) => b.popularity - a.popularity);

  const seenArtists = new Set<string>();
  const selected: CandidateTrack[] = [];

  for (const track of sorted) {
    const artist = primaryArtist(track);
    if (artist && seenArtists.has(artist)) {
      continue;
    }
    seenArtists.add(artist);
    selected.push(track);
    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}
