# Feature: Persist Message on Refresh

## Problem Statement

Currently, when a user visits the site and receives a cancellation reason, refreshing the page generates a **new random reason**. This is because the message selection happens client-side in `useEffect` with `Math.random()`, and there's no persistence mechanism.

**Current behavior:**
1. User visits site → sees "Reason: for wearing blackface at a company Halloween party"
2. User refreshes → sees "Reason: for saying 'all lives matter'" (different message)

**Desired behavior:**
1. User visits site → sees "Reason: for wearing blackface at a company Halloween party"
2. User refreshes → sees the **same** message
3. Only gets a new message when explicitly requesting one (e.g., clicking a "Get Another" button)

---

## Solution Options

### Option 1: localStorage (Recommended)

**Pros:**
- Persists across browser sessions
- No server-side changes needed
- Simple to implement
- Works offline

**Cons:**
- Cleared if user clears browser data
- Not shared across devices

### Option 2: sessionStorage

**Pros:**
- Simpler mental model (cleared when tab closes)
- Good for "single session" persistence

**Cons:**
- Lost when user closes tab/browser
- Not shared across tabs

### Option 3: URL Parameter

**Pros:**
- Shareable links preserve the message
- No cookies or storage needed
- SEO-friendly (each reason can be indexed)

**Cons:**
- URL becomes longer and "uglier"
- Requires additional routing logic

### Option 4: Cookie

**Pros:**
- Works with server-side rendering
- Can be read before hydration

**Cons:**
- Requires cookie consent in some regions
- Adds complexity for a simple use case

---

## Recommended Implementation: localStorage + URL Param Hybrid

This approach combines the best of both worlds:
- **localStorage** for returning visitors
- **URL parameter** for shareable links

---

## Implementation Guide

### Step 1: Update `reason-typewriter.tsx`

Replace the current random selection logic with persistence:

```tsx
// components/hero/reason-typewriter.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import REASONS, { type Reason } from "@/lib/reasons";
import { Typewriter } from "motion-plus/react";

const STORAGE_KEY = "canceled_reason_index";

// Helper to get reason index from URL
function getReasonFromURL(): number | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const reasonParam = params.get("r");

  if (reasonParam !== null) {
    const index = parseInt(reasonParam, 10);
    if (!isNaN(index) && index >= 0 && index < REASONS.length) {
      return index;
    }
  }
  return null;
}

// Helper to get reason index from localStorage
function getReasonFromStorage(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const index = parseInt(stored, 10);
      if (!isNaN(index) && index >= 0 && index < REASONS.length) {
        return index;
      }
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
  return null;
}

// Helper to save reason index to localStorage
function saveReasonToStorage(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, index.toString());
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

// Helper to update URL without page reload
function updateURLWithReason(index: number): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("r", index.toString());

  // Use replaceState to avoid adding to browser history
  window.history.replaceState({}, "", url.toString());
}

export function ReasonTypewriter() {
  const [reasonIndex, setReasonIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (REASONS.length === 0) return;

    // Priority: URL param > localStorage > random
    let index = getReasonFromURL();

    if (index === null) {
      index = getReasonFromStorage();
    }

    if (index === null) {
      // Generate new random index
      index = Math.floor(Math.random() * REASONS.length);
    }

    // Save to storage and update URL
    saveReasonToStorage(index);
    updateURLWithReason(index);

    setReasonIndex(index);
  }, []);

  // Fallback while loading
  if (reasonIndex === null) {
    return null; // Or a loading skeleton
  }

  const selectedReason = REASONS[reasonIndex];
  const reasonText = selectedReason.description
    ? `Reason: ${selectedReason.title} ${selectedReason.description}`
    : `Reason: ${selectedReason.title}`;

  const textClassName =
    "font-display text-4xl sm:text-5xl md:text-[56px] text-white uppercase leading-tight tracking-tight max-w-4xl";

  if (prefersReducedMotion) {
    return <p className={textClassName}>{reasonText}</p>;
  }

  const cursorStyle = { background: "#db4543", width: 2 };
  const textStyle = { fontFamily: "var(--font-display)" };

  return (
    <Typewriter
      as="p"
      speed={0.08}
      cursorStyle={cursorStyle}
      textStyle={textStyle}
      className={textClassName}
    >
      {reasonText}
    </Typewriter>
  );
}

export default ReasonTypewriter;
```

### Step 2: Add a "Get New Reason" Function (Optional)

If you want users to be able to get a new reason:

```tsx
// Add this to reason-typewriter.tsx or export from a hook

export function useNewReason() {
  const getNewReason = useCallback(() => {
    if (REASONS.length === 0) return;

    // Get current index to avoid showing the same reason
    const currentIndex = getReasonFromStorage();
    let newIndex: number;

    do {
      newIndex = Math.floor(Math.random() * REASONS.length);
    } while (newIndex === currentIndex && REASONS.length > 1);

    saveReasonToStorage(newIndex);
    updateURLWithReason(newIndex);

    // Force page reload to show new reason with animation
    window.location.reload();
  }, []);

  return { getNewReason };
}
```

### Step 3: Create a "Get New Reason" Button (Optional)

Add to `cta-cluster.tsx` or create a new component:

```tsx
// components/hero/new-reason-button.tsx
"use client";

import { useNewReason } from "./reason-typewriter";

export function NewReasonButton() {
  const { getNewReason } = useNewReason();

  return (
    <button
      onClick={getNewReason}
      className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
    >
      Get a different reason
    </button>
  );
}
```

---

## Alternative: Server-Side with Cookies

If you prefer server-side rendering of the reason (for SEO or faster initial paint):

### Step 1: Create a Cookie Utility

```ts
// lib/reason-cookie.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "canceled_reason_index";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getReasonIndexFromCookie(): Promise<number | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (cookie?.value) {
    const index = parseInt(cookie.value, 10);
    if (!isNaN(index) && index >= 0) {
      return index;
    }
  }
  return null;
}

export function setReasonCookie(index: number): void {
  // This needs to be called from a Server Action or Route Handler
  cookies().set(COOKIE_NAME, index.toString(), {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}
```

### Step 2: Update Page Component

```tsx
// app/page.tsx
import { cookies } from "next/headers";
import REASONS from "@/lib/reasons";

export default async function Home() {
  const cookieStore = await cookies();
  const storedIndex = cookieStore.get("canceled_reason_index")?.value;

  let reasonIndex: number;

  if (storedIndex !== undefined) {
    reasonIndex = parseInt(storedIndex, 10);
    if (isNaN(reasonIndex) || reasonIndex < 0 || reasonIndex >= REASONS.length) {
      reasonIndex = Math.floor(Math.random() * REASONS.length);
    }
  } else {
    reasonIndex = Math.floor(Math.random() * REASONS.length);
  }

  // Pass to Hero component
  return <Hero reasonIndex={reasonIndex} canceledCount={...} />;
}
```

### Step 3: Create Server Action to Set Cookie

```tsx
// app/actions.ts
"use server";

import { cookies } from "next/headers";
import REASONS from "@/lib/reasons";

export async function setReasonCookie(index: number) {
  if (index < 0 || index >= REASONS.length) {
    throw new Error("Invalid reason index");
  }

  cookies().set("canceled_reason_index", index.toString(), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });
}

export async function getNewReasonIndex() {
  const newIndex = Math.floor(Math.random() * REASONS.length);
  await setReasonCookie(newIndex);
  return newIndex;
}
```

---

## URL Parameter Format

The URL parameter approach allows shareable links:

```
https://youdeserved.it/?r=42
```

Where `r` is the index of the reason in the `REASONS` array.

### Benefits:
- Users can share their specific cancellation reason
- Bookmarkable
- Works without JavaScript (if combined with server-side rendering)

### SEO Consideration:
Add a canonical URL to prevent duplicate content issues:

```tsx
// app/layout.tsx or app/page.tsx
export const metadata = {
  alternates: {
    canonical: "https://youdeserved.it",
  },
};
```

---

## Testing Checklist

- [ ] First visit shows random reason and saves to localStorage
- [ ] Refresh shows the same reason
- [ ] URL updates with `?r=` parameter
- [ ] Visiting with `?r=X` shows reason at index X
- [ ] Invalid `?r=` values fall back to localStorage or random
- [ ] "Get new reason" button works (if implemented)
- [ ] Works in private/incognito mode (graceful fallback)
- [ ] Works with JavaScript disabled (if using SSR approach)

---

## Migration Notes

The current implementation in `reason-typewriter.tsx` needs these changes:

1. Add localStorage read/write helpers
2. Add URL parameter parsing
3. Update the `useEffect` to check storage before generating random
4. Optionally update URL on mount

No changes needed to:
- `lib/reasons.ts` (data source)
- `content/reasons.json` (data)
- `Hero.tsx` (layout)
- `app/page.tsx` (unless using SSR cookie approach)
