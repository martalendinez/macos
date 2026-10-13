// src/components/windows/GitHub/GitHubWindow.jsx
// A GitHub-style app that shows how Marta ships: a profile with this repo's real commit history,
// and a demo pull request the visitor reviews, can push back on, and finally merges.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import avatar from "../../../imgs/avatar/profile-photo.jpg";
import { COMMITS_PER_DAY, RECENT_COMMITS, SNAPSHOT_DATE, TOTAL_COMMITS } from "./repoActivity";
import { openWorkspace, useWorkspace } from "../../../config/workspaceBus";
import traceReadme from "../VSCode/workspaces/trace/README.md.txt?raw";
import salReadme from "../VSCode/workspaces/sallskap/README.md.txt?raw";
import kalReadme from "../VSCode/workspaces/kallos/README.md.txt?raw";
import { WORKSPACE_PROJECTS } from "../../../config/projectWorkspaces";
import DemoBanner from "../DemoBanner";

export const PR_STORE = "portfolio.github.pr.v1";
const STORE = PR_STORE;
const PROFILE_URL = "https://github.com/martalendinez";
const REPO_URL = "https://github.com/martalendinez/macos";

const PALETTE = {
  light: { bg: "#ffffff", subtle: "#f6f8fa", border: "#d1d9e0", text: "#1f2328", muted: "#59636e", link: "#0969da", green: "#1a7f37", greenBg: "#1f883d", red: "#d1242f", purple: "#8250df", yellow: "#9a6700", heat: ["#eff2f5", "#aceebb", "#4ac26b", "#2da44e", "#116329"] },
  dark: { bg: "#0d1117", subtle: "#151b23", border: "#3d444d", text: "#f0f6fc", muted: "#9198a1", link: "#4493f8", green: "#3fb950", greenBg: "#238636", red: "#f85149", purple: "#ab7df8", yellow: "#d29922", heat: ["#151b23", "#033a16", "#196c2e", "#2ea043", "#56d364"] },
};

/* ---------- icons (simple outlines, GitHub-like) ---------- */
const P = {
  repo: "M4 3.5A1.5 1.5 0 0 1 5.5 2H13v10H5.5A1.5 1.5 0 0 0 4 13.5zM4 13.5A1.5 1.5 0 0 0 5.5 15H13v-3M6.5 5h4",
  pr: "M4.5 5v6M4.5 3.5a1.5 1.5 0 1 1 0 .01M4.5 12.5a1.5 1.5 0 1 1 0 .01M11.5 12.5a1.5 1.5 0 1 1 0 .01M11.5 11V6.5A2 2 0 0 0 9.5 4.5H7M8.5 3L7 4.5 8.5 6",
  merge: "M4.5 5v6M4.5 3.5a1.5 1.5 0 1 1 0 .01M4.5 12.5a1.5 1.5 0 1 1 0 .01M11.5 9.5a1.5 1.5 0 1 1 0 .01M4.5 5c0 2.5 2 4.5 5.5 4.5",
  check: "M3 8.5l3 3 7-7",
  x: "M4 4l8 8M12 4l-8 8",
  commit: "M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM1.5 8h4M10.5 8h4",
  comment: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z",
  file: "M4 1.8h5l3 3v9.4H4zM9 1.8v3h3",
  pin: "M8 14.5s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0c0 3.3 4.5 7.5 4.5 7.5zM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  org: "M2.5 14V3.5h7V14M9.5 7h4v7M4.5 6h1M6.5 6h1M4.5 8.5h1M6.5 8.5h1M4.5 11h1M6.5 11h1M1.5 14h13",
  link: "M7 9a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.7.7M9 7a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.7-.7",
  eye: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8zM8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  rocket: "M9.5 2.5c2.5 0 4 1.5 4 4-1 2.5-3.5 5-6 6l-3-3c1-2.5 3.5-5 5-7zM4.5 9.5l-2 .5 1-2.5 2-.5M6.5 11.5l-.5 2 2.5-1 .5-2M10.5 5.5a.8.8 0 1 0 0 .01",
};
const I = ({ n, className = "w-4 h-4", style }) => (
  <svg viewBox="0 0 16 16" className={`shrink-0 ${className}`} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={P[n]} />
  </svg>
);
const Logo = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-label="GitHub">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
);

/* ---------- WCAG contrast (for the before/after preview) ---------- */
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b = "#ffffff") => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const OLD = { base: "#5aa9ff", hover: "#7ab9ff" };
const NEW = { base: "#0b63ce", hover: "#0a56b3" };

/* ---------- profile ---------- */
const PINNED = [
  { name: "macos", desc: "This portfolio: a macOS-style desktop with real apps, built in React.", stack: "React · Vite · Tailwind · Framer Motion", url: REPO_URL, isPublic: true },
  { name: "Trace_Plugin", desc: "AI co-pilot for Figma that helps designers think, not just generate. KTH master thesis.", stack: "React · TypeScript · Express · LLaMA", isPublic: true, view: "repo:trace" },
  { name: "Kallos", desc: "Employer-branding platform for PrideCom with encrypted data and a local LLM.", stack: "Flask · PostgreSQL · PyNaCl · LLaMA", isPublic: true, view: "repo:kallos" },
  { name: "Sallskap", desc: "Group restaurant coordination: availability, diets and a fair group pick.", stack: "React · TypeScript · Tailwind · Supabase", isPublic: true, view: "repo:sallskap" },
  { name: "trivia-app", desc: "Mobile trivia MVP built as a KTH group project, powered by a public API.", stack: "React Native", win: "triviaCaseStudy" },
];

function Heatmap({ c }) {
  const weeks = useMemo(() => {
    const end = new Date(`${SNAPSHOT_DATE}T12:00:00`);
    const start = new Date(end);
    start.setDate(start.getDate() - 7 * 38 - start.getDay());
    const out = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      if (d.getDay() === 0) out.push([]);
      out[out.length - 1].push({ key, n: COMMITS_PER_DAY[key] || 0, month: d.getDate() <= 7 && d.getDay() === 0 ? d.toLocaleString("en", { month: "short" }) : null });
    }
    return out;
  }, []);
  const level = (n) => (n === 0 ? 0 : n <= 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);
  const [tip, setTip] = useState(null);
  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1 min-w-max">
          <div className="flex gap-[3px] text-[10px] h-3" style={{ color: c.muted }}>
            {weeks.map((w, i) => (
              <span key={i} className="w-[11px] overflow-visible whitespace-nowrap">{w[0]?.month || ""}</span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {w.map((d) => (
                  <span
                    key={d.key}
                    onMouseEnter={() => setTip(d)}
                    onMouseLeave={() => setTip(null)}
                    className="w-[11px] h-[11px] rounded-[2px]"
                    style={{ background: c.heat[level(d.n)], outline: `1px solid ${c.border}40`, outlineOffset: -1 }}
                    aria-label={`${d.n} commits on ${d.key}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11.5px]" style={{ color: c.muted }}>
        <span>{tip ? `${tip.n} commit${tip.n === 1 ? "" : "s"} on ${new Date(tip.key).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : "Hover a day to see its commits"}</span>
        <span className="flex items-center gap-1">
          Less
          {c.heat.map((h) => (
            <span key={h} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: h }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

function Profile({ c, onOpenWindow, openPr, prState, go }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[230px_1fr] gap-6 p-4 @2xl:p-6">
      <aside className="flex @3xl:block gap-4 items-center">
        <img src={avatar} alt="Marta Lendínez" className="w-20 h-20 @3xl:w-full @3xl:h-auto aspect-square rounded-full object-cover" style={{ boxShadow: `0 0 0 1px ${c.border}` }} />
        <div className="min-w-0">
          <h1 className="mt-0 @3xl:mt-4 text-[22px] font-semibold leading-tight">Marta Lendínez</h1>
          <div className="text-[17px] font-light" style={{ color: c.muted }}>martalendinez</div>
          <p className="mt-3 text-[14px] leading-snug hidden @3xl:block">Design Engineer. I design it, then I build it.</p>
          <ul className="mt-3 space-y-1.5 text-[13px] hidden @3xl:block">
            <li className="flex items-center gap-2"><I n="org" style={{ color: c.muted }} />ROYC</li>
            <li className="flex items-center gap-2"><I n="pin" style={{ color: c.muted }} />Stockholm, Sweden</li>
            <li className="flex items-center gap-2"><I n="link" style={{ color: c.muted }} /><a href={PROFILE_URL} target="_blank" rel="noreferrer" className="hover:underline truncate" style={{ color: c.link }}>github.com/martalendinez</a></li>
          </ul>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <section className="rounded-[6px] p-5" style={{ border: `1px solid ${c.border}` }}>
          <div className="text-[12px] font-mono mb-3" style={{ color: c.muted }}>martalendinez / README.md</div>
          <h2 className="text-[20px] font-semibold pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>How I work</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed list-disc pl-5">
            <li><b>Small PRs, clear descriptions.</b> Every PR says why, what changed and how I tested it.</li>
            <li><b>Accessibility is a check, not a nice-to-have.</b> Contrast, keyboard and screen reader are part of “done”.</li>
            <li><b>Tokens are the contract.</b> Figma and code read from the same design tokens, so nothing drifts.</li>
            <li><b>Prototype in code early.</b> Real data and real interactions find problems a mockup hides.</li>
          </ul>
          <button type="button" onClick={openPr} className="mt-4 inline-flex items-center gap-2 rounded-[6px] px-3 py-1.5 text-[13px] font-semibold" style={{ background: c.subtle, border: `1px solid ${c.border}` }}>
            <I n={prState === "merged" ? "merge" : "pr"} style={{ color: prState === "merged" ? c.purple : c.green }} />
            {prState === "merged" ? "See the merged pull request" : "Review my open pull request"}
          </button>
        </section>

        <section>
          <h2 className="text-[16px] mb-2">Pinned</h2>
          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
            {PINNED.map((r) => (
              <div key={r.name} className="rounded-[6px] p-4 flex flex-col" style={{ border: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2">
                  <I n="repo" style={{ color: c.muted }} />
                  <span className="text-[14px] font-semibold" style={{ color: c.link }}>{r.name}</span>
                  <span className="ml-auto text-[11px] font-medium rounded-full px-2" style={{ border: `1px solid ${c.border}`, color: c.muted }}>{r.isPublic ? "Public" : "Case study"}</span>
                </div>
                <p className="mt-2 text-[12.5px] leading-snug flex-1" style={{ color: c.muted }}>{r.desc}</p>
                <div className="mt-3 flex items-center gap-3 text-[12px]">
                  <span className="truncate" style={{ color: c.muted }}>{r.stack}</span>
                  {r.view ? (
                    <button type="button" onClick={() => go(r.view)} className="ml-auto shrink-0 font-semibold hover:underline" style={{ color: c.link }}>Open repo</button>
                  ) : r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="ml-auto shrink-0 font-semibold hover:underline" style={{ color: c.link }}>Open repo</a>
                  ) : (
                    <button type="button" onClick={() => onOpenWindow?.(r.win)} className="ml-auto shrink-0 font-semibold hover:underline" style={{ color: c.link }}>Case study</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] mb-2">{TOTAL_COMMITS} commits to this portfolio in 2026</h2>
          <div className="rounded-[6px] p-4" style={{ border: `1px solid ${c.border}` }}>
            <Heatmap c={c} />
          </div>
        </section>

        <section>
          <h2 className="text-[16px] mb-2">Recent commits</h2>
          <div className="rounded-[6px] overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
            {RECENT_COMMITS.map((cm, i) => (
              <div key={cm.sha} className="flex items-center gap-3 px-4 py-2.5 text-[13px]" style={i ? { borderTop: `1px solid ${c.border}` } : undefined}>
                <I n="commit" style={{ color: c.muted }} />
                <span className="truncate flex-1">{cm.msg}</span>
                <span className="shrink-0 hidden @xl:inline text-[12px]" style={{ color: c.muted }}>{new Date(cm.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                <code className="shrink-0 text-[12px] font-mono" style={{ color: c.muted }}>{cm.sha}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- the pull request ---------- */
const CHECKS = ["Lint", "Unit tests", "Visual regression", "Accessibility (axe)"];
const REQUESTS = [
  {
    id: "hover",
    text: "The hover state still looks low-contrast to me.",
    reply: "Good catch, the hover colour was still a hard-coded hex. It now reads action.primary.hover too: 7.0:1. Pushed a fix, checks are re-running.",
    commit: "Use the hover token in Button",
  },
  {
    id: "brand",
    text: "Could we keep the old brand blue instead?",
    reply: "I tried! White text on the old blue is 2.5:1, far below the 4.5:1 AA minimum. Brand signed off on the darker step for buttons; the light blue stays for illustrations and large headings. Happy to pair on it if you see another option.",
  },
];

const initialPr = () => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (s?.merged) return s;
  } catch {
    /* storage blocked */
  }
  return { merged: false };
};

function Avatar({ who, c, size = 32 }) {
  if (who === "marta") return <img src={avatar} alt="" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  return (
    <span className="rounded-full shrink-0 flex items-center justify-center font-bold text-white" style={{ width: size, height: size, background: c.purple, fontSize: size < 28 ? 10 : 12 }}>
      {size < 28 ? "Y" : "You"}
    </span>
  );
}

function CommentBox({ who, c, children, time = "just now", badge }) {
  return (
    <div className="flex gap-3">
      <span className="hidden @xl:block"><Avatar who={who} c={c} /></span>
      <div className="flex-1 min-w-0 rounded-[6px] overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 px-4 py-2 text-[13px]" style={{ background: c.subtle, borderBottom: `1px solid ${c.border}` }}>
          <b>{who === "marta" ? "martalendinez" : "you"}</b>
          <span style={{ color: c.muted }}>commented {time}</span>
          {badge && <span className="ml-auto text-[11px] font-medium rounded-full px-2" style={{ border: `1px solid ${c.border}`, color: c.muted }}>{badge}</span>}
        </div>
        <div className="px-4 py-3 text-[14px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Event({ icon, c, color, children }) {
  return (
    <div className="flex items-start gap-3 pl-1 @xl:pl-[52px] text-[13px]" style={{ color: c.muted }}>
      <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: color || c.subtle, color: color ? "#fff" : c.muted, border: color ? "none" : `1px solid ${c.border}` }}>
        <I n={icon} className="w-3.5 h-3.5" />
      </span>
      <div className="pt-1 min-w-0">{children}</div>
    </div>
  );
}

function ButtonPreview({ colors, label, c }) {
  const [hover, setHover] = useState(false);
  const bg = hover ? colors.hover : colors.base;
  const r = ratio(bg);
  const pass = r >= 4.5;
  return (
    <div className="flex-1 min-w-[180px] rounded-[6px] p-4" style={{ border: `1px solid ${c.border}` }}>
      <div className="text-[11.5px] font-semibold uppercase tracking-wide mb-3" style={{ color: c.muted }}>{label}</div>
      <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} className="w-full rounded-[12px] py-2.5 text-[14px] font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: bg, outlineColor: colors.base }}>
        Invest now
      </button>
      <div className="mt-3 flex items-center justify-between text-[12.5px]">
        <span style={{ color: c.muted }}>{hover ? "Hover" : "Default"} · white text</span>
        <span className="font-semibold tabular-nums flex items-center gap-1" style={{ color: pass ? c.green : c.red }}>
          <I n={pass ? "check" : "x"} className="w-3.5 h-3.5" />
          {r.toFixed(1)}:1 {pass ? "AA" : "Fails AA"}
        </span>
      </div>
    </div>
  );
}

const DIFFS = [
  {
    file: "src/tokens/color.json",
    lines: [
      [" ", '"action": {'],
      [" ", '  "primary": {'],
      ["-", `    "value": "${OLD.base}",`],
      ["+", `    "value": "${NEW.base}",          // 5.7:1 with white text`],
      ["-", `    "hover": "${OLD.hover}"`],
      ["+", `    "hover": "${NEW.hover}"          // 7.0:1`],
      [" ", "  }"],
      [" ", "}"],
    ],
  },
  {
    file: "src/components/Button.tsx",
    lines: [
      [" ", "export function Button({ variant = \"primary\", ...props }: ButtonProps) {"],
      [" ", "  return ("],
      [" ", "    <button"],
      ["-", "      style={{ background: \"#5aa9ff\" }}"],
      ["+", "      className={cx(styles.button, styles[variant])}"],
      ["+", "      // colours come from tokens, focus ring is always visible on keyboard"],
      [" ", "      {...props}"],
      [" ", "    />"],
      [" ", "  );"],
      [" ", "}"],
    ],
  },
  {
    file: "src/components/Button.module.css",
    lines: [
      ["+", ".primary { background: var(--action-primary); color: #fff; }"],
      ["+", ".primary:hover { background: var(--action-primary-hover); }"],
      ["+", ".button:focus-visible { outline: 2px solid var(--action-primary); outline-offset: 2px; }"],
    ],
  },
];

function FilesChanged({ c, dark }) {
  const [viewed, setViewed] = useState({});
  return (
    <div className="space-y-4">
      {DIFFS.map((d) => (
        <div key={d.file} className="rounded-[6px] overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
          <div className="flex items-center gap-2 px-3 py-2 text-[12.5px]" style={{ background: c.subtle, borderBottom: viewed[d.file] ? "none" : `1px solid ${c.border}` }}>
            <I n="file" style={{ color: c.muted }} />
            <span className="font-mono truncate">{d.file}</span>
            <span className="text-[11.5px] font-mono" style={{ color: c.green }}>+{d.lines.filter((l) => l[0] === "+").length}</span>
            <span className="text-[11.5px] font-mono" style={{ color: c.red }}>−{d.lines.filter((l) => l[0] === "-").length}</span>
            <label className="ml-auto flex items-center gap-1.5 cursor-pointer select-none" style={{ color: c.muted }}>
              <input type="checkbox" checked={!!viewed[d.file]} onChange={(e) => setViewed((v) => ({ ...v, [d.file]: e.target.checked }))} />
              Viewed
            </label>
          </div>
          {!viewed[d.file] && (
            <pre className="text-[12px] leading-[1.7] font-mono overflow-x-auto py-1">
              {d.lines.map(([s, l], i) => (
                <div key={i} className="px-3 whitespace-pre" style={s === "-" ? { background: dark ? "rgba(248,81,73,0.15)" : "#ffebe9" } : s === "+" ? { background: dark ? "rgba(46,160,67,0.15)" : "#dafbe1" } : undefined}>
                  <span className="select-none inline-block w-4" style={{ color: c.muted }}>{s}</span>
                  {l}
                </div>
              ))}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}

function CheckRow({ name, status, c }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 text-[13px]">
      {status === "pass" ? (
        <I n="check" style={{ color: c.green }} />
      ) : status === "run" ? (
        <motion.span className="w-4 h-4 rounded-full border-2 border-t-transparent shrink-0" style={{ borderColor: c.yellow, borderTopColor: "transparent" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
      ) : (
        <span className="w-4 h-4 rounded-full shrink-0" style={{ border: `2px solid ${c.border}` }} />
      )}
      <span className="font-medium">{name}</span>
      <span className="ml-auto text-[12px]" style={{ color: c.muted }}>{status === "pass" ? "Successful" : status === "run" ? "In progress…" : "Queued"}</span>
    </div>
  );
}

function PullRequest({ c, dark, notify, unlockAchievement, pr, setPr }) {
  const [tab, setTab] = useState("conversation");
  const [runId, setRunId] = useState(pr.merged ? -1 : 0);
  const [checks, setChecks] = useState(() => CHECKS.map(() => (pr.merged ? "pass" : "queued")));
  const [timeline, setTimeline] = useState([]);
  const [review, setReview] = useState(pr.merged ? "approved" : null);
  const [composer, setComposer] = useState(null);
  const [typing, setTyping] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deploy, setDeploy] = useState(pr.merged ? 3 : -1);
  const used = useRef(new Set());
  const endRef = useRef(null);

  // run the checks one after another whenever a new commit is pushed
  useEffect(() => {
    if (runId < 0) return undefined;
    setChecks(CHECKS.map(() => "queued"));
    const ts = [];
    CHECKS.forEach((_, i) => {
      ts.push(setTimeout(() => setChecks((s) => s.map((v, j) => (j === i ? "run" : v))), 300 + i * 650));
      ts.push(setTimeout(() => setChecks((s) => s.map((v, j) => (j === i ? "pass" : v))), 300 + i * 650 + 900));
    });
    return () => ts.forEach(clearTimeout);
  }, [runId]);

  useEffect(() => {
    if (deploy < 0 || deploy >= 3) return undefined;
    const t = setTimeout(() => setDeploy((d) => d + 1), 900);
    return () => clearTimeout(t);
  }, [deploy]);

  useEffect(() => {
    if (deploy === 3 && !pr.merged) {
      const next = { merged: true };
      setPr(next);
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* storage blocked */
      }
      window.dispatchEvent(new CustomEvent("portfolio:ship", { detail: { merged: true } }));
      notify?.({ title: "Deployed to production", message: "The Invest button now passes WCAG AA (5.7:1). Thanks for the review!", toast: true });
      unlockAchievement?.("shipped_it", "🏆 Achievement unlocked: Shipped It", "You reviewed and merged Marta’s pull request 🚀");
    }
  }, [deploy, pr.merged, setPr, notify, unlockAchievement]);

  useEffect(() => {
    if (timeline.length || typing) endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [timeline.length, typing]);

  const checksDone = checks.every((s) => s === "pass");
  const merged = pr.merged || deploy >= 0;

  const requestChanges = (req) => {
    used.current.add(req.id);
    setComposer(null);
    setReview("changes");
    setTimeline((t) => [...t, { kind: "comment", who: "you", text: req.text, badge: "Changes requested" }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setTimeline((t) => [...t, { kind: "comment", who: "marta", text: req.reply }, ...(req.commit ? [{ kind: "commit", text: req.commit, sha: "7c1e9a4" }] : []), { kind: "event", text: "martalendinez requested your review again" }]);
      setReview(null);
      if (req.commit) setRunId((r) => r + 1);
    }, 1600);
  };
  const approve = () => {
    setComposer(null);
    setReview("approved");
    setTimeline((t) => [...t, { kind: "approved" }]);
  };
  const merge = () => {
    setConfirm(false);
    setDeploy(0);
  };
  const reset = () => {
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* storage blocked */
    }
    window.dispatchEvent(new CustomEvent("portfolio:ship", { detail: { merged: false } }));
    setPr({ merged: false });
    setTimeline([]);
    setReview(null);
    setDeploy(-1);
    used.current.clear();
    setRunId((r) => (r < 0 ? 0 : r + 1));
  };

  const btn = (primary, disabled) => ({
    background: disabled ? c.subtle : primary ? c.greenBg : c.subtle,
    color: disabled ? c.muted : primary ? "#fff" : c.text,
    border: `1px solid ${primary && !disabled ? "rgba(0,0,0,0.15)" : c.border}`,
  });

  return (
    <div className="p-4 @2xl:p-6">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
        <h1 className="text-[22px] @2xl:text-[26px] leading-tight">
          Fix: Invest button fails WCAG AA contrast <span style={{ color: c.muted }}>#43</span>
        </h1>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] pb-4" style={{ color: c.muted, borderBottom: `1px solid ${c.border}` }}>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold text-white" style={{ background: merged ? c.purple : c.greenBg }}>
          <I n={merged ? "merge" : "pr"} className="w-3.5 h-3.5" />
          {merged ? "Merged" : "Open"}
        </span>
        <span>
          <b style={{ color: c.text }}>martalendinez</b> wants to merge 3 commits into <code className="font-mono text-[12px] px-1.5 py-0.5 rounded-[6px]" style={{ background: c.subtle, color: c.link }}>main</code> from <code className="font-mono text-[12px] px-1.5 py-0.5 rounded-[6px]" style={{ background: c.subtle, color: c.link }}>fix/invest-button-contrast</code>
        </span>
        <span className="ml-auto text-[11.5px]">Demo PR, written the way I write real ones</span>
      </div>

      <div className="flex gap-1 mt-3 text-[13.5px]" style={{ borderBottom: `1px solid ${c.border}` }}>
        {[
          ["conversation", "Conversation", "comment"],
          ["files", "Files changed", "file"],
        ].map(([k, l, ic]) => (
          <button key={k} type="button" onClick={() => setTab(k)} className="flex items-center gap-1.5 px-3 py-2 -mb-px" style={tab === k ? { borderBottom: `2px solid #fd8c73`, fontWeight: 600 } : { color: c.muted }}>
            <I n={ic} />
            {l}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 @4xl:grid-cols-[1fr_220px] gap-6">
        <div className="min-w-0 space-y-4">
          {tab === "files" ? (
            <FilesChanged c={c} dark={dark} />
          ) : (
            <>
              <CommentBox who="marta" c={c} time="2 days ago" badge="Author">
                <h3 className="text-[16px] font-semibold">Why</h3>
                <p className="mt-1">
                  Our primary button used a light blue with white text: <b>2.5:1</b> contrast, under the 4.5:1 WCAG AA minimum. It’s the most important button in the app (Invest), so people with low vision or a phone in sunlight could struggle to read it.
                </p>
                <h3 className="mt-4 text-[16px] font-semibold">What changed</h3>
                <ul className="mt-1 list-disc pl-5 space-y-0.5">
                  <li>Darkened the <code className="font-mono text-[12.5px]">action.primary</code> token so every primary button gets the fix at once</li>
                  <li>Button reads tokens instead of a hard-coded hex</li>
                  <li>Added a visible keyboard focus ring</li>
                </ul>
                <h3 className="mt-4 text-[16px] font-semibold">Before / after</h3>
                <p className="mt-1 text-[13px]" style={{ color: c.muted }}>Hover the buttons to check the hover state too.</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <ButtonPreview c={c} colors={OLD} label="Before" />
                  <ButtonPreview c={c} colors={NEW} label="After" />
                </div>
                <h3 className="mt-4 text-[16px] font-semibold">How I tested</h3>
                <ul className="mt-1 space-y-1">
                  {["axe: no contrast violations", "Keyboard only: focus ring visible on every button", "VoiceOver reads “Invest now, button”", "Light and dark mode screenshots updated"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-[4px] flex items-center justify-center text-white shrink-0" style={{ background: c.link }}>
                        <I n="check" className="w-3 h-3" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </CommentBox>

              <Event icon="commit" c={c}>
                <span className="font-mono text-[12px]">a41f0c2</span> Darken action.primary token to pass AA
              </Event>
              <Event icon="commit" c={c}>
                <span className="font-mono text-[12px]">e9b27d5</span> Read Button colours from tokens, add focus ring
              </Event>
              <Event icon="eye" c={c}>
                martalendinez requested a review from <b style={{ color: c.text }}>you</b>
              </Event>

              <AnimatePresence initial={false}>
                {timeline.map((e, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    {e.kind === "comment" ? (
                      <CommentBox who={e.who} c={c} badge={e.badge}>{e.text}</CommentBox>
                    ) : e.kind === "commit" ? (
                      <Event icon="commit" c={c}>
                        <span className="font-mono text-[12px]">{e.sha}</span> {e.text}
                      </Event>
                    ) : e.kind === "approved" ? (
                      <Event icon="check" c={c} color={c.greenBg}>
                        <b style={{ color: c.text }}>you</b> approved these changes
                      </Event>
                    ) : (
                      <Event icon="eye" c={c}>{e.text}</Event>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <Event icon="comment" c={c}>
                  <span className="inline-flex items-center gap-1">
                    martalendinez is typing
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="w-1 h-1 rounded-full" style={{ background: c.muted }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} />
                    ))}
                  </span>
                </Event>
              )}

              {/* checks + merge box */}
              <div className="flex gap-3" ref={endRef}>
                <span className="hidden @xl:flex w-8 h-8 rounded-full items-center justify-center text-white shrink-0" style={{ background: merged ? c.purple : checksDone && review === "approved" ? c.greenBg : c.muted }}>
                  <I n={merged ? "merge" : "pr"} />
                </span>
                <div className="flex-1 min-w-0 rounded-[6px] overflow-hidden" style={{ border: `1px solid ${merged ? c.purple : checksDone && review === "approved" ? c.greenBg : c.border}` }}>
                  {merged ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 font-semibold text-[14px]">
                        <I n="merge" style={{ color: c.purple }} />
                        Pull request successfully merged and closed
                      </div>
                      <div className="mt-3 space-y-2">
                        {["Build", "Preview deploy", "Production"].map((s, i) => (
                          <div key={s} className="flex items-center gap-2.5 text-[13px]">
                            {deploy > i ? (
                              <I n="check" style={{ color: c.green }} />
                            ) : deploy === i ? (
                              <motion.span className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: c.yellow, borderTopColor: "transparent" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                            ) : (
                              <span className="w-4 h-4 rounded-full shrink-0" style={{ border: `2px solid ${c.border}` }} />
                            )}
                            {s}
                          </div>
                        ))}
                      </div>
                      {deploy >= 3 && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
                          <I n="rocket" style={{ color: c.purple }} />
                          <span>Shipped. Every primary button now passes AA.</span>
                          <button type="button" onClick={reset} className="ml-auto text-[12px] hover:underline" style={{ color: c.link }}>Reset demo</button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 text-[14px] font-semibold flex items-center gap-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                        {checksDone ? <I n="check" style={{ color: c.green }} /> : <motion.span className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: c.yellow, borderTopColor: "transparent" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />}
                        {checksDone ? "All checks have passed" : "Some checks haven’t completed yet"}
                      </div>
                      <div style={{ borderBottom: `1px solid ${c.border}` }}>
                        {CHECKS.map((n, i) => (
                          <CheckRow key={n} name={n} status={checks[i]} c={c} />
                        ))}
                      </div>
                      <div className="px-4 py-3 text-[13.5px] flex items-center gap-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                        {review === "approved" ? <I n="check" style={{ color: c.green }} /> : <span className="w-4 h-4 rounded-full shrink-0" style={{ border: `2px solid ${c.yellow}` }} />}
                        <span className="font-semibold">{review === "approved" ? "Changes approved" : "Review required"}</span>
                        <span style={{ color: c.muted }}>{review === "approved" ? "by you" : "You’re the reviewer"}</span>
                      </div>

                      <div className="p-4 space-y-3">
                        {review !== "approved" && !typing && (
                          <div>
                            {composer === "changes" ? (
                              <div className="space-y-2">
                                <div className="text-[12.5px] font-semibold">Pick a comment to leave:</div>
                                {REQUESTS.filter((r) => !used.current.has(r.id)).map((r) => (
                                  <button key={r.id} type="button" onClick={() => requestChanges(r)} className="w-full text-left rounded-[6px] px-3 py-2 text-[13px] hover:opacity-80" style={{ border: `1px solid ${c.border}`, background: c.subtle }}>
                                    “{r.text}”
                                  </button>
                                ))}
                                <button type="button" onClick={() => setComposer(null)} className="text-[12px]" style={{ color: c.muted }}>Cancel</button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <button type="button" disabled={!checksDone} onClick={approve} className="rounded-[6px] px-3 py-1.5 text-[13px] font-semibold disabled:cursor-not-allowed" style={btn(true, !checksDone)}>
                                  Approve
                                </button>
                                {REQUESTS.some((r) => !used.current.has(r.id)) && (
                                  <button type="button" onClick={() => setComposer("changes")} className="rounded-[6px] px-3 py-1.5 text-[13px] font-semibold" style={btn(false)}>
                                    Request changes
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {confirm ? (
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={merge} className="rounded-[6px] px-3 py-1.5 text-[13px] font-semibold" style={btn(true)}>
                              Confirm squash and merge
                            </button>
                            <button type="button" onClick={() => setConfirm(false)} className="rounded-[6px] px-3 py-1.5 text-[13px]" style={btn(false)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button type="button" disabled={!checksDone || review !== "approved"} onClick={() => setConfirm(true)} className="rounded-[6px] px-3 py-1.5 text-[13px] font-semibold disabled:cursor-not-allowed" style={btn(true, !checksDone || review !== "approved")}>
                            Squash and merge
                          </button>
                        )}
                        {(!checksDone || review !== "approved") && <p className="text-[12px]" style={{ color: c.muted }}>{!checksDone ? "Waiting for checks to finish." : "Approve the changes to enable merging, or request changes and see how I respond."}</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="text-[12.5px] space-y-4 hidden @4xl:block">
          {[
            ["Reviewers", <span key="r" className="flex items-center gap-2"><Avatar who="you" c={c} size={20} />you {review === "approved" || merged ? <I n="check" className="w-3.5 h-3.5 ml-auto" style={{ color: c.green }} /> : <span className="ml-auto w-2 h-2 rounded-full" style={{ background: c.yellow }} />}</span>],
            ["Assignees", <span key="a" className="flex items-center gap-2"><Avatar who="marta" c={c} size={20} />martalendinez</span>],
            [
              "Labels",
              <span key="l" className="flex flex-wrap gap-1">
                {[["accessibility", "#0e8a16"], ["design-system", "#5319e7"], ["quick-win", "#fbca04"]].map(([l, col]) => (
                  <span key={l} className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold" style={{ background: `${col}26`, color: dark ? "#fff" : col === "#fbca04" ? "#7a5c00" : col, border: `1px solid ${col}66` }}>{l}</span>
                ))}
              </span>,
            ],
            ["Linked design", <span key="d" style={{ color: c.muted }}>Figma · Buttons / Primary v3</span>],
          ].map(([h, v]) => (
            <div key={h} className="pb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div className="font-semibold mb-2" style={{ color: c.muted }}>{h}</div>
              {v}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

/* ---------- project repos (real READMEs, file trees and language mix) ---------- */
const REPOS = {
  trace: {
    name: "Trace_Plugin",
    url: "https://github.com/martalendinez/Trace_Plugin",
    note: "Prototype from my master thesis at KTH",
    about: "A six-stage, AI-supported reflection plugin for designers, built to enhance human thinking, not replace it.",
    readme: traceReadme,
    entry: "server/reflect.ts",
    license: "Apache-2.0",
    topics: ["ux-design", "human-ai-interaction", "llm", "react", "typescript", "figma-plugin"],
    tree: [["dir", "ai-design-reflection-assistant", "React + TypeScript plugin and Express API"], ["file", ".gitattributes", ""], ["file", "LICENSE", "Apache-2.0"], ["file", "README.md", ""]],
    langs: [["TypeScript", 95.2, "#3178c6"], ["CSS", 3.5, "#663399"], ["JavaScript", 1.0, "#f1e05a"], ["HTML", 0.3, "#e34c26"]],
  },
  sallskap: {
    name: "Sallskap",
    url: "https://github.com/martalendinez/Sallskap",
    note: "Group dining, coordinated",
    about: "A web app that simplifies group dining for groups with diverse dietary needs, from preferences to a confirmed reservation.",
    readme: salReadme,
    entry: "src/utils/filtering.ts",
    live: "https://sallskap-git-main-martalendinezs-projects.vercel.app",
    topics: ["ux-design", "react", "typescript", "supabase", "tailwind", "lovable"],
    tree: [["dir", "public", ""], ["dir", "src", "Screens, components, context and matching logic"], ["file", "README.md", ""], ["file", "package.json", ""], ["file", "tailwind.config.ts", "Design tokens"], ["file", "playwright.config.ts", "End-to-end tests"], ["file", "vercel.json", "Deployment"]],
    langs: [["TypeScript", 97.6, "#3178c6"], ["CSS", 1.6, "#663399"], ["HTML", 0.4, "#e34c26"], ["JavaScript", 0.4, "#f1e05a"]],
  },
  kallos: {
    name: "Kallos",
    url: "https://github.com/martalendinez/Kallos",
    note: "Bachelor thesis with PrideCom",
    about: "A Flask platform that helps HR teams in SMEs evaluate and improve their employer brand, with encrypted data and local LLM analysis.",
    readme: kalReadme,
    entry: "website/auth.py",
    license: "Apache-2.0",
    topics: ["flask", "python", "pynacl", "llm", "hr-tech", "ux-design"],
    tree: [["dir", "migrations", "Database migrations"], ["dir", "website", "Flask app: auth, encryption, models, templates"], ["file", "LICENSE", "Apache-2.0"], ["file", "README.md", ""], ["file", "main.py", "Entry point"]],
    langs: [["Python", 73.5, "#3572A5"], ["HTML", 23.7, "#e34c26"], ["Mako", 2.8, "#7e858d"]],
  },
};

function Md({ text, c }) {
  const out = [];
  const lines = text.split("\n");
  const inl = (t, k) =>
    t.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((p, i) => {
      if (p.startsWith("`")) return <code key={`${k}${i}`} className="font-mono text-[12.5px] px-1 py-0.5 rounded-[4px]" style={{ background: c.subtle }}>{p.slice(1, -1)}</code>;
      if (p.startsWith("**")) return <b key={`${k}${i}`}>{p.slice(2, -2)}</b>;
      if (p.startsWith("[")) return <span key={`${k}${i}`} style={{ color: c.link }}>{p.match(/\[([^\]]+)\]/)[1]}</span>;
      return p;
    });
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("```")) {
      const code = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      out.push(<pre key={i} className="my-3 rounded-[6px] p-3 text-[12.5px] font-mono overflow-x-auto" style={{ background: c.subtle }}>{code.join("\n")}</pre>);
    } else if (l.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++].split("|").slice(1, -1).map((x) => x.trim()));
      i--;
      out.push(
        <table key={i} className="my-3 text-[13px] border-collapse">
          <tbody>
            {rows.filter((r) => !r.every((x) => /^:?-+:?$/.test(x))).map((r, ri) => (
              <tr key={ri}>{r.map((x, ci) => <td key={ci} className={`px-3 py-1.5 ${ri === 0 ? "font-semibold" : ""}`} style={{ border: `1px solid ${c.border}` }}>{inl(x, `t${i}${ri}${ci}`)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      );
    } else if (/^#{1,4} /.test(l)) {
      const lvl = l.match(/^#+/)[0].length;
      out.push(<div key={i} className={lvl === 1 ? "text-[26px] font-semibold pb-2 mb-3" : lvl === 2 ? "text-[20px] font-semibold pb-1.5 mt-6 mb-2" : "text-[16px] font-semibold mt-4 mb-1"} style={lvl <= 2 ? { borderBottom: `1px solid ${c.border}` } : undefined}>{l.replace(/^#+ /, "")}</div>);
    } else if (l.startsWith("> ")) out.push(<blockquote key={i} className="pl-3 my-2 text-[14px]" style={{ borderLeft: `3px solid ${c.border}`, color: c.muted }}>{inl(l.slice(2), `q${i}`)}</blockquote>);
    else if (/^\s*(- |\d+\. )/.test(l)) out.push(<div key={i} className="flex gap-2 text-[14px] leading-relaxed pl-4"><span style={{ color: c.muted }}>•</span><span>{inl(l.trim().replace(/^(- |\d+\. )/, ""), `l${i}`)}</span></div>);
    else if (l.trim() === "---") out.push(<hr key={i} className="my-4" style={{ borderColor: c.border }} />);
    else if (l.trim()) out.push(<p key={i} className="my-2 text-[14px] leading-relaxed">{inl(l, `p${i}`)}</p>);
  }
  return out;
}

function ProjectRepo({ id, c, onOpenWindow }) {
  const R = REPOS[id];
  const [full, setFull] = useState(false);
  const readme = full ? R.readme : R.readme.split("\n").slice(0, 70).join("\n");
  const openCode = (file) => {
    openWorkspace("vscode", { project: id, file });
    onOpenWindow?.("vscode");
  };
  return (
    <div className="p-4 @2xl:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <I n="repo" style={{ color: c.muted }} />
        <span className="text-[18px]"><span style={{ color: c.link }}>martalendinez</span> / <b style={{ color: c.link }}>{R.name}</b></span>
        <span className="text-[11.5px] font-medium rounded-full px-2" style={{ border: `1px solid ${c.border}`, color: c.muted }}>Public</span>
      </div>
      <div className="mt-5 grid grid-cols-1 @4xl:grid-cols-[1fr_260px] gap-6">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[13px] font-semibold" style={{ background: c.subtle, border: `1px solid ${c.border}` }}>
              <I n="merge" className="w-3.5 h-3.5" /> main
            </span>
            <button type="button" onClick={() => openCode(R.entry)} className="ml-auto inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[13px] font-semibold text-white" style={{ background: c.greenBg }}>
              {"<>"} Open in VS Code
            </button>
          </div>
          <div className="rounded-[6px] overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2 px-4 py-2.5 text-[13px]" style={{ background: c.subtle, borderBottom: `1px solid ${c.border}` }}>
              <img src="/icons/apps/github.svg" alt="" className="w-5 h-5 rounded-full" />
              <b>martalendinez</b>
              <span className="truncate" style={{ color: c.muted }}>{R.note}</span>
            </div>
            {R.tree.map(([type, name, note], i) => (
              <button key={name} type="button" onClick={() => type === "dir" && openCode(R.entry)} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-left" style={i ? { borderTop: `1px solid ${c.border}` } : undefined}>
                <span style={{ color: type === "dir" ? "#54aeff" : c.muted }}>{type === "dir" ? "▸" : "·"}</span>
                <span className={type === "dir" ? "hover:underline" : ""} style={type === "dir" ? { color: c.link } : undefined}>{name}</span>
                <span className="ml-auto truncate" style={{ color: c.muted }}>{note}</span>
              </button>
            ))}
          </div>
          <div className="rounded-[6px]" style={{ border: `1px solid ${c.border}` }}>
            <div className="px-4 py-2.5 text-[13px] font-semibold" style={{ borderBottom: `1px solid ${c.border}` }}>README</div>
            <div className="px-6 py-5">
              <Md text={readme} c={c} />
              {!full && (
                <button type="button" onClick={() => setFull(true)} className="mt-2 text-[13px] font-semibold" style={{ color: c.link }}>Show the full README</button>
              )}
            </div>
          </div>
        </div>
        <aside className="space-y-5 text-[13px]">
          <div>
            <div className="font-semibold mb-2">About</div>
            <p style={{ color: c.muted }}>{R.about}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {R.topics.map((t) => (
                <span key={t} className="rounded-full px-2.5 py-0.5 text-[12px] font-medium" style={{ background: c.link + "1f", color: c.link }}>{t}</span>
              ))}
            </div>
            <div className="mt-3 space-y-1.5" style={{ color: c.muted }}>
              {R.license && <div>⚖ {R.license} license</div>}
              {R.live && <a href={R.live} target="_blank" rel="noreferrer" className="block hover:underline" style={{ color: c.link }}>Live demo ↗</a>}
              <a href={R.url} target="_blank" rel="noreferrer" className="block hover:underline" style={{ color: c.link }}>{R.url.replace("https://", "")}</a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-4">
            <div className="font-semibold mb-2">Languages</div>
            <div className="flex h-2 rounded-full overflow-hidden">
              {R.langs.map(([n, v, col]) => <span key={n} style={{ width: `${v}%`, background: col }} />)}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {R.langs.map(([n, v, col]) => (
                <span key={n} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: col }} /><b>{n}</b> <span style={{ color: c.muted }}>{v}%</span></span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-4 space-y-1.5">
            <div className="font-semibold mb-1">Behind this repo</div>
            <button type="button" onClick={() => onOpenWindow?.(WORKSPACE_PROJECTS[id].caseStudy)} className="block hover:underline" style={{ color: c.link }}>Case study</button>
            <button type="button" onClick={() => { openWorkspace("figma", id); onOpenWindow?.("figma"); }} className="block hover:underline" style={{ color: c.link }}>Design file in Figma</button>
            <button type="button" onClick={() => { openWorkspace("claude", id); onOpenWindow?.("claude"); }} className="block hover:underline" style={{ color: c.link }}>AI sessions in Claude</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RepoList({ c, go }) {
  return (
    <div className="p-4 @2xl:p-6">
      <h2 className="text-[20px] font-semibold">Repositories</h2>
      <p className="mt-1 text-[13px]" style={{ color: c.muted }}>The public repos behind my case studies, plus this portfolio.</p>
      <div className="mt-4 rounded-[6px] overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
        {[...Object.entries(REPOS), ["macos", { name: "macos", about: "This portfolio: a macOS-style desktop with real apps, built in React.", langs: [["JavaScript", 100, "#f1e05a"]], url: REPO_URL }]].map(([id, r], i) => (
          <div key={id} className="flex flex-wrap items-center gap-3 px-4 py-4" style={i ? { borderTop: `1px solid ${c.border}` } : undefined}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {id === "macos" ? (
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-[16px] font-semibold hover:underline" style={{ color: c.link }}>{r.name}</a>
                ) : (
                  <button type="button" onClick={() => go(`repo:${id}`)} className="text-[16px] font-semibold hover:underline" style={{ color: c.link }}>{r.name}</button>
                )}
                <span className="text-[11px] font-medium rounded-full px-2" style={{ border: `1px solid ${c.border}`, color: c.muted }}>Public</span>
              </div>
              <p className="mt-1 text-[13px]" style={{ color: c.muted }}>{r.about}</p>
            </div>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: c.muted }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.langs[0][2] }} />
              {r.langs[0][0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GitHubWindow({ theme = "light", onOpenWindow, notify, unlockAchievement }) {
  const dark = theme === "dark";
  const c = dark ? PALETTE.dark : PALETTE.light;
  const [view, setView] = useState("profile");
  const [pr, setPr] = useState(initialPr);
  const scroller = useRef(null);
  const go = (v) => {
    setView(v);
    scroller.current?.scrollTo({ top: 0 });
  };
  useWorkspace("github", (p) => REPOS[p] && go(`repo:${p}`));
  const repoId = view.startsWith("repo:") ? view.slice(5) : null;

  return (
    <div className="no-darkwin h-full flex flex-col" style={{ background: c.bg, color: c.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif' }}>
      <header className="shrink-0 px-4 pt-3" style={{ background: c.subtle, borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-3">
          <span style={{ color: c.text }}><Logo /></span>
          <button type="button" onClick={() => go("profile")} className="text-[14px] font-semibold hover:underline">martalendinez</button>
          {view !== "profile" && (
            <>
              <span style={{ color: c.muted }}>/</span>
              <span className="text-[14px] font-semibold">{repoId ? REPOS[repoId].name : view === "repos" ? "repositories" : "macos"}</span>
            </>
          )}
        </div>
        <nav className="flex gap-1 mt-2 text-[13.5px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["profile", "Overview", "repo"],
            ["pr", "Pull requests", "pr"],
            ["repos", "Repositories", "repo"],
          ].map(([k, l, ic]) => (
            <button key={k} type="button" onClick={() => go(k)} className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-2.5 py-2 -mb-px" style={view === k || (k === "repos" && repoId) ? { borderBottom: "2px solid #fd8c73", fontWeight: 600 } : { color: c.muted, borderBottom: "2px solid transparent" }}>
              <I n={ic} style={{ color: c.muted }} />
              {l}
              {k === "pr" && !pr.merged && <span className="ml-0.5 rounded-full px-1.5 text-[11.5px] font-semibold" style={{ background: dark ? "rgba(101,108,118,0.4)" : "rgba(129,139,152,0.2)" }}>1</span>}
            </button>
          ))}
        </nav>
      </header>
      {repoId && <DemoBanner project={WORKSPACE_PROJECTS[repoId].name} dark={dark} onBack={() => onOpenWindow?.(WORKSPACE_PROJECTS[repoId].caseStudy)} />}
      <div ref={scroller} className="@container flex-1 min-h-0 overflow-y-auto">
        {view === "profile" ? (
          <Profile c={c} onOpenWindow={onOpenWindow} openPr={() => go("pr")} prState={pr.merged ? "merged" : "open"} go={go} />
        ) : repoId ? (
          <ProjectRepo key={repoId} id={repoId} c={c} onOpenWindow={onOpenWindow} />
        ) : view === "repos" ? (
          <RepoList c={c} go={go} />
        ) : (
          <PullRequest c={c} dark={dark} notify={notify} unlockAchievement={unlockAchievement} pr={pr} setPr={setPr} />
        )}
      </div>
    </div>
  );
}
