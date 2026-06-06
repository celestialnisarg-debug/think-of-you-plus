# ThinkOfYou+

A multi-theme digital postcard creator. Pick a theme, add a photo and stickers, customize the title, and send a unique link the recipient can open and keep — with animations throughout.

Inspired by the original [think-of-you](https://think-of-you.vercel.app) by [@iryna_lupan](https://www.instagram.com/iryna_lupan/), rebuilt with more customization.

## Features

- **5 themes** — Vintage, Modern Minimal, Botanical, Festive, Night (each with its own palette, texture, and fonts).
- **Photo upload** — click or drag-and-drop.
- **Title styling** — text, color picker, and 4 font choices.
- **Message + To / From** on the card back.
- **Stickers** — 10 draggable SVG stickers (flowers, stars, hearts, stamps, washi tape).
- **3D flip** between the card front and back.
- **Real shareable links** — saved to Supabase, opened at `/c/[slug]` with an entrance animation and confetti.
- **PNG fallback** — when no backend is configured, Share exports the card as a PNG.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase (Postgres + Storage).

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in the two values below
npm run dev                        # http://localhost:3000
```

The app works without Supabase — Share will export a PNG instead of creating a link.

### Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key |

## Backend setup (Supabase)

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/0001_postcards.sql` (creates the `postcards` table, the `postcard-photos` storage bucket, and public RLS policies).
3. Copy the project URL and anon key into `.env.local`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run test` | Run the Vitest unit tests |
| `npm run lint` | Lint |

## Deploy (Vercel)

1. Import the project into Vercel.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project settings.
3. Deploy.
