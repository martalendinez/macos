// src/config/island.js
// Tiny event hub for the iPhone Dynamic Island (phone layout only).
// island({ icon, title, sub }) shows a short alert; nowPlaying({...}) keeps a live activity going.

export function island(detail) {
  window.dispatchEvent(new CustomEvent("portfolio:island", { detail }));
}

export function nowPlaying(detail) {
  window.dispatchEvent(new CustomEvent("portfolio:nowplaying", { detail }));
}
