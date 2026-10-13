// src/components/shell/Dock.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import DockItem, { DOCK_BASE } from "./DockItem";

/** A Dock stack: a frosted grid of apps that pops up above its Dock icon. */
function StackPopover({ stack, anchorX, isDark, onClose }) {
  const n = stack.items.length;
  const cols = n === 4 ? 2 : Math.min(n, 3);
  const width = Math.min(cols * 92 + 28, window.innerWidth - 16);
  const left = Math.max(8, Math.min(anchorX - width / 2, window.innerWidth - width - 8));
  const arrow = Math.max(22, Math.min(anchorX - left, width - 22));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const panel = isDark
    ? { background: "rgba(36,36,40,0.82)", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(255,255,255,0.14), 0 22px 50px rgba(0,0,0,0.45)" }
    : { background: "rgba(246,246,248,0.86)", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 22px 50px rgba(0,0,0,0.25)" };

  return (
    <>
      <div className="fixed inset-0 z-[4990]" onClick={onClose} onContextMenu={onClose} />
      <motion.div
        role="dialog"
        aria-label={`${stack.label} stack`}
        className={`fixed z-[5010] rounded-[18px] px-3.5 pt-3 pb-3.5 backdrop-blur-2xl backdrop-saturate-[1.8] ${isDark ? "text-white" : "text-black"}`}
        style={{ ...panel, left, width, bottom: DOCK_BASE + 32, transformOrigin: `${arrow}px 100%` }}
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.14 } }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        <div className="flex items-center justify-between gap-2 pl-0.5">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">{stack.label}</span>
          {stack.onSeeAll && (
            <button
              type="button"
              onClick={() => {
                stack.onSeeAll();
                onClose();
              }}
              className={`text-[12px] font-medium ${isDark ? "text-[#4aa3ff]" : "text-[#0a6fe0]"} hover:underline`}
            >
              See all ›
            </button>
          )}
        </div>

        <div className="mt-2.5 grid gap-y-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {stack.items.map((it, i) => (
            <motion.button
              key={it.key}
              type="button"
              onClick={() => {
                it.onOpen();
                onClose();
              }}
              className={`group flex flex-col items-center gap-1.5 rounded-[12px] px-1 pt-2 pb-1.5 ${isDark ? "hover:bg-white/[0.08]" : "hover:bg-black/[0.05]"}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <img src={it.icon} alt="" draggable={false} className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-transform group-hover:scale-[1.06]" />
              <span className={`text-[11.5px] leading-tight text-center truncate max-w-full ${isDark ? "text-white/80" : "text-black/75"}`}>{it.label}</span>
            </motion.button>
          ))}
        </div>

        {/* little pointer down to the Dock icon */}
        <span
          className="absolute -bottom-[7px] w-3.5 h-3.5 rotate-45 rounded-[3px]"
          style={{ left: arrow - 7, background: panel.background, boxShadow: isDark ? "0.5px 0.5px 0 rgba(0,0,0,0.5)" : "0.5px 0.5px 0 rgba(0,0,0,0.08)" }}
        />
      </motion.div>
    </>
  );
}

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
  const [openStack, setOpenStack] = useState(null); // { id, x }
  const activeStack = openStack && apps.find((a) => a.id === openStack.id);

  // close the stack when the Dock hides (e.g. a phone app goes full screen)
  useEffect(() => {
    if (hidden) setOpenStack(null);
  }, [hidden]);

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
        // magnify only for a real mouse; on touch screens the icons stay put
        onPointerMove={(e) => e.pointerType === "mouse" && mouseX.set(e.clientX)}
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
            tourId={`dock-${app.id}`}
            mouseX={mouseX}
            label={app.label}
            isDark={isDark}
            running={app.stack ? app.stack.items.some((it) => it.windowId && runningIds.includes(it.windowId)) : runningIds.includes(app.windowId)}
            bounceOnClick={!app.stack}
            peek={app.stack ? app.stack.items.map((it) => it.icon).filter(Boolean) : []}
            active={openStack?.id === app.id}
            onClick={(e) => {
              if (!app.stack) return onLaunch?.(app);
              const r = e?.currentTarget?.getBoundingClientRect();
              setOpenStack((o) => (o?.id === app.id ? null : { id: app.id, x: r ? r.left + r.width / 2 : window.innerWidth / 2 }));
            }}
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

      <AnimatePresence>
        {activeStack && (
          <div className="pointer-events-auto">
            <StackPopover key={activeStack.id} stack={activeStack.stack} anchorX={openStack.x} isDark={isDark} onClose={() => setOpenStack(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
