# Website UI Kit

A React/JSX recreation of the rittmananalytics.com marketing-site shell. Components are hosted in this folder, composed in `index.html`, and styled by `website.css` + the root-level `colors_and_type.css`.

## Components

| File | What it renders | Source |
| --- | --- | --- |
| `Navigation.jsx` | Sticky top nav: logo, dropdown menu, sign-in + CTA. | `src/components/Navigation.tsx` + `navigation/*` |
| `Hero.jsx` | Centered hero with headline, lede, supporting paragraph, primary CTA, partner logo strip. | `src/components/Hero.tsx` |
| `ChallengeCards.jsx` | 2×2 "What's your main data challenge?" grid with selectable cards (indigo ring on active). | `src/pages/Index.tsx` |
| `Methodology.jsx` | 3-up indigo-medallion methodology section (`Confront / Create / Manage`). | `src/components/Methodology.tsx` |
| `CaseStudies.jsx` | 3 metric-led case-study cards (tinted media + body + link). | Marketing site `CaseStudies` patterns |
| `Footer.jsx` | Final CTA on dark ink + dense multi-column footer + base meta line. | `src/components/Footer.tsx` |

## Cosmetic shortcuts taken

- The four challenge tile illustrations are stand-in tinted blocks with a single brand glyph. The real site uses bespoke PNGs from `/lovable-uploads/`.
- Partner logos (ROUVY, Pleo, Rixo…) are wordmarks rather than the actual greyscale logos — those aren't included in the upload.
- Icons in the methodology medallions are inline SVGs that mimic Lucide's `Search` / `BookOpen` / `Users`. Swap to `lucide-react` in production.
- Selection-on-click in `ChallengeCards` is fake — no modal, no analytics, no service-content swap.

## Anchor patterns to reuse

- The **64×64 indigo medallion** for step icons.
- The **eyebrow → h2 → lede** stack for every section header.
- The **2×2 grid** for service / challenge / persona pickers.
- The **dark final-CTA + light footer** sandwich is the standard page tail.
