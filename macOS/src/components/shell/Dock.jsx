// src/components/shell/Dock.jsx
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import DockItem, { DOCK_BASE } from "./DockItem";

function MinimizedTile({ title, icon, isDark }) {
  return (
    <div className="relative w-[86%] h-[70%]">
      <div
        className={`w-full h-full rounded-[5px] overflow-hidden ${isDark ? "bg-[#1e1e20]" : "bg-white"}`}
        style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.25), 0 3px 8px rgba(0,0,0,0.25)" }}
        title={title}
      >
        <div className={`h-[22%] flex items-center gap-[2px] px-[3px] ${isDark ? "bg-[#2a2a2c]" : "bg-[#efefef]"}`}>
          <span className="w-[3px] h-[3px] rounded-full bg-[#ff5f57]" />
          <span className="w-[3px] h-[3px] rounded-full bg-[#febc2e]" />
          <span className="w-[3px] h-[3px] rounded-full bg-[#28c840]" />
        </div>
        <div className="p-[4px] space-y-[3px]">
          <div className={`h-[3px] w-[70%] rounded ${isDark ? "bg-white/25" : "bg-black/15"}`} />
          <div className={`h-[3px] w-[90%] rounded ${isDark ? "bg-white/15" : "bg-black/10"}`} />
          <div className={`h-[3px] w-[55%] rounded ${isDark ? "bg-white/15" : "bg-black/10"}`} />
        </div>
      </div>
      {icon && (
        <img src={icon} alt="" className="absolute -right-[8%] -bottom-[14%] w-[48%] h-[48%] object-contain drop-shadow" />
      )}
    </div>
  );
}

export default function Dock({
  loaded,
  theme = "light",
  apps = [], // [{ id, label, icon, windowId }]
  docs = [], // [{ id, label, icon, onOpen }]
  minimized = [], // [{ id, title, icon }]
  runningIds = [],
  onLaunch,
  onRestore,
  hidden = false,
}) {
  const isDark = theme === "dark";
  const mouseX = useMotionValue(Infinity);

  const surface = isDark
    ? {
        background: "rgba(40,40,44,0.38)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.6), inset 0 0 0 0.5px rgba(255,255,255,0.16), 0 12px 32px rgba(0,0,0,0.35)",
      }
    : {
        background: "rgba(255,255,255,0.24)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.45), 0 12px 32px rgba(0,0,0,0.18)",
      };

  return (
    <div className="fixed bottom-[6px] inset-x-0 z-[5000] flex justify-center pointer-events-none">
      <motion.div
        className="pointer-events-auto flex items-end gap-[6px] px-[6px] pb-[6px] rounded-[22px] backdrop-blur-2xl backdrop-saturate-[1.8]"
        style={{ ...surface, height: DOCK_BASE + 12 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 110 }}
        animate={loaded ? { y: hidden ? 120 : 0 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 30, delay: 0.25 }}
        role="toolbar"
        aria-label="Dock"
      >
        {apps.map((app) => (
          <DockItem
            key={app.id}
            mouseX={mouseX}
            label={app.label}
            isDark={isDark}
            running={runningIds.includes(app.windowId)}
            bounceOnClick
            onClick={() => onLaunch?.(app)}
          >
            <img src={app.icon} alt="" draggable={false} className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]" />
          </DockItem>
        ))}

        {(minimized.length > 0 || docs.length > 0) && (
          <div className={`self-stretch w-px my-[5px] mx-[3px] ${isDark ? "bg-white/20" : "bg-black/15"}`} />
        )}

        <AnimatePresence initial={false}>
          {minimized.map((m) => (
            <motion.div
              key={m.id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="flex items-end"
            >
              <DockItem mouseX={mouseX} label={m.title} isDark={isDark} onClick={() => onRestore?.(m.id)}>
                <MinimizedTile title={m.title} icon={m.icon} isDark={isDark} />
              </DockItem>
            </motion.div>
          ))}
        </AnimatePresence>

        {docs.map((d) => (
          <DockItem key={d.id} mouseX={mouseX} label={d.label} isDark={isDark} onClick={d.onOpen}>
            <img src={d.icon} alt="" draggable={false} className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]" />
          </DockItem>
        ))}

        {/* where minimizing windows fly to (the right end of the Dock) */}
        <span data-dock-min-anchor className="self-center w-0 h-[40px] -ml-[6px] translate-x-[30px]" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
