# Canceled Co Hero Experience

This repo implements the hero section of the Canceled Co marketing site based on the [Figma design](https://www.figma.com/design/U1O4af0ddEaUdAXxrRsaT5/Canceled-Co-Site--Copy-?node-id=10-747&p=f). It focuses on the App Router landing view that features:

- Official logo variants pulled directly from Figma via MCP.
- A typewriter-driven cancellation reason sourced from a configurable JSON file.
- A glitching “Canceled” stamp animation and CTA cluster wired to TikTok.
- Bun-first tooling (install, dev, lint, typecheck) with Tailwind v4 tokens and `next/font` (Staatliches + Montserrat).

For implementation details see `docs/implementation.md`, `docs/tasks.md`, and `docs/tracking.md`.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Bun package manager (scripts and lockfile)
- Tailwind CSS v4 (inline theme) + custom tokens
- Framer Motion + motion-plus Typewriter component
- Local JSON content + lightweight helper libs (`lib/reasons.ts`, `lib/canceled-count.ts`)

## Getting Started

```bash
bun install
bun dev
```

The dev server defaults to port 3000 (Next.js may choose a different port if that is busy).

### Environment variables

| Variable | Description |
| --- | --- |
| `MOTION_PLUS_TOKEN` | Auth token for motion-plus components. |
| `CANCELED_COUNT_BASE` *(optional)* | Starting value for the “people canceled” counter (default `984`). |
| `CANCELED_COUNT_START` *(optional)* | ISO timestamp when the counter began (default `2024-01-01T00:00:00Z`). |
| `CANCELED_COUNT_PER_DAY` *(optional)* | How many increments to add per day (default `120`). |

### Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Run Next.js in development mode (App Router + Webpack for now). |
| `bun run lint` | ESLint across the repo. |
| `bun typecheck` | TypeScript `tsc --noEmit`. |
| `bun run build` | Production build (Next.js). |

## Project Structure

```
app/
  layout.tsx        # Fonts, motion provider stub, global wrappers
  page.tsx          # Server component that selects random reasons
components/
  hero/             # Hero layout, CTA cluster, glitch stamp, reason typewriter
  logo.tsx          # Figma-exported logo variants
  nav/              # SiteNav overlay component
content/reasons.json
lib/reasons.ts      # Weighted random helper
lib/canceled-count.ts# Time-based “people canceled” formatter (formula)
public/assets/      # Hero imagery + logo exports from Figma
styles/tokens.css   # Brand palette + CSS variables
docs/               # Implementation guide, tasks, tracking
```

## Verification Checklist

- `bun typecheck`
- `bun run lint`
- `bun dev` → ensure hero renders, typewriter/glitch animations run (disable at OS level to test reduced motion), CTA links to TikTok, random reason + pseudo count update on refresh.

## Deployment

Deploy to Vercel or the target platform once the placeholder reasons are replaced with final copy. Remember to set `MOTION_PLUS_TOKEN` and (optionally) the `CANCELED_COUNT_*` variables if you want to tune the counter formula.
