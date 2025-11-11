import { randomInt } from "node:crypto";
import reasonsData from "@/content/reasons.json";

const REASONS = reasonsData.reasons;

export type Reason = (typeof REASONS)[number];

export function getRandomReason(seed?: number): Reason {
  if (REASONS.length === 0) {
    throw new Error("Reasons dataset is empty");
  }

  const upperBound = REASONS.length;
  const randomValue =
    typeof seed === "number"
      ? Math.max(0, Math.min(seed, upperBound - 1))
      : randomInt(upperBound);

  return REASONS[randomValue];
}

export function getAllReasons() {
  return REASONS;
}
