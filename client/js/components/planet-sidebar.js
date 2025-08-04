export function createPlanetSidebar(planet) {
  const container = document.createElement('div');
  container.className = 'planet-sidebar';
  const features = planet.features && planet.features.length ? planet.features.join(', ') : 'None';
  const resourceEntries = Object.entries(planet.resources || {});
  const resourcesTable = resourceEntries.length
    ? `<table class="info-table"><thead><tr><th>Resource</th><th>Amount</th></tr></thead><tbody>${resourceEntries
        .map(([name, amount]) => `<tr><td>${name}</td><td>${amount}</td></tr>`)
        .join('')}</tbody></table>`
    : '<p>None</p>';
  const atmosphereEntries = Object.entries(planet.atmosphere || {});
  const atmosphereTable = atmosphereEntries.length
    ? `<table class="info-table"><thead><tr><th>Gas</th><th>%</th></tr></thead><tbody>${atmosphereEntries
        .map(([gas, percent]) => `<tr><td>${gas}</td><td>${percent}</td></tr>`)
        .join('')}</tbody></table>`
    : '<p>None</p>';
  const moons = planet.moons || [];
  const moonsTable = moons.length
    ? `<table class="info-table"><thead><tr><th>Moon</th><th>Radius</th><th>Atmosphere</th></tr></thead><tbody>${moons
        .map(
          (m) =>
            `<tr><td>${m.name}</td><td>${m.radius.toFixed(2)}</td><td>${m.atmosphere ? 'Yes' : 'No'}</td></tr>`
        )
        .join('')}</tbody></table>`
    : '<p>None</p>';

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
    <h3>Atmosphere</h3>
    ${atmosphereTable}
    <h3>Resources</h3>
    ${resourcesTable}
    <h3>Moons</h3>
    ${moonsTable}
  `;
  return container;
}
