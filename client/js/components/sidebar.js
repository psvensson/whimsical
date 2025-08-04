export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';
  sidebar.classList.add('hidden');
  return sidebar;
}

export function showSidebar(sidebar, star) {
  sidebar.innerHTML = `
    <h2>${star.name}</h2>
    <ul>
      <li>Mass: ${star.mass.toFixed(2)}</li>
      <li>Luminosity: ${star.luminosity.toFixed(2)}</li>
      <li>Radius: ${star.radius.toFixed(2)}</li>
    </ul>
  `;
  sidebar.classList.remove('hidden');
}

export function hideSidebar(sidebar) {
  sidebar.classList.add('hidden');
}
