# HRMS Pitch Deck — Design Spec
**Date:** 2026-05-11
**Project:** Phaze AI HRMS Pitch Deck
**Status:** Approved

---

## 1. Overview

Two web-based deliverables that together serve as the complete sales pitch for the Phaze AI HRMS product:

| Deliverable | File | Purpose |
|---|---|---|
| Scrollable Pitch Website | `site/index.html` | Share via link, read at own pace, embedded CTA form |
| Slide Deck | `deck/index.html` | Live presentations, keyboard-navigable, fullscreen |

**Output location:** `C:\Users\nisup\Downloads\HRMS Pitch Deck\`

---

## 2. Audience & Goal

- **Primary audience:** SMB owners and HR managers
- **Goal:** Convince them to book a demo or contact Phaze AI
- **Tone:** Modern tech startup — dark, premium, confident. Not vibrant or playful.

---

## 3. Design System

### Colour Palette
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#06191E` | Page/slide background |
| `--primary` | `#13768D` | Buttons, active accents, borders |
| `--secondary` | `#64919F` | Section headings, card highlights |
| `--muted` | `#8FA2A4` | Supporting text, labels |
| `--surface` | `#0D2A33` | Card backgrounds (slightly lighter than bg) |
| `--light` | `#F7F7F7` | Body text, headings |
| `--overlay` | `rgba(19,118,141,0.12)` | Glassmorphism card overlay |

### Typography
- **Font:** Inter (Google Fonts CDN)
- **Hero headline:** 56px / Bold
- **Section headline:** 36px / Bold
- **Card title:** 18px / SemiBold
- **Body:** 15px / Regular
- **Label/caption:** 13px / Medium, `--muted` colour

### Component Styles
- **Cards:** `background: --surface`, `border: 1px solid rgba(100,145,159,0.25)`, `border-radius: 12px`, subtle `box-shadow: 0 0 24px rgba(19,118,141,0.1)`
- **Buttons (primary):** `background: #13768D`, white text, `border-radius: 8px`, hover darkens to `#0f6070`
- **Buttons (outline):** transparent bg, `border: 1px solid #13768D`, `color: #F7F7F7`
- **Section dividers:** thin `1px` horizontal rule at `rgba(100,145,159,0.2)`

---

## 4. Deliverable 1 — Scrollable Pitch Website (`site/index.html`)

### Technology
- Pure HTML5 + CSS3 + vanilla JS
- No frameworks, no build step
- Google Fonts (Inter) via CDN
- Intersection Observer API for scroll-triggered fade-in animations

### Sections

#### S1 — Hero
- Full-viewport height
- Phaze AI logo (text-based, styled) top-left
- Nav links: Features | Pricing | Contact (smooth scroll anchors)
- Centre: headline `"HR that runs itself."`, sub-headline `"GPS attendance, AI expense scanning, leave management — all from WhatsApp. Zero new apps for your team."`
- Two CTAs: `Book a Demo` (primary button) + `Contact Us` (outline button)
- Background: subtle radial gradient `#06191E` → `#0D2A33` with faint teal glow bottom-left

#### S2 — The Problem
- Section heading: `"HR admin is eating your day."`
- 4 pain point cards in a 2×2 grid:
  1. Field staff mark fake attendance — no visibility
  2. Expense claims pile up as paper receipts
  3. Leave requests buried in email chains
  4. Policy questions flood HR's inbox
- Each card: icon (emoji/SVG), bold problem title, one-line description

#### S3 — The Solution
- Section heading: `"One system. Two interfaces."`
- Two-column split:
  - Left: **Admin Dashboard** — web portal, full visibility, approval controls
  - Right: **WhatsApp Bot** — employees use WhatsApp they already have, natural language
- Connector visual between columns (arrow or line with "real-time sync")

#### S4 — Key Features
- Section heading: `"Everything HR. Nothing extra."`
- 6-card grid (3×2 on desktop, 2×3 on tablet, 1-col on mobile):
  1. GPS Attendance — Check-in/out verified by location
  2. AI Receipt Scanning — Photo → auto-extracted expense claim
  3. Leave Management — Apply and approve in seconds
  4. Field Visit Tracker — Meeting in/out with GPS + client notes
  5. Policy Q&A Bot — Instant answers from uploaded policy docs
  6. Task Management — Assign, log, and track team tasks

#### S5 — How It Works
- Section heading: `"Set up in a day. Running by tomorrow."`
- 3-step horizontal stepper:
  1. **Onboard** — Add employees, configure branches, upload policies
  2. **Connect** — Employees start WhatsApp bot with one message
  3. **Track** — Everything flows into your admin dashboard live
- Step connector lines in `--primary` colour

#### S6 — Pricing
- Section heading: `"Simple pricing. No surprises."`
- Two cards, side by side:
  - **Monthly:** `₹5,000 / month` — billed monthly, cancel anytime
  - **Annual:** `₹50,000 / year` — highlighted as "Best Value", badge: `Save ₹10,000`
- Below cards: one-liner `"Includes all features. Unlimited employees. One flat price."`

#### S7 — Book a Demo
- Section heading: `"See it live in 20 minutes."`
- Simple inline form: Name, Company Name, Phone Number, Submit button
- Form submits to mailto (or placeholder action for now)
- Below form: direct contact line `manthanjethwani@phazeai.com | +91 7990700545`

#### S8 — Footer
- Left: Phaze AI logo + tagline `"Automating What Drains Your Time"`
- Right: `www.phazeai.com` | `subscriptions@phazeai.com`
- Bottom line: `© 2026 Phaze AI. All rights reserved.`

### Animations
- All sections fade up on scroll entry (Intersection Observer, `opacity 0→1`, `translateY 20px→0`, 0.5s ease)
- Hero CTA buttons have subtle hover scale (`transform: scale(1.03)`)
- Feature cards have hover border glow (`box-shadow` intensifies on hover)
- Smooth scroll for all anchor links

### Responsive Breakpoints
- Desktop: 1200px+ (full layout as described)
- Tablet: 768–1199px (2-col grids become 2-col, hero text smaller)
- Mobile: <768px (all grids become 1-col, nav collapses)

---

## 5. Deliverable 2 — Slide Deck (`deck/index.html`)

### Technology
- **Reveal.js** v5 (CDN — no install needed)
- Custom CSS theme overriding Reveal.js defaults with Phaze AI brand tokens
- Keyboard navigation (arrow keys, spacebar), fullscreen (F), overview (ESC)

### Slides

| # | Slide Title | Key Content |
|---|---|---|
| 1 | Cover | Phaze AI logo, `"HR that runs itself."`, product name, tagline |
| 2 | The Problem | 4 pain points as bold statements, one per bullet |
| 3 | The Solution | Two-column: Admin Dashboard vs WhatsApp Bot |
| 4 | Key Features | 6 features in 2-column list with icons |
| 5 | How It Works | 3-step visual flow |
| 6 | Pricing | Two pricing cards, annual highlighted |
| 7 | Book a Demo | CTA + contact details large and clear |
| 8 | Thank You | Logo, Manthan Jethwani, email, phone, website |

### Deck-Specific Design Rules
- Each slide: full dark background, centred or left-aligned content
- Max 40 words of body text per slide — visuals and headlines carry the weight
- Slide number shown bottom-right
- Progress bar at top in `--primary` colour
- Transition: `fade` (clean, professional)
- Font sizes larger than website (presentation distance): headlines 52px, body 22px

---

## 6. File Structure

```
C:\Users\nisup\Downloads\HRMS Pitch Deck\
├── site\
│   ├── index.html        ← Scrollable pitch website
│   └── assets\
│       └── logo.svg      ← (placeholder — text-based logo used if absent)
├── deck\
│   └── index.html        ← Reveal.js slide deck
└── README.md             ← How to open both files
```

---

## 7. Content — Key Messages

| Message | Where Used |
|---|---|
| "HR that runs itself." | Hero headline, deck cover |
| "Automating What Drains Your Time" | Tagline (brand) |
| WhatsApp — no new app for employees | Problem/Solution sections |
| GPS-verified, AI-powered | Feature callouts |
| ₹5,000/mo or ₹50,000/yr | Pricing section |
| Save ₹10,000 on annual | Annual plan badge |
| "See it live in 20 minutes." | Demo CTA heading |

---

## 8. Out of Scope

- Backend for the contact form (form uses mailto or static placeholder)
- Authentication or password protection
- CMS or editable content
- Animations beyond CSS transitions (no GSAP, Lottie, etc.)
- Hosting/deployment (files are local HTML, openable directly in browser)

---

## 9. Contact Details (from brand assets)

| Field | Value |
|---|---|
| Founder | Manthan Jethwani |
| Email | manthanjethwani@phazeai.com |
| Phone | +91 7990700545 |
| Website | www.phazeai.com |
| Support email | subscriptions@phazeai.com |
