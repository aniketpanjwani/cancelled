"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Typewriter } from "motion-plus/react";
import { useReducedMotion } from "framer-motion";
import reasonsData from "@/content/reasons.json";
import type { Reason } from "@/lib/reasons";

const REASONS: Reason[] = reasonsData.reasons;

const cursorStyle: CSSProperties = {
  background: "#db4543",
  width: 2,
};

const textStyle: CSSProperties = {
  fontFamily: 'var(--font-display), "Staatliches", sans-serif',
};

export function ReasonTypewriter() {
  const prefersReducedMotion = useReducedMotion();
  const [reason, setReason] = useState<Reason | null>(null);

  useEffect(() => {
    if (REASONS.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * REASONS.length);
    setReason(REASONS[index]);
  }, []);

  if (REASONS.length === 0) {
    return null;
  }

  const selectedReason = reason ?? REASONS[0];
  const title = selectedReason.title?.trim() ?? "";
  const description = selectedReason.description?.trim();
  const reasonText = description
    ? `Reason: ${title} ${description}`
    : `Reason: ${title}`;
  const shouldAnimate = !prefersReducedMotion && Boolean(reason);

  const textClassName =
    "mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-[56px]";

  return (
    <div className="flex w-full flex-col items-center text-center text-white lg:items-start lg:text-left">
      {shouldAnimate ? (
        <Typewriter
          as="p"
          speed={0.08}
          cursorStyle={cursorStyle}
          textStyle={textStyle}
          className={textClassName}
        >
          {reasonText}
        </Typewriter>
      ) : (
        <p className={textClassName}>{reasonText}</p>
      )}
    </div>
  );
}
