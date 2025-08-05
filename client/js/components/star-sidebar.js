export function createStarSidebar(system, onGoToSystem) {
  const star = system.stars[0];
  const container = document.createElement('div');
  container.className = 'star-sidebar';
  container.innerHTML = `
    <div class="sidebar-label">Star System</div>
    <h2 style="color:${star.color}">${star.name}</h2>
    <ul>
      <li><strong>Class:</strong> ${star.class}</li>
      <li><strong>Mass:</strong> ${star.mass.toFixed(2)} M☉</li>
      <li><strong>Luminosity:</strong> ${star.luminosity.toFixed(2)} L☉</li>
      <li><strong>Radius:</strong> ${star.radius.toFixed(2)} R☉</li>
      <li><strong>Habitable Zone:</strong> ${star.habitableZone[0].toFixed(2)} - ${star.habitableZone[1].toFixed(2)} AU</li>
    </ul>
  `;

  const btn = document.createElement('button');
  btn.textContent = 'Go to system';
  btn.addEventListener('click', () => {
    if (typeof onGoToSystem === 'function') {
      onGoToSystem(system);
    }
  });
  container.appendChild(btn);
  return container;
}

