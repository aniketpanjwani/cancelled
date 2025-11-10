# Progress Tracker – Canceled Co Site

Purpose: capture the current implementation status, outstanding questions, and decisions related to delivering the hero experience described in `implementation.md`.

## Status snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Design assets | ✅ | Hero frame (`node 10:811`) + exported textures/stamp references documented. |
| Tech stack | ✅ | Next.js 15 + Bun workflow + Tailwind tokens captured. |
| Reasons dataset | 🚧 | Placeholder JSON defined; awaiting final copy from stakeholders. |
| Motion system | 🚧 | Framer Motion + motion-plus plan documented; needs implementation once repo exists. |
| Analytics/stat | 🚧 | Pseudo-random cancellation count helper documented; awaiting real metric/API. |

Legend: ✅ completed, 🚧 in progress, ⚠️ blocked, ⛔ not started.

## Decisions to date

1. **Tooling**: Standardize on Bun for install/dev/lint/typecheck.
2. **Fonts/colors**: Use Staatliches + Montserrat with palette (#C92B27, #DB4543, black, white).
3. **Motion tooling**: Adopt framer-motion + motion-plus (Typewriter) with token sourced from `.env.local`.
4. **Reason source**: Local `content/reasons.json` remains the single source of truth until a CMS is requested.

## Open questions / follow-ups

1. Provide final, approved reason copy to replace the playful placeholders.
2. Supply the real "people canceled" metric so we can remove the pseudo-random helper.

## Next actionable steps

1. Spin up the Next.js 15 project scaffold (per `implementation.md`), wire Bun scripts.
2. Implement `lib/reasons.ts` + `lib/canceled-count.ts`, then build the hero section with motion behaviors.
3. Run the manual verification steps outlined in `docs/tasks.md` once each development milestone is complete.
