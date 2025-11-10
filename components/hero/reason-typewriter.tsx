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

  return (
    <div className="flex w-full flex-col items-center text-center text-white lg:items-start lg:text-left">
      <p className="font-display text-2xl uppercase tracking-[0.2em] text-white/80">
        Reason:
      </p>
      {prefersReducedMotion ? (
        <p className="mt-4 line-clamp-3 font-display text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-[56px]">
          {reason.title}
        </p>
      ) : (
        <Typewriter
          as="p"
          speed={0.08}
          cursorStyle={cursorStyle}
          textStyle={textStyle}
          className="mt-4 line-clamp-3 font-display text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-[56px]"
        >
          {reason.title}
        </Typewriter>
      )}
      <p className="mt-4 max-w-xl text-base text-white/70">
        {reason.description}
      </p>
    </div>
  );
}
