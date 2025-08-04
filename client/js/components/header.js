export function createHeader(userName, playerName) {
  const header = document.createElement('header');
  header.id = 'header';

  const userInfo = document.createElement('span');
  userInfo.className = 'user-info';
  userInfo.textContent = `User: ${userName}`;

  const playerInfo = document.createElement('span');
  playerInfo.className = 'player-info';
  playerInfo.textContent = `Player: ${playerName}`;

  header.append(userInfo, playerInfo);
  return header;
}
