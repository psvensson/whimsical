import { createHeader } from './components/header.js';
import { createOverview } from './components/overview.js';
import { createSidebar, setSidebarContent } from './components/sidebar.js';
import { createStarSidebar } from './components/star-sidebar.js';

function init() {
  const app = document.getElementById('app');

  const header = createHeader('Guest', 'Explorer');
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = createSidebar();
  const overview = createOverview((star) => {
    const starContent = createStarSidebar(star);
    setSidebarContent(sidebar, starContent);
  });

  main.append(overview, sidebar);
  app.append(header, main);
}

document.addEventListener('DOMContentLoaded', init);
