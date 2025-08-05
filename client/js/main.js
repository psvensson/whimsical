import { createHeader } from './components/header.js';
import { createGalaxyOverview } from './components/galaxy-overview.js';
import { createSidebar, setSidebarContent, clearSidebar } from './components/sidebar.js';
import { createStarSidebar } from './components/star-sidebar.js';
import { createSystemOverview } from './components/system-overview.js';
import { createPlanetSidebar } from './components/planet-sidebar.js';
import { generateGalaxy } from './galaxy.js';

function init() {
  const app = document.getElementById('app');

  const header = createHeader('Guest', 'Explorer');
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = createSidebar();
  let overview;
  const galaxy = generateGalaxy();

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

  function showSystem(system) {
    clearSidebar(sidebar);
    const systemView = createSystemOverview(
      system,
      () => showGalaxy(system),
      (planet) => {
        const planetContent = createPlanetSidebar(planet);
        setSidebarContent(sidebar, planetContent);
      },
      overview.offsetWidth,
      overview.offsetHeight
    );
    main.replaceChild(systemView, overview);
    overview = systemView;
  }

  showGalaxy();
  main.append(sidebar);
  app.append(header, main);
}

document.addEventListener('DOMContentLoaded', init);
