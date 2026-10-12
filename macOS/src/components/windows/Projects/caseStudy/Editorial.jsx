// src/components/windows/Projects/caseStudy/Editorial.jsx
// Editorial building blocks for case studies: intro, at-a-glance, stats, decisions, quotes,
// finding → change rows, and framed visuals (browser frame, phone crop, tinted stage).
// No boxes around text: structure comes from type, hairlines and whitespace.
import { motion } from "framer-motion";
import { ZoomBadge } from "./CaseStudyImageTile";
import { useCaseStudyContext } from "./CaseStudyLayout";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const hex = (h, a) => {
  const n = parseInt(h.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* ---------- text ---------- */

export function Intro({ theme, eyebrow, title, lede, ctas = [], facts = [], tint }) {
  return (
    <header>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: tint }}>
          {eyebrow}
        </div>
        <h1 className={`mt-4 text-[34px] @2xl:text-[50px] font-bold tracking-[-0.035em] leading-[1.04] ${theme.textMain}`}>{title}</h1>
        <p className={`mt-5 max-w-[680px] text-[17px] @2xl:text-[19px] leading-[1.6] ${theme.textBody}`}>{lede}</p>
        {!!ctas.length && (
          <div className="mt-7 flex flex-wrap gap-2">
            {ctas.map((c, i) => (
              <a
                key={c.href}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${i === 0 ? theme.primaryButtonClass : theme.buttonClass}`}
              >
                {c.label} {i === 0 ? "↗" : ""}
              </a>
            ))}
          </div>
        )}
      </motion.div>
      {!!facts.length && (
        <dl className={`mt-10 grid grid-cols-2 @3xl:grid-cols-4 border-y ${theme.divider}`}>
          {facts.map((f, i) => (
            <div key={f.k} className={`py-4 pr-4 ${i % 2 ? "pl-4 @3xl:pl-5" : "@3xl:pl-5 @3xl:first:pl-0"} ${i > 0 ? `@3xl:border-l ${theme.divider}` : ""} ${i % 2 ? `border-l ${theme.divider}` : ""}`}>
              <dt className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${theme.textSub}`}>{f.k}</dt>
              <dd className={`mt-1.5 text-[14px] leading-snug font-medium ${theme.textMain}`}>{f.v}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}

export function Lead({ theme, children }) {
  return <p className={`text-[19px] @2xl:text-[21px] leading-[1.55] tracking-[-0.01em] ${theme.textMain}`}>{children}</p>;
}

export function H3({ theme, children, className = "" }) {
  return <h3 className={`text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain} ${className}`}>{children}</h3>;
}

/** Problem / What I did / Outcome in three columns, each with an accent rule on top. */
export function AtAGlance({ theme, tint, items }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-x-8 gap-y-7">
      {items.map((it) => (
        <div key={it.label} className="pt-4 border-t-2" style={{ borderColor: tint }}>
          <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${theme.textSub}`}>{it.label}</div>
          <p className={`mt-2 text-[15px] leading-[1.65] ${theme.textBody}`}>{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Stats({ theme, tint, items }) {
  return (
    <div className={`grid grid-cols-2 @3xl:grid-cols-4 border-y ${theme.divider}`}>
      {items.map((s, i) => (
        <motion.div
          key={s.label}
          className={`py-5 pr-4 ${i % 2 ? `pl-4 border-l ${theme.divider}` : ""} ${i > 0 ? `@3xl:pl-5 @3xl:border-l ${theme.divider}` : ""} ${i >= 2 ? `border-t @3xl:border-t-0 ${theme.divider}` : ""}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
        >
          <div className="text-[34px] @2xl:text-[40px] font-bold tracking-[-0.04em] leading-none tabular-nums" style={{ color: tint }}>
            {s.value}
          </div>
          <div className={`mt-2 text-[13px] leading-snug ${theme.textBody}`}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

/** Numbered list of research insights: bold claim, explanation, and what it changed. */
export function Insights({ theme, tint, items }) {
  return (
    <ol className="space-y-7">
      {items.map((it, i) => (
        <li key={it.title} className="grid grid-cols-[36px_1fr] gap-x-3">
          <span className="text-[13px] font-semibold tabular-nums pt-[3px]" style={{ color: tint }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>{it.title}</div>
            <p className="mt-1.5">{it.text}</p>
            {it.so && (
              <p className={`mt-2 text-[14px] ${theme.textSub}`}>
                <span className="font-semibold" style={{ color: tint }}>
                  So →{" "}
                </span>
                {it.so}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A design decision: what I chose, why, and the trade-off I accepted. */
export function Decision({ theme, tint, n, title, children, tradeoff, visual }) {
  return (
    <motion.div
      className={`grid grid-cols-1 ${visual ? "@3xl:grid-cols-[1fr_1.1fr] @3xl:gap-10" : ""} gap-6 py-9 border-t ${theme.divider} first:border-t-0 first:pt-0`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: tint }}>
          Decision {String(n).padStart(2, "0")}
        </div>
        <div className={`mt-2 text-[22px] font-bold tracking-[-0.02em] leading-tight ${theme.textMain}`}>{title}</div>
        <div className="mt-3">{children}</div>
        {tradeoff && (
          <p className={`mt-4 pl-4 border-l-2 text-[14px] leading-relaxed ${theme.textSub}`} style={{ borderColor: hex(tint, 0.5) }}>
            <span className={`font-semibold ${theme.textMain}`}>Trade-off: </span>
            {tradeoff}
          </p>
        )}
      </div>
      {visual && <div className="min-w-0">{visual}</div>}
    </motion.div>
  );
}

export function PullQuote({ theme, tint, quotes, who }) {
  return (
    <figure className="my-10">
      <blockquote className="pl-5 border-l-[3px] space-y-1" style={{ borderColor: tint }}>
        {quotes.map((q) => (
          <p key={q} className={`text-[22px] @2xl:text-[26px] font-semibold tracking-[-0.02em] leading-snug ${theme.textMain}`}>
            {q}
          </p>
        ))}
      </blockquote>
      {who && <figcaption className={`mt-3 text-[13px] ${theme.textSub}`}>{who}</figcaption>}
    </figure>
  );
}

/** "What we saw" → "What I changed" rows. */
export function Changes({ theme, tint, items, labels = ["What we saw", "What I changed"] }) {
  return (
    <div>
      <div className={`hidden @3xl:grid grid-cols-[1fr_24px_1fr] gap-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] ${theme.textSub}`}>
        <span>{labels[0]}</span>
        <span />
        <span>{labels[1]}</span>
      </div>
      {items.map((it) => (
        <div key={it.changed} className={`grid grid-cols-1 @3xl:grid-cols-[1fr_24px_1fr] gap-1 @3xl:gap-4 py-3.5 border-t ${theme.divider}`}>
          <div className={`text-[15px] leading-relaxed ${theme.textSub}`}>{it.found}</div>
          <div className="hidden @3xl:block text-center" style={{ color: tint }}>
            →
          </div>
          <div className={`text-[15px] leading-relaxed font-medium ${theme.textMain}`}>
            <span className="@3xl:hidden" style={{ color: tint }}>
              →{" "}
            </span>
            {it.changed}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- visuals ---------- */

/** Tinted backdrop that makes screenshots and mockups feel staged, not pasted. */
export function Stage({ theme, tint, children, className = "", pad = "p-5 @2xl:p-10" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] ${pad} ${className}`}
      style={{
        background: theme.isDark
          ? `radial-gradient(120% 90% at 20% 0%, ${hex(tint, 0.28)}, transparent 60%), linear-gradient(160deg, ${hex(tint, 0.16)}, ${hex(tint, 0.05)})`
          : `radial-gradient(120% 90% at 20% 0%, ${hex(tint, 0.22)}, transparent 60%), linear-gradient(160deg, ${hex(tint, 0.12)}, ${hex(tint, 0.03)})`,
      }}
    >
      {children}
    </div>
  );
}

/** Soft tinted canvas every case-study visual sits on (Dribbble "shot" style). */
function Canvas({ theme, tint, children, className = "", pad = "p-4 @2xl:p-7" }) {
  const { canvas = true } = useCaseStudyContext();
  // plain presentation: no tinted backdrop, the mockup sits directly on the page
  if (!canvas) return <div className={`relative ${className.replace(/aspect-\[[^\]]+\]/, "")}`}>{children}</div>;
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] ${pad} ${className}`}
      style={{
        background: theme.isDark
          ? `radial-gradient(90% 80% at 0% 0%, ${hex(tint, 0.3)}, transparent 60%), radial-gradient(70% 70% at 100% 100%, ${hex(tint, 0.18)}, transparent 60%), #1a1a1d`
          : `radial-gradient(90% 80% at 0% 0%, ${hex(tint, 0.2)}, transparent 60%), radial-gradient(70% 70% at 100% 100%, ${hex(tint, 0.12)}, transparent 60%), #f6f6f8`,
        boxShadow: theme.isDark ? "inset 0 0 0 0.5px rgba(255,255,255,0.08)" : "inset 0 0 0 0.5px rgba(0,0,0,0.04)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none" style={{ backgroundImage: GRAIN }} />
      <div className="relative">{children}</div>
    </div>
  );
}

const SHADOW_LIGHT = "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -20px rgba(20,20,40,0.32)";
const SHADOW_DARK = "0 0 0 0.5px rgba(255,255,255,0.12), 0 24px 48px -18px rgba(0,0,0,0.75)";
const lift = "transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-2xl";

function useTint(tint) {
  const ctx = useCaseStudyContext();
  return tint ?? ctx.tint ?? "#0a84ff";
}

function Cap({ theme, tint, children }) {
  if (!children) return null;
  return (
    <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
      <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tint }} />
      <span>{children}</span>
    </figcaption>
  );
}

function BrowserWindow({ theme, src, alt, url }) {
  return (
    <div className={`relative rounded-[12px] overflow-hidden bg-white ${lift}`} style={{ boxShadow: theme.isDark ? SHADOW_DARK : SHADOW_LIGHT }}>
      <div className={`h-7 flex items-center gap-1.5 px-3 ${theme.isDark ? "bg-[#2c2c2e]" : "bg-[#f1f1f3]"}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        {url && (
          <span className={`mx-auto max-w-[60%] truncate px-3 py-[2px] rounded-md text-[10px] ${theme.isDark ? "bg-white/10 text-white/60" : "bg-white text-black/45"}`}>
            {url}
          </span>
        )}
        {url && <span className="w-[42px]" />}
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto" />
    </div>
  );
}

/** MacBook-style laptop mockup. Wide screenshots are letterboxed over a blurred copy of themselves. */
function Laptop({ src, alt }) {
  return (
    <div className={`relative ${lift} group-hover:shadow-none`}>
      <div className="px-[7%]">
        <div className="relative rounded-t-[14px] bg-[#0c0c0e] p-[1.8%] pb-[2.6%]" style={{ boxShadow: "inset 0 0 0 1.5px #2b2b2f, 0 30px 50px -28px rgba(0,0,0,0.55)" }}>
          <span className="absolute top-[0.9%] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#26262a]" />
          {/* the screen takes the screenshot's own proportions, so nothing is cropped */}
          <div className="relative overflow-hidden rounded-[3px] bg-white">
            <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto" />
          </div>
        </div>
      </div>
      <div className="relative h-[14px] rounded-b-[12px] rounded-t-[2px]" style={{ background: "linear-gradient(180deg,#e9eaec 0%,#c9cbcf 55%,#a5a7ac 100%)", boxShadow: "0 18px 30px -14px rgba(0,0,0,0.45)" }}>
        <span className="absolute left-1/2 -translate-x-1/2 top-0 w-[15%] h-[45%] rounded-b-[6px] bg-[#b4b6ba]" />
      </div>
    </div>
  );
}

/** A tall plugin / side-panel screen, floating as a card. */
export function PanelShot({ theme, tint: tintProp, src, alt, onOpen, caption, maxW = 340 }) {
  const tint = useTint(tintProp);
  return (
    <figure className="group min-w-0">
      <button type="button" onClick={() => onOpen?.(src, alt)} className="relative block w-full cursor-zoom-in" title="Click to enlarge">
        <Canvas theme={theme} tint={tint}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`block w-full mx-auto h-auto rounded-[16px] bg-white ${lift}`}
            style={{ maxWidth: maxW, boxShadow: theme.isDark ? SHADOW_DARK : SHADOW_LIGHT }}
          />
        </Canvas>
        <ZoomBadge />
      </button>
      <Cap theme={theme} tint={tint}>{caption}</Cap>
    </figure>
  );
}

/** Web screenshot as a device mockup: Safari window on a tinted canvas, or a MacBook when the study asks for it. */
export function BrowserFrame({ theme, tint: tintProp, src, alt, url, onOpen, caption, className = "" }) {
  const tint = useTint(tintProp);
  const { device = "browser" } = useCaseStudyContext();
  return (
    <figure className={`group min-w-0 ${className}`}>
      <button type="button" onClick={() => onOpen?.(src, alt)} className="relative block w-full text-left cursor-zoom-in" title="Click to enlarge">
        <Canvas theme={theme} tint={tint}>
          {device === "laptop" ? <Laptop src={src} alt={alt} /> : <BrowserWindow theme={theme} src={src} alt={alt} url={url} />}
        </Canvas>
        <ZoomBadge />
      </button>
      <Cap theme={theme} tint={tint}>{caption}</Cap>
    </figure>
  );
}

/** A real app screen inside a phone frame, staged on a tinted canvas. */
export function PhoneShot({ src, alt, onOpen, caption, theme, tint: tintProp }) {
  const tint = useTint(tintProp);
  return (
    <figure className="group min-w-0">
      <button type="button" onClick={() => onOpen?.(src, alt)} className="relative block w-full cursor-zoom-in" title="Click to enlarge">
        <Canvas theme={theme} tint={tint} pad="px-[16%] pt-6 pb-0" className="aspect-[4/5]">
          <div className={`relative mx-auto w-full max-w-[220px] bg-[#0e0e10] rounded-[26px] p-[5px] ${lift}`} style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.14), 0 24px 44px -16px rgba(0,0,0,0.5)" }}>
            <div className="relative overflow-hidden rounded-[21px] bg-white aspect-[1520/3290]">
              <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </Canvas>
        <ZoomBadge />
      </button>
      <Cap theme={theme} tint={tint}>{caption}</Cap>
    </figure>
  );
}

/** Numbered steps of a flow, each with a framed screenshot. */
export function FlowSteps({ theme, tint, steps, onOpen, url }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
      {steps.map((s, i) => (
        <div key={s.title} className="min-w-0">
          <BrowserFrame theme={theme} tint={tint} src={s.src} alt={s.title} url={url} onOpen={onOpen} />
          <div className="mt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: tint }}>
              Step {i + 1}
            </span>
            <div className={`text-[14px] font-semibold ${theme.textMain}`}>{s.title}</div>
            <div className={`text-[13px] leading-snug ${theme.textSub}`}>{s.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Caption({ theme, children }) {
  return <p className={`mt-3 text-[13px] leading-snug ${theme.textSub}`}>{children}</p>;
}

/** Any artefact (diagram, research, screenshot) presented as a clean card on a tinted canvas. */
export function Figure({ theme, tint: tintProp, src, alt, caption, onOpen, framed = true }) {
  const tint = useTint(tintProp);
  return (
    <figure className="group min-w-0">
      <button type="button" onClick={() => onOpen?.(src, alt)} className="relative block w-full cursor-zoom-in" title="Click to enlarge">
        <Canvas theme={theme} tint={tint}>
          <div className={`overflow-hidden rounded-[12px] ${framed ? "bg-white" : ""} ${lift}`} style={{ boxShadow: framed ? (theme.isDark ? SHADOW_DARK : SHADOW_LIGHT) : undefined }}>
            <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto" />
          </div>
        </Canvas>
        <ZoomBadge />
      </button>
      <Cap theme={theme} tint={tint}>{caption}</Cap>
    </figure>
  );
}

/** "How I'd measure success": metric, why it matters, how to track it, and the target. */
export function MetricsPlan({ theme, tint: tintProp, items, note }) {
  const tint = useTint(tintProp);
  return (
    <div>
      <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4">
        {items.map((m, i) => (
          <motion.div
            key={m.metric}
            className={`rounded-[16px] p-5 ${theme.isDark ? "bg-white/[0.04]" : "bg-black/[0.025]"}`}
            style={{ boxShadow: theme.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.07)" : "inset 0 0 0 1px rgba(0,0,0,0.05)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`text-[16px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>{m.metric}</div>
              {m.target && (
                <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold tabular-nums" style={{ background: hex(tint, 0.14), color: tint }}>
                  {m.target}
                </span>
              )}
            </div>
            <p className={`mt-2 text-[14px] leading-relaxed ${theme.textBody}`}>{m.why}</p>
            <p className={`mt-3 text-[12.5px] ${theme.textSub}`}>
              <span className="font-semibold" style={{ color: tint }}>
                How:{" "}
              </span>
              {m.how}
            </p>
          </motion.div>
        ))}
      </div>
      {note && <p className={`mt-4 text-[13px] ${theme.textSub}`}>{note}</p>}
    </div>
  );
}

/** Numbered lessons with a big index, for the reflection section. */
export function Learnings({ theme, tint: tintProp, items }) {
  const tint = useTint(tintProp);
  return (
    <ol className="space-y-6">
      {items.map((l, i) => (
        <motion.li
          key={l.title}
          className={`grid grid-cols-[48px_1fr] gap-x-4 pb-6 border-b last:border-b-0 last:pb-0 ${theme.divider}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
        >
          <span className="text-[34px] font-bold leading-none tracking-[-0.04em] tabular-nums" style={{ color: hex(tint, 0.55) }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>{l.title}</div>
            <p className="mt-1.5">{l.text}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
