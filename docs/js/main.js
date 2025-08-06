import { createHeader } from './components/header.js';
import { createGalaxyOverview } from './components/galaxy-overview.js';
import { createSidebar, setSidebarContent, clearSidebar } from './components/sidebar.js';
import { createStarSidebar } from './components/star-sidebar.js';
import { createSystemOverview } from './components/system-overview.js';
import { createPlanetSidebar } from './components/planet-sidebar.js';
import { createPlanetOverview } from './components/planet-overview.js';
import { createBaseSidebar } from './components/base-sidebar.js';
import { generateGalaxy } from './galaxy.js';

export function init() {
  const app = document.getElementById('app');

  const header = createHeader('Guest', 'Explorer');
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = createSidebar();
  let overview;
  let galaxy;

  function showGalaxy(selectedSystem = null) {
    const galaxyOverview = createGalaxyOverview(
      galaxy,
      (system) => {
        const starContent = createStarSidebar(system, showSystem);
        setSidebarContent(sidebar, starContent);
      },
      showSystem,
      selectedSystem
    );
    if (overview) {
      main.replaceChild(galaxyOverview, overview);
    } else {
      main.append(galaxyOverview);
    }
    overview = galaxyOverview;

    if (selectedSystem) {
      const starContent = createStarSidebar(selectedSystem, showSystem);
      setSidebarContent(sidebar, starContent);
    } else {
      clearSidebar(sidebar);
    }
  }

  function showSystem(system, selectedPlanet = null) {
    const systemView = createSystemOverview(
      system,
      () => showGalaxy(system),
      (planet) => {
        const planetContent = createPlanetSidebar(planet);
        setSidebarContent(sidebar, planetContent);
      },
      (planet) => showPlanet(system, planet),
      () => {
        const starContent = createStarSidebar(system);
        setSidebarContent(sidebar, starContent);
      },
      selectedPlanet,
      overview.offsetWidth,
      overview.offsetHeight
    );
    main.replaceChild(systemView, overview);
    overview = systemView;
    if (selectedPlanet) {
      const planetContent = createPlanetSidebar(selectedPlanet);
      setSidebarContent(sidebar, planetContent);
    } else {
      clearSidebar(sidebar);
    }
  }

  function showPlanet(system, planet) {
    const planetView = createPlanetOverview(
      planet,
      () => showSystem(system, planet),
      (obj) => {
        let content;
        if (obj.type === 'base') {
          content = createBaseSidebar(obj);
        } else {
          content = createPlanetSidebar(obj);
        }
        setSidebarContent(sidebar, content);
      },
      overview.offsetWidth,
      overview.offsetHeight
    );
    main.replaceChild(planetView, overview);
    overview = planetView;
    const planetContent = createPlanetSidebar(planet);
    setSidebarContent(sidebar, planetContent);
  }

  main.append(sidebar);
  app.append(header, main);

  setTimeout(() => {
    galaxy = generateGalaxy(100);
    showGalaxy();
  }, 0);
}
// Ensure init runs even if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
