# Battlesword — Design Specification

Visual reference: **Baldur's Gate 3** official site (https://baldursgate3.game/). This document
captures the design language (colors, typography, layout, components) as reusable tokens and
component conventions for the Angular SPA.

## 1. Design principles

- **Dark, cinematic**: near-black background with warm gold/bronze accents, high contrast.
- **Ornate fantasy**: decorative corner cuts, ornamental dividers, and filigree framing on key
  elements (buttons, frames, section headers) — never plain rectangles.
- **Fluid typography**: all display and body sizes scale continuously between 970px and 1920px
  viewport using `clamp()`.
- **Uppercase display type**: headings and overlines are set in small/regular caps.

## 2. Color palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-ink` | `#ffffff` | Primary text / headings |
| `--color-ink-muted` | `hsl(0 0% 100% / 0.65)` | Body copy (`p`) |
| `--color-gold` | `#fbcea0` | Accent, `h4`, overlines, links (hover), gradient text |
| `--color-bronze` | `#c19976` | Links, list underlines |
| `--color-bronze-soft` | `#b99b77` | Button border |
| `--color-bronze-deep` | `#b78f6d` | Deco-line end, scrollbar thumb |
| `--color-bronze-dark` | `#6d523b` | List underline end, hover glow |
| `--color-parchment` | `#ddc9a7` | Deco-line start, scrollbar thumb |
| `--color-parchment-light` | `#e0ccb1` | Deco-line gradient start |
| `--color-success` / `-bright` | `#008951` / `#00c071` | Frame & toast success state |
| `--color-info` / `-bright` | `#c8aa34` / `#ffe270` | Frame & toast info state |
| `--color-danger` / `-bright` | `#b51111` / `#cf3939` | Frame & toast error state |

**Gradient text** (`.text-gradient` / `--decor` accents):
`linear-gradient(135deg, #fff, #fbcea0 66%, #fbcfa0)` with `background-clip: text`.

## 3. Typography

| Role | Family | Size | Notes |
|------|--------|------|-------|
| H1 | QuadraatOffcPro Demibold | `clamp(48px, 3rem + 12·(100vw−970px)/950, 60px)` | weight 400 |
| H2 | QuadraatOffcPro Demibold | `clamp(38px, 2.375rem + 10·(100vw−970px)/950, 48px)` | uppercase |
| H3 | QuadraatOffcPro Demibold | `clamp(28px, 1.75rem + 6·(100vw−970px)/950, 34px)` | uppercase |
| H4 | QuadraatOffcPro Regular | `clamp(24px, 1.5rem + 4·(100vw−970px)/950, 28px)` | gold, not uppercase |
| Overline (`.deco-label`) | QuadraatOffcPro Demibold | `13px`, `letter-spacing: 3px` | gold, uppercase |
| Body (`p`) | Gothic A1 | `clamp(14px, .875rem + 2·(100vw−970px)/950, 16px)` | `hsl(0 0% 100% / .65)`, line-height 1.4 |
| Base body | QuadraatOffcPro Regular | `clamp(16px, 1rem + 2·(100vw−970px)/950, 18px)` | line-height 1.4 |

All headings: `font-weight: 400`, `line-height: 1.1`.

**Font licensing**: `QuadraatOffcPro` and `Gilam` are proprietary and self-hosted by the reference
site; they must be licensed and self-hosted before production. `Gothic A1` is on Google Fonts
(weight 400/600). Until then, the token stacks degrade gracefully to `Georgia, serif` (display) and
`system-ui` (sans).

## 4. Layout

- Centered container, widths: **970px** (base) → **1170px** (≥1170px) → **1410px** (≥1612px).
- Mobile padding: `0 8vw`.
- Section shadows: `linear-gradient(0deg, #000, transparent)` bottom / `linear-gradient(180deg, ...)` top.
- Two-column prose uses CSS columns (`column-count: 2`, gap `5.99vw`).
- Custom scrollbars: gold gradient thumb (`linear-gradient(179deg, #ddc9a7 7%, #b78f6d)`), 5px.

## 5. Components

### Button (`app-button`)
Ornate CTA with chamfered corners and top/bottom center notches (clipped, gold border), blurred
dark backdrop, uppercase label. Variants:
- `default` — 47px tall, min-width 200px, white label; hover fades in a warm texture/glow.
- `large` — 66px tall, gradient-text label; hover inverts label to dark over a filled gold texture.

### Heading (`app-heading`)
Semantic `h1`–`h4` renderer with fluid sizing, uppercase, optional `text-gradient`.

### DecoLine (`app-deco-line`)
190px ornamental divider: 1px gradient bar (`#e0ccb1 → #b78f6d`) with arrow/filigree end caps.

### Frame (`app-frame`)
Decorative cornered border frame with filigree corner ornaments. Variants: `default`, `success`,
`info`, `error` (recolor corners/edges per palette).

### Supporting patterns (from reference, for later)
- **Toast**: blurred `rgba(0,0,0,.5)` panel, radial state glow, masked rounded corners.
- **Loader**: 100px ring spinner, `#ffc589` accent.
- **List**: gold bullet icon, gradient underline (`#c19976 → #6d523b`), radial hover glow.
- **Container / two-column / section-shadow** utilities.

## 6. Implementation notes

- Tokens live in `src/styles.css` as Tailwind v4 `@theme` variables → utilities (`text-h2`, `bg-bg`,
  `text-gold`, `font-display`, etc.).
- Component selectors use the `app` prefix; classes drop the `Component` suffix per Angular 22
  convention (`Button`, `Heading`, `DecoLine`, `Frame`).
- Interactive behavior is out of scope; components are presentational (inputs in, content projected).
