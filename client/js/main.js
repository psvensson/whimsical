import { createHeader } from './components/header.js';
import { createOverview } from './components/overview.js';
import { createSidebar, setSidebarContent, clearSidebar } from './components/sidebar.js';
import { createStarSidebar } from './components/star-sidebar.js';
import { createSystemOverview } from './components/system-overview.js';
import { createPlanetSidebar } from './components/planet-sidebar.js';

function init() {
  const app = document.getElementById('app');

  const header = createHeader('Guest', 'Explorer');
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = createSidebar();
  let overview;

  function showGalaxy() {
    const galaxyOverview = createOverview(
      (system) => {
        const starContent = createStarSidebar(system, showSystem);
        setSidebarContent(sidebar, starContent);
      },
      showSystem
    );
    if (overview) {
      main.replaceChild(galaxyOverview, overview);
    } else {
      main.append(galaxyOverview);
    }
    overview = galaxyOverview;
  }

  function showSystem(system) {
    clearSidebar(sidebar);
    const systemView = createSystemOverview(
      system,
      showGalaxy,
      (planet) => {
        const planetContent = createPlanetSidebar(planet);
        setSidebarContent(sidebar, planetContent);
      },
      overview.width,
      overview.height
    );
    main.replaceChild(systemView, overview);
    overview = systemView;
  }

  showGalaxy();
  main.append(sidebar);
  app.append(header, main);
}

document.addEventListener('DOMContentLoaded', init);
