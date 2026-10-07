// src/components/shell/Spotlight.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuSurface } from "./menu/MenuPanel";

const KIND_LABEL = {
  app: "Application",
  caseStudy: "Case Study",
  document: "Document",
  system: "System",
};

function score(item, q) {
  const label = item.label.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.split(/[\s—-]+/).some((w) => w.startsWith(q))) return 2;
  if (label.includes(q) || (item.keywords ?? "").includes(q)) return 1;
  return 0;
}

function ItemIcon({ item }) {
  if (item.icon) {
    return <img src={item.icon} alt="" className="w-7 h-7 object-contain" />;
  }
  return (
    <span className="w-7 h-7 rounded-[7px] bg-gradient-to-b from-[#9a9aa0] to-[#6c6c72] flex items-center justify-center">
      <img src="/icons/ui/gear.png" alt="" className="w-4 h-4" />
    </span>
  );
}

export default function Spotlight({ open, onClose, items = [], isDark, onPick }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      // focus after the panel mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.filter((i) => i.kind === "app" || i.kind === "document").slice(0, 8);
    return items
      .map((i) => ({ i, s: score(i, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.i)
      .slice(0, 9);
  }, [items, q]);

  useEffect(() => setSel(0), [q]);

  function pick(item) {
    if (!item) return;
    onClose?.();
    onPick?.(item);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[sel]);
    }
  }

  const surface = menuSurface(isDark);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10100]"
          onPointerDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            role="dialog"
            aria-label="Spotlight Search"
            className="absolute left-1/2 top-[20vh] w-[min(680px,calc(100vw-32px))] rounded-[18px] overflow-hidden backdrop-blur-3xl backdrop-saturate-[1.8]"
            style={{ ...surface, x: "-50%", boxShadow: `${surface.boxShadow}, 0 30px 80px rgba(0,0,0,0.35)` }}
            onPointerDown={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, y: -6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          >
            <div className="h-[58px] px-4 flex items-center gap-3">
              <svg viewBox="0 0 16 16" className="w-[22px] h-[22px] opacity-55 shrink-0" fill="none" aria-hidden="true">
                <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Spotlight Search"
                aria-label="Search"
                className="flex-1 bg-transparent outline-none text-[22px] font-light tracking-[-0.01em] placeholder:opacity-45"
                style={{ color: "inherit" }}
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            <div className={`h-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />

            <div className="p-[6px] max-h-[50vh] overflow-y-auto">
              {!q.trim() && <div className="px-3 pt-1 pb-1 text-[11px] font-semibold opacity-45">Suggestions</div>}

              {results.length === 0 ? (
                <div className="px-3 py-6 text-center text-[13px] opacity-55">No results for “{q}”</div>
              ) : (
                results.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseMove={() => setSel(idx)}
                    onClick={() => pick(item)}
                    className={`w-full h-[42px] px-3 rounded-[9px] flex items-center gap-3 text-left ${
                      idx === sel ? "bg-[hsl(var(--accent))] text-white" : ""
                    }`}
                  >
                    <ItemIcon item={item} />
                    <span className="flex-1 truncate text-[14px]">{item.label}</span>
                    <span className={`text-[12px] ${idx === sel ? "text-white/80" : "opacity-45"}`}>
                      {KIND_LABEL[item.kind]}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
