// src/components/windows/MacWindow.jsx
import { useEffect, useState } from "react";
import { motion, useDragControls } from "framer-motion";

export default function MacWindow({
  id,
  title,
  isActive,
  zIndex,
  onFocus,
  onClose,
  width = 860,
  height = 560,
  initialPos = { x: 220, y: 90 },
  children,
  uiTheme = "glass",
  theme = "light",
  isMaximized = false,
  onToggleMaximize,
}) {
  const dragControls = useDragControls();

  const [viewport, setViewport] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1440,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  useEffect(() => {
    function onResize() {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMac = uiTheme === "macos";
  const isDark = theme === "dark";
  const isMobile = viewport.w < 768;

  const windowClassByTheme = {
    glass: isDark
      ? "border border-white/15 bg-black/25 backdrop-blur-xl shadow-2xl"
      : "border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl",

    macos: isDark
      ? "border border-white/10 bg-[#1c1c1e] shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
      : "border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
  };

  const titleBarClassByTheme = {
    glass: isDark ? "bg-black/20" : "bg-white/10",
    macos: isDark
      ? "bg-[#2c2c2e] border-b border-white/10"
      : "bg-[#f6f6f6] border-b border-black/10",
  };

  const titleTextClassByTheme = {
    glass: "text-white/90",
    macos: isDark ? "text-white/85" : "text-black/70",
  };

  const ringClass =
    uiTheme === "macos"
      ? isDark
        ? "ring-1 ring-white/10"
        : "ring-1 ring-black/10"
      : "ring-1 ring-white/20";

  const closeBtn = uiTheme === "macos" ? "bg-[#ff5f57]" : "bg-red-400";

  const MAX_MARGIN = 16;
  const SAFE_TOP = 56;

  // ⭐ MOBILE = fullscreen window
  const computedStyle = isMobile
    ? {
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100dvh",
        borderRadius: 0,
        transform: "none",
      }
    : isMaximized
    ? {
        left: MAX_MARGIN,
        top: MAX_MARGIN + 40,
        width: `calc(100vw - ${MAX_MARGIN * 2}px)`,
        height: `calc(100vh - ${MAX_MARGIN * 2 + 40 + 24}px)`,
      }
    : {
        left: initialPos.x,
        top: initialPos.y,
        width,
        height,
      };

  const dragConstraints = isMobile || isMaximized
    ? undefined
    : {
        left: -(initialPos.x - MAX_MARGIN),
        top: -(initialPos.y - SAFE_TOP),
        right: Math.max(0, viewport.w - MAX_MARGIN - (initialPos.x + width)),
        bottom: Math.max(0, viewport.h - MAX_MARGIN - (initialPos.y + height)),
      };

  return (
    <motion.div
      onMouseDown={() => onFocus(id)}
      className={[
        "fixed overflow-hidden flex flex-col",
        isMobile ? "" : "rounded-2xl",
        windowClassByTheme[uiTheme],
        isActive ? ringClass : "opacity-95",
        isDark ? "darkwin" : "",
        isMac ? (isDark ? "text-white" : "text-black") : "text-white",
      ].join(" ")}
      style={{ zIndex, ...computedStyle }}
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      drag={!isMobile && !isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0}
    >
      {/* ⭐ TITLE BAR */}
      <div
        className={`relative ${
          isMobile ? "h-16" : "h-12"
        } px-4 flex items-center justify-between cursor-default shrink-0 ${titleBarClassByTheme[uiTheme]}`}
        style={{
          touchAction: "none",
          // ⭐ LOWERED TOP BAR FOR MOBILE
          paddingTop: isMobile
            ? "calc(env(safe-area-inset-top) + 32px)"
            : 0,
        }}
        onPointerDown={(e) => {
          onFocus(id);
          if (!isMobile && !isMaximized) dragControls.start(e);
        }}
      >
        {/* ⭐ MAC BUTTONS — visible on mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className={`rounded-full ${
              isMobile ? "w-4 h-4" : "w-3 h-3"
            } ${closeBtn} hover:brightness-110`}
          />
          <div
            className={`rounded-full bg-[#ffbd2e] opacity-80 ${
              isMobile ? "w-4 h-4" : "w-3 h-3"
            }`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize?.(id);
            }}
            className={`rounded-full bg-[#28c840] opacity-80 hover:brightness-110 ${
              isMobile ? "w-4 h-4" : "w-3 h-3"
            }`}
          />
        </div>

        <div
          className={`text-[14px] font-medium select-none ${titleTextClassByTheme[uiTheme]}`}
          style={{ fontFamily: "Lustria" }}
        >
          {title}
        </div>

        <div className="w-[52px]" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
    </motion.div>
  );
}
