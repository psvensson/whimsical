export function createPlanetSidebar(planet) {
  const container = document.createElement('div');
  container.className = 'planet-sidebar';
  const features = planet.features && planet.features.length ? planet.features.join(', ') : 'None';
  container.innerHTML = `
    <h2>${planet.type}</h2>
    <ul>
      <li><strong>Distance:</strong> ${planet.distance.toFixed(2)} AU</li>
      <li><strong>Radius:</strong> ${planet.radius.toFixed(2)}</li>
      <li><strong>Temperature:</strong> ${planet.temperature.toFixed(2)} K</li>
      <li><strong>Habitable:</strong> ${planet.isHabitable ? 'Yes' : 'No'}</li>
      <li><strong>Orbital Period:</strong> ${planet.orbitalPeriod.toFixed(2)} years</li>
      <li><strong>Features:</strong> ${features}</li>
    </ul>
  `;
  return container;
}
