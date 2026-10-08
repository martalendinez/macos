// src/components/windows/DesignSystem/DesignSystemWindow.jsx
// Living documentation of this portfolio's design system: the real tokens, components and motion it's built with.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import TrafficLights from "../TrafficLights";
import { ACCENTS } from "../../../config/accents";
import { EASE_OUT, MENU_BAR_H, SPRING_WINDOW } from "../../../config/shell";

const SECTIONS = [
  { id: "colors", label: "Color", tint: "#ff375f", icon: "◐" },
  { id: "type", label: "Typography", tint: "#0a84ff", icon: "Aa" },
  { id: "shape", label: "Shape & depth", tint: "#bf5af2", icon: "▢" },
  { id: "components", label: "Components", tint: "#30d158", icon: "❖" },
  { id: "motion", label: "Motion", tint: "#ff9f0a", icon: "↯" },
];

const SURFACES = [
  ["Window", "#ffffff", "#1e1e20"],
  ["Sidebar", "#f3f3f5", "#262628"],
  ["Grouped bg", "#f5f5f7", "#1c1c1e"],
  ["Text primary", "#1d1d1f", "rgba(255,255,255,0.92)"],
  ["Text secondary", "rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)"],
  ["Divider", "rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"],
];

const SYSTEM = [
  ["Close", "#ff5f57"],
  ["Minimize", "#febc2e"],
  ["Zoom", "#28c840"],
  ["Destructive", "#ff3b30"],
  ["Success", "#30d158"],
  ["Spotify", "#1ed760"],
];

const TYPE = [
  ["Display", "48 / Bold / −3.5%", "text-[48px] font-bold tracking-[-0.035em] leading-[1.02]"],
  ["Title 1", "32 / Bold / −3%", "text-[32px] font-bold tracking-[-0.03em]"],
  ["Title 2", "24 / Bold / −2%", "text-[24px] font-bold tracking-[-0.02em]"],
  ["Headline", "17 / Semibold", "text-[17px] font-semibold"],
  ["Body", "15 / Regular / 1.75", "text-[15px] leading-[1.75]"],
  ["UI", "13 / Medium", "text-[13px] font-medium"],
  ["Caption", "11 / Semibold / CAPS", "text-[11px] font-semibold uppercase tracking-[0.08em]"],
];

const RADII = [
  ["Row", 7],
  ["Control", 8],
  ["Menu", 10],
  ["Window", 12],
  ["Card", 16],
  ["Hero", 22],
];

const SPRINGS = [
  ["Window", SPRING_WINDOW],
  ["Snappy", { type: "spring", stiffness: 500, damping: 40 }],
  ["Bouncy", { type: "spring", stiffness: 300, damping: 14 }],
  ["Ease-out", { duration: 0.6, ease: EASE_OUT }],
];

function Swatch({ t, name, value, sub }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="group text-left"
      title="Copy value"
    >
      <span className={`block h-16 rounded-xl ring-1 ring-inset ${t.isDark ? "ring-white/10" : "ring-black/10"} transition group-hover:scale-[1.03]`} style={{ background: value }} />
      <span className={`mt-1.5 block text-[12px] font-medium ${t.textMain}`}>{name}</span>
      <span className={`block text-[11px] font-mono truncate ${t.textSub}`}>{copied ? "Copied ✓" : sub ?? value}</span>
    </button>
  );
}

function Specimen({ t, label, children, code }) {
  return (
    <div className={`rounded-2xl p-4 ${t.isDark ? "bg-white/[0.04] ring-1 ring-white/[0.07]" : "bg-[#f5f5f7]"}`}>
      <div className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>{label}</div>
      <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
      {code && <div className={`mt-3 font-mono text-[11px] ${t.textSub}`}>{code}</div>}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-[42px] h-[26px] rounded-full transition-colors ${on ? "bg-[hsl(var(--accent))]" : "bg-black/20"}`}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 35 }} className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow ${on ? "right-[3px]" : "left-[3px]"}`} />
    </button>
  );
}

function MotionDemo({ t }) {
  const [on, setOn] = useState(false);
  return (
    <div>
      <button onClick={() => setOn((v) => !v)} className={`px-4 py-1.5 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>
        ▶ Play
      </button>
      <div className="mt-4 space-y-3">
        {SPRINGS.map(([name, tr]) => (
          <div key={name} className="flex items-center gap-3">
            <div className={`w-20 text-[12px] ${t.textSub}`}>{name}</div>
            <div className={`relative flex-1 h-9 rounded-lg ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}>
              <motion.div className="absolute top-1 left-1 w-7 h-7 rounded-md bg-[hsl(var(--accent))] shadow" animate={{ left: on ? "calc(100% - 32px)" : 4 }} transition={tr} />
            </div>
            <code className={`hidden @2xl:block w-[220px] text-[10px] font-mono ${t.textSub}`}>
              {tr.type === "spring" ? `spring ${tr.stiffness}/${tr.damping}` : `ease [${tr.ease.join(", ")}] ${tr.duration}s`}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignSystemWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", accent, setAccent }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [section, setSection] = useState("colors");
  const [toggle, setToggle] = useState(true);
  const [seg, setSeg] = useState("Day");
  const H2 = ({ kicker, title, sub }) => (
    <div className="mb-6">
      <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${t.accentText}`}>{kicker}</div>
      <h2 className={`mt-1 text-[30px] font-bold tracking-[-0.03em] ${t.textMain}`}>{title}</h2>
      {sub && <p className={`mt-1 max-w-[600px] text-[14px] leading-relaxed ${t.textSub}`}>{sub}</p>}
    </div>
  );

  return (
    <div className={`no-darkwin h-full w-full flex flex-col @3xl:flex-row ${t.windowBg}`}>
      {/* narrow: chips */}
      <div className={`@3xl:hidden shrink-0 flex gap-1.5 overflow-x-auto px-4 py-3 border-b ${t.divider} ${t.sidebarBg} [scrollbar-width:none]`}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-[13px] font-medium ${section === s.id ? "bg-[hsl(var(--accent))] text-white" : `${t.textMain} ${t.isDark ? "bg-white/[0.07]" : "bg-black/[0.05]"}`}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* sidebar */}
      <aside className={`hidden @3xl:flex w-[210px] shrink-0 flex-col border-r ${t.divider} ${t.sidebarBg}`}>
        <div className="px-4 pt-5 pb-3">
          <div className={`text-[15px] font-bold tracking-[-0.01em] ${t.textMain}`}>MartaOS Design</div>
          <div className={`text-[11px] ${t.textSub}`}>The system behind this portfolio</div>
        </div>
        <nav className="px-2 space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`relative w-full flex items-center gap-2.5 rounded-[7px] px-2 py-[5px] text-[13px] text-left ${section === s.id ? "text-white" : `${t.textMain} ${t.hoverBg}`}`}
            >
              {section === s.id && <motion.span layoutId="ds-nav" className="absolute inset-0 rounded-[7px] bg-[hsl(var(--accent))]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
              <span className="relative w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-white text-[11px] font-bold shadow-sm" style={{ background: s.tint }}>
                {s.icon}
              </span>
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex-1" />
        <div className={`m-3 rounded-xl p-3 text-[11px] leading-snug ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"} ${t.textSub}`}>
          Built with <b className={t.textMain}>design tokens</b> so one component library works in light, dark, glass and every accent. The same idea powers white-label products.
        </div>
      </aside>

      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={section} className="max-w-[820px] mx-auto px-4 @lg:px-8 py-7" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {section === "colors" && (
              <>
                <H2 kicker="Tokens" title="Color" sub="Every surface, text and accent comes from a small set of tokens. Pick an accent: the whole portfolio re-themes instantly. Click a swatch to copy it." />
                <div className={`text-[13px] font-semibold mb-2 ${t.textMain}`}>Accent (live)</div>
                <div className="grid grid-cols-3 @2xl:grid-cols-5 gap-3">
                  {Object.entries(ACCENTS).map(([k, v]) => (
                    <div key={k} className="relative">
                      <Swatch t={t} name={k[0].toUpperCase() + k.slice(1)} value={`hsl(${v})`} sub={`hsl(${v})`} />
                      <button
                        onClick={() => setAccent?.(k)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${accent === k ? "bg-white text-black shadow" : "bg-black/25 text-white hover:bg-black/40"}`}
                        aria-label={`Use ${k} accent`}
                        title="Use as accent"
                      >
                        {accent === k ? "✓" : "+"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className={`mt-8 text-[13px] font-semibold mb-2 ${t.textMain}`}>Surfaces & text</div>
                <div className="space-y-2">
                  {SURFACES.map(([name, light, dark]) => (
                    <div key={name} className="grid grid-cols-[110px_1fr_1fr] gap-3 items-center">
                      <span className={`text-[12px] ${t.textSub}`}>{name}</span>
                      {[["Light", light, "#ffffff"], ["Dark", dark, "#1e1e20"]].map(([mode, v, bg]) => (
                        <span key={mode} className={`flex items-center gap-2 rounded-lg p-1.5 ring-1 ${t.isDark ? "ring-white/10" : "ring-black/10"}`} style={{ background: bg }}>
                          <span className="w-7 h-7 rounded-md ring-1 ring-black/10" style={{ background: v }} />
                          <span className={`text-[10px] font-mono truncate ${mode === "Dark" ? "text-white/70" : "text-black/60"}`}>{v}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                <div className={`mt-8 text-[13px] font-semibold mb-2 ${t.textMain}`}>System & semantic</div>
                <div className="grid grid-cols-3 @2xl:grid-cols-6 gap-3">
                  {SYSTEM.map(([n, v]) => (
                    <Swatch key={n} t={t} name={n} value={v} />
                  ))}
                </div>
              </>
            )}

            {section === "type" && (
              <>
                <H2 kicker="Tokens" title="Typography" sub="SF Pro on Apple devices, Inter everywhere else. Tight tracking on big titles, generous line height for reading." />
                <div className={`rounded-2xl divide-y ${t.isDark ? "bg-white/[0.04] divide-white/[0.07]" : "bg-[#f5f5f7] divide-black/[0.06]"}`}>
                  {TYPE.map(([name, spec, cls]) => (
                    <div key={name} className="px-4 py-4 grid @2xl:grid-cols-[140px_1fr] gap-2 items-baseline">
                      <div>
                        <div className={`text-[12px] font-semibold ${t.textMain}`}>{name}</div>
                        <div className={`text-[11px] font-mono ${t.textSub}`}>{spec}</div>
                      </div>
                      <div className={`${cls} ${t.textMain} truncate`}>Designing for humans</div>
                    </div>
                  ))}
                </div>
                <Specimen t={t} label="Monospace (Terminal)" code='"SF Mono", ui-monospace, Menlo'>
                  <span className={`font-mono text-[14px] ${t.textMain}`}>marta@portfolio ~ % neofetch</span>
                </Specimen>
              </>
            )}

            {section === "shape" && (
              <>
                <H2 kicker="Tokens" title="Shape & depth" sub="A consistent radius scale and soft, layered shadows make windows feel like real objects." />
                <div className="grid grid-cols-3 @2xl:grid-cols-6 gap-4">
                  {RADII.map(([n, r]) => (
                    <div key={n} className="text-center">
                      <div className="h-16 bg-[hsl(var(--accent)/0.18)] ring-2 ring-[hsl(var(--accent))]" style={{ borderRadius: r }} />
                      <div className={`mt-1.5 text-[12px] font-medium ${t.textMain}`}>{n}</div>
                      <div className={`text-[11px] font-mono ${t.textSub}`}>{r}px</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-3 gap-5">
                  {[
                    ["Card", "0 1px 2px rgba(0,0,0,.04)"],
                    ["Hover lift", "0 18px 40px -18px rgba(0,0,0,.35)"],
                    ["Window", "0 28px 70px -12px rgba(0,0,0,.42), 0 10px 24px -8px rgba(0,0,0,.2)"],
                  ].map(([n, sh]) => (
                    <div key={n} className="text-center">
                      <div className={`h-24 rounded-xl ${t.isDark ? "bg-[#2c2c2e]" : "bg-white"}`} style={{ boxShadow: sh }} />
                      <div className={`mt-3 text-[12px] font-medium ${t.textMain}`}>{n}</div>
                    </div>
                  ))}
                </div>
                <Specimen t={t} label="Layout metrics" code={`menu bar ${MENU_BAR_H}px · title bar 44px · sidebar 200–230px · reading width ≤ 920px`}>
                  <span className={`text-[13px] ${t.textBody}`}>Content adapts with container queries, so every app reflows to its own window width.</span>
                </Specimen>
              </>
            )}

            {section === "components" && (
              <>
                <H2 kicker="Library" title="Components" sub="The same building blocks are reused in every app. These are live: try them." />
                <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
                  <Specimen t={t} label="Buttons">
                    <button className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>Primary</button>
                    <button className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>Secondary</button>
                    <button className={`px-4 py-1 rounded-full text-[12px] font-bold ${t.isDark ? "bg-white/[0.12] text-[#4aa3ff]" : "bg-black/[0.06] text-[#0a6fe0]"}`}>Open</button>
                  </Specimen>
                  <Specimen t={t} label="Window controls">
                    <TrafficLights isActive isDark={t.isDark} onClose={() => {}} onMinimize={() => {}} onZoom={() => {}} />
                    <span className={`text-[12px] ${t.textSub}`}>Hover to reveal glyphs</span>
                  </Specimen>
                  <Specimen t={t} label="Segmented control">
                    <div className={`flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
                      {["Day", "Week", "Month"].map((k) => (
                        <button key={k} onClick={() => setSeg(k)} className={`relative px-3 py-1 rounded-[6px] ${seg === k ? t.textMain : t.textSub}`}>
                          {seg === k && <motion.span layoutId="ds-seg" className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />}
                          <span className="relative">{k}</span>
                        </button>
                      ))}
                    </div>
                  </Specimen>
                  <Specimen t={t} label="Toggle & tags">
                    <Toggle on={toggle} onChange={setToggle} />
                    {["Fintech", "B2B SaaS", "Design Systems"].map((x) => (
                      <span key={x} className={`px-2.5 py-[3px] rounded-md text-[12px] font-medium border ${t.pillClass}`}>
                        {x}
                      </span>
                    ))}
                  </Specimen>
                  <Specimen t={t} label="Sidebar row">
                    <div className="w-[200px] space-y-0.5">
                      {["Overview", "Experience"].map((x, i) => (
                        <div key={x} className={`flex items-center gap-2.5 rounded-[7px] px-2 py-[5px] text-[13px] ${i === 0 ? "bg-[hsl(var(--accent))] text-white" : t.textMain}`}>
                          <span className="w-[22px] h-[22px] rounded-[6px]" style={{ background: i === 0 ? "#0a84ff" : "#ff9f0a" }} />
                          {x}
                        </div>
                      ))}
                    </div>
                  </Specimen>
                  <Specimen t={t} label="Notification banner">
                    <div className={`w-full rounded-[18px] px-3.5 py-3 flex gap-3 ${t.isDark ? "bg-[#2c2c2e]" : "bg-white"} shadow-sm`}>
                      <span className="w-8 h-8 rounded-[9px] bg-gradient-to-b from-[#5ac8fa] to-[#007aff]" />
                      <span className="min-w-0">
                        <span className={`block text-[13px] font-semibold ${t.textMain}`}>Achievement unlocked</span>
                        <span className={`block text-[12px] ${t.textSub}`}>Design Nerd 🎨</span>
                      </span>
                    </div>
                  </Specimen>
                </div>
              </>
            )}

            {section === "motion" && (
              <>
                <H2 kicker="Tokens" title="Motion" sub="Springs instead of fixed durations: interruptible, physical and calm. Windows use a firm, low-bounce spring; delight moments get more bounce." />
                <MotionDemo t={t} />
                <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-3 gap-4">
                  {[
                    ["Purposeful", "Motion explains where things come from: windows zoom from the click, minimized windows fly to the Dock."],
                    ["Interruptible", "Springs can be redirected mid-flight, so the UI never feels stuck in an animation."],
                    ["Respectful", "Everything honours the system “Reduce motion” setting."],
                  ].map(([h, p]) => (
                    <div key={h}>
                      <div className={`text-[14px] font-semibold ${t.textMain}`}>{h}</div>
                      <p className={`mt-1 text-[13px] leading-relaxed ${t.textSub}`}>{p}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
