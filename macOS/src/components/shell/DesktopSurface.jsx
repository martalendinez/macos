// src/components/shell/DesktopSurface.jsx
// The empty desktop: click to deselect icons, right-click for the Finder context menu.
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MenuPanel from "./menu/MenuPanel";

const MENU_W = 240;

export default function DesktopSurface({ isDark, menuItems = [], onDeselect }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!pos) return;
    const close = (e) => {
      if (e.type === "keydown" && e.key !== "Escape") return;
      if (e.target?.closest?.("[role='menu']")) return;
      setPos(null);
    };
    window.addEventListener("pointerdown", close, true);
    window.addEventListener("keydown", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("pointerdown", close, true);
      window.removeEventListener("keydown", close);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        onPointerDown={() => onDeselect?.()}
        onContextMenu={(e) => {
          e.preventDefault();
          onDeselect?.();
          const approxH = menuItems.length * 22 + 12;
          setPos({
            x: Math.min(e.clientX, window.innerWidth - MENU_W - 6),
            y: Math.min(e.clientY, window.innerHeight - approxH - 6),
          });
        }}
      />

      <AnimatePresence>
        {pos && (
          <MenuPanel
            items={menuItems}
            isDark={isDark}
            onClose={() => setPos(null)}
            style={{ left: pos.x, top: pos.y, width: MENU_W }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
