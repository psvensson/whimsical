export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';
  sidebar.classList.add('hidden');
  return sidebar;
}

export function setSidebarContent(sidebar, content) {
  sidebar.innerHTML = '';
  sidebar.append(content);
  sidebar.classList.remove('hidden');
}

export function clearSidebar(sidebar) {
  sidebar.innerHTML = '';
  sidebar.classList.add('hidden');
}
