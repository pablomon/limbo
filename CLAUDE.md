# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing page built with [Astro](https://astro.build) (static site generator) and [Sanity](https://sanity.io) as the headless CMS.

## Deployment

- **Public site** (`src/`): deployed on Vercel (project `limbo`), domain `limbomezcal.com`. Auto-deploys on push to `main`. A Sanity webhook triggers a rebuild when content is published.
- **Studio** (`studio/`): hosted by Sanity at `limbo.sanity.studio`. Deploy with `cd studio && npx sanity deploy` (NOT via Vercel — the Vercel build of `sanity build` fails with "CLI config cannot be loaded"). `autoUpdates` is disabled in `studio/sanity.cli.js`.

## Commands

> Node >=22 is required. If you get an engine warning, run `nvm use 22` first.

```bash
npm run dev       # start dev server at localhost:4321
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and fill in your Sanity project details:

```
PUBLIC_SANITY_PROJECT_ID=6ikhc7g5
PUBLIC_SANITY_DATASET=production
```

Variables prefixed with `PUBLIC_` are exposed to the browser. Never add secret tokens (e.g. Sanity write tokens) without the `SANITY_` prefix and without keeping them server-side only.

## Design

The reference design is `cliente/WEB LIMBO prueba.pdf` (6 pages, desktop-only — the site must stay responsive). Design tokens live in `src/styles/global.css` (Tailwind v4 `@theme`): colors `cream` #FFFCF2, `sage` #C9CDBD, `terracotta` #CD774D, `ink` #252422; fonts `font-display` (Josefin Sans, stand-in for NeutraDisp) and `font-body` (Jost, stand-in for BrownStd — both PDF fonts are commercial). Assets extracted from the PDF are in `public/images/` (logo, bottles, ink illustrations with alpha, convocatoria artworks by year, placeholder Instagram feed photos).

## Architecture

```
src/
  styles/global.css    # Tailwind v4 import + @theme design tokens
  lib/sanity.ts        # Sanity client + imageUrlBuilder — import from here everywhere
  layouts/Layout.astro # shared shell: Header + InstaFeed + Footer; props: title, dark, noFeed
  pages/               # index, nosotros, mezcales, proceso, convocatoria (dark, draggable year slider), compra
  components/          # Header (light/dark variant, mobile menu), Footer, FotoSlider (auto-scrolling marquee), InstaFeed

sanity/
  schemas/             # Sanity document type definitions (used in your Sanity Studio project)
    landingPage.ts
```

Pages are currently static with content hardcoded from the PDF; Sanity wiring comes later. The Instagram feed fetches the latest posts at build time when `INSTAGRAM_ACCESS_TOKEN` is set (falls back to local photos otherwise); Instagram CDN image URLs expire after a few weeks, so schedule periodic redeploys (Vercel deploy hook + cron) once the token is live. The convocatoria year slider centers the current year on load (falls back to the newest year with artworks) and supports mouse drag with snap.

### Data flow

Astro fetches data from Sanity **at build time** (static generation). The client in `src/lib/sanity.ts` uses `useCdn: true` in production and `useCdn: false` in dev so edits show immediately during development.

### Adding content

1. Create a Sanity Studio project at [sanity.io](https://sanity.io) and copy the schemas from `sanity/schemas/` into it.
2. Set `PUBLIC_SANITY_PROJECT_ID` in `.env`.
3. Add a `landingPage` document in the Studio and publish it.
4. Run `npm run dev` — the page will render the CMS content.

### Adding new Sanity types

1. Add a schema file in `sanity/schemas/` and register it in your Studio's `sanity.config.ts`.
2. Add a GROQ query in the relevant Astro page's frontmatter, typing the result inline.
3. Use `urlFor(image).width(n).url()` from `src/lib/sanity.ts` for image URLs.
