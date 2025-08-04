import { createHeader } from './components/header.js';
import { createOverview } from './components/overview.js';
import { createSidebar, setSidebarContent } from './components/sidebar.js';
import { createStarSidebar } from './components/star-sidebar.js';
import { createSystemOverview } from './components/system-overview.js';

function init() {
  const app = document.getElementById('app');

  const header = createHeader('Guest', 'Explorer');
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = createSidebar();
  let overview;

  function showGalaxy() {
    const galaxyOverview = createOverview((system) => {
      const starContent = createStarSidebar(system, showSystem);
      setSidebarContent(sidebar, starContent);
    });
    if (overview) {
      main.replaceChild(galaxyOverview, overview);
    } else {
      main.append(galaxyOverview);
    }
    overview = galaxyOverview;
  }

  function showSystem(system) {
    const systemView = createSystemOverview(system, showGalaxy);
    main.replaceChild(systemView, overview);
    overview = systemView;
  }

  showGalaxy();
  main.append(sidebar);
  app.append(header, main);
}

document.addEventListener('DOMContentLoaded', init);
