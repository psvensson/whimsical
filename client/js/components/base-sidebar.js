export function createBaseSidebar(base) {
  const container = document.createElement('div');
  container.className = 'base-sidebar';
  const orbit = base.orbitDistance || 0;
  container.innerHTML = `
    <h2>${base.name}</h2>
    <ul>
      <li><strong>Orbit Distance:</strong> ${orbit.toFixed(3)} AU</li>
      <li><strong>Radius:</strong> ${base.radius.toFixed(2)}</li>
      <li><strong>Population:</strong> ${base.population}</li>
    </ul>
  `;
  return container;
}
