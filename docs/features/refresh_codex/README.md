# Keep the same cancelation message after refresh

You can persist the first randomly chosen cancelation reason so a visitor sees the exact same message after a page refresh. The simplest approach is to save the selected reason index to `localStorage` when it is first generated and re-use it on subsequent mounts.

## Recommended approach (client-side persistence)

- Storage key: `cancelled:last-reason-index`
- Scope: localStorage (keeps data on the same device without sending it to the server)
- Lifespan: until the user clears storage; optionally add a time-to-live if you want to rotate messages periodically.

### Implementation outline (edit `components/hero/reason-typewriter.tsx`)

1) Load any previously stored index:
   ```ts
   const storageKey = "cancelled:last-reason-index";
   const storedValue =
     typeof window !== "undefined"
       ? window.localStorage.getItem(storageKey)
       : null;
   const storedIndex = storedValue ? Number.parseInt(storedValue, 10) : NaN;
   const hasValidStoredIndex =
     Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < REASONS.length;
   ```
2) Choose the index to render:
   ```ts
   const index = hasValidStoredIndex
     ? storedIndex
     : Math.floor(Math.random() * REASONS.length);
   setReason(REASONS[index]);
   ```
3) Persist the index if this is the first visit or the stored value was invalid:
   ```ts
   if (!hasValidStoredIndex) {
     window.localStorage.setItem(storageKey, String(index));
   }
   ```
4) Run the logic inside an effect that already guards for an empty dataset:
   ```ts
   useEffect(() => {
     if (REASONS.length === 0) return;
     // steps 1–3 above
   }, []);
   ```

### Notes and options

- Hydration flash: because `ReasonTypewriter` is a client component, the first paint uses the fallback reason and then swaps to the stored one during hydration. If that flash matters, also store the reason string (not just the index) and render it immediately after hydration using `useLayoutEffect`, or move persistence into a cookie that server code can read before render.
- Dataset changes: if the reasons list changes and the stored index is now out of range, the guard above automatically replaces it with a fresh valid index and updates storage.
- Resetting: deleting `cancelled:last-reason-index` from `localStorage` (or providing a small “Show me a new reason” button that clears it) will allow the next refresh to pick a new random message.
