import { useRef } from "react";
import { motion, useDragControls } from "framer-motion";

export default function MacWindow({
  id,
  title,
  isActive,
  zIndex,
  onFocus,
  onClose,

  // normal size/pos
  width = 860,
  height = 560,
  initialPos = { x: 220, y: 90 },

  children,
  uiTheme = "glass",

  // ✅ NEW
  isMaximized = false,
  onToggleMaximize,
}) {
  const dragConstraintsRef = useRef(null);
  const dragControls = useDragControls();

  const windowClassByTheme = {
    glass: "border border-white/15 bg-white/10 backdrop-blur-xl",
    macos: "border border-black/10 bg-[#f5f5f2]",
  };

  const titleBarClassByTheme = {
    glass: "bg-white/10",
    macos: "bg-[#ececec] border-b border-black/10",
  };

  const titleTextClassByTheme = {
    glass: "text-white/90",
    macos: "text-black/80",
  };

  const ringClass =
    uiTheme === "macos" ? "ring-1 ring-black/10" : "ring-1 ring-white/20";

  const closeBtn = uiTheme === "macos" ? "bg-[#ff5f57]" : "bg-red-400";

  // ✅ margin when maximized
  const MAX_MARGIN = 16;

  const computedStyle = isMaximized
    ? {
        left: MAX_MARGIN,
        top: MAX_MARGIN + 40, // small offset so it doesn’t collide with top bar
        width: `calc(100vw - ${MAX_MARGIN * 2}px)`,
        height: `calc(100vh - ${(MAX_MARGIN * 2) + 40 + 24}px)`, // margin + topbar + a bit for dock feel
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
        className={`fixed rounded-2xl overflow-hidden shadow-2xl ${
          windowClassByTheme[uiTheme]
        } ${isActive ? ringClass : "opacity-95"} ${
          uiTheme === "macos" ? "text-black" : "text-white"
        }`}
        style={{
          zIndex,
          ...computedStyle,
        }}
        initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(8px)" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        // ✅ disable drag when maximized
        drag={!isMaximized}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={dragConstraintsRef}
        dragMomentum={false}
      >
        <div
          className={`h-12 px-4 flex items-center justify-between cursor-default relative ${titleBarClassByTheme[uiTheme]}`}
          onPointerDown={(e) => {
            onFocus(id);
            if (!isMaximized) dragControls.start(e);
          }}
          style={{ touchAction: "none" }}
        >
          <div className="flex items-center gap-2">
            {/* close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              className={`w-3 h-3 rounded-full ${closeBtn} hover:brightness-110`}
              aria-label="Close"
              title="Close"
            />

            {/* yellow (optional: minimize later) */}
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />

            {/* ✅ green = maximize toggle */}
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

          <div className={`text-[14px] font-medium select-none ${titleTextClassByTheme[uiTheme]}`}>
            {title}
          </div>

          <div className="w-[52px]" />
        </div>

        <div className="h-[calc(100%-3rem)]">{children}</div>
      </motion.div>
    </>
  );
}
