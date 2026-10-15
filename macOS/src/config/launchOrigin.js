// src/config/launchOrigin.js
// Phones: remembers which icon launched each app, so the window can zoom out of it and back into it.
const origins = {};

export function setLaunchOrigin(windowId, rect) {
  if (windowId && rect) origins[windowId] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width };
}

export function getLaunchOrigin(windowId) {
  return origins[windowId] ?? null;
}
