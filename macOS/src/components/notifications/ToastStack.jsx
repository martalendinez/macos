// src/components/notifications/ToastStack.jsx
// macOS-style notification banners: slide in from the right, close button on hover.
import { AnimatePresence, motion } from "framer-motion";
import { MENU_BAR_H } from "../../config/shell";
import AppleLogo from "../../ui/AppleLogo";

export default function ToastStack({ uiTheme = "glass", theme = "light", toasts = [], onDismiss }) {
  const isDark = theme === "dark" || uiTheme !== "macos";

  const surface = isDark
    ? {
        background: "rgba(40,40,44,0.72)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(255,255,255,0.14), 0 10px 30px rgba(0,0,0,0.35)",
      }
    : {
        background: "rgba(246,246,246,0.78)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.18)",
      };

  return (
    <div
      className="fixed right-3 z-[9000] w-[356px] max-w-[calc(100vw-24px)] pointer-events-none"
      // phones: below the full-screen app's title bar so its Done button stays reachable
      style={{ top: MENU_BAR_H + (typeof window !== "undefined" && window.innerWidth < 768 ? 52 : 8) }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`group relative pointer-events-auto mb-2 rounded-[18px] backdrop-blur-2xl backdrop-saturate-[1.8] ${
              isDark ? "text-white" : "text-black"
            }`}
            style={surface}
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            <button
              className={`absolute -left-[7px] -top-[7px] w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xl ${
                isDark ? "bg-[#3a3a3c]/90 text-white/80" : "bg-white/95 text-black/60"
              }`}
              style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15)" }}
              onClick={() => onDismiss?.(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>

            <div className="px-[14px] py-[12px] flex items-start gap-3">
              <span className="mt-[2px] shrink-0 w-[34px] h-[34px] rounded-[9px] bg-gradient-to-b from-[#5ac8fa] to-[#007aff] text-white flex items-center justify-center shadow-sm">
                <AppleLogo className="w-[17px] h-[17px] -mt-[2px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[13px] font-semibold truncate">{t.title}</div>
                  <div className="text-[11px] opacity-50 shrink-0">now</div>
                </div>
                {t.message && <div className="mt-[1px] text-[13px] leading-snug opacity-80">{t.message}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
