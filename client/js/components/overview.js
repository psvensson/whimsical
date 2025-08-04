export function createOverview() {
  const overview = document.createElement('div');
  overview.id = 'overview';
  overview.textContent = 'Select a location to see details.';
  return overview;
}
