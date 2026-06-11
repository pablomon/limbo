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
PUBLIC_SANITY_PROJECT_ID=  # from sanity.io/manage
PUBLIC_SANITY_DATASET=production
```

Variables prefixed with `PUBLIC_` are exposed to the browser. Never add secret tokens (e.g. Sanity write tokens) without the `SANITY_` prefix and without keeping them server-side only.

## Architecture

```
src/
  lib/sanity.ts        # Sanity client + imageUrlBuilder — import from here everywhere
  pages/index.astro    # landing page; fetches "landingPage" singleton from Sanity at build time
  components/          # reusable Astro components

sanity/
  schemas/             # Sanity document type definitions (used in your Sanity Studio project)
    landingPage.ts
```

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
