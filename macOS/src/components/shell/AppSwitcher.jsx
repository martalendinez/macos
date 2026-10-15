// src/components/shell/AppSwitcher.jsx
// The macOS app switcher: hold ⌥ (Option/Alt) and press Tab to cycle through open windows,
// let go to jump to the highlighted one. (⌘Tab itself is taken by macOS, so it never reaches the page.)
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AppSwitcher({ windows, onPick, isDark }) {
  // windows: [{ id, title, icon }] most recent first
  const [index, setIndex] = useState(null);
  const latest = useRef({ windows, index: null });
  latest.current = { windows, index };

  useEffect(() => {
    const down = (e) => {
      const { windows: list, index: i } = latest.current;
      if (e.key === "Tab" && e.altKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (list.length < 2 && i === null) return;
        const step = e.shiftKey ? -1 : 1;
        setIndex((cur) => {
          const from = cur ?? 0;
          return (from + step + list.length) % list.length;
        });
      } else if (e.key === "Escape" && i !== null) {
        setIndex(null);
      }
    };
    const up = (e) => {
      const { windows: list, index: i } = latest.current;
      if (e.key === "Alt" && i !== null) {
        const w = list[i];
        setIndex(null);
        if (w) onPick(w.id);
      }
    };
    const blur = () => setIndex(null);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [onPick]);

  const current = index !== null ? windows[index] : null;

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div className="fixed inset-0 z-[9800] flex items-center justify-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.08 }}>
          <div
            role="listbox"
            aria-label="Open windows"
            className="pointer-events-auto max-w-[92vw] rounded-[26px] px-3 pt-3 pb-2 backdrop-blur-2xl backdrop-saturate-[1.8]"
            style={{
              background: isDark ? "rgba(40,40,44,0.6)" : "rgba(230,230,234,0.55)",
              boxShadow: isDark ? "0 0 0 0.5px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(255,255,255,0.15), 0 30px 60px rgba(0,0,0,0.45)" : "0 0 0 0.5px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 30px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
              {windows.map((w, i) => (
                <button
                  key={w.id}
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setIndex(null);
                    onPick(w.id);
                  }}
                  className={`shrink-0 w-[112px] h-[112px] rounded-[18px] flex items-center justify-center transition-colors ${i === index ? (isDark ? "bg-white/15" : "bg-black/10") : ""}`}
                >
                  <img src={w.icon} alt="" draggable={false} className="w-[88px] h-[88px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" />
                </button>
              ))}
            </div>
            <div className={`mt-1 text-center text-[13px] font-medium truncate ${isDark ? "text-white/85" : "text-black/80"}`}>{current?.title}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
