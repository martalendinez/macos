// src/config/workspaceBus.js
// Opens an app on a specific project ("workspace"), e.g. Figma on the Trace design file.
// Works whether the app window is already open (event) or still loading (pending value).
import { useEffect } from "react";

const EVENT = "portfolio:workspace";
const pending = {};

/** Ask `app` (window id) to switch to `project`. Pair with onOpenWindow(app) to bring the window up. */
export function openWorkspace(app, project) {
  pending[app] = project;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { app, project } }));
}

/** Calls handler(project) on mount if a request is queued for this app, and on every later request. */
export function useWorkspace(app, handler) {
  useEffect(() => {
    if (pending[app]) {
      handler(pending[app]);
      delete pending[app];
    }
    const fn = (e) => {
      if (e.detail.app !== app) return;
      delete pending[app];
      handler(e.detail.project);
    };
    window.addEventListener(EVENT, fn);
    return () => window.removeEventListener(EVENT, fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);
}
