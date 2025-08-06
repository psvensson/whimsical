import {
  subscribe as subscribeTime,
  play,
  pause,
  isPlaying,
  getTime,
} from '../time.js';

export function createHeader(userName, playerName) {
  const header = document.createElement('header');
  header.id = 'header';

  const userInfo = document.createElement('span');
  userInfo.className = 'user-info';
  userInfo.textContent = `User: ${userName}`;

  const playerInfo = document.createElement('span');
  playerInfo.className = 'player-info';
  playerInfo.textContent = `Player: ${playerName}`;

  const infoContainer = document.createElement('div');
  infoContainer.append(userInfo, playerInfo);

  const controls = document.createElement('div');
  controls.className = 'time-controls';

  const display = document.createElement('span');
  display.className = 'time-display';

  const playBtn = document.createElement('button');
  playBtn.textContent = '▶';

  const pauseBtn = document.createElement('button');
  pauseBtn.textContent = '⏸';

  function updateDisplay(months) {
    const year = Math.floor(months / 12);
    const month = months % 12;
    display.textContent = `${year}:${month}`;
    playBtn.disabled = isPlaying();
    pauseBtn.disabled = !isPlaying();
  }

  playBtn.addEventListener('click', () => {
    play();
    updateDisplay(getTime());
  });
  pauseBtn.addEventListener('click', () => {
    pause();
    updateDisplay(getTime());
  });

  controls.append(display, playBtn, pauseBtn);
  const unsubscribe = subscribeTime(updateDisplay);
  updateDisplay(getTime());

  header.append(infoContainer, controls);

  header.destroy = () => {
    unsubscribe();
  };

  return header;
}
