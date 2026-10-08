// src/components/windows/Projects/caseStudy/CaseStudyLayout.jsx
// macOS document-app layout for case studies: source-list sidebar with scroll-spy,
// unified toolbar with breadcrumb + reading progress, and a centered reading column.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CaseStudyContext = createContext({ sections: [] });
export const useCaseStudyContext = () => useContext(CaseStudyContext);

const TOOLBAR_H = 48;
const COMPACT_BELOW = 860; // hide the sidebar in narrow windows

export default function CaseStudyLayout({ theme, sections = [], title, children }) {
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const [compact, setCompact] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const clickLock = useRef(0);

  // sidebar collapses when the window is narrow
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < COMPACT_BELOW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // scroll-spy + reading progress
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
      if (Date.now() < clickLock.current) return;
      const top = el.getBoundingClientRect().top + TOOLBAR_H + 40;
      let current = sections[0]?.id;
      for (const s of sections) {
        const node = el.querySelector(`#${CSS.escape(s.id)}`);
        if (node && node.getBoundingClientRect().top <= top) current = s.id;
      }
      if (el.scrollTop >= max - 4) current = sections[sections.length - 1]?.id;
      setActive(current);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [sections]);

  const scrollTo = useCallback((id) => {
    const el = scrollRef.current;
    const node = el?.querySelector(`#${CSS.escape(id)}`);
    if (!el || !node) return;
    setActive(id);
    clickLock.current = Date.now() + 700; // don't let scroll-spy fight the smooth scroll
    const target = () => node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - TOOLBAR_H - 32;
    el.scrollTo({ top: target(), behavior: "smooth" });
    // images above may finish loading mid-scroll and push the section down: correct once it settles
    setTimeout(() => {
      if (Math.abs(target() - el.scrollTop) > 4) el.scrollTo({ top: target(), behavior: "smooth" });
    }, 650);
  }, []);

  const showSidebar = !compact && sidebarOpen;
  const activeIdx = Math.max(0, sections.findIndex((s) => s.id === active));

  return (
    <CaseStudyContext.Provider value={{ sections, theme }}>
      <div ref={rootRef} className={`no-darkwin relative h-full w-full flex ${theme.windowBg}`}>
        {/* SIDEBAR */}
        <motion.aside
          initial={false}
          animate={{ width: showSidebar ? 220 : 0, opacity: showSidebar ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className={`shrink-0 h-full overflow-hidden border-r ${theme.divider} ${theme.sidebarBg}`}
        >
          <div className="w-[220px] h-full flex flex-col">
            <div className="px-4 pt-5 pb-2">
              <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${theme.textSub}`}>On this page</div>
            </div>

            <nav className="flex-1 min-h-0 overflow-y-auto px-2 pb-3" aria-label="Case study sections">
              {sections.map((s, i) => {
                const isActive = s.id === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={`relative w-full flex items-center gap-2.5 rounded-[7px] px-2.5 py-[5px] text-left text-[13px] transition-colors ${
                      isActive ? "text-white" : `${theme.textMain} ${theme.hoverBg}`
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cs-active"
                        className="absolute inset-0 rounded-[7px] bg-[hsl(var(--accent))]"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className={`relative w-5 text-[11px] tabular-nums ${isActive ? "text-white/80" : theme.textSub}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative truncate">{s.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className={`px-4 py-3 border-t ${theme.divider}`}>
              <div className={`flex justify-between text-[11px] ${theme.textSub}`}>
                <span>Reading progress</span>
                <span className="tabular-nums">{Math.round(progress * 100)}%</span>
              </div>
              <div className={`mt-1.5 h-[3px] rounded-full overflow-hidden ${theme.isDark ? "bg-white/10" : "bg-black/[0.08]"}`}>
                <div className="h-full rounded-full bg-[hsl(var(--accent))] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.aside>

        {/* MAIN */}
        <div ref={scrollRef} className="relative flex-1 min-w-0 h-full overflow-y-auto scroll-smooth">
          {/* unified toolbar */}
          <div
            className={`sticky top-0 z-20 flex items-center gap-3 px-4 border-b ${theme.divider} ${theme.toolbarBg} backdrop-blur-xl backdrop-saturate-150`}
            style={{ height: TOOLBAR_H }}
          >
            {!compact && (
              <button
                type="button"
                onClick={() => setSidebarOpen((o) => !o)}
                className={`w-8 h-7 rounded-md flex items-center justify-center ${theme.textSub} ${theme.hoverBg}`}
                aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <svg viewBox="0 0 20 16" className="w-[18px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <rect x="1" y="1" width="18" height="14" rx="3" />
                  <path d="M7 1v14" />
                </svg>
              </button>
            )}

            <div className="min-w-0 flex items-center gap-1.5 text-[13px]">
              <span className={theme.textSub}>Projects</span>
              <span className={theme.textSub}>›</span>
              <span className={`font-semibold truncate ${theme.textMain}`}>{title}</span>
            </div>

            <div className="flex-1" />

            <span className={`hidden @2xl:inline text-[12px] tabular-nums ${theme.textSub}`}>
              {String(activeIdx + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")} · {sections[activeIdx]?.label}
            </span>

            <button
              type="button"
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className={`w-8 h-7 rounded-md flex items-center justify-center text-[13px] transition-opacity ${theme.textSub} ${theme.hoverBg} ${
                progress > 0.05 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Back to top"
              title="Back to top"
            >
              ↑
            </button>

            {/* reading progress */}
            <div className="absolute left-0 bottom-[-1px] h-[2px] bg-[hsl(var(--accent))] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
          </div>

          <div className="mx-auto w-full max-w-[920px] px-6 @2xl:px-12 pt-10 pb-16">{children}</div>
        </div>
      </div>
    </CaseStudyContext.Provider>
  );
}
