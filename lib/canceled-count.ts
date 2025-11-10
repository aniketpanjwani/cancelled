const formatter = new Intl.NumberFormat("en-US");

const BASE_COUNT = Number(process.env.CANCELED_COUNT_BASE ?? 984);
const START_TIMESTAMP = process.env.CANCELED_COUNT_START ?? "2024-01-01T00:00:00Z";
const INCREASE_PER_DAY = Number(process.env.CANCELED_COUNT_PER_DAY ?? 120);

export function getComputedCanceledCount(date: Date = new Date()) {
  const start = Date.parse(START_TIMESTAMP);
  if (Number.isNaN(start)) {
    return formatter.format(BASE_COUNT);
  }

  const elapsedMs = Math.max(0, date.getTime() - start);
  const increments = Math.floor(
    (elapsedMs / (24 * 60 * 60 * 1000)) * Math.max(0, INCREASE_PER_DAY),
  );

  return formatter.format(BASE_COUNT + increments);
}
