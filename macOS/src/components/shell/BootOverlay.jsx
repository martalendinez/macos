// src/components/shell/BootOverlay.jsx
// Shown on "Restart…": black screen, logo and a filling progress bar.
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppleLogo from "../../ui/AppleLogo";

const BOOT_MS = 1900;

export default function BootOverlay({ open, onDone }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onDone?.(), BOOT_MS + 250);
    return () => clearTimeout(t);
  }, [open, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[30000] bg-black flex flex-col items-center justify-center gap-14 cursor-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="status"
          aria-label="Restarting"
        >
          <motion.div
            className="text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <AppleLogo className="w-[76px] h-[76px]" />
          </motion.div>
          <div className="w-[200px] h-[5px] rounded-full bg-white/25 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.45, duration: BOOT_MS / 1000 - 0.45, ease: [0.45, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
