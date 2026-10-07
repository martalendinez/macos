import { useCallback, useRef, useState } from "react";

export default function useWindowManager() {
  const [openWindows, setOpenWindows] = useState([]); // array of ids
  const [activeWindow, setActiveWindow] = useState(null);
  const [zMap, setZMap] = useState({});
  const zTopRef = useRef(200);

  // maximized / minimized state per window
  const [maxMap, setMaxMap] = useState({}); // { [id]: true/false }
  const [minMap, setMinMap] = useState({}); // { [id]: true/false }

  // mirrors so callbacks can read the latest state synchronously
  const stateRef = useRef({ openWindows, zMap, minMap });
  stateRef.current = { openWindows, zMap, minMap };

  const focusWindow = useCallback((id) => {
    setActiveWindow(id);
    zTopRef.current += 1;
    const next = zTopRef.current;
    setZMap((m) => (m[id] === next ? m : { ...m, [id]: next }));
  }, []);

  // like macOS: when a window goes away, the next window in the stack becomes key
  const focusTopmostExcept = useCallback((exceptId) => {
    const { openWindows: open, zMap: z, minMap: min } = stateRef.current;
    const candidates = open.filter((w) => w !== exceptId && !min[w]);
    if (!candidates.length) {
      setActiveWindow(null);
      return;
    }
    const top = candidates.reduce((a, b) => ((z[a] ?? 0) >= (z[b] ?? 0) ? a : b));
    setActiveWindow(top);
  }, []);

  const restoreWindow = useCallback(
    (id) => {
      setMinMap((m) => {
        if (!m[id]) return m;
        const copy = { ...m };
        delete copy[id];
        return copy;
      });
      focusWindow(id);
    },
    [focusWindow]
  );

  const openWindow = useCallback(
    (id) => {
      setOpenWindows((prev) => (prev.includes(id) ? prev : [...prev, id]));
      restoreWindow(id);
    },
    [restoreWindow]
  );

  const closeWindow = useCallback(
    (id) => {
      focusTopmostExcept(id);
      setOpenWindows((prev) => prev.filter((w) => w !== id));
      const drop = (prev) => {
        if (!(id in prev)) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      };
      setZMap(drop);
      setMaxMap(drop);
      setMinMap(drop);
    },
    [focusTopmostExcept]
  );

  const minimizeWindow = useCallback(
    (id) => {
      setMinMap((m) => ({ ...m, [id]: true }));
      focusTopmostExcept(id);
    },
    [focusTopmostExcept]
  );

  const toggleMaximize = useCallback(
    (id) => {
      setMaxMap((m) => ({ ...m, [id]: !m[id] }));
      focusWindow(id);
    },
    [focusWindow]
  );

  // reset window layout
  const resetLayout = useCallback(() => {
    setOpenWindows([]);
    setActiveWindow(null);
    setZMap({});
    setMaxMap({});
    setMinMap({});
    zTopRef.current = 200;
  }, []);

  return {
    openWindows,
    activeWindow,
    zMap,
    maxMap,
    minMap,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMaximize,
    minimizeWindow,
    restoreWindow,
    resetLayout,
  };
}
