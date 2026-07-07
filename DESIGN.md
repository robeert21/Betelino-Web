---
name: Betelino
description: Digital companion for the Betelino Christian summer camp
colors:
  warm-cream: "#FAF5EC"
  soft-linen: "#F1E9DA"
  border-sand: "#E3D9C4"
  ink-umber: "#2E2A22"
  ink-umber-soft: "#5B5346"
  sage-trust: "#6F8358"
  sage-deep: "#576848"
  amber-glow: "#E0A73D"
  amber-deep: "#C48A24"
  signal-red: "#B65440"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.04em"
  numeric:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 600
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "14px"
  lg: "22px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.sage-trust}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.sage-deep}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-secondary:
    backgroundColor: "{colors.amber-glow}"
    textColor: "{colors.ink-umber}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-secondary-hover:
    backgroundColor: "{colors.amber-deep}"
    textColor: "{colors.ink-umber}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-ghost:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.ink-umber}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  nav-link:
    textColor: "{colors.ink-umber-soft}"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.sage-deep}"
    typography: "{typography.label}"
---

# Design System: Betelino

## 1. Overview

**Creative North Star: "Golden Hour at Camp"**

Betelino should feel like the hour before dinner at a summer camp in the hills: warm light on cream-colored buildings, sage-green shutters, everyone gathered by team. The palette is luminous and sun-warmed rather than clinical; typography carries an editorial, hand-picked quality rather than a dashboard's mechanical grid. Nothing here should read as a SaaS product pretending to be a camp. It reads as a camp that happens to have a very well-made website.

This system explicitly rejects: neon blues, pure black/dark themes, generic SaaS hero-metric blocks, gradient text, glassmorphism, and identical icon-card grids. It also rejects busyness for its own sake, every screen has one job, stated plainly.

**Key Characteristics:**
- Warm cream and linen surfaces, never stark white or black
- One trust color (sage) for structure and action, one warmth color (amber) for delight and reward
- Editorial serif display type paired with a clean, highly legible sans body
- Flat, sunlit surfaces; depth from tone and spacing, not shadows
- Numbers (points, stock) always in tabular figures so they don't jitter

## 2. Colors

The palette reads as sun-bleached linen with two living accents: sage for trust and structure, amber for warmth and reward.

### Primary
- **Sage Trust** (`#6F8358`): primary actions, active nav state, team-points emphasis, the color of "you belong here."

### Secondary
- **Amber Glow** (`#E0A73D`): reward and delight, hover moments, the shop's "Solicită obiect" secondary emphasis, badges for individual points.

### Neutral
- **Warm Cream** (`#FAF5EC`): base page background.
- **Soft Linen** (`#F1E9DA`): section backgrounds, subtle surface separation (never a bordered card-on-card).
- **Border Sand** (`#E3D9C4`): hairline dividers and input borders only.
- **Ink Umber** (`#2E2A22`): primary text.
- **Ink Umber Soft** (`#5B5346`): secondary text, captions, nav labels at rest.

### Tertiary
- **Signal Red** (`#B65440`): out-of-stock states, form errors. Never used decoratively.

### Named Rules
**The One Accent at a Time Rule.** Sage and amber are never both the loudest thing on the same screen. Sage leads on structural/account screens (dashboard, nav); amber leads on reward moments (shop CTA hover, points badges). Pick one lead per screen.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A warm editorial serif for moments that should feel human and welcoming (hero, section titles) paired with a crisp, highly legible sans for everything a camper needs to read quickly on a shared tablet in daylight.

### Hierarchy
- **Display** (500, clamp(2.25rem, 5vw, 3.75rem), 1.05): Hero headline on the landing page only.
- **Headline** (500, clamp(1.5rem, 3vw, 2.25rem), 1.15): Page titles for each route (Regulamente, Magazin, Contul meu).
- **Title** (600, 1.25rem, 1.3): Card/section titles, shop item names, rule names.
- **Body** (400, 1rem, 1.6): Running text, rule descriptions. Capped at 70ch.
- **Label** (600, 0.8125rem, uppercase-tracked 0.04em): Nav links, field labels, status tags.

### Named Rules
**The Tabular Numbers Rule.** Any score, point total, price, or stock count is rendered with `font-variant-numeric: tabular-nums`. Numbers that update must not reflow their neighbors.

## 4. Elevation

Betelino is flat by design, depth comes from tonal layering (cream vs. linen) and generous spacing, not shadows. This matches the "golden hour" mood: soft daylight has no hard shadow edges. The one exception is a very soft ambient shadow used under the sticky navigation bar to separate it from scrolled content.

### Shadow Vocabulary
- **Nav Ambient** (`box-shadow: 0 1px 0 0 #E3D9C4`): a hairline, not a shadow, under the persistent navigation bar.

### Named Rules
**The Flat Daylight Rule.** No drop shadows on cards, buttons, or content blocks. Separation comes from background tone (cream vs. linen) and spacing, never from shadow.

## 5. Components

### Buttons
- **Shape:** Fully rounded pill (`border-radius: 999px`).
- **Primary:** Sage Trust background, Warm Cream text, 14px/32px padding. Used for the one primary action per screen ("Solicită obiect", "Vezi regulamente").
- **Hover / Focus:** Background shifts to Sage Deep (`#576848`); focus-visible adds a 2px Sage Deep outline offset 2px. No transform/scale.
- **Secondary:** Amber Glow background, Ink Umber text; used for reward-flavored secondary actions.
- **Ghost:** Warm Cream background, Ink Umber text, 1px Border Sand outline; used for tertiary/cancel actions.

### Chips / Status Tags
- **Style:** Soft Linen background, Ink Umber Soft text, pill shape, no border.
- **State:** "În stoc" uses Sage Trust text on Soft Linen; "Stoc epuizat" uses Signal Red text on Soft Linen. Color is always paired with the text label, never color alone.

### Cards / Containers
- **Corner Style:** 14px radius for content blocks (shop items), 22px for larger section wells.
- **Background:** Soft Linen on Warm Cream page background, one level of tonal separation only. No nested cards.
- **Shadow Strategy:** None (see Elevation).
- **Border:** None by default; a single 1px Border Sand hairline only where two adjacent surfaces share the same tone and need a seam.
- **Internal Padding:** 24px minimum on mobile, 40px on desktop for section wells.

### Inputs / Fields
- **Style:** Warm Cream background, 1px Border Sand stroke, 8px radius.
- **Focus:** Border shifts to Sage Trust, no glow/blur effects.
- **Error:** Border and helper text shift to Signal Red; icon + text, never color alone.

### Navigation
- **Style:** Persistent top bar, Warm Cream background, hairline bottom seam (Nav Ambient). Logo/wordmark left, route links right using Label typography.
- **States:** Default Ink Umber Soft; hover Ink Umber; active route Sage Deep with a small underline dot, not a background pill.
- **Mobile:** Collapses to a bottom tab bar with four large tap targets (44px min height) for Acasă / Regulamente / Magazin / Contul meu, icons plus label, since this is used on shared tablets outdoors.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Cream / Soft Linen tonal layering for all surface separation.
- **Do** render every score, point total, and price with tabular numbers.
- **Do** keep one primary action per screen, in Sage Trust.
- **Do** use large tap targets (44px minimum) throughout, this is used on shared tablets outdoors.
- **Do** pair every status color with a text label or icon, never color alone.

### Don't:
- **Don't** use neon blues, pure black, or dark-mode-first themes.
- **Don't** build generic SaaS hero-metric blocks, gradient text, or glassmorphism.
- **Don't** repeat identical icon-card grids; vary layout rhythm per section.
- **Don't** nest cards inside cards, especially in the Regulamente rule list.
- **Don't** use `border-left`/`border-right` colored stripes as accents.
- **Don't** add drop shadows to cards or buttons; depth comes from tone, not shadow.
