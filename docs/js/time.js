let currentMonth = 0;
let playing = true;
const listeners = new Set();
let lastTick = Date.now();

export const TICK_INTERVAL_MS = 1000;
export const MAX_TICK_PROGRESS = 1;
export const PLANET_MONTH_FACTOR = 6;
export const MOON_MONTH_FACTOR = 3;
export const MONTHS_PER_YEAR = 12;

function notify() {
  for (const fn of listeners) fn(currentMonth);
}

function tick() {
  if (playing) {
    currentMonth += 1;
    lastTick = Date.now();
    notify();
  }
}

const interval = setInterval(tick, TICK_INTERVAL_MS);
if (interval.unref) interval.unref();

export function getTime() {
  return currentMonth;
}

export function getTickProgress() {
  if (!playing) return 0;
  return Math.min(
    (Date.now() - lastTick) / TICK_INTERVAL_MS,
    MAX_TICK_PROGRESS
  );
}

export function getPlanetTime() {
  return (
    currentMonth / PLANET_MONTH_FACTOR +
    getTickProgress() / PLANET_MONTH_FACTOR
  );
}

export function getMoonTime() {
  return currentMonth / MOON_MONTH_FACTOR + getTickProgress() / MOON_MONTH_FACTOR;
}

export function isPlaying() {
  return playing;
}

export function play() {
  playing = true;
  lastTick = Date.now();
  notify();
}

export function pause() {
  playing = false;
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
