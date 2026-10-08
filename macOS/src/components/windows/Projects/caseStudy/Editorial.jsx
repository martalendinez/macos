// src/components/windows/Projects/caseStudy/Editorial.jsx
// Editorial building blocks for case studies: intro, at-a-glance, stats, decisions, quotes,
// finding → change rows, and framed visuals (browser frame, phone crop, tinted stage).
// No boxes around text: structure comes from type, hairlines and whitespace.
import { motion } from "framer-motion";
import { ZoomBadge } from "./CaseStudyImageTile";

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

/** Safari-style window around a web screenshot. */
export function BrowserFrame({ theme, src, alt, url, onOpen, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(src, alt)}
      className={`group relative block w-full text-left rounded-[12px] overflow-hidden cursor-zoom-in ${className}`}
      style={{ boxShadow: theme.isDark ? "0 0 0 0.5px rgba(255,255,255,0.12), 0 24px 50px -20px rgba(0,0,0,0.7)" : "0 0 0 0.5px rgba(0,0,0,0.1), 0 24px 50px -22px rgba(0,0,0,0.35)" }}
      title="Click to enlarge"
    >
      <div className={`h-7 flex items-center gap-1.5 px-3 ${theme.isDark ? "bg-[#2c2c2e]" : "bg-[#ececee]"}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        {url && (
          <span className={`mx-auto max-w-[60%] truncate px-3 py-[2px] rounded-md text-[10px] ${theme.isDark ? "bg-white/10 text-white/60" : "bg-white text-black/50"}`}>
            {url}
          </span>
        )}
        {url && <span className="w-[42px]" />}
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto bg-white" />
      <ZoomBadge />
    </button>
  );
}

/** Phone mockup image cropped to portrait so the device fills the frame. */
export function PhoneShot({ src, alt, onOpen, caption, theme }) {
  return (
    <figure className="group min-w-0">
      <button type="button" onClick={() => onOpen?.(src, alt)} className="relative block w-full aspect-[3/4] overflow-hidden rounded-[16px] cursor-zoom-in" title="Click to enlarge">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover scale-[1.18] transition duration-500 group-hover:scale-[1.22]" />
        <ZoomBadge />
      </button>
      {caption && <figcaption className={`mt-2.5 text-[13px] leading-snug ${theme.textSub}`}>{caption}</figcaption>}
    </figure>
  );
}

/** Numbered steps of a flow, each with a framed screenshot. */
export function FlowSteps({ theme, tint, steps, onOpen, url }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
      {steps.map((s, i) => (
        <figure key={s.title} className="min-w-0">
          <BrowserFrame theme={theme} src={s.src} alt={s.title} url={url} onOpen={onOpen} />
          <figcaption className="mt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: tint }}>
              Step {i + 1}
            </span>
            <div className={`text-[14px] font-semibold ${theme.textMain}`}>{s.title}</div>
            <div className={`text-[13px] leading-snug ${theme.textSub}`}>{s.text}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Caption({ theme, children }) {
  return <p className={`mt-3 text-[13px] leading-snug ${theme.textSub}`}>{children}</p>;
}

/** Plain image that zooms on click, with optional caption (for diagrams and research artifacts). */
export function Figure({ theme, src, alt, caption, onOpen, framed = true }) {
  return (
    <figure className="group min-w-0">
      <button
        type="button"
        onClick={() => onOpen?.(src, alt)}
        className={`relative block w-full overflow-hidden rounded-[14px] cursor-zoom-in ${framed ? (theme.isDark ? "ring-1 ring-white/10" : "ring-1 ring-black/[0.07]") : ""}`}
        title="Click to enlarge"
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto bg-white" />
        <ZoomBadge />
      </button>
      {caption && <figcaption className={`mt-2.5 text-[13px] leading-snug ${theme.textSub}`}>{caption}</figcaption>}
    </figure>
  );
}
