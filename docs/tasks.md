# Implementation Task List – Canceled Co Hero

Each task builds on the previous one and includes a manual verification step so progress can be confirmed locally. Timelines are intentionally omitted; Codex will execute sequentially.

## Task 1 – Bootstrap Next.js 15 project with Bun
- Scaffold via `npx create-next-app@latest cancelled-co --ts --app --tailwind --eslint --turbo --import-alias "@/*"`.
- Run `bun install` and commit the generated Bun lockfile.
- Configure package scripts (`dev`, `lint`, `typecheck`, `test`) to call Bun.
**Manual verification**: Run `bun dev` and load `http://localhost:3000` to confirm the default Next.js welcome screen renders without errors.

## Task 2 – Configure global theming (fonts, tokens, Tailwind)
- Add Staatliches + Montserrat through `next/font` (self-host or Google Fonts) inside `app/layout.tsx`.
- Create `styles/tokens.css` with the palette from `implementation.md` and import it in `globals.css`.
- Extend `tailwind.config.ts` with spacing/radius/shadow tokens noted in the doc.
**Manual verification**: Inspect the rendered HTML to ensure CSS variables exist on `<html>` and fonts are applied globally (check via browser devtools).

## Task 3 – Implement data layer (`reasons.json`, helpers)
- Create `content/reasons.json` using the placeholder entries from the doc.
- Build `lib/reasons.ts` with `getRandomReason` (weighted random) and TypeScript types.
- Add `lib/canceled-count.ts` to compute the time-based counter (base + daily growth) driven by `CANCELED_COUNT_*` env vars.
**Manual verification**: Run a quick unit test (or log the value) to ensure `getComputedCanceledCount()` returns the expected number when you mock specific timestamps.

## Task 4 – Install and wire motion libraries
- `bun add framer-motion motion-plus`.
- Create `lib/motion.tsx` exporting `MotionProviders` that injects `MotionPlusProvider` with `process.env.MOTION_PLUS_TOKEN`.
- Include `MotionProviders` in `app/layout.tsx`.
**Manual verification**: Start the dev server and confirm no runtime errors related to the motion token appear in the console.

## Task 5 – Build the hero layout structure
- Create `components/hero/Hero.tsx` plus subcomponents (`ReasonTypewriter`, `GlitchStamp`, `CTACluster`).
- Use `next/image` to layer the hero texture/stamp assets as described.
- Layout: responsive two-column grid collapsing to one column on small screens.
**Manual verification**: Load the page and confirm the hero visually matches the Figma screenshot (background texture, stamp placement, CTA grouping) without motion yet.

## Task 6 – Add content + data wiring
- Pass `heroReason` and the computed cancellation count into the hero from `app/(marketing)/page.tsx`.
- Display `Reason: ${heroReason.title}` with up to three lines (Tailwind `line-clamp-3`).
- Connect the CTA button to `https://tiktok.com` and insert the divider asset between button + stat.
**Manual verification**: Refresh multiple times; ensure the reason text changes, CTA link targets TikTok, and the computed count rises predictably over time (compare values a few minutes apart).

## Task 7 – Implement motion behaviors
- Integrate motion-plus `Typewriter` in the reason component with defaults: `speed={0.04}`, cursor color `#DB4543`, no loop.
- Use framer-motion `useAnimationControls` for the glitch pulse (every 4 s, 0.25 s duration, skew/scale/filter sequence from the doc).
- Add reduced-motion guards so the text shows instantly and glitch is disabled when `prefers-reduced-motion` is true.
**Manual verification**: Record a short screen capture or observe the hero to confirm the typewriter animation runs once per load and the stamp glitches periodically; enable OS-level “reduce motion” to verify the fallback (static text, no glitch) kicks in.

## Task 8 – Testing & accessibility pass
- Add Vitest/Jest unit coverage for helper utilities.
- Create a Playwright spec that loads `/`, checks the reason + computed count render, verifies CTA href, and asserts no console errors from motion providers.
- Run `bun lint`, `bun typecheck`, and `bun test` before final sign-off.
**Manual verification**: Share the Playwright report (or CLI output) demonstrating all assertions pass and no accessibility violations are reported by Axe.

## Task 9 – Final review & deployment readiness
- Confirm `.env.local` includes `MOTION_PLUS_TOKEN` and is excluded from version control.
- Review `docs/implementation.md`, `docs/tracking.md`, and this tasks file to ensure they reflect the final build.
- Prepare deployment settings (Vercel project, environment variables) but do not deploy until stakeholders approve placeholders.
**Manual verification**: Run through the hero experience end-to-end in incognito mode, verifying random reason assignment, motion, CTA link, and the computed count all behave as documented.
