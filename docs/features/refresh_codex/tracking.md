# Refresh Persistence Tracking

| Task ID | Description | Status | Notes |
| --- | --- | --- | --- |
| T1 | Mark page dynamic so cookies are read per request | DONE | Added `export const dynamic = "force-dynamic"` |
| T2 | Read/write reason index cookie in `app/page.tsx` | DONE | Server picks random index, persists to cookie |
| T3 | Pass the persisted reason into `Hero`/`ReasonTypewriter` props | DONE | `initialReason` prop threaded through |
| T4 | Remove client-side random pick; render initial reason directly | DONE | `ReasonTypewriter` now renders the provided reason |
| T5 | Optional: mirror index to `localStorage` for client reuse | TODO |  |
| T6 | Manual verification: first paint uses persisted reason; refresh stays the same | TODO |  |
