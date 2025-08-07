import { ORBITAL_FACILITY_CLASSES, SURFACE_FACILITY_CLASSES } from '../facilities/index.js';

function hasFacility(obj, name) {
  if (SURFACE_FACILITY_CLASSES[name]) {
    return (obj.features || []).some((f) =>
      typeof f === 'string' ? f === name : f.kind === name
    );
  }
  if (ORBITAL_FACILITY_CLASSES[name]) {
    return (obj.moons || []).some((m) => m.kind === name);
  }
  return false;
}

function canCreate(obj, name) {
  if (name === 'Spaceport') return { allowed: true, reason: '' };
  if (SURFACE_FACILITY_CLASSES[name]) {
    if (obj.type === 'gas') {
      return { allowed: false, reason: 'Cannot build on gas objects' };
    }
  }
  if (name === 'Base') {
    const ok = (obj.features || []).some((f) =>
      typeof f === 'string' ? f === 'Spaceport' : f.kind === 'Spaceport'
    );
    return { allowed: ok, reason: 'Requires Spaceport' };
  }
  if (ORBITAL_FACILITY_CLASSES[name]) {
    const ok = (obj.moons || []).some((m) => m.kind === 'Base');
    return { allowed: ok, reason: 'Requires Base in orbit' };
  }
  return { allowed: true, reason: '' };
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  toast.addEventListener('animationend', () => toast.remove());
}

function create(obj, name, facilityName) {
  if (!SURFACE_FACILITY_CLASSES[name]) return;
  if (obj.type === 'gas') return;
  obj.features = obj.features || [];
  obj.features.push({ kind: name, name: facilityName });
}

export function createFacilityDialog(obj, onCreate = null) {
  const dialog = document.createElement('dialog');
  dialog.className = 'facility-dialog';
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  const allFacilities = [
    ...Object.keys(SURFACE_FACILITY_CLASSES),
    ...Object.keys(ORBITAL_FACILITY_CLASSES),
  ];

  for (const name of allFacilities) {
    if (hasFacility(obj, name)) continue;
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    const actionCell = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent = 'Create';
    const { allowed, reason } = canCreate(obj, name);
    if (!allowed) {
      btn.disabled = true;
      row.title = reason;
      btn.title = reason;
    }
    btn.addEventListener('click', () => {
      if (ORBITAL_FACILITY_CLASSES[name]) {
        const Facility = ORBITAL_FACILITY_CLASSES[name];
        const facility = Facility.generate(null, (obj.moons || []).length, obj);
        if (!facility) return;
        const input = window.prompt('Facility name', facility.name);
        facility.name = input?.trim() || facility.name;
        if (!obj.moons) obj.moons = [];
        obj.moons.push(facility);
        showToast(`${facility.name} created`);
      } else {
        const input = window.prompt('Facility name', name);
        const facilityName = input?.trim() || name;
        create(obj, name, facilityName);
        showToast(`${facilityName} created`);
      }
      onCreate?.();
      dialog.close?.();
      dialog.remove();
    });
    actionCell.appendChild(btn);
    row.append(nameCell, actionCell);
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  dialog.appendChild(table);
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    dialog.close?.();
    dialog.remove();
  });
  dialog.appendChild(closeBtn);
  return dialog;
}
