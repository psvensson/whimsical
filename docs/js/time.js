let currentMonth = 0;
let playing = true;
const listeners = new Set();
let lastTick = Date.now();

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

const interval = setInterval(tick, 1000);
if (interval.unref) interval.unref();

export function getTime() {
  return currentMonth;
}

export function getTickProgress() {
  if (!playing) return 0;
  return Math.min((Date.now() - lastTick) / 1000, 1);
}

export function getPlanetTime() {
  return currentMonth / 6 + getTickProgress() / 6;
}

export function getMoonTime() {
  return currentMonth / 3 + getTickProgress() / 3;
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
