// src/components/windows/Projects/caseStudy/CaseStudyLightbox.jsx
// Quick Look-style viewer: dark blurred backdrop, image fitted to the screen, Esc or click outside to close.
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function CaseStudyLightbox({ open, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  // portal to <body> so the viewer covers the whole screen, not just the window
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[20000] flex flex-col items-center justify-center p-4 sm:p-10 bg-black/75 backdrop-blur-xl cursor-zoom-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label={alt || "Image preview"}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition"
            aria-label="Close preview"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>

          <motion.img
            src={src}
            alt={alt}
            className="max-w-full max-h-[calc(100%-56px)] w-auto h-auto object-contain rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] cursor-default"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          />
          {alt && <div className="mt-4 text-[13px] text-white/70 text-center max-w-[640px]">{alt}</div>}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
