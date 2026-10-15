// src/components/shell/QuickLook.jsx
// Finder Quick Look: select a desktop icon and press Space for a preview, Space or Esc to close.
// The résumé shows the real PDF; the other icons show a little preview card.
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU_BAR_H } from "../../config/shell";

const ABOUT = {
  recruiter: "The 30-second overview: role, education, location, toolkit and languages on one screen, with the résumé one click away.",
  projects: "Four case studies with the research, the decisions and the code behind them: Trace, Employer Branding, Trivia and Sällskap.",
};

export default function QuickLook({ item, onClose, onOpen, isDark }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  const pdf = item?.id === "resume";
  const surface = isDark ? "bg-[#2a2a2c]/90 text-white" : "bg-[#f6f6f6]/90 text-black";
  const sub = isDark ? "text-white/60" : "text-black/55";

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-[9600] flex items-center justify-center p-6" style={{ paddingTop: MENU_BAR_H + 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-label={`Quick Look: ${item.label}`}
            className={`relative flex flex-col overflow-hidden rounded-[14px] backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10 ${surface}`}
            style={pdf ? { width: "min(720px, 92vw)", height: "min(860px, calc(100vh - 120px))" } : { width: "min(420px, 92vw)" }}
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* title bar */}
            <div className={`h-11 shrink-0 flex items-center gap-2 px-3 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
              <button type="button" onClick={onClose} aria-label="Close Quick Look" className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90" />
              <span className="ml-2 flex-1 truncate text-[13px] font-semibold text-center">{item.label}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpen(item);
                }}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${isDark ? "bg-white/10 hover:bg-white/15" : "bg-black/[0.06] hover:bg-black/10"}`}
              >
                {pdf ? "Open with Preview" : `Open ${item.label}`}
              </button>
            </div>

            {pdf ? (
              <iframe src="/resume.pdf#toolbar=0&view=FitH" title="Résumé preview" className="flex-1 w-full bg-white" />
            ) : (
              <div className="p-8 flex flex-col items-center text-center">
                <img src={item.icon} alt="" className="w-[128px] h-[128px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]" />
                <div className="mt-4 text-[18px] font-semibold">{item.label}</div>
                <p className={`mt-2 text-[13.5px] leading-relaxed ${sub}`}>{ABOUT[item.id] ?? "Double-click to open."}</p>
              </div>
            )}
            <div className={`absolute bottom-2 right-3 text-[10.5px] ${sub} ${pdf ? "hidden" : ""}`}>Press Space to close</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
