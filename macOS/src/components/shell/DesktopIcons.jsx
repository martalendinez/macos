// src/components/shell/DesktopIcons.jsx
// Finder-style desktop icons (left column keeps them clear of notification banners).
import { motion } from "framer-motion";
import { MENU_BAR_H } from "../../config/shell";

export default function DesktopIcons({ loaded, items = [], selectedId, onSelect }) {
  return (
    <div
      className="fixed left-3 z-40 flex flex-col items-center gap-3"
      style={{ top: MENU_BAR_H + 14 }}
    >
      {items.map((it, idx) => {
        const selected = selectedId === it.id;
        return (
          <motion.button
            key={it.id}
            type="button"
            className="w-[96px] flex flex-col items-center gap-[3px] outline-none"
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelect?.(it.id);
            }}
            onClick={() => it.onOpen?.()}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + idx * 0.06, type: "spring", stiffness: 320, damping: 26 }}
          >
            <span
              className={`p-[5px] rounded-[7px] transition-colors duration-100 ${
                selected ? "bg-black/25 ring-1 ring-white/15" : ""
              }`}
            >
              <img
                src={it.icon}
                alt=""
                draggable={false}
                className="w-[60px] h-[60px] object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]"
              />
            </span>
            <span
              className={`max-w-full px-[6px] py-px rounded-[4px] text-[12px] font-medium leading-[1.35] text-white text-center break-words ${
                selected ? "bg-[hsl(var(--accent))]" : ""
              }`}
              style={selected ? undefined : { textShadow: "0 1px 3px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.5)" }}
            >
              {it.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
