// src/components/windows/MacWindow.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useDragControls, useMotionValue } from "framer-motion";
import TrafficLights from "./TrafficLights";
import useIsMobile from "../../hooks/useIsMobile";
import {
  DOCK_RESERVE,
  MENU_BAR_H,
  SPRING_WINDOW,
  WINDOW_MARGIN,
} from "../../config/shell";

const MIN_W = 420;
const MIN_H = 280;
const TITLE_H = 44;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function zoomedRect() {
  return {
    left: WINDOW_MARGIN,
    top: MENU_BAR_H + WINDOW_MARGIN,
    width: window.innerWidth - WINDOW_MARGIN * 2,
    height: window.innerHeight - MENU_BAR_H - WINDOW_MARGIN - DOCK_RESERVE,
  };
}

// Fit the requested frame on small screens (e.g. 1180×760 windows on a 13" laptop)
function initialFrame(initialPos, width, height) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw - WINDOW_MARGIN * 2;
  const maxH = vh - MENU_BAR_H - WINDOW_MARGIN - DOCK_RESERVE;
  const w = Math.min(width, maxW);
  const h = Math.min(height, maxH);
  const left = clamp(initialPos.x, WINDOW_MARGIN, vw - WINDOW_MARGIN - w);
  const top = clamp(initialPos.y, MENU_BAR_H + WINDOW_MARGIN, Math.max(MENU_BAR_H + WINDOW_MARGIN, vh - DOCK_RESERVE - h));
  return { left, top, width: w, height: h };
}

export default function MacWindow({
  id,
  title,
  isActive,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  width = 860,
  height = 560,
  initialPos = { x: 220, y: 90 },
  children,
  uiTheme = "glass",
  theme = "light",
  isMaximized = false,
  isMinimized = false,
  onToggleMaximize,
  dragBoundsRef,
  resizable = true,
}) {
  const dragControls = useDragControls();
  const outerRef = useRef(null);
  const mobile = useIsMobile(); // phones: full-screen app sheets, no drag/resize

  // Frame lives in motion values so zoom can animate and resizing stays 60fps
  const [f0] = useState(() => initialFrame(initialPos, width, height));
  const left = useMotionValue(f0.left);
  const top = useMotionValue(f0.top);
  const w = useMotionValue(f0.width);
  const h = useMotionValue(f0.height);
  const x = useMotionValue(0); // drag offset
  const y = useMotionValue(0);

  const [resizing, setResizing] = useState(false);

  // ---------- Zoom (green button / double-click title bar) ----------
  const restoreRef = useRef(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (!isMaximized) return;
    }
    const opts = SPRING_WINDOW;
    if (isMaximized) {
      restoreRef.current = { left: left.get(), top: top.get(), width: w.get(), height: h.get(), x: x.get(), y: y.get() };
      const t = zoomedRect();
      animate(left, t.left, opts);
      animate(top, t.top, opts);
      animate(w, t.width, opts);
      animate(h, t.height, opts);
      animate(x, 0, opts);
      animate(y, 0, opts);
    } else if (restoreRef.current) {
      const r = restoreRef.current;
      restoreRef.current = null;
      animate(left, r.left, opts);
      animate(top, r.top, opts);
      animate(w, r.width, opts);
      animate(h, r.height, opts);
      animate(x, r.x, opts);
      animate(y, r.y, opts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized]);

  // keep zoomed windows filling the screen when the browser is resized
  useEffect(() => {
    if (!isMaximized) return;
    function onResize() {
      const t = zoomedRect();
      left.set(t.left);
      top.set(t.top);
      w.set(t.width);
      h.set(t.height);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized]);

  // ---------- Minimize ("genie" into the Dock) ----------
  const [genie, setGenie] = useState(null);
  useLayoutEffect(() => {
    if (!isMinimized || !outerRef.current) return;
    const r = outerRef.current.getBoundingClientRect();
    const anchor = document.querySelector("[data-dock-min-anchor]")?.getBoundingClientRect();
    const tx = anchor ? anchor.left + anchor.width / 2 : window.innerWidth / 2;
    const ty = anchor ? anchor.top + anchor.height / 2 : window.innerHeight - 40;
    setGenie({
      x: tx - (r.left + r.width / 2),
      y: ty - (r.top + r.height / 2),
      s: Math.min(56 / r.width, 0.14),
    });
  }, [isMinimized]);

  const genieAnimate =
    isMinimized && genie
      ? { x: genie.x, y: genie.y, scaleX: genie.s, scaleY: genie.s * 0.85, opacity: 0 }
      : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 };

  const genieTransition = isMinimized
    ? {
        x: { duration: 0.5, ease: [0.55, 0, 0.75, 0.25] },
        y: { duration: 0.5, ease: [0.7, 0, 0.84, 0] },
        scaleX: { duration: 0.42, ease: [0.4, 0, 0.6, 1] },
        scaleY: { duration: 0.5, ease: [0.4, 0, 0.6, 1] },
        opacity: { duration: 0.5, ease: [0.9, 0, 1, 0.6] },
      }
    : { ...SPRING_WINDOW, opacity: { duration: 0.18 } };

  const zoom = () => resizable && onToggleMaximize?.(id);

  // ---------- Resize from edges ----------
  const minW = Math.min(MIN_W, f0.width);
  const minH = Math.min(MIN_H, f0.height);
  function startResize(dir) {
    return (e) => {
      if (isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus(id);
      setResizing(true);

      const sx = e.clientX;
      const sy = e.clientY;
      const sw = w.get();
      const sh = h.get();
      const sl = left.get();
      const cursor = getComputedStyle(e.currentTarget).cursor;
      document.body.style.cursor = cursor;

      const move = (ev) => {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        if (dir.includes("e")) {
          const maxW = window.innerWidth - WINDOW_MARGIN - (left.get() + x.get());
          w.set(clamp(sw + dx, minW, maxW));
        }
        if (dir.includes("w")) {
          const maxW = sw + (sl + x.get() - WINDOW_MARGIN);
          const nw = clamp(sw - dx, minW, maxW);
          left.set(sl + (sw - nw));
          w.set(nw);
        }
        if (dir.includes("s")) {
          const maxH = window.innerHeight - WINDOW_MARGIN - (top.get() + y.get());
          h.set(clamp(sh + dy, minH, maxH));
        }
      };
      const up = () => {
        setResizing(false);
        document.body.style.cursor = "";
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }

  // ---------- Styling ----------
  const isMac = uiTheme === "macos";
  const isDark = theme === "dark";

  const surfaceClass = isMac
    ? isDark
      ? "bg-[#1e1e20]"
      : "bg-white"
    : isDark
    ? "bg-black/30 backdrop-blur-2xl backdrop-saturate-150"
    : "bg-white/12 backdrop-blur-2xl backdrop-saturate-150";

  const shadow = (() => {
    const edge = isDark
      ? "0 0 0 0.5px rgba(0,0,0,0.9), inset 0 0 0 0.5px rgba(255,255,255,0.16)"
      : isMac
      ? "0 0 0 0.5px rgba(0,0,0,0.16)"
      : "0 0 0 0.5px rgba(255,255,255,0.28), inset 0 0 0 0.5px rgba(255,255,255,0.18)";
    return isActive
      ? `${edge}, 0 28px 70px -12px rgba(0,0,0,${isDark ? 0.7 : 0.42}), 0 10px 24px -8px rgba(0,0,0,${isDark ? 0.5 : 0.2})`
      : `${edge}, 0 14px 36px -12px rgba(0,0,0,${isDark ? 0.55 : 0.26})`;
  })();

  const titleBarClass = isMac
    ? isDark
      ? "bg-[#2a2a2c] border-b border-black/60"
      : "bg-[#f6f6f6] border-b border-black/10"
    : isDark
    ? "bg-black/20 border-b border-white/10"
    : "bg-white/10 border-b border-white/15";

  const titleTextClass = isMac
    ? isDark
      ? isActive ? "text-white/85" : "text-white/40"
      : isActive ? "text-black/80" : "text-black/35"
    : isActive ? "text-white/90" : "text-white/50";

  const edge = "absolute z-20";

  return (
    <motion.div
      ref={outerRef}
      role="dialog"
      aria-label={title}
      onPointerDownCapture={() => !isMinimized && onFocus(id)}
      className="fixed"
      style={
        mobile
          ? { zIndex, left: 0, top: MENU_BAR_H, width: "100vw", height: `calc(100dvh - ${MENU_BAR_H}px)`, pointerEvents: isMinimized ? "none" : "auto" }
          : { zIndex, left, top, width: w, height: h, x, y, pointerEvents: isMinimized ? "none" : "auto" }
      }
      initial={mobile ? { opacity: 0, y: 80 } : { opacity: 0, scale: 0.9 }}
      animate={mobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
      exit={mobile ? { opacity: 0, y: 80, transition: { duration: 0.2, ease: "easeIn" } } : { opacity: 0, scale: 0.94, transition: { duration: 0.16, ease: "easeIn" } }}
      transition={{ ...SPRING_WINDOW, opacity: { duration: 0.18 } }}
      drag={!mobile && !isMaximized && !resizing}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={dragBoundsRef}
      dragMomentum={false}
      dragElastic={0}
    >
      <motion.div
        className={[
          `relative w-full h-full overflow-hidden flex flex-col ${mobile ? "rounded-t-xl" : "rounded-xl"}`,
          surfaceClass,
          isDark ? "darkwin" : "",
          isMac ? (isDark ? "text-white" : "text-black") : "text-white",
        ].join(" ")}
        style={{ boxShadow: shadow, transition: "box-shadow 200ms ease" }}
        animate={genieAnimate}
        transition={genieTransition}
      >
        {/* clip-path guarantees rounded corners clip animated/composited children
            (Chrome can miss them with overflow:hidden alone); kept off the shadowed frame */}
        <div className="flex-1 min-h-0 flex flex-col" style={{ clipPath: mobile ? "inset(0 round 12px 12px 0 0)" : "inset(0 round 12px)" }}>
        {/* Title bar */}
        <div
          className={`relative px-4 flex items-center shrink-0 cursor-default select-none ${titleBarClass}`}
          style={{ height: TITLE_H, touchAction: "none" }}
          onPointerDown={(e) => {
            if (!mobile && !isMaximized) dragControls.start(e);
          }}
          onDoubleClick={mobile ? undefined : zoom}
        >
          <TrafficLights
            isActive={isActive}
            isDark={isDark || !isMac}
            isMaximized={isMaximized}
            onClose={() => onClose(id)}
            onMinimize={() => onMinimize?.(id)}
            onZoom={zoom}
            canZoom={resizable}
          />

          <div
            className={`absolute left-1/2 -translate-x-1/2 ${mobile ? "max-w-[45%]" : "max-w-[60%]"} truncate text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${titleTextClass}`}
          >
            {title}
          </div>

          {mobile && (
            <button
              onClick={() => onClose(id)}
              onPointerDown={(e) => e.stopPropagation()}
              className="ml-auto -mr-1 px-3 py-1.5 rounded-full text-[15px] font-semibold text-[hsl(var(--accent))] active:opacity-60"
            >
              Done
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        {/* @container: apps adapt to the window's width (narrow windows + phones get compact layouts) */}
        <div className="@container flex-1 overflow-y-auto min-h-0">{children}</div>
        </div>
      </motion.div>

      {/* Resize handles (sit slightly outside the frame, like macOS) */}
      {resizable && !mobile && !isMaximized && !isMinimized && (
        <>
          <div className={`${edge} top-3 bottom-3 -right-1 w-2 cursor-ew-resize`} onPointerDown={startResize("e")} />
          <div className={`${edge} top-3 bottom-3 -left-1 w-2 cursor-ew-resize`} onPointerDown={startResize("w")} />
          <div className={`${edge} left-3 right-3 -bottom-1 h-2 cursor-ns-resize`} onPointerDown={startResize("s")} />
          <div className={`${edge} -right-1 -bottom-1 w-4 h-4 cursor-nwse-resize`} onPointerDown={startResize("se")} />
          <div className={`${edge} -left-1 -bottom-1 w-4 h-4 cursor-nesw-resize`} onPointerDown={startResize("sw")} />
        </>
      )}
    </motion.div>
  );
}
