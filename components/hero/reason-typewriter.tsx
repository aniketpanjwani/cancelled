"use client";

import type { CSSProperties } from "react";
import { Typewriter } from "motion-plus/react";
import { useReducedMotion } from "framer-motion";
import type { Reason } from "@/lib/reasons";

interface ReasonTypewriterProps {
  reason: Reason;
}

const cursorStyle: CSSProperties = {
  background: "#db4543",
  width: 2,
};

const textStyle: CSSProperties = {
  fontFamily: 'var(--font-display), "Staatliches", sans-serif',
};

export function ReasonTypewriter({ reason }: ReasonTypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const reasonText = `Reason: ${reason.title}. ${reason.description}`;

  return (
    <div className="flex w-full flex-col items-center text-center text-white lg:items-start lg:text-left">
      {prefersReducedMotion ? (
        <p className="mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-[56px]">
          {reasonText}
        </p>
      ) : (
        <Typewriter
          as="p"
          speed={0.08}
          cursorStyle={cursorStyle}
          textStyle={textStyle}
          className="mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-[56px]"
        >
          {reasonText}
        </Typewriter>
      )}
    </div>
  );
}
