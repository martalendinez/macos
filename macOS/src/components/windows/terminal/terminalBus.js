// src/components/windows/terminal/terminalBus.js
// Lets other windows (e.g. Extras & Fun) start a Terminal game.
// Works whether Terminal is already open (event) or still loading (pending value).

const EVENT = "portfolio:terminal-play";
let pending = null;

export function requestTerminalGame(name) {
  pending = name;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}

/** Returns the queued game (if any) and clears it. */
export function consumePendingGame() {
  const g = pending;
  pending = null;
  return g;
}

export function onTerminalGameRequest(handler) {
  const fn = (e) => {
    pending = null;
    handler(e.detail);
  };
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
