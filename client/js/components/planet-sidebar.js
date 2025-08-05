export function createPlanetSidebar(planet) {
  const container = document.createElement('div');
  container.className = 'planet-sidebar';
  const surfaceObjects = (planet.features || []).filter((f) => f !== 'base');
  const surfaceContent = surfaceObjects.length
    ? `<ul>${surfaceObjects.map((s) => `<li>${s}</li>`).join('')}</ul>`
    : '<p>None</p>';
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
    ? `<table class="info-table"><thead><tr><th>Name</th><th>Type</th><th>Radius</th><th>Atmosphere</th></tr></thead><tbody>${moons
        .map(
          (m, i) =>
            `<tr><td>${m.name || `Object ${i + 1}`}</td><td>${m.type} ${m.kind}</td><td>${m.radius.toFixed(2)}</td><td>${m.atmosphere ? formatAtmosphere(m.atmosphere) : 'None'}</td></tr>`
        )
        .join('')}</tbody></table>`
    : '<p>None</p>';

  container.innerHTML = `
    <h2>${planet.type} ${planet.kind}</h2>
    <ul>
      <li><strong>Distance:</strong> ${planet.distance.toFixed(2)} AU</li>
      <li><strong>Radius:</strong> ${planet.radius.toFixed(2)}</li>
      <li><strong>Temperature:</strong> ${planet.temperature.toFixed(2)} K</li>
      <li><strong>Habitable:</strong> ${planet.isHabitable ? 'Yes' : 'No'}</li>
      <li><strong>Orbital Period:</strong> ${planet.orbitalPeriod.toFixed(2)} years</li>
      <li><strong>Eccentricity:</strong> ${planet.eccentricity.toFixed(2)}</li>
    </ul>
    <h3>Surface Objects</h3>
    ${surfaceContent}
    <h3>Atmosphere</h3>
    ${atmosphereTable}
    <h3>Resources</h3>
    ${resourcesTable}
    <h3>Orbiting Objects</h3>
    ${moonsTable}
  `;
  return container;
}

function formatAtmosphere(atmo) {
  return Object.entries(atmo)
    .map(([gas, percent]) => `${gas} (${percent}%)`)
    .join(', ');
}
