# Rittman Analytics Design System

A boutique data analytics consultancy that helps ambitious, data-rich businesses scale and modernise their analytics capabilities. They believe lasting data maturity is achieved by combining deep technical expertise with a commitment to enabling your team.

> **Voice:** confident, plainspoken, slightly British. Writes in **sentence case**, uses **British spellings** (modernise, behaviours, colours), and prefers **"we"** + **"you"** to "the customer".
>
> **Visual:** crisp white surfaces, near-black ink, **indigo `#4F60FF`** as the always-on accent, and a small chorus of supporting hues (lavender, mint, sky, peach) used as flat blocks of colour rather than gradients. Typography is **Beatrice** — geometric, modern, generous in size.

---

## Sources

| Source | What's in it | How it's accessed |
| --- | --- | --- |
| **`data-clarity-project`** (rittmananalytics/data-clarity-project, branch `main`) | Production marketing site — React + TypeScript + Tailwind + shadcn/ui. Source of truth for tokens, components, copy. | Private GitHub repo. Most relevant files: `src/index.css`, `tailwind.config.ts`, `src/components/Hero.tsx`, `Methodology.tsx`, `Navigation.tsx`, `Footer.tsx`, `Index.tsx`. |
| **`RA-style.fig`** | 200-frame Figma file: marketing landing flows, AI assistant UI mocks, dashboard mocks, colour studies, brand artwork. Beatrice-set, indigo-led. | Mounted as `.fig` virtual filesystem at `/Page-1`. Use `fig_read` / `fig_grep` / `fig_screenshot`. |
| **Logo set** (8 SVGs from `uploads/`) | Wordmark "rittman" + indigo dot, in 4 colourways × {transparent, square}. | Copied into [`assets/`](./assets). |

The reader of this folder may not have access to the private repo or Figma file. Everything needed to design or prototype against the brand is captured here.

---

## Products

The codebase represents **one product surface** — the **rittmananalytics.com** marketing & content site. It contains:

- **Public marketing pages** — homepage, services (Build / Modernise / Embed / Solve), case studies, partner pages (dbt Labs, Looker, Cube, Fivetran, Embeddable, Dagster), about, contact.
- **Content hub** — blog (RSS-imported + admin-authored, vector-indexed), Drill to Detail podcast (iTunes-compliant feed).
- **Lead-gen widgets** — ICP segmentation modal, diagnostic assessment, RAG chatbot, Calendly scheduler, HubSpot lead sync.
- **Embedded analytics dashboard** — Looker tiles fed from BigQuery + Segment events.
- **Admin surfaces** — blog / podcast / case-study editors with auto-tagging via GPT-4o.

The Figma file additionally explores an **"AI Assistant"** workspace concept (chat composer, source panels, dashboard fragments) — currently exploratory, not in production.

> **One UI kit** is therefore in scope: `ui_kits/website/` — a high-fidelity recreation of the marketing site shell.

---

## Index

```
.
├── README.md                       ← you are here
├── SKILL.md                        ← Claude-Code-compatible skill manifest
├── colors_and_type.css             ← all design tokens (CSS variables)
├── assets/                         ← logos
│   ├── logo-black-blue.svg                (default — wordmark + indigo dot)
│   ├── logo-white-blue.svg                (for dark surfaces)
│   ├── logo-black-on-white.svg            (square lockup, light)
│   ├── logo-white-on-black.svg            (square lockup, dark)
│   ├── logo-black.svg / logo-white.svg    (mono variants)
│   └── logo-mark-*.svg                    (square crops for avatars / favicons)
├── preview/                        ← Design System tab cards
├── slides/                         ← 16:9 deck templates (1280×720)
│   ├── slides.css                  ← shared layout system
│   ├── index.html                  ← deck navigator (preview shell)
│   ├── 01-title-internal.html      (dark cover · internal/team variant)
│   ├── 02-title-pitch.html         (dark cover · pitch deck variant)
│   ├── 03-section-divider.html     (indigo full-bleed chapter break)
│   ├── 04-agenda.html              (numbered agenda / table of contents)
│   ├── 05-intro-pillars.html       (consultancy intro · three pillars)
│   ├── 06-expertise-grid.html      (credentials + case studies + stack)
│   ├── 07-methodology-venn.html    (people / process / technology)
│   ├── 08-diagram.html             (reference architecture diagram)
│   ├── 09-two-up.html              (concept text + product illustration)
│   ├── 10-bullets.html             (three-column bulleted content)
│   ├── 11-metric.html              (big-number outcome)
│   ├── 12-orgchart.html            (org chart with reporting lines)
│   ├── 13-questions.html           (Q&A interlude)
│   └── 14-closing.html             (dark closing with contact block)
├── assets/illustrations/           ← 23 brand illustrations + 11 social cards
└── ui_kits/
    └── website/                    ← marketing-site recreation
        ├── README.md
        ├── index.html
        └── *.jsx                   ← Navigation, Hero, ChallengeCards, Methodology, CaseStudies, Footer, etc.
```

---

## Content Fundamentals

**Tone.** Direct, candid, occasionally pointed. The site doesn't sell — it diagnoses. Headlines are blunt observations, not value props. Examples lifted verbatim from the live site:

- *"Your Company Scaled. Your Data Platform Didn't."*
- *"It's Never Just a Technical Problem."*
- *"What's your Main Data Challenge?"*
- *"We Confront the Hard Truths."*

**Person.** Always **"we"** and **"you"** — never "the team" or "users" in third person. The reader is a data leader; the writer is a senior consultant sat across the table.

**Casing.** Sentence case headlines (with proper-noun caps preserved). Title Case is reserved for product names, page titles in the nav, and CTA buttons. Eyebrows are typically capitalised.

**Spelling.** **British English** throughout — *modernise, modernising, customise, colour, behaviours, organisation, programme, optimisation*. Don't switch to American spellings even in code-adjacent copy.

**Sentence shape.** Short → long → short. The hero pattern is a tight headline (6–8 words), a 25–35-word problem statement, then a 35–45-word value statement. Never starts with "Welcome" or "Discover".

**Vocabulary the brand uses.** *modern data stack, data foundation, technical debt, hands-on enablement, semantic model, ways of working, lasting transformation, ambitious, scalable, sustainable, embedded, strategic partner, diagnostic deep dive*.

**Vocabulary the brand avoids.** *cutting-edge, revolutionary, world-class, innovative, leverage, synergies, unleash, empower, journey* (as a noun), *seamlessly*, generic AI hype.

**Emoji.** **No.** No emoji in marketing copy, headers, buttons, or CTAs. (One exception: emoji are tolerated inside generated blog content and chatbot replies, never as design elements.)

**CTA pattern.** Verbs first, no exclamation marks. *Schedule a Discovery Call · Read More › · Get Started · Learn More About Our Approach.* The chevron `›` / `>` is a recurring affordance.

**Numbers & lists.** Numbered methodology steps use `1.` prefix in the heading itself (`1. Confront the Hard Truths`). Stats are big-number / one-line ("60% on average", "10+ years experience").

---

## Visual Foundations

### Colour
- **Indigo `#4F60FF`** is the brand's heartbeat. Used for the dot in the wordmark, primary buttons, the methodology medallions, focus rings, the active-tile ring, links, and the favicon's tile. Roughly one indigo accent per viewport.
- **Near-black `#181B25`** is the ink colour for all text and most outlined elements. Pure black is rare.
- **Soft tints** (`#E0E0FF` indigo, `#E6DBFF` violet, `#EBFFEB` mint, `#E7F7FE` sky, `#FFBBBE` peach) appear as **flat block fills** on illustration cards and stat tiles. They are paired with ink text — never with white text.
- **Gradients are absent** from the production site. The Figma file contains a `02-Gradients/` study but those treatments don't ship. Treat gradients as off-brand unless explicitly approved.
- Imagery is largely **product screenshots** (Looker, dbt, BigQuery panels) and **flat coloured illustrations**. There is no photographic art direction — no people, no offices.

### Type
- **Beatrice** (Light 300, Regular 400) is the brand display + body face. It's loaded from `https://ra-fonts.pages.dev/`. **Inter** is the production fallback when Beatrice fails to load. **IBM Plex Mono** for code.
- The hero h1 is `4xl–6xl` (48–60px) at `font-bold`. The lede is `xl–2xl` (20–24px) at regular weight. Body is **16px**, the small-text workhorse is **14px**.
- Tracking is mostly default; tighten only the hero (-0.02em). Eyebrows are uppercase with `0.12em` tracking.

### Spacing & Layout
- The site uses an **8-pt rhythm**. Sections breathe at `py-20` (80px). Card grids use 32px gaps. Container max is **1280px** (some marketing sections push to **1400px**).
- Layouts are unapologetically **centered**. Hero text is `text-center`. The challenge-card grid is 2×2 on desktop. Asymmetry is rare.

### Backgrounds
- Two surface tones alternate: **white** (`#FFFFFF`) and **off-white** (`#F7F7FA`). That's it. No full-bleed photography, no patterns, no textures, no noise.
- Coloured tints (peach / mint / sky / violet) appear only as **card backgrounds** within white sections, never as page backgrounds.

### Borders & Cards
- Default border: `1px solid #E1E1E9` on white surfaces.
- Default radius: **8px** (`--radius: 0.5rem`). Buttons share the same radius. Pills/chips use `999px`.
- **Card** = white fill + `1px` border + `8px` radius + the neutral lift shadow. On hover, shadow steps up to `shadow-lg`. The active/selected state adds a `2px ring` in **indigo** and a `1.05` scale.
- Colour-tinted illustration cards drop the border entirely — the colour is the boundary.

### Shadows
- Two systems coexist:
  - **Neutral lift** for cards: `0 8px 20px rgba(50,50,93,0.08)` → `0 18px 40px rgba(50,50,93,0.18)` on hover.
  - **Tinted indigo** on highlighted CTAs and dark-surface elements: `0 18px 40px rgba(205,205,255,0.25)`.
- No inset shadows. No multi-layer "neumorphic" looks.

### Buttons & Inputs
- **Primary**: indigo fill, white text, 16/24px padding, semibold, 8px radius, neutral shadow. Hover dims fill to `~90%`. No icon by default.
- **Secondary**: `#F7F7FA` fill, ink text, same metrics. Hover dims to `~80%`.
- **Ghost / link**: indigo text, `Read More ›` pattern, hovers to a slightly deeper indigo.
- **Inputs**: 1px border `#E1E1E9`, 8px radius, 12/16px padding, focus = 2px indigo ring.

### Hover & Press
- Hover on cards: shadow grows + 1.02–1.05 scale (300ms).
- Hover on buttons: opacity reduction to `/90` or `/80` of fill.
- Hover on text-links: deeper indigo + underline.
- Press: no explicit shrink/scale-down — the codebase relies on default browser active state. Don't over-engineer.

### Motion
- Easing is `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's default `ease-in-out`). No bounce, no overshoot.
- Durations are **120 / 200 / 320 / 600 ms**. Most transitions are 200–300ms.
- Two custom keyframes ship: `roll-up` and `roll-out` (used to swap the dynamic-content section under the homepage hero). They translate 20px on the Y axis with opacity 0→1.
- No parallax, no scroll-triggered reveals, no sticky animations beyond the standard sticky nav.

### Transparency & Blur
- Used **sparingly**. Dark image overlays at `rgba(0,0,0,0.2)`. Modal backdrops at the same. Beyond that, surfaces are opaque.
- Backdrop blur is not part of the production look — avoid it unless emulating an OS chrome.

### Iconography
See [Iconography](#iconography) below.

### Layout rules
- The nav is **sticky** (`top: 0; z: 50`) with a 1px bottom border.
- A 1400px wide constrained header + 1280px page container is the dominant frame.
- Footers are dense, multi-column, dark grey on white. No reverse-out.

---

## Iconography

**System.** [Lucide](https://lucide.dev) (`lucide-react@^0.462.0`) is the production icon library. The codebase imports specific icons per-component (`Search`, `Book`, `Users`, `Menu`, `X`, `ArrowRight`, etc.). They are **stroke icons at 1.5–2px** weight, sized `16px` in inline UI and `24–32px` in feature blocks.

**On dark indigo medallions** the icon is white, 32px, inside a 64px circle (`bg-[#5D6DFF] rounded-full` — see the methodology section).

**Brand glyphs / logos.** The wordmark "rittman" (with an indigo dot following the "n") is the canonical lockup. Eight variants live in `assets/`. The square logo (mark only) is used for favicons, social avatars, OG tiles.

**Partner logos.** The site embeds raster logos for ROUVY, Rixo, Pleo, Conversion Interactive, Osprey, dbt Labs, Looker, Cube, Fivetran, Embeddable, Dagster — these aren't included here; if you need them, lift them from `/lovable-uploads/` on the live site.

**Emoji.** Not used in design surfaces. Don't add them.

**Unicode characters as icons.** The chevron `›` / `>` appears in *Read More ›* CTAs. The em-dash `—` is used as a separator in the footer. That's it.

**SVGs.** Logos are SVG. Marketing illustrations on the site are PNGs hosted under `/lovable-uploads/`. The Figma file contains many one-off illustrations and isometric scenes; those should be **copied with `fig_copy_files`**, never redrawn by hand.

**Brand illustration library.** A curated set lives in `assets/illustrations/`. Reuse these for slides, blog headers, and landing pages instead of generating new ones. Browse them in the `Illustration library` card on the Design System tab.

- **Architecture / product mocks** — `data-architecture-overview-{v1,v2}.png` (the canonical RA reference architecture: extract → manage/store → present), `ai-assistant-hero[-with-chat].png`, `looker-engagement-hero.png`, `conversational-analytics-timeline.png`, `google-next-2026-cover.png`, `warehouse-layers-diagram.svg` (modern data stack layer breakdown).
- **Data viz / charts** — `credit-card-offer-funnel.png`, `conversion-bars.png`, `attribution-conversion-cycle.png`, `icp-segmentation-table.png`, `marketing-funnel.svg`, `conversion-gauge.svg`, `people-process-technology.svg` (the three-circle Venn from the methodology page).
- **Agentic prompt cards** — `dashboard-spec-prompt.png`, `lookml-prompt.png`, `dbt-prompt.png`, `voice-narration-prompt[-alt].png` (lavender prompt bubble + sparkle icon over a real product fragment).
- **Partner cards** — `google-cloud-partner-card.svg`, `partner-logos-{wide,tall}.svg` (drop-in tiles for the partner section).
- **Social / campaign cards** (`assets/illustrations/social/`, square 1:1, logo + footer baked in — drop straight into LinkedIn, blog OG tags, deck splash slides):
  - Headlines — `headline-spreadsheets-arent.png`, `headline-data-platform-didnt.png`
  - Methodology — `methodology-three-step[-cta].png`
  - Challenges grid — `challenges-firefighting-truth-bi.png`
  - Lead-magnet — `diagnose-data-gaps-roadmap.png`
  - Customer quotes — `quote-rouvy[-alt][-cta].png`, `quote-pleo[-cta].png`

**For agents working in this kit:** when you need an icon, **use Lucide** (load via `https://unpkg.com/lucide@latest` or `lucide-react`). If a CDN icon doesn't fit, drop in a placeholder rect with the asset's intended dimensions and flag the substitution.

---

## Brand pillars (one-liners worth keeping)

1. **Confront the Hard Truths** — diagnostic-first.
2. **Create the Change** — modern, sustainable data foundation.
3. **Manage the Change** — embedded enablement, lasting transformation.

These three appear repeatedly across pages, in slides, in case-study templates, and in the methodology section. Reuse them.

---

## Using the kit (quickstart)

```html
<link rel="stylesheet" href="colors_and_type.css">
<body class="ra">
  <h1>Your Company Scaled. Your Data Platform Didn't.</h1>
  <p class="lede">You've built a successful business…</p>
  <a href="#" style="background:var(--ra-indigo);color:#fff;padding:16px 28px;border-radius:8px;font-family:var(--ra-font-ui);font-weight:600">Schedule a Discovery Call</a>
</body>
```

For a production-fidelity recreation, lift JSX directly from `ui_kits/website/`.

## Caveats

- **Beatrice fonts** ship locally under `fonts/` (`Beatrice-Light` + `Beatrice-Regular`, in woff2/woff/ttf/otf). Designs in this kit are now offline-safe.
- **Lato** and **IBM Plex Mono** appear in the Figma file (image overlays, code blocks) but are not used by the live website. Treat them as deck-only.
- **Marketing illustrations** (the four challenge tiles, partner logos, case-study hero images) are hosted on the live site under `/lovable-uploads/`. They aren't included here. UI-kit recreations use **placeholder coloured tiles** that match the brand palette.
- **Photography direction** is undefined — the brand currently doesn't use photography. If a project needs it, ask the user for art direction.

