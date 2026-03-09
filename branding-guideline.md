# Civic Northstar — Branding Guidelines

> Canonical visual identity reference for the Civic Northstar Municipal Budget Benchmarking Dashboard.
> Source of truth: `src/styles/global.css` `@theme` block + component files.

---

## 1. Brand Identity

| Field      | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Name       | **Civic Northstar**                                          |
| Short name | **CivicNS**                                                  |
| Tagline    | Municipal budget benchmarking for Canadian local governments  |
| Domain     | `https://www.civicnorthstar.ca`                              |
| Language   | en-CA, LTR                                                   |

---

## 2. Color Palette

### Core tokens (`@theme` in global.css)

| Token              | CSS variable             | Hex / value                |
| ------------------ | ------------------------ | -------------------------- |
| Primary (navy)     | `--color-primary`        | `#1A5276`                  |
| Secondary (blue)   | `--color-secondary`      | `#2E86C1`                  |
| Body text          | `--color-body`           | `#2C3E50`                  |
| Muted text         | `--color-muted`          | `#5D6D7E`                  |
| Surface background | `--color-surface`        | `#FAFBFC`                  |
| Card background    | `--color-card`           | `#FFFFFF`                  |
| Border             | `--color-border`         | `#E5E7EB`                  |

### Header gradient

| Token      | CSS variable           | Hex        |
| ---------- | ---------------------- | ---------- |
| From       | `--color-header-from`  | `#0D2D42`  |
| Mid        | `--color-header-mid`   | `#0F3652`  |
| To         | `--color-header-to`    | `#1E6FA8`  |

Usage: `background: linear-gradient(to bottom right, var(--color-header-from), var(--color-header-mid), var(--color-header-to));`
Utility class: `.page-header-bg`

### Traffic lights (KPI health)

| State  | CSS variable         | Hex        | Percentile threshold |
| ------ | -------------------- | ---------- | -------------------- |
| Green  | `--color-tl-green`   | `#27AE60`  | ≥ 0.60               |
| Yellow | `--color-tl-yellow`  | `#F39C12`  | ≥ 0.30               |
| Red    | `--color-tl-red`     | `#E74C3C`  | < 0.30               |

### Navigation (frosted glass)

| Property   | Value                                    |
| ---------- | ---------------------------------------- |
| Background | `rgba(17, 50, 73, 0.85)`                |
| Backdrop   | `blur(20px) saturate(180%)`              |

### Chart palettes

**BC Tax Base Composition:**

| Group         | Hex        |
| ------------- | ---------- |
| Residential   | `#2E86C1`  |
| Commercial    | `#E67E22`  |
| Industrial    | `#E74C3C`  |
| Utilities     | `#9B59B6`  |
| Farm/Natural  | `#27AE60`  |

**AB Tax Base Composition:**

| Group                    | Hex        |
| ------------------------ | ---------- |
| Residential              | `#2E86C1`  |
| Commercial & Industrial  | `#E74C3C`  |
| Machinery & Equipment    | `#8E44AD`  |
| Farm/Natural             | `#27AE60`  |

### Tier 2 (Community Context) cards

| Property   | Value      |
| ---------- | ---------- |
| Background | `#F8F9FA`  |

No traffic lights on Tier 2 cards.

---

## 3. Typography

| Property       | Value                                             |
| -------------- | ------------------------------------------------- |
| Font family    | `Inter`, `system-ui`, `-apple-system`, `sans-serif` |
| CSS variable   | `--font-sans`                                     |
| Weights        | 400 (regular), 700 (bold)                         |
| Loading        | `font-display: optional` (self-hosted woff2)      |
| Files          | `/fonts/inter-v20-latin-regular.woff2`, `/fonts/inter-v20-latin-700.woff2` |
| Rendering      | `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale` |

---

## 4. Design Tokens

### Radii

| Token        | CSS variable     | Value  |
| ------------ | ---------------- | ------ |
| Card radius  | `--radius-card`  | `6px`  |
| Large radius | `--radius-lg`    | `6px`  |

### Shadows

| Token     | CSS variable        | Value                                                        |
| --------- | ------------------- | ------------------------------------------------------------ |
| Card      | `--shadow-card`     | `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`  |
| Elevated  | `--shadow-elevated` | `0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)`  |

---

## 5. Component Patterns

### Card (`.card`)

```css
background-color: var(--color-card);      /* #FFFFFF */
border-radius: var(--radius-card);        /* 6px */
padding: 1.25rem;
box-shadow: var(--shadow-card);
```

### Eyebrow label (`.eyebrow`)

```css
display: inline-block;
font-size: 0.75rem;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
color: var(--color-secondary);            /* #2E86C1 */
margin-bottom: 0.75rem;
```

### Frosted glass nav (`nav.frosted`)

```css
background: rgba(17, 50, 73, 0.85);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
```

### Hero dot-grid (`.hero-dot-grid`)

```css
background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
background-size: 20px 20px;
```

---

## 6. Animations & Effects

### fadeUp (`@keyframes fadeUp`)

Used on context cards (`.context-card.visible`). Slides up 12px with opacity fade over 0.5s ease-out.

### Section animate (`.section-animate`)

Slides up 20px with opacity fade over 0.6s ease-out. Triggered by adding `.in-view` class (Intersection Observer).

### Shimmer line (`.hero-shimmer-line`)

A 2px-high gradient sweep across the bottom edge of the hero section. Cycles every 3.5s. Gradient colors: transparent → `rgba(46,134,193,0.6)` → `rgba(255,255,255,0.9)` → `rgba(46,134,193,0.6)` → transparent.

---

## 7. Logo & Assets

| Asset             | Path                                  | Dimensions     |
| ----------------- | ------------------------------------- | -------------- |
| Favicon (SVG)     | `public/favicon.svg`                  | Scalable       |
| Apple touch icon  | `public/apple-touch-icon.png`         | 180×180        |
| App icon          | `public/icons/icon-192.png`           | 192×192        |
| App icon (large)  | `public/icons/icon-512.png`           | 512×512        |
| Maskable icon     | `public/icons/icon-512-maskable.png`  | 512×512        |
| OG default image  | `public/og-default.svg`               | Scalable       |

Icons generated by `scripts/generate-icons.mjs` using `sharp`.

---

## 8. Print Styles

Defined in `src/styles/print.css`. Key overrides:

- **Hidden elements**: nav, footer, `.no-print`, `.search-bar-wrapper`
- **Body**: white background, black text, 11pt font
- **Cards**: 1px solid `#CCC` border, no shadow, `break-inside: avoid`
- **Report card grid**: 3-column grid, 8px gap
- **Chart section**: `break-before: page`
- **Peer table**: `break-before: page`, 9pt font
- **Page margins**: 1.5cm
- **Print footer**: 8pt, `#999` text, fixed bottom, 1px `#EEE` top border

---

## 9. PWA

| Property         | Value           |
| ---------------- | --------------- |
| Theme color      | `#1A5276`       |
| Background color | `#1A5276`       |
| Display          | `standalone`    |
| Display override | `window-controls-overlay`, `standalone`, `minimal-ui` |
| Orientation      | `portrait-primary` |
| PWA ID           | `civic-northstar-pwa` |

Bottom nav height: `calc(49px + env(safe-area-inset-bottom))` — accounts for iOS safe area.
