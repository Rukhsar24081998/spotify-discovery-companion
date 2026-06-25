# UI Guidelines

# Spotify Discovery Companion

## Design Philosophy

The Discovery Companion should feel like a **native Spotify feature**, not a separate application.

Users should immediately recognize the interface as part of Spotify while also understanding that they are interacting with an AI-powered discovery experience.

The design should prioritize:

* Simplicity
* Clarity
* Confidence
* Minimal user effort

AI should feel helpful rather than overwhelming.

---

# Design Principles

## Preserve Spotify

Do not redesign Spotify.

The Home screen remains unchanged except for a single Discovery Companion card.

Navigation, layout, and interactions should feel familiar to existing Spotify users.

---

## Keep AI Optional

Discovery Companion should never interrupt the normal Spotify experience.

Only users who tap **"Discover"** enter the AI flow.

---

## Minimize Cognitive Load

The interface should ask only for information that improves recommendations.

Required:

* Mood
* Activity

Optional:

* Artists you already love

No additional questions.

---

## Explain, Don't Surprise

Every recommendation must include a concise explanation.

Users should understand **why** a song is being recommended.

---

## Preview Before Commitment

Allow users to validate recommendations using a **30-second preview**.

The preview is a supporting interaction, not the primary feature.

Primary action remains:

> Continue in Spotify

---

# Visual Style

## Theme

Dark Mode only.

Inspired by Spotify.

Background:

Near black.

Cards:

Dark gray.

Accent:

Spotify green.

Avoid bright gradients.

---

## Typography

Use a clean sans-serif font.

Hierarchy:

Large heading

Medium section titles

Small supporting text

AI explanations should never exceed three lines.

---

## Layout

Maximum content width:

Approximately 900px on desktop.

Generous spacing.

Avoid crowded interfaces.

Every screen should focus on one primary action.

---

# Screen Guidelines

## Screen 1 — Spotify Home

Keep existing Spotify UI.

Add one optional card.

Example:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Discovery Companion

Feeling stuck in a loop?

Discover something new

[ Discover ]

━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The card should feel like a promoted Spotify feature rather than an advertisement.

---

## Screen 2 — Discovery Companion

Structure:

Heading

↓

Mood

↓

Activity

↓

Optional Artist Search

↓

Primary CTA

Example layout:

```text
Let's find something you'll love.

How are you feeling?

Happy
Calm
Focused
Energetic
Nostalgic

--------------------------------

What are you doing?

Workout
Studying
Working
Driving
Relaxing

--------------------------------

Artists you already love (Optional)

Search...

--------------------------------

Discover Music
```

---

# Selection Components

Mood and Activity should use rounded pill buttons.

Requirements:

* Clearly selectable
* Single selection only
* Strong selected state
* Keyboard accessible

Hover effects should be subtle.

---

# Artist Search

Autocomplete input.

Suggested artists appear while typing.

Multiple artists allowed.

Maximum:

Three artists.

The field is optional.

---

# AI Processing Screen

Do not use a spinning loader.

Instead, communicate reasoning.

Example:

```text
AI Discovery Companion

Understanding your mood

✓

Understanding your activity

✓

Building a discovery strategy

✓

Searching Spotify

✓

Ranking recommendations

...
```

This creates trust in the AI process.

---

# Recommendation Cards

Each recommendation is displayed inside an individual card.

Each card contains:

Album Artwork

↓

Song Title

↓

Artist

↓

Discovery Match

↓

AI Explanation

↓

Preview (30 sec)

↓

Actions

Example:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Album Artwork

Blinding Lights

The Weeknd

⭐ 94% Discovery Match

This track matches your workout
energy while introducing an artist
outside your usual listening habits.

▶ Preview (30 sec)

❤️ Save

🎵 Continue in Spotify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# Discovery Match

Display a confidence score.

Example:

```text
⭐ 92% Discovery Match
```

Purpose:

Provide users with confidence while remaining lightweight.

Avoid excessive technical explanations.

---

# AI Explanation

Keep explanations:

* Short
* Human
* Positive

Good example:

> Matches your workout energy while introducing an artist outside your regular listening habits.

Bad example:

> Similarity score generated using collaborative filtering and embeddings.

Never expose technical AI terminology to users.

---

# Preview Player

The player should appear directly inside the recommendation card.

Display:

```text
▶ Preview (30 sec)

────────────●────────

0:12 / 0:30
```

After playback finishes:

```text
Preview finished

Continue listening in Spotify
```

Users should always understand that they listened to a preview rather than the complete song.

## Preview Unavailable

Many Spotify tracks have no `preview_url`. When a preview is missing, **hide the player** for that card and show:

```text
Preview unavailable

🎵 Continue in Spotify
```

The "Continue in Spotify" action always remains available. Never disable a recommendation solely because it lacks a preview.

---

# Edge & Empty States

The interface must degrade gracefully and never show a crash or a raw error.

## Limited Results (1–2 recommendations)

When fewer than 3 recommendations are available (after fallback), show the available cards plus a calm notice:

```text
We found a few matches for now.

Try adjusting your mood or activity for more.
```

## No Results

When zero recommendations are available:

```text
We couldn't find a great match right now.

[ Adjust mood & activity ]   [ Try again ]
```

## Service Errors (Spotify or AI unavailable)

```text
Something went wrong while discovering music.

Please try again in a moment.

[ Try again ]
```

Error copy is friendly and never exposes technical details or stack traces.

---

# Action Buttons

Primary:

🎵 Continue in Spotify

Secondary:

❤️ Save

Tertiary:

👎 Skip

Visual hierarchy should reflect this order.

---

# Feedback Dialog

Only display after multiple skipped recommendations.

Example:

```text
Help us improve.

Why wasn't this a good fit?

○ Too energetic

○ Wrong mood

○ Didn't like vocals

○ Already know this artist

Update Recommendations
```

The interaction should feel optional rather than mandatory.

---

# Motion

Use subtle animations only.

Recommended:

* Fade transitions
* Card hover elevation
* Progress indicators
* Smooth button interactions

Avoid:

* Large page transitions
* Excessive bouncing
* Flashing animations

---

# Responsiveness

Desktop:

Primary target.

Tablet:

Fully supported.

Mobile:

Single-column layout.

Recommendation cards stack vertically.

Touch targets should remain accessible.

---

# Accessibility

Maintain high contrast.

Keyboard navigation should work throughout.

Buttons should include focus states.

Use semantic HTML.

Provide alt text for album artwork.

---

# UI Success Criteria

The interface should make users feel:

* The experience belongs inside Spotify.
* AI understands their current situation.
* Recommendations are transparent.
* Trying unfamiliar music feels safe.
* The overall interaction is simple, fast, and trustworthy.

Users should never feel like they are using a separate AI application—they should feel like Spotify has become smarter at helping them discover music.
