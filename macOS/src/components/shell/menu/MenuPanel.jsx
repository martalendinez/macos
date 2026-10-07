// src/components/shell/menu/MenuPanel.jsx
// macOS-style translucent menu, shared by the menu bar and the desktop context menu.
import { forwardRef } from "react";
import { motion } from "framer-motion";

export function menuSurface(isDark) {
  return isDark
    ? {
        background: "rgba(36,36,38,0.72)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.14), 0 12px 32px rgba(0,0,0,0.45)",
        color: "rgba(255,255,255,0.88)",
      }
    : {
        background: "rgba(246,246,246,0.76)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.16), 0 12px 32px rgba(0,0,0,0.18)",
        color: "rgba(0,0,0,0.85)",
      };
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="w-[10px] h-[10px]" aria-hidden="true">
      <path d="M2.2 6.4l2.4 2.4 5.2-5.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MenuPanel = forwardRef(function MenuPanel({ items = [], isDark, onClose, style, className = "" }, ref) {
  const hasChecks = items.some((it) => it && "checked" in it);

  return (
    <motion.div
      ref={ref}
      role="menu"
      className={`fixed z-[10050] min-w-[230px] rounded-[10px] p-[5px] text-[13px] backdrop-blur-2xl backdrop-saturate-[1.8] select-none ${className}`}
      style={{ ...menuSurface(isDark), ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.08 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, idx) => {
        if (!it) return null;
        if (it.separator) {
          return (
            <div
              key={`sep-${idx}`}
              className={`mx-[10px] my-[5px] h-px ${isDark ? "bg-white/12" : "bg-black/10"}`}
            />
          );
        }
        if (it.header) {
          return (
            <div key={`h-${idx}`} className="px-[10px] pt-1 pb-0.5 text-[11px] font-semibold opacity-45">
              {it.header}
            </div>
          );
        }

        return (
          <button
            key={`${it.label}-${idx}`}
            type="button"
            role="menuitem"
            disabled={it.disabled}
            onClick={() => {
              if (it.disabled) return;
              onClose?.();
              it.onSelect?.();
            }}
            className={[
              "group w-full h-[22px] px-[10px] rounded-[5px] flex items-center gap-2 text-left",
              it.disabled
                ? "opacity-35 cursor-default"
                : "hover:bg-[hsl(var(--accent))] hover:text-white",
            ].join(" ")}
          >
            {hasChecks && (
              <span className="w-[10px] shrink-0 flex items-center">{it.checked ? <Check /> : null}</span>
            )}
            <span className="flex-1 truncate">{it.label}</span>
            {it.shortcut && (
              <span className="ml-6 shrink-0 opacity-45 group-hover:opacity-80 tracking-[0.08em]">
                {it.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
});

export default MenuPanel;
