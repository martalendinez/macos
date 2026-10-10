// src/components/windows/Fun/funBus.js
// Lets the Dock open Extras & Fun on a specific section,
// whether the window is already open (event) or still loading (pending value).

const EVENT = "portfolio:fun-category";
let pending = null;

export function requestFunCategory(id) {
  pending = id;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

/** Read the queued section without clearing it (safe to call twice in StrictMode). */
export function peekPendingCategory() {
  return pending;
}

export function clearPendingCategory() {
  pending = null;
}

export function onFunCategoryRequest(handler) {
  const fn = (e) => {
    pending = null;
    handler(e.detail);
  };
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
