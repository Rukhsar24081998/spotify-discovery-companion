# Phase 03 — Design System

**Reference docs:** `ui-guidelines.md` (Design Philosophy, Visual Style, Typography, Layout, Screen 1, Selection Components, Motion, Accessibility), `implementation-plan.md` (Step 1), `cursor-rules.md` (UI Principles, Tailwind Rules, Component Rules).

---

## Objective

Establish the reusable visual language and primitives, then prove them by building the unchanged-feeling Spotify Home (Screen 1) with the single Discovery Companion card — the first visible screen.

## Scope

- In: theme tokens, typography scale, layout container, reusable primitives (pill button, card shell, headings, icon button), Spotify Home screen, `DiscoveryCard`.
- Out: the discovery input flow (Phase 04), recommendations (Phase 09).

## Deliverables

- A documented, reusable set of UI primitives styled per `ui-guidelines.md`.
- A rendered Spotify Home page with the Discovery card that navigates into the flow.

## Files to create or modify

- `styles/globals.css` / `tailwind.config.ts` — finalize theme tokens + typography scale.
- `app/page.tsx` — Spotify Home layout.
- `components/DiscoveryCard.tsx`
- `components/ui/` primitives (e.g. `PillButton`, `CardShell`, `Heading`) — small, reusable, ≤ 300 lines each.

## Components involved

- `DiscoveryCard` + shared UI primitives.

## Backend work

- None.

## APIs

- None.

## AI integrations

- None.

## Dependencies

- Phases 01–02. `lucide-react` for icons.

## Implementation notes

- Dark mode only: near-black background, dark-gray cards, Spotify-green accent; avoid bright gradients (`ui-guidelines.md` → Visual Style).
- Typography hierarchy: large heading, medium section titles, small supporting text; clean sans-serif.
- Layout: max content width ~900px, generous spacing, one primary action per screen.
- `DiscoveryCard` copy and feel per `implementation-plan.md` Step 1 / `ui-guidelines.md` Screen 1 — a "promoted Spotify feature," not an ad.
- Build pill buttons here (used by Mood/Activity in Phase 04): clearly selectable, strong selected state, subtle hover, keyboard accessible.
- Motion: subtle fades and hover elevation only; respect reduced-motion.

## Edge cases

- Small viewports: card and Home remain single-column and legible.
- High-contrast/focus states present on all interactive primitives.

## Testing checklist

- [ ] Home renders with the documented dark theme and spacing.
- [ ] `DiscoveryCard` matches documented copy and styling.
- [ ] "Discover" navigates to `/discover`.
- [ ] Primitives are reusable and prop-driven (no duplication).
- [ ] Keyboard focus visible; semantic HTML; alt text pattern established for imagery.
- [ ] Responsive at desktop/tablet/mobile.

## Definition of Done

The Spotify Home screen renders with the Discovery card, navigation into the flow works, and a reusable, accessible primitive set exists for all later UI phases.

## Risks

- **Low–Medium.** Risk is primitives that don't generalize to later screens — mitigated by designing pill/card primitives against the known Phase 04/09 needs.
