import { randomInt } from "node:crypto";
import reasonsData from "@/content/reasons.json";

const REASONS = reasonsData.reasons;

export type Reason = (typeof REASONS)[number];

export function getRandomReason(seed?: number): Reason {
  if (REASONS.length === 0) {
    throw new Error("Reasons dataset is empty");
  }

  const totalWeight = REASONS.reduce(
    (sum, reason) => sum + (reason.weight ?? 1),
    0,
  );

  if (totalWeight <= 0) {
    return REASONS[0];
  }

  const upperBound = totalWeight;
  const randomValue =
    typeof seed === "number"
      ? Math.max(0, Math.min(seed, upperBound - 1))
      : randomInt(upperBound);

  let accumulator = 0;
  for (const reason of REASONS) {
    accumulator += reason.weight ?? 1;
    if (randomValue < accumulator) {
      return reason;
    }
  }

  return REASONS[REASONS.length - 1];
}

export function getAllReasons() {
  return REASONS;
}
