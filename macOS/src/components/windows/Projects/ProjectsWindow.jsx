// src/components/windows/Projects/ProjectsWindow.jsx
// Finder-style project browser: sidebar with library + colored tags, toolbar with search and
// grid/list views, a featured project and tinted project cards.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import { PROJECTS } from "./data/projectData";
import ProjectCover from "./ui/ProjectCover";

const ACTION_TO_WINDOW = {
  openEmployerBrandingCaseStudy: "employerBrandingCaseStudy",
  openStardewNotionCaseStudy: "stardewNotionCaseStudy",
  openGroupDiningCaseStudy: "groupDiningCaseStudy",
  openThesisCaseStudy: "thesisCaseStudy",
  openTriviaCaseStudy: "triviaCaseStudy",
};

// Finder-like tag colors
const TAG_COLORS = ["#ff5f57", "#ff9f0a", "#ffcc00", "#34c759", "#0a84ff", "#bf5af2", "#ff375f", "#64d2ff", "#8e8e93"];

function TagDot({ color, size = 8 }) {
  return <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: color }} />;
}

function Arrow({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function Cover({ project, className = "" }) {
  return <ProjectCover project={project} className={className} />;
}

// module-level so clicks aren't lost to remounts
function SideItem({ id, label, count, dot, icon, filter, setFilter, t }) {
  const active = filter === id;
  return (
    <button
      onClick={() => setFilter(id)}
      className={`w-full flex items-center gap-2.5 rounded-[7px] px-2.5 py-[5px] text-[13px] text-left ${
        active ? "bg-[hsl(var(--accent))] text-white" : `${t.textMain} ${t.hoverBg}`
      }`}
    >
      {dot ? <TagDot color={dot} size={10} /> : <span className={`w-[14px] text-center ${active ? "" : t.accentText}`}>{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {count != null && <span className={`text-[11px] tabular-nums ${active ? "text-white/80" : t.textSub}`}>{count}</span>}
    </button>
  );
}

export default function ProjectsWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", onOpenWindow }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [filter, setFilter] = useState("all"); // "all" | tag
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const tags = useMemo(() => {
    const set = [];
    PROJECTS.forEach((p) => (p.tags ?? []).forEach((tag) => !set.includes(tag) && set.push(tag)));
    return set.map((tag, i) => ({ tag, color: TAG_COLORS[i % TAG_COLORS.length] }));
  }, []);
  const tagColor = (tag) => tags.find((x) => x.tag === tag)?.color ?? "#8e8e93";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => filter === "all" || (p.tags ?? []).includes(filter)).filter(
      (p) => !q || [p.title, p.subtitle, ...(p.tags ?? []), ...(p.meta ?? [])].join(" ").toLowerCase().includes(q)
    );
  }, [filter, query]);

  const showFeatured = view === "grid" && filter === "all" && !query.trim() && visible.length > 1;
  const featured = showFeatured ? visible[0] : null;
  const rest = showFeatured ? visible.slice(1) : visible;

  function open(p) {
    const link = p.links?.[0];
    if (!link) return;
    if (ACTION_TO_WINDOW[link.action]) onOpenWindow?.(ACTION_TO_WINDOW[link.action]);
    else if (link.href && link.href !== "#") window.open(link.href, "_blank", "noreferrer");
  }

  const sideProps = { filter, setFilter, t };
  const card = t.isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06]";


  return (
    <div className={`no-darkwin h-full w-full flex ${t.windowBg}`}>
      {/* SIDEBAR */}
      <aside className={`w-[200px] shrink-0 h-full overflow-y-auto border-r ${t.divider} ${t.sidebarBg} px-2 py-4 hidden @2xl:block`}>
        <div className={`px-2.5 mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${t.textSub}`}>Library</div>
        <SideItem id="all" label="All Projects" count={PROJECTS.length} icon="▦" {...sideProps} />

        <div className={`px-2.5 mt-5 mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${t.textSub}`}>Tags</div>
        {tags.map(({ tag, color }) => (
          <SideItem key={tag} id={tag} label={tag} dot={color} count={PROJECTS.filter((p) => p.tags?.includes(tag)).length} {...sideProps} />
        ))}
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        {/* toolbar */}
        <div className={`h-12 shrink-0 px-4 flex items-center gap-3 border-b ${t.divider} ${t.toolbarBg} backdrop-blur-xl`}>
          <div className="min-w-0">
            <div className={`text-[14px] font-semibold leading-tight ${t.textMain}`}>{filter === "all" ? "All Projects" : filter}</div>
            <div className={`text-[11px] leading-tight ${t.textSub}`}>
              {visible.length} {visible.length === 1 ? "project" : "projects"}
            </div>
          </div>
          <div className="flex-1" />

          {/* view switch */}
          <div className={`flex rounded-[7px] p-0.5 ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            {[
              ["grid", "M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"],
              ["list", "M2 3h12M2 8h12M2 13h12"],
            ].map(([v, d]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-8 h-6 rounded-[5px] flex items-center justify-center transition ${
                  view === v ? (t.isDark ? "bg-white/20 text-white" : "bg-white text-black shadow-sm") : t.textSub
                }`}
                aria-label={`${v} view`}
                title={v === "grid" ? "Gallery" : "List"}
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={v === "grid" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={v === "grid" ? 0 : 1.6} strokeLinecap="round" aria-hidden="true">
                  <path d={d} />
                </svg>
              </button>
            ))}
          </div>

          <div className={`flex items-center gap-1.5 rounded-[7px] px-2 h-7 w-[130px] @lg:w-[180px] ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
            <svg viewBox="0 0 16 16" className={`w-3 h-3 ${t.textSub}`} fill="none" aria-hidden="true">
              <circle cx="6.8" cy="6.8" r="4.6" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10.3 10.3l3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search projects"
              className={`flex-1 min-w-0 bg-transparent outline-none text-[13px] ${t.textMain} ${t.isDark ? "placeholder:text-white/40" : "placeholder:text-black/40"}`}
            />
          </div>
        </div>

        {/* content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-4 @lg:px-6 @2xl:px-8 py-6 @lg:py-7">
            {/* narrow: tag chips replace the sidebar */}
            <div className="@2xl:hidden -mx-4 px-4 mb-5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
              {[{ tag: "all", color: null }, ...tags].map(({ tag, color }) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium ${
                    filter === tag ? "bg-[hsl(var(--accent))] text-white" : `${t.textMain} ${t.isDark ? "bg-white/[0.07]" : "bg-black/[0.05]"}`
                  }`}
                >
                  {color && <TagDot color={color} size={7} />}
                  {tag === "all" ? "All" : tag}
                </button>
              ))}
            </div>
            {filter === "all" && !query.trim() && (
              <div className="mb-7">
                <h1 className={`text-[32px] font-bold tracking-[-0.03em] leading-tight ${t.textMain}`}>Projects</h1>
                <p className={`mt-1.5 max-w-[620px] text-[15px] leading-relaxed ${t.textSub}`}>
                  A hand-picked collection of my UX and research projects. Feel free to explore any project, dive into the case studies, and get a sense of my thinking and process!
                </p>
              </div>
            )}

            {visible.length === 0 && (
              <div className={`py-20 text-center text-[14px] ${t.textSub}`}>No projects match “{query}”.</div>
            )}

            {/* FEATURED */}
            {featured && (
              <motion.button
                type="button"
                onClick={() => open(featured)}
                className={`group w-full text-left rounded-[20px] overflow-hidden grid @2xl:grid-cols-[1.25fr_1fr] ${card} transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)]`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Cover project={featured} className="min-h-[260px] @2xl:min-h-[320px]" />
                <div className="p-7 flex flex-col">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: featured.tint }}>
                    ★ Featured case study
                  </div>
                  <div className={`mt-2 text-[26px] font-bold tracking-[-0.02em] leading-tight ${t.textMain}`}>{featured.shortTitle ?? featured.title}</div>
                  <div className={`mt-1 text-[12px] ${t.textSub}`}>{(featured.meta ?? []).join(" · ")}</div>
                  <p className={`mt-3 text-[14px] leading-relaxed ${t.textBody}`}>{featured.subtitle}</p>
                  <ul className={`mt-3 space-y-1.5 text-[13px] leading-snug ${t.textBody}`}>
                    {(featured.bullets ?? []).slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[0.5em] w-1 h-1 rounded-full shrink-0" style={{ background: featured.tint }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex-1" />
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {(featured.tags ?? []).map((tag) => (
                        <TagDot key={tag} color={tagColor(tag)} />
                      ))}
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium text-white"
                      style={{ background: featured.tint }}
                    >
                      Read case study <Arrow className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.button>
            )}

            {/* GRID */}
            {view === "grid" ? (
              <motion.div layout className={`grid grid-cols-1 @4xl:grid-cols-2 gap-5 ${featured ? "mt-5" : ""}`}>
                <AnimatePresence mode="popLayout">
                  {rest.map((p, i) => (
                    <motion.button
                      layout
                      key={p.id}
                      type="button"
                      onClick={() => open(p)}
                      className={`group text-left rounded-[18px] overflow-hidden flex flex-col ${card} transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)]`}
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Cover project={p} className="h-[230px]" />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className={`text-[11px] ${t.textSub}`}>{(p.meta ?? []).join(" · ")}</div>
                        <div className={`mt-1 text-[19px] font-semibold tracking-[-0.01em] leading-tight ${t.textMain}`}>{p.shortTitle ?? p.title}</div>
                        <p className={`mt-1.5 text-[13px] leading-relaxed ${t.textSub}`}>{p.subtitle}</p>
                        <div className="flex-1" />
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {(p.tags ?? []).map((tag) => (
                              <span key={tag} className={`inline-flex items-center gap-1.5 text-[11px] ${t.textSub}`}>
                                <TagDot color={tagColor(tag)} size={7} /> {tag}
                              </span>
                            ))}
                          </div>
                          <span className="shrink-0 inline-flex items-center gap-1 text-[13px] font-medium" style={{ color: p.tint }}>
                            Read <Arrow className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* LIST */
              <div className={`rounded-xl overflow-hidden ${card}`}>
                <div className={`grid grid-cols-[56px_1fr_64px] @2xl:grid-cols-[64px_1.5fr_1fr_1fr_80px] gap-3 @2xl:gap-4 px-4 py-2 text-[11px] font-medium border-b ${t.divider} ${t.textSub}`}>
                  <span />
                  <span>Name</span>
                  <span className="hidden @2xl:block">Details</span>
                  <span className="hidden @2xl:block">Tags</span>
                  <span />
                </div>
                {rest.map((p, i) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => open(p)}
                    className={`group w-full grid grid-cols-[56px_1fr_64px] @2xl:grid-cols-[64px_1.5fr_1fr_1fr_80px] gap-3 @2xl:gap-4 items-center px-4 py-3 text-left ${
                      i % 2 ? (t.isDark ? "bg-white/[0.02]" : "bg-black/[0.015]") : ""
                    } ${t.hoverBg}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <span className="w-16 h-11 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: `${p.tint}22` }}>
                      <img src={p.thumbnail} alt="" className="max-w-full max-h-full object-contain p-1" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[14px] font-semibold truncate ${t.textMain}`}>{p.shortTitle ?? p.title}</span>
                      <span className={`block text-[12px] truncate ${t.textSub}`}>{p.subtitle}</span>
                    </span>
                    <span className={`hidden @2xl:block text-[12px] truncate ${t.textSub}`}>{(p.meta ?? []).join(" · ")}</span>
                    <span className="hidden @2xl:flex gap-1.5">
                      {(p.tags ?? []).map((tag) => (
                        <span key={tag} title={tag}>
                          <TagDot color={tagColor(tag)} />
                        </span>
                      ))}
                    </span>
                    <span className="justify-self-end inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: p.tint }}>
                      Open <Arrow className="w-3 h-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
