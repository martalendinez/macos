import { motion } from "framer-motion";

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
  uiTheme = "glass", // "glass" | "macos"
}) {
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

  const closeBtn =
    uiTheme === "macos"
      ? "bg-[#ff5f57]"
      : "bg-red-400"; // fine either way

  return (
    <motion.div
      onMouseDown={() => onFocus(id)}
      className={`fixed rounded-2xl overflow-hidden shadow-2xl ${
        windowClassByTheme[uiTheme]
      } ${isActive ? ringClass : "opacity-95"}`}
      style={{
        width,
        height,
        zIndex,
        left: initialPos.x,
        top: initialPos.y,
      }}
      initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(8px)" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Title bar */}
      <div
        className={`h-12 px-4 flex items-center justify-between ${titleBarClassByTheme[uiTheme]}`}
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
          <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-80" />
        </div>

        <div className={`text-[14px] font-medium select-none ${titleTextClassByTheme[uiTheme]}`}>
          {title}
        </div>

        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </motion.div>
  );
}
