export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';
  sidebar.classList.add('hidden');
  sidebar.textContent = 'Details';
  return sidebar;
}

export function showSidebar(sidebar, content) {
  sidebar.textContent = content;
  sidebar.classList.remove('hidden');
}

export function hideSidebar(sidebar) {
  sidebar.classList.add('hidden');
}
