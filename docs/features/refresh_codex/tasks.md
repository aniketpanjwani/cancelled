# Implementation Tasks: Persist First-Paint Reason with Cookies

Each task depends on the previous. After completing a task, run the listed manual verification before moving on.

## T1 — Make the page dynamic for per-request cookies
- Update `app/page.tsx` with `export const dynamic = "force-dynamic";` (or handle cookies in a route handler).
- Manual verification: Start the dev server, load the home page twice; confirm no static HTML is cached (reason can change between hard reloads if cookie isn’t set yet).

## T2 — Read or set the reason index cookie on the server
- In `app/page.tsx`, read `cookies()` with a key like `cancelled_reason_index`.
- If valid (integer in range), keep it; otherwise generate a random index, set the cookie (`maxAge` ~30 days, `sameSite: "lax"`, `path: "/"`).
- Manual verification: Load the page, inspect browser cookies for `cancelled_reason_index`, and confirm it contains a valid integer.

## T3 — Pass the persisted reason to the UI
- Fetch `reasons = getAllReasons()` and derive `initialReason = reasons[index]`.
- Pass `initialReason` as a prop down to `Hero` and then to `ReasonTypewriter`.
- Manual verification: Add a temporary `console.log(initialReason.title)` in `ReasonTypewriter` to ensure the prop matches the cookie-derived index.

## T4 — Remove client randomization in `ReasonTypewriter`
- Update `ReasonTypewriter` to render the `initialReason` prop directly; remove the `useEffect` random pick.
- Keep reduced-motion handling intact; Typewriter animation should use the provided text.
- Manual verification: Reload the page; confirm the rendered reason matches the `console.log` from T3 and does not change across refreshes.

## T5 — Optional: mirror to `localStorage`
- In a `useEffect`, write the same index to `localStorage` (e.g., `cancelled:last-reason-index`) as a client cache; do not change the rendered text based on it.
- Manual verification: In DevTools > Application > Local Storage, confirm the key is written and matches the cookie value.

## T6 — End-to-end behavior check
- Steps: Load the page, note the reason; refresh; confirm the reason is identical. Close the tab, reopen; reason should stay the same. Delete the cookie, reload; reason should change and a new cookie should appear.
- Manual verification: Perform the steps above in a normal window and an incognito/private window; in private mode the cookie should persist for that session only (or as allowed by the browser).
