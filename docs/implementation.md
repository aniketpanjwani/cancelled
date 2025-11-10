# Next.js 15 App Router Implementation Guide – Canceled Co Site

This document describes how to translate the [Canceled Co Figma design](https://www.figma.com/design/U1O4af0ddEaUdAXxrRsaT5/Canceled-Co-Site--Copy-?node-id=10-747&p=f) into a production-ready Next.js 15 web application using the App Router. It captures the project setup, hero build plan, asset workflow, and the configurable "Reasons" JSON data source that must surface a random reason on each render.

> **Figma context**: All tokens/assets come from the copied file above (node `10:811`). At the moment only the hero frame exists; if more sections are added later we can extend this doc.

---

## 1. Technology stack & prerequisites

| Concern | Recommendation |
| --- | --- |
| Runtime | Node.js 20 LTS (matches Next.js 15 baseline) |
| Framework | Next.js 15 with the App Router, TypeScript, SWC, Turbopack dev server |
| Package manager & scripts | **Bun** for everything: `bun install`, `bun lint`, `bun typecheck`, `bun dev`, `bun test` |
| Styling | Tailwind CSS + CSS variables for design tokens (can be swapped for vanilla CSS modules if preferred) |
| Fonts | `next/font` to self-host brand typography extracted from Figma |
| Images/Iconography | `next/image` for hero/avatars, inline SVG components for logos |
| Content | Local JSON + MDX for marketing copy, optional Contentlayer if we later externalize |
| Deployment | Vercel (zero-config) or containerized deployment |

Install scaffold:

```bash
npx create-next-app@latest cancelled-co \
  --ts --app --tailwind --eslint --turbo --import-alias "@/*"
```

Upgrade to the latest canary if 15.x is still in beta:

```bash
cd cancelled-co
pnpm dlx nuxi@latest # or `pnpm up next@canary react@latest react-dom@latest`
```

Run `bun install` immediately after scaffold (or whenever dependencies change) and favor Bun for every script:

```bash
bun install
bun dev
bun lint
bun typecheck
```

> Keep Bun as the single source of truth to avoid mismatched lockfiles.

---

## 2. Repository layout

```
cancelled-co/
├─ app/
│  ├─ (marketing)/page.tsx          # Default route (RSC)
│  ├─ layout.tsx                     # Global metadata & providers
│  └─ api/reasons/route.ts          # Optional endpoint for random reason
├─ components/
│  ├─ hero/
│  ├─ reason-typewriter/
│  ├─ glitch-stamp/
│  └─ cta-cluster/
├─ content/
│  ├─ reasons.json                   # Configurable reason catalog
│  └─ sections.ts                    # Copy + CTA metadata
├─ lib/
│  ├─ reasons.ts                     # Random-selection helpers
│  └─ tokens.ts                      # Theme tokens parsed from Figma
├─ public/
│  └─ assets/                        # Exported imagery from Figma
├─ styles/
│  ├─ globals.css
│  └─ tokens.css                     # Generated CSS variables
└─ docs/
   └─ implementation.md
```

- Use [Segmented routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) if the design has modal flows (e.g., contact form overlay).
- Keep sections as server components so copy, images, and the random reason can be streamed.

---

## 3. Design tokens & assets

1. **Typography**: The new file confirms `Staatliches` (hero/title) and `Montserrat` (body/supporting copy). Install both with `next/font/google` or local subsets so the "You’ve been / CANCELED" lockup keeps its condensed letterforms and paragraph copy remains legible on dense red backgrounds.

2. **Color variables**: Metadata calls out `Main Red #C92B27`, `Bright Red #DB4543` (for text when it sits on black), plus pure black/white. Seed `styles/tokens.css` with those and extend once additional sections are exported:

   ```css
   :root {
     --color-bg: #000000;
     --color-surface: #050505;
     --color-accent: #C92B27;
     --color-accent-bright: #DB4543;
     --color-text: #FFFFFF;
     --color-text-invert: #000000;
   }
   ```
   Later sections can introduce desaturated neutrals for cards/modals, but these four tokens cover the hero above-the-fold treatment we now have screenshots for.

3. **Spacing & radii**: Mirror the Figma 4pt grid. Example utility additions for Tailwind:

   ```js
   // tailwind.config.ts excerpt
   theme: {
     extend: {
       spacing: { 18: '4.5rem', 22: '5.5rem' },
       borderRadius: { xl: '2.5rem' },
       boxShadow: {
         card: '0 30px 120px rgba(0,0,0,0.35)'
       }
     }
   }
   ```

4. **Icons/illustrations**: Export as SVG from Figma and drop into `public/assets`. Convert repeating logos into React components when they require color overrides.

5. **Imagery**: Export `RagebaitGameWebpageDesign` (hero background), `canceled stamp white text`, `Screenshot 2025-11-06...` (nav strip), and `Line 1` from Figma using the MCP asset URLs already surfaced. Store them under `public/assets/hero/` and wrap them with `next/image` + `priority` so the fold loads instantly. Generate low-res placeholders via `plaiceholder` or `next dev`'s built-in blur functionality.

> At the moment the shared Figma page only contains this hero layout. The later sections sketched below are forward-looking placeholders should we extend the site beyond the fold.

---

## 4. Configurable Reasons JSON & randomization

Create `content/reasons.json` (this file is the fixed catalog; no runtime metadata beyond what’s in the array is required):

```json
{
  "meta": {
    "lastUpdated": "2024-04-28",
    "source": "Internal CX pulse"
  },
  "reasons": [
    {
      "id": "ring-light-overload",
      "title": "Owning a ring light and too many opinions",
      "description": "Your seventh hot take of the morning tripped every alarm in the algorithm.",
      "ctaLabel": "Tone it down",
      "ctaHref": "#tone",
      "audience": ["Creators"],
      "weight": 2
    },
    {
      "id": "main-character-energy",
      "title": "Main character energy set to 110%",
      "description": "You tried to soliloquy through a group project stand-up.",
      "ctaLabel": "Share the stage",
      "ctaHref": "#stage",
      "audience": ["Team leads", "Roommates"],
      "weight": 1
    },
    {
      "id": "inbox-ghosted",
      "title": "Ghosted every email for 42 days",
      "description": "We sent smoke signals, you replied with ellipses.",
      "ctaLabel": "Open the inbox",
      "ctaHref": "#emails",
      "audience": ["Ops"],
      "weight": 1
    },
    {
      "id": "group-chat-judged",
      "title": "Group chat voted you out",
      "description": "Your meme-to-message ratio exceeded community guidelines.",
      "ctaLabel": "Appeal to the mods",
      "ctaHref": "#mods",
      "audience": ["Friends"],
      "weight": 1
    }
  ]
}
```

This file lives in `content/reasons.json` and is the authoritative source for the random hero copy—no additional metadata or APIs are planned unless requirements change.

> These entries are intentionally playful placeholders per the brief. Swap them for the approved list when available.

Helper (`lib/reasons.ts`):

```ts
import data from '@/content/reasons.json';

const REASONS = data.reasons;

export type Reason = (typeof REASONS)[number];

export function getRandomReason(seed?: number): Reason {
  const totalWeight = REASONS.reduce((sum, reason) => sum + (reason.weight ?? 1), 0);
  const r = seed ?? crypto.randomInt(totalWeight);
  let acc = 0;

  for (const reason of REASONS) {
    acc += reason.weight ?? 1;
    if (r < acc) return reason;
  }

  return REASONS[0];
}
```

Usage in `app/(marketing)/page.tsx`:

```tsx
import { getRandomReason } from '@/lib/reasons';

export default function MarketingPage() {
  const heroReason = getRandomReason();
  return (
    <main className="relative min-h-screen">
      <Hero reason={heroReason} />
    </main>
  );
}
```

- Because App Router server components execute per-request, `getRandomReason` can run server-side. For CSR determinism (e.g., hydration), pass the selected reason as serialized props.
- Optionally expose `/api/reasons` that returns the entire list and `/api/reasons/random` for third-party embeds.

---

## 5. Hero implementation blueprint

- **Layout & background**: Use a two-column grid (`grid-cols-1 lg:grid-cols-2`) constrained to `max-w-[1440px]` and center it with `mx-auto`. Place the `imgRagebaitGameWebpageDesign` texture as a full-bleed `next/image` underneath via `position: absolute` so motion overlays don’t interfere with pointer events.
- **Stamped headline**: Left column stacks `"You’ve been"` text with the `imgCanceledStampWhiteText1` asset (slightly rotated ~–3°). Both use the `Staatliches` font and pure black fill to match the screenshot.
- **Reason callout**: Right column displays `Reason: ${randomReason.title}` in `Staatliches`, uppercased, aligned center on mobile and left on desktop. Clamp to three lines via `line-clamp-3` and reserve ~2–3 lines worth of height.
- **CTA cluster**: Primary button "Appeal Your Cancellation" (links to `https://tiktok.com`) plus the `#### people canceled` stat separated by the `imgLine1` divider graphic. Until we have a real metric, show a server-generated pseudo-count (e.g., a random `Intl.NumberFormat` string between 25 000 and 999 000). Buttons stay black with white text; add `aria-label` for the stat once real data arrives.
- **Animations**: Hook in motion logic (see Section 7) for (a) typewriter reveal of the reason copy, (b) periodic glitch pulses on the stamp, and (c) subtle fade/slide on the CTA cluster.

---

### Random cancellation count helper

Until product provides a real metric, generate a pseudo-random count on the server so it remains deterministic per request (and matches the hydration payload):

```ts
// lib/canceled-count.ts
export function getPseudoCanceledCount(seed?: number) {
  const min = 25_000;
  const max = 999_000;
  const value = seed ?? crypto.randomInt(min, max);
  return new Intl.NumberFormat('en-US').format(value);
}
```

```tsx
import { getPseudoCanceledCount } from '@/lib/canceled-count';

export function Hero() {
  const canceledCount = getPseudoCanceledCount();
  return (
    <p aria-label={`${canceledCount} people canceled`}>{canceledCount} people canceled</p>
  );
}
```

Swap this helper once we have production analytics.

---

## 6. Styling & theming approach

- **Global styles**: `styles/globals.css` imports Tailwind base/components/utilities and defines CSS custom properties for colors, fonts, spacing.
- **Glassmorphism card effect**: If the Figma uses translucent cards, add backdrop blur via `backdrop-filter: blur(18px)` and `background-color: rgba(17,16,21,0.65)`.
- **Grid system**: Use `max-w-6xl mx-auto px-6 sm:px-12` with a simple two-column grid that collapses to a single column on small screens so the hero adapts cleanly.
- **Dark mode**: If the design is inherently dark, set `color-scheme: dark` to align form controls.

---

## 7. Motion implementation (Framer Motion + motion-plus)

1. **Dependencies (with Bun)**

   ```bash
   bun add framer-motion motion-plus
   ```

   Reference repos at `/Users/aniketpanjwani/Projects/reference_repos/motion` and `/Users/aniketpanjwani/Projects/reference_repos/motion_plus` show baseline usage if needed.

2. **Provider setup**

   - Create `lib/motion.tsx` that exports a `MotionProviders` component wrapping `MotionPlusProvider` (from `motion-plus/react`) and passes the token from `.env.local` (already stored as `MOTION_PLUS_TOKEN`; never commit it). Access via `process.env.MOTION_PLUS_TOKEN`.
   - Import this provider in `app/layout.tsx` so any server component can opt into motion controls.

3. **Typewriter effect for the random reason**

   Motion Plus ships a `Typewriter` component that already matches Figma’s annotation. Usage mirrors the sample you shared:

   ```tsx
   "use client";

   import { Typewriter } from "motion-plus/react";

   const monospace = { fontFamily: '"Azeret Mono", monospace' } satisfies React.CSSProperties;
   const cursor = { background: "#DB4543", width: 2 } satisfies React.CSSProperties;

   export function ReasonTypewriter({ text }: { text: string }) {
     return (
       <Typewriter as="p" cursorStyle={cursor} textStyle={monospace} speed={0.04}>
         {text}
       </Typewriter>
     );
   }
   ```

   - Feed `text` from `getRandomReason()`.
   - Default config: `speed={0.08}` (~12 chars/sec) to create a slower dramatic reveal, cursor color `#DB4543`, and `loop={false}` so each load types once. Adjust only if stakeholders request timing tweaks.

4. **Glitch pulses on the canceled stamp**

   - Use `framer-motion`’s `useAnimationControls` to rapidly toggle `skew`, `scale`, and `filter: contrast()` on the stamp asset. Default cadence: trigger every 4 seconds with a 0.25 s timeline (`skewX: [0, -1, 0.5, 0]`, `scale: [1, 1.02, 0.98, 1]`, `filter: ["none", "contrast(180%)", "none"]`).
   - Example pattern:

     ```tsx
     const controls = useAnimationControls();
     useEffect(() => {
       const interval = setInterval(() => {
         void controls.start({
           skewX: [0, -1, 0.5, 0],
           scale: [1, 1.02, 0.98, 1],
           filter: ["none", "contrast(180%)", "none"],
           transition: { duration: 0.25 }
         });
       }, 4000);
       return () => clearInterval(interval);
     }, [controls]);
     ```

5. **Reduced motion**

   - Guard both the Typewriter and glitch loops with `const prefersReducedMotion = useReducedMotion();` so motion-disabled users see static text.
   - Provide fallback styles (e.g., show the full reason immediately, skip glitch keyframes).

---

## 8. Content authoring workflow

- Maintain marketing copy in `content/sections.ts` (typed object) or MDX files under `content/sections/*.mdx` processed with `next-mdx-remote`.
- For the `Reasons` dataset, allow operations to edit `content/reasons.json` or serve via CMS later. Keep schema stable so randomization logic still works.
- Add Zod schemas to validate JSON at build time and surface readable errors.

---

## 9. Testing & quality gates

- **Unit tests**: Validate `getRandomReason` selection distribution with Vitest (or Jest). Ensure hydration parity by snapshotting serialized props.
- **Integration tests**: Use Playwright to confirm the hero renders the random reason, CTA links to TikTok, motion effects respect `prefers-reduced-motion`, and that the glitch/typewriter animations mount without console errors.
- **Accessibility**: Run `@axe-core/playwright` in CI; pay special attention to color contrast from the dark palette.
- **Performance**: Configure `next/image` properly and prefetch hero fonts. Confirm Lighthouse > 90 for Performance/Accessibility.

---

## 10. Deployment & env configuration

- Add `NEXT_PUBLIC_SITE_URL` for open graph metadata.
- If the Reasons JSON will eventually live in an external store, store the endpoint in `REASONS_API_URL` and fall back to the local file during development.
- Deploy to Vercel; set the project to use the Node.js 20 runtime and enable the Edge cache for the marketing route if the content is static.

---

## 11. Outstanding items / clarifications needed

1. **Final reason copy**: Swap the playful placeholder reasons for approved messaging before GA.
2. **Hero stat data**: Replace the pseudo-random count helper with a real metric/API once the number exists.

Once these are answered, we can implement and ship the hero with confidence.
