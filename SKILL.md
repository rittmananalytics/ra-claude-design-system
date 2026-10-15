---
name: rittman-analytics-design
description: Use this skill to generate well-branded interfaces, slide decks and assets for Rittman Analytics — a boutique data analytics consultancy — for production work or throwaway prototypes, mocks, slides and marketing pages. Contains tokens, fonts, logos, icons, illustrations, team headshots, slide templates and a website UI kit.
user-invocable: true
---

Read `README.md` first for tone, visual foundations and component conventions, then use the files below.

## What's here
- `colors_and_type.css` — all design tokens (colour, type, spacing, radii, shadows, motion) + @font-face for Google Sans and Beatrice (files in `fonts/`).
- `assets/` — logos (8 colourways), `icons/` (Lucide glyphs on an indigo circle, SVG), `illustrations/` (product mocks, diagrams, partner cards, `social/` 1:1 cards), `team/` (headshots — show as circle-masked photos), `template/` (Google Cloud Partner badge, pitch title backgrounds).
- `slides/` — 1280×720 deck templates sharing `slides/slides.css`: title (internal + pitch), section divider, agenda, intro pillars, expertise grid, methodology venn, diagram, two-up, bullets, big metric, org chart, Q&A, closing, team intros. `slides/index.html` steps through them.
- `ui_kits/website/` — JSX recreation of rittmananalytics.com (nav, hero, challenge cards, methodology, case studies, footer).
- `preview/` — specimen cards for tokens, type, icons, illustrations, headshots.

## Hard rules
- **Two type systems.** Decks/slides use **Google Sans** (`--ra-font-deck-*` tokens). Website, marketing and app UI use **Beatrice** (`--ra-font-display/body/ui`). IBM Plex Mono for code.
- **Indigo `#4F60FF`** is the one loud colour — about one accent per view. Section dividers + Q&A use deep blue `#2F3997`; internal title uses navy `#1F2433`.
- Content slides: white background, RA logo top-left, 4-part contact footer bottom. Pitch titles use a client-specific photo background with a dark overlay.
- White and `#F7F7FA` are the only page backgrounds. No gradients. No emoji.
- British English, sentence-case headlines, "we" and "you".
- Icons: use the existing set in `assets/icons/`; for new ones wrap a Lucide glyph in the same indigo circle (see `preview/icon-library.html` generator). Don't hand-draw illustrations — reuse `assets/illustrations/`.

If invoked without guidance, ask what to build and 3–5 questions about audience, format and constraints, then produce HTML artifacts or production code.
