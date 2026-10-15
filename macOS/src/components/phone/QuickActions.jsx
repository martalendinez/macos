// src/components/phone/QuickActions.jsx
// iOS long-press menu for home screen icons: the icon lifts out of a blurred home screen
// and a menu of shortcuts appears next to it. ✏️ Shortcuts per app live in actionsFor().
import { motion } from "framer-motion";
import { CONTACT } from "../windows/About/aboutData";
import { island } from "../../config/island";

const LINKEDIN = CONTACT.links.find((l) => l.label === "LinkedIn")?.href;

const I = {
  doc: "M6 2.5h5l3.5 3.5v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 15V4A1.5 1.5 0 0 1 6 2.5zM10.5 2.5V6.5h4",
  mail: "M3 5h14v10H3zM3.5 5.5l6.5 5 6.5-5",
  link: "M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-1 1M11.5 8.5a3 3 0 0 0-4.2 0L4.7 11.1a3 3 0 0 0 4.2 4.2l1-1",
  open: "M11 3.5h5.5V9M16.5 3.5l-7 7M14 11.5v4a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4",
  bolt: "M11 2.5L4.5 11h5l-1 6.5L15 9h-5z",
  chat: "M10 3.5c4.1 0 7 2.5 7 5.7s-2.9 5.7-7 5.7c-.9 0-1.7-.1-2.5-.3l-3.4 1.7.8-2.9C3.8 12.4 3 10.9 3 9.2c0-3.2 2.9-5.7 7-5.7z",
  share: "M10 12.5V3M6.5 6.5L10 3l3.5 3.5M5 9.5H4.5v7h11v-7H15",
  folder: "M3 6a1.5 1.5 0 0 1 1.5-1.5h3.5l1.5 2h6A1.5 1.5 0 0 1 17 8v6.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5z",
};

async function copy(text, what) {
  try {
    await navigator.clipboard.writeText(text);
    island({ kind: "copied", icon: "/icons/apps/messages.svg", title: "Copied", sub: what });
  } catch {
    /* clipboard blocked */
  }
}

/** The shortcuts for an app, iOS style: the most useful thing first. */
export function actionsFor(app, { launch, openWindow, apps }) {
  const open = { label: `Open ${app.label}`, icon: I.open, run: () => launch(app) };
  const sharePortfolio = {
    label: "Share Portfolio",
    icon: I.share,
    run: () => (navigator.share ? navigator.share({ title: "Marta Lendínez · Portfolio", url: window.location.origin }).catch(() => {}) : copy(window.location.origin, "Portfolio link")),
  };
  switch (app.id) {
    case "recruiter":
      return [
        { label: "Download Résumé", icon: I.doc, run: () => window.open("/resume.pdf", "_blank", "noopener") },
        { label: "Copy Email", icon: I.mail, run: () => copy(CONTACT.email, CONTACT.email) },
        { label: "30-Second Overview", icon: I.bolt, run: () => launch(app) },
      ];
    case "about":
      return [
        { label: "Copy Email", icon: I.mail, run: () => copy(CONTACT.email, CONTACT.email) },
        LINKEDIN && { label: "LinkedIn", icon: I.link, run: () => window.open(LINKEDIN, "_blank", "noopener") },
        open,
      ].filter(Boolean);
    case "resume":
      return [
        { label: "Open Résumé", icon: I.doc, run: () => window.open("/resume.pdf", "_blank", "noopener") },
        { label: "Copy Link", icon: I.link, run: () => copy(`${window.location.origin}/resume.pdf`, "Résumé link") },
      ];
    case "projects":
      return [
        ["thesisCaseStudy", "Trace · AI co-pilot"],
        ["employerBrandingCaseStudy", "Employer Branding"],
        ["triviaCaseStudy", "Trivia App"],
        ["groupDiningCaseStudy", "Sällskap"],
      ]
        .map(([id, label]) => apps[id] && { label, icon: I.folder, run: () => launch(apps[id]) })
        .filter(Boolean)
        .concat({ label: "All Projects", icon: I.open, run: () => launch(app) });
    case "messages":
      return [{ label: "Ask Me Anything", icon: I.chat, run: () => openWindow("messages") }, { label: "Copy Email", icon: I.mail, run: () => copy(CONTACT.email, CONTACT.email) }];
    default:
      return [open, sharePortfolio];
  }
}

/** The overlay: blurred home screen, the lifted icon, and the menu above or below it. */
export default function QuickActions({ menu, onClose, renderIcon }) {
  const { app, rect, actions } = menu;
  const below = rect.top < window.innerHeight * 0.55;
  const menuW = 250;
  const left = Math.max(12, Math.min(rect.left + rect.width / 2 - menuW / 2, window.innerWidth - menuW - 12));

  return (
    <motion.div className="fixed inset-0 z-[7500]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} onClick={onClose} onContextMenu={(e) => e.preventDefault()}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />

      {/* the lifted icon */}
      <motion.div className="absolute" style={{ left: rect.left, top: rect.top, width: rect.width }} initial={{ scale: 1 }} animate={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
        {renderIcon(app)}
      </motion.div>

      {/* the menu */}
      <motion.div
        role="menu"
        aria-label={`${app.label} quick actions`}
        className="absolute rounded-[14px] overflow-hidden bg-[rgba(245,245,247,0.86)] backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] text-black"
        style={{ left, width: menuW, ...(below ? { top: rect.bottom + 14 } : { bottom: window.innerHeight - rect.top + 10 }), transformOrigin: below ? "top center" : "bottom center" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 480, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((a, i) => (
          <button
            key={a.label}
            type="button"
            role="menuitem"
            onClick={() => {
              onClose();
              a.run();
            }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-[11px] text-left text-[16px] active:bg-black/10 ${i ? "border-t border-black/10" : ""}`}
          >
            <span className="truncate">{a.label}</span>
            <svg viewBox="0 0 20 20" className="shrink-0 w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={a.icon} />
            </svg>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
