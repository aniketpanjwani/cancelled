import { randomInt } from "node:crypto";

const MIN = 25_000;
const MAX = 999_000;
const formatter = new Intl.NumberFormat("en-US");

export function getPseudoCanceledCount(seed?: number) {
  const value = resolveValue(seed);
  return formatter.format(value);
}

function resolveValue(seed?: number) {
  if (typeof seed === "number") {
    return clamp(Math.round(seed), MIN, MAX);
  }

  return randomInt(MIN, MAX + 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
