/**
 * Server-side ranking post-processing (Phase 08).
 *
 * Reconciles Groq ranking output against the Spotify candidate pool, enforces
 * set-level variety, and composes final Recommendation objects. The AI curates
 * the set; the backend validates trackIds and applies defensive variety rules.
 */

import {
  TARGET_RECOMMENDATIONS,
  type CandidateTrack,
  type RankedTrack,
  type RankingResult,
  type Recommendation,
} from '@/types';
import { clampScore } from '@/lib/utils';

function primaryArtist(track: CandidateTrack): string {
  return track.artist.split(',')[0]?.trim().toLowerCase() ?? '';
}

/** Collapse internal whitespace and trim leading/trailing space. */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Count non-empty sentences (rough heuristic for ≤3-sentence limits). */
export function countSentences(text: string): number {
  return splitSentences(text).length;
}

function splitSentences(text: string): string[] {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return [];
  }

  const sentences: string[] = [];
  const regex = /[^.!?]*[.!?]+/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regex.exec(normalized)) !== null) {
    const sentence = match[0].trim();
    if (sentence) {
      sentences.push(sentence);
    }
    lastIndex = regex.lastIndex;
  }

  const remainder = normalized.slice(lastIndex).trim();
  if (remainder) {
    sentences.push(remainder);
  }

  return sentences.length > 0 ? sentences : [normalized];
}

/** Truncate explanation to the first N sentences; normalize whitespace. */
export function normalizeExplanation(text: string, maxSentences = 3): string {
  const sentences = splitSentences(text);
  return sentences.slice(0, maxSentences).join(' ');
}

/**
 * Reconcile AI ranking output against the candidate pool: discard unknown
 * trackIds, clamp scores, and enforce one track per primary artist.
 */
export function reconcileRanking(
  ranking: RankingResult,
  candidatePool: CandidateTrack[],
  limit = TARGET_RECOMMENDATIONS,
): RankedTrack[] {
  const poolById = new Map(candidatePool.map((track) => [track.trackId, track]));
  const seenArtists = new Set<string>();
  const selected: RankedTrack[] = [];

  for (const item of ranking.recommendations) {
    const candidate = poolById.get(item.trackId);
    if (!candidate) {
      continue;
    }

    const artist = primaryArtist(candidate);
    if (artist && seenArtists.has(artist)) {
      continue;
    }
    seenArtists.add(artist);

    selected.push({
      trackId: item.trackId,
      score: clampScore(item.score),
      explanation: normalizeExplanation(item.explanation),
    });

    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

/** Merge reconciled ranking output with Spotify metadata into Recommendation cards. */
export function composeRecommendations(
  ranked: RankedTrack[],
  candidatePool: CandidateTrack[],
): Recommendation[] {
  const poolById = new Map(candidatePool.map((track) => [track.trackId, track]));

  return ranked.flatMap((item) => {
    const candidate = poolById.get(item.trackId);
    if (!candidate) {
      return [];
    }
    return [
      {
        trackId: candidate.trackId,
        title: candidate.title,
        artist: candidate.artist,
        albumArt: candidate.albumArt,
        previewUrl: candidate.previewUrl,
        spotifyUrl: candidate.spotifyUrl,
        discoveryScore: item.score,
        explanation: item.explanation,
      },
    ];
  });
}
