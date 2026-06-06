# ThinkOfYou+ — Design Spec

**Date:** 2026-06-06
**Status:** Approved
**Inspiration:** think-of-you.vercel.app (vintage digital postcard creator by @iryna_lupan)

## 1. Concept

A vintage-rooted digital postcard creator, elevated with a multi-theme system,
draggable stickers/stamps, and real shareable links. A sender designs a postcard;
the recipient opens a unique URL and watches it animate to life (entrance reveal,
flip-to-read-back, confetti). The goal is the same emotional core as the original —
"share the love with someone special" — with far more customization and motion.

## 2. Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling; CSS for paper/noise textures and gradients
- **Framer Motion** for card flip (3D), sticker drag (spring physics), entrance reveals, page transitions
- **Supabase**: Postgres (card data) + Storage (uploaded photos)
- **Deploy:** Vercel

## 3. Pages / Units

Each unit has one clear purpose, a defined interface, and is testable in isolation.

### 3.1 `/` — Landing
- Animated hero headline + subcopy ("Share the love with someone special").
- A live sample postcard that flips on hover/tap.
- Primary CTA → `/create`.
- Footer credit line (attribution to original inspiration + this build).

### 3.2 `/create` — Editor
Two-pane layout (stacks vertically on mobile):
- **Preview pane:** live, flippable postcard rendering current state. Click/tap to flip
  between front (photo + title) and back (message, to/from, stamp).
- **Control pane:** all customization controls (section 4).
- **Share button:** saves the card and returns a shareable link (section 6).

### 3.3 `/c/[slug]` — Recipient View
- Fetches the saved postcard by slug.
- Read-only render with an entrance animation and confetti on open.
- Flip-to-read-back interaction.
- Share / copy-link buttons and a "Create your own" CTA → `/create`.
- Graceful "not found" state for bad/expired slugs.

## 4. Editor Controls

- **Theme picker** — Vintage (default), Modern Minimal, Botanical, Festive, Night.
  Each theme sets: palette, paper/background texture, stamp style, default title font.
- **Photo** — click-to-upload or drag-and-drop; uploaded to Supabase Storage; preview
  on the card front. Remove/replace supported.
- **Title** — text input (limit 40 chars, live counter), color picker, font selector.
- **Message** — multi-line text on the card back.
- **To / From** — sender and recipient name fields on the card back.
- **Stickers / stamps** — a tray of SVG decorative elements (flowers, stars, hearts,
  stamps, washi tape). Drag onto the card; move, rotate, scale, re-layer, delete.
  Stored as a JSON array of placements.

## 5. Data Model

**Table `postcards`:**

| column        | type      | notes                                            |
|---------------|-----------|--------------------------------------------------|
| `id`          | uuid PK   | default gen_random_uuid()                        |
| `slug`        | text uniq | short, URL-safe (e.g. 8 chars)                   |
| `theme`       | text      | theme id                                         |
| `title`       | text      | front title                                      |
| `title_color` | text      | hex                                              |
| `title_font`  | text      | font id                                          |
| `message`     | text      | back message                                     |
| `to_name`     | text      | recipient                                        |
| `from_name`   | text      | sender                                           |
| `photo_url`   | text null | public URL in storage                            |
| `stickers`    | jsonb     | array of `{id,type,x,y,rotation,scale,z}`        |
| `bg`          | text null | optional background override                     |
| `created_at`  | timestamptz | default now()                                  |

- **Storage bucket** `postcard-photos` (public read) for uploaded images.
- **RLS:** public `insert` and `select` (no auth in v1); writes are append-only.

## 6. Share Flow

1. User clicks **Share** in the editor.
2. App uploads any pending photo, then inserts the card row with a generated `slug`.
3. App returns `/c/[slug]`; offers native share sheet + copy-to-clipboard.
4. Recipient opens the link → animated render.

## 7. Animations

- Card flip: 3D rotateY with perspective.
- Sticker drag: spring physics; rotate/scale handles.
- Recipient entrance: staggered reveal of card, then stickers, then confetti burst.
- Landing hero: subtle parallax / float; sample card flip on hover.
- Page transitions and hover micro-interactions throughout.
- Respect `prefers-reduced-motion`: reduce/disable non-essential motion.

## 8. Assets

- Inline SVG for stickers/stamps and CSS-generated paper/noise textures and gradients —
  no external runtime dependency, so the user can swap in their own webp/SVG later.
- A small `assets`/`components` structure makes replacement straightforward.

## 9. Graceful Fallback

If Supabase env vars are absent (e.g. before backend provisioning), the editor still
works fully and **Share** falls back to **PNG download** (render the card to an image).
The app is never broken pre-backend.

## 10. Out of Scope (v1 / YAGNI)

- Accounts / auth, editing a card after sharing, analytics, comments/replies,
  email delivery, payment. All deferred.

## 11. Success Criteria

- Build a postcard end-to-end in the editor with theme, photo, title, message, stickers.
- Share produces a working `/c/[slug]` link that renders the exact card with animations.
- PNG fallback works when backend env is absent.
- Responsive on mobile and desktop; respects reduced-motion.
- Deploys cleanly to Vercel.
