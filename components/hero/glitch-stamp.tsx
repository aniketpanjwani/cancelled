"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const STAMP_SRC = "/assets/hero/canceled-stamp.png";

export function GlitchStamp() {
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      void controls.start({
        skewX: [0, -1, 0.5, 0],
        scale: [1, 1.02, 0.98, 1],
        filter: ["none", "contrast(180%)", "none"],
        transition: { duration: 0.25, ease: "easeInOut" },
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [controls, prefersReducedMotion]);

  return (
    <motion.div
      className="relative w-full max-w-[600px]"
      animate={controls}
      initial={{ skewX: 0, scale: 1, filter: "none" }}
    >
      <Image
        src={STAMP_SRC}
        alt="Canceled stamp"
        width={600}
        height={177}
        className="pointer-events-none w-full max-w-[600px] -rotate-[3deg] select-none"
        priority
      />
    </motion.div>
  );
}
