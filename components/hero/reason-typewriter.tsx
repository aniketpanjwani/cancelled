"use client";

import type { CSSProperties } from "react";
import { Typewriter } from "motion-plus/react";
import { useReducedMotion } from "framer-motion";
import type { Reason } from "@/lib/reasons";

interface ReasonTypewriterProps {
  initialReason: Reason | null;
}

const cursorStyle: CSSProperties = {
  background: "#db4543",
  width: 2,
};

const textStyle: CSSProperties = {
  fontFamily: 'var(--font-display), "Staatliches", sans-serif',
};

export function ReasonTypewriter({ initialReason }: ReasonTypewriterProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!initialReason) {
    return null;
  }

  const title = initialReason.title?.trim() ?? "";
  const description = initialReason.description?.trim();
  const reasonText = description ? `Reason: ${title} ${description}` : `Reason: ${title}`;
  const shouldAnimate = !prefersReducedMotion;

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
