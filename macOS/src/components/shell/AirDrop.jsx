// src/components/shell/AirDrop.jsx
// macOS-style AirDrop request: "Marta's iPhone would like to share resume.pdf".
// Fired with the "portfolio:airdrop" window event: About me sends it, and it shows once per page load.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuSurface } from "./menu/MenuPanel";
import { MENU_BAR_H } from "../../config/shell";
import avatar from "../../imgs/avatar/profile-photo.jpg";

// once per page load: a refresh brings it back
let shown = false;

export default function AirDrop({ isDark, onAccept }) {
  const [open, setOpen] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const show = () => {
      if (shown) return;
      shown = true;
      setDeclined(false);
      setOpen(true);
    };
    window.addEventListener("portfolio:airdrop", show);
    return () => window.removeEventListener("portfolio:airdrop", show);
  }, []);

  function decline() {
    setDeclined(true);
    setTimeout(() => setOpen(false), 1400);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="alertdialog"
          aria-label="AirDrop"
          className="fixed z-[9500] left-1/2 w-[300px] max-w-[calc(100vw-24px)] rounded-[16px] p-4 backdrop-blur-2xl backdrop-saturate-[1.8] text-center"
          style={{ ...menuSurface(isDark), top: MENU_BAR_H + 56, x: "-50%" }}
          initial={{ opacity: 0, scale: 0.9, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <div className="relative mx-auto w-14 h-14">
            <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
            {/* a little PDF peeking out, like the AirDrop preview */}
            <span className="absolute -right-2 -bottom-1 w-7 h-9 rounded-[4px] bg-white shadow-md flex items-end justify-center pb-0.5 text-[7px] font-bold text-[#e5484d] ring-1 ring-black/10">PDF</span>
          </div>
          <div className="mt-3 text-[13px] font-semibold">AirDrop</div>
          <p className="mt-1 text-[12.5px] leading-snug opacity-80">
            {declined ? (
              <>No worries. It’ll be on the desktop when you need it 😌</>
            ) : (
              <>
                “Marta’s iPhone” would like to share <b>“resume.pdf”</b>. One page, promise.
              </>
            )}
          </p>
          {!declined && (
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <button type="button" onClick={decline} className={`h-8 rounded-[8px] text-[13px] font-medium ${isDark ? "bg-white/12 hover:bg-white/18" : "bg-black/[0.07] hover:bg-black/[0.1]"}`}>
                Decline
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onAccept?.();
                }}
                className="h-8 rounded-[8px] text-[13px] font-semibold text-white bg-[hsl(var(--accent))] hover:brightness-110"
              >
                Accept
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
