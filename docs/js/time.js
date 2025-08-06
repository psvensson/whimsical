let currentMonth = 0;
let playing = true;
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(currentMonth);
}

function tick() {
  if (playing) {
    currentMonth += 1;
    notify();
  }
}

const interval = setInterval(tick, 1000);
if (interval.unref) interval.unref();

export function getTime() {
  return currentMonth;
}

export function isPlaying() {
  return playing;
}

export function play() {
  playing = true;
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
