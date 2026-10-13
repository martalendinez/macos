// src/config/a11yStore.js
// OS-wide accessibility settings (System Settings → Accessibility). Saved in localStorage and applied
// as data attributes on <html>, so every window follows them (see the a11y rules in index.css).
import { useSyncExternalStore } from "react";

const KEY = "portfolio.a11y.v1";
export const A11Y_DEFAULTS = { motion: false, contrast: false, transparency: false, text: "default", focus: false, filter: "none" };

function load() {
  try {
    return { ...A11Y_DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return A11Y_DEFAULTS;
  }
}

let state = load();
const listeners = new Set();

function apply(s) {
  if (typeof document === "undefined") return;
  const d = document.documentElement.dataset;
  d.a11yMotion = s.motion ? "reduce" : "";
  d.a11yContrast = s.contrast ? "more" : "";
  d.a11yTransparency = s.transparency ? "reduce" : "";
  d.a11yText = s.text;
  d.a11yFocus = s.focus ? "always" : "";
  d.a11yFilter = s.filter;
}
apply(state);

export const a11yStore = {
  get: () => state,
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  set(patch) {
    state = { ...state, ...patch };
    apply(state);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage blocked */
    }
    listeners.forEach((l) => l());
  },
  reset() {
    a11yStore.set(A11Y_DEFAULTS);
  },
};

export function useA11y() {
  return useSyncExternalStore(a11yStore.subscribe, a11yStore.get, a11yStore.get);
}
