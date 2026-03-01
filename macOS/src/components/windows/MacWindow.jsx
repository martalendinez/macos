// src/components/windows/MacWindow.jsx
import { useRef } from "react";
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
  theme = "light", // ✅ used for dark mode
  isMaximized = false,
  onToggleMaximize,
}) {
  const dragConstraintsRef = useRef(null);
  const dragControls = useDragControls();

  const isMac = uiTheme === "macos";
  const isDark = theme === "dark";

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

  const computedStyle = isMaximized
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

  return (
    <>
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none" />

      <motion.div
        onMouseDown={() => onFocus(id)}
        className={[
          // ✅ make the window a flex column so content can "flex-1"
          "fixed rounded-2xl overflow-hidden flex flex-col",
          windowClassByTheme[uiTheme],
          isActive ? ringClass : "opacity-95",
          // ✅ this class enables global dark overrides for content
          isDark ? "darkwin" : "",
          // base text default (content may override; our CSS will fix most cases)
          isMac ? (isDark ? "text-white" : "text-black") : "text-white",
        ].join(" ")}
        style={{ zIndex, ...computedStyle }}
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        drag={!isMaximized}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={dragConstraintsRef}
        dragMomentum={false}
      >
        {/* Title bar */}
        <div
          className={`relative h-12 px-4 flex items-center justify-between cursor-default ${titleBarClassByTheme[uiTheme]}`}
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            onFocus(id);
            if (!isMaximized) dragControls.start(e);
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              className={`w-3 h-3 rounded-full ${closeBtn} hover:brightness-110`}
              aria-label="Close"
              title="Close"
            />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMaximize?.(id);
              }}
              className="w-3 h-3 rounded-full bg-[#28c840] opacity-80 hover:brightness-110"
              aria-label={isMaximized ? "Restore" : "Maximize"}
              title={isMaximized ? "Restore" : "Maximize"}
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

        {/* ✅ Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
}