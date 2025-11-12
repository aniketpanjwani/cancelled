# Canceled Co – Launch Polish Plan

## Goals
Deliver the final set of marketing polish items before launch:
1. Replace the favicon with the “X” asset from Figma.
2. Update Open Graph/Twitter preview to use the red background + stamp artwork.
3. Point the primary CTA button to `https://canceledco.com`.
4. Add a “Cancel Someone” copy-to-clipboard interaction near the CTA cluster.

## Assets & Prep
- **Favicon**: Node `80:7` (“X” logo). Export at ≥72×72 and drop into `public/favicon.ico` plus `app/icon.png` as needed.
- **Preview image**: Node `82:16` (red background + cancel stamp). Sizes already 1200×620 per Oliver. Save as `public/og/canceled-co-preview.png`.
- **CTA buttons**: Primary button `50:17`, secondary “Cancel Someone” button `80:16`. Each node includes hover/active variants—capture colors/borders/typography for both states before reproducing them.
- Ensure MCP access to those node IDs; re-export if the asset URLs expire.

## Implementation Steps

### 1. Favicon update
- Replace current Next.js default icons with the Figma export:
  - `public/favicon.ico`
  - `app/icon.png` and `app/apple-icon.png` if needed for iOS.
- Clear `.next` to ensure the new favicon ships.
- Quick manual test: load the site locally and confirm the browser tab shows the new icon.

### 2. Link preview metadata
- Move/extend metadata in `app/layout.tsx`:
  - Set `metadata.openGraph.images` and `metadata.twitter.images` to the new OG asset (`/og/canceled-co-preview.png`).
  - Ensure title/description reflect the hero copy (“You’ve been canceled…”).
- If we need per-route metadata later, consider exporting a `generateMetadata`, but for now the static object is fine.
- Validate via `npx vercel dev --inspect-og` or using Facebook/Twitter debugger after deploy.

### 3. CTA destination
- In `components/hero/cta-cluster.tsx`, replace the TikTok placeholder href with `https://canceledco.com`.
- Keep `target="_blank" rel="noreferrer"` so marketing can track via analytics.
- Sanity check that the button styling remains unchanged.

### 4. “Cancel Someone” copy interaction
- Placement: per Figma `10:811`, the secondary button (“click to cancel someone”, node `80:16`) sits to the right of the main CTA inside the same row. We’ll reproduce that layout in `CTACluster`.
- Implementation outline:
  - Convert the subcomponent to a client component if it isn’t already (likely already is because of event handlers).
  - Add a secondary text link (e.g., `“Cancel Someone →”`) that triggers `navigator.clipboard.writeText(window.location.href)`.
  - Maintain a short “Copied” success state (2–3 seconds). Could use small inline text swap or tooltip-style badge.
  - Provide focus/hover styles and keyboard activation (treat as `<button>` styled like text).
  - Use `aria-live="polite"` for the success message so screen readers know it worked.
- Manual test cases:
  - Copy works in modern browsers (guards for `navigator.clipboard` support; fallback to `document.execCommand('copy')` or show instructions).
  - Success state disappears after timeout and resets when the user clicks again.

## Verification
1. `bun typecheck`, `bun run lint`, `bun run build`.
2. Manual QA in local dev:
   - Favicon displays.
   - CTA opens `canceledco.com` in a new tab.
   - “Cancel Someone” text copies the URL and shows “Copied”.
3. After deployment, use OG debugger to confirm the preview updates.

## Open Questions
- None: “Cancel Someone” copy action will always copy `https://canceled.canceledco.com` unless stakeholders request a dynamic URL later.
