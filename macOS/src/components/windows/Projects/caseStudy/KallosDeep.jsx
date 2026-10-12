// src/components/windows/Projects/caseStudy/KallosDeep.jsx
// Native (code-drawn) visuals for the Kallos case study, replacing screenshots of documents:
// problem cards, double diamond, competitor table, expert panel, UX sketch sheet, KPI framework,
// architecture, security flow, data model, AI pipeline and app-factory code.
// Content comes from the Kallos PDF case study, the thesis interview notes and github.com/martalendinez/Kallos.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const O = "#f07837";
const G = "#474747";
const POP = "Poppins, system-ui, sans-serif";
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

const surface = (theme) =>
  theme.isDark ? { background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" } : { background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 14px 32px -24px rgba(0,0,0,0.3)" };

const rise = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -40px 0px" },
  transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

/* ---------- icons (1.6px line, 24 grid) ---------- */
const ICON = {
  cost: "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.7 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3",
  expertise: "M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5",
  fragmented: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  sensitive: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2",
};
function Ico({ d, className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function ProblemCards({ theme }) {
  const items = [
    ["cost", "High consultancy costs", "Expert audits priced SMEs out."],
    ["expertise", "No in-house expertise", "HR teams of one or two, no branding specialist."],
    ["fragmented", "Manual, fragmented analysis", "Surveys, reviews and KPIs in different places."],
    ["sensitive", "Highly sensitive HR data", "Employee answers demand real privacy."],
  ];
  return (
    <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
      {items.map(([k, h, d], i) => (
        <motion.div key={k} {...rise(i)} className="rounded-[16px] p-4" style={surface(theme)}>
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(240,120,55,0.12)", color: O }}>
            <Ico d={ICON[k]} />
          </span>
          <div className={`mt-3 text-[14.5px] font-semibold leading-snug ${theme.textMain}`}>{h}</div>
          <div className={`mt-1 text-[12.5px] leading-snug ${theme.textSub}`}>{d}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- double diamond (interactive, Kallos palette) ---------- */
const PHASES = [
  { k: "Discover", mode: "Diverge", tone: 0.35, q: "What’s really going on?", items: ["5 expert interviews: HR, marketing, AI, data, software", "Competitor analysis of CultureAmp, Eletive, Populum", "Desk research: employer branding, dashboards, privacy"] },
  { k: "Define", mode: "Converge", tone: 0.6, q: "What exactly are we solving?", items: ["Persona: Elena, HR coordinator", "Empathy map", "6 product goals and requirements"] },
  { k: "Develop", mode: "Diverge", tone: 0.8, q: "What could it look like?", items: ["Design flowchart & IA", "Sketches → lo-fi → hi-fi", "Design system + Flask build"] },
  { k: "Deliver", mode: "Converge", tone: 1, q: "Does it work for real users?", items: ["2 testing rounds with 11 participants", "5 iterations from the findings", "A containerised, working prototype"] },
];
export function DoubleDiamondPro({ theme }) {
  const [act, setAct] = useState(0);
  const line = theme.isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)";
  const shade = (t) => `rgba(240,120,55,${0.06 + t * 0.2})`;
  const p = PHASES[act];
  return (
    <div className="rounded-[22px] p-5 @2xl:p-7" style={surface(theme)}>
      <svg viewBox="0 0 1000 210" className="w-full h-auto select-none" role="tablist" aria-label="Double Diamond phases">
        <line x1="0" y1="105" x2="1000" y2="105" stroke={line} strokeDasharray="3 6" />
        {[0, 1].map((d) => (
          <path key={d} d={`M${10 + d * 495} 105 L${250 + d * 495} 10 L${490 + d * 495} 105 L${250 + d * 495} 200 Z`} fill="none" stroke={line} strokeWidth="1.2" />
        ))}
        {PHASES.map((ph, i) => {
          const d = Math.floor(i / 2), left = i % 2 === 0, x0 = 10 + d * 495;
          const path = left ? `M${x0} 105 L${x0 + 240} 10 L${x0 + 240} 200 Z` : `M${x0 + 240} 10 L${x0 + 480} 105 L${x0 + 240} 200 Z`;
          const on = i === act;
          return (
            <g key={ph.k} onClick={() => setAct(i)} onMouseEnter={() => setAct(i)} style={{ cursor: "pointer" }} role="tab" aria-selected={on}>
              <motion.path d={path} animate={{ fill: on ? O : shade(ph.tone) }} transition={{ duration: 0.3 }} />
              <text x={x0 + (left ? 150 : 330)} y="100" textAnchor="middle" fontFamily={POP} fontSize="21" fontWeight="700" fill={on ? "#fff" : O} style={{ transition: "fill .3s" }}>
                {ph.k}
              </text>
              <text x={x0 + (left ? 150 : 330)} y="124" textAnchor="middle" fontFamily={POP} fontSize="10.5" letterSpacing="2.4" fill={on ? "rgba(255,255,255,0.85)" : theme.isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)"}>
                {ph.mode.toUpperCase()}
              </text>
            </g>
          );
        })}
        <circle cx="10" cy="105" r="5" fill={O} />
        <circle cx="990" cy="105" r="5" fill={G} />
        <text x="500" y="22" textAnchor="middle" fontFamily={POP} fontSize="10" letterSpacing="2" fill={theme.isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)"}>
          PROBLEM  ·  SOLUTION
        </text>
      </svg>
      <div className="mt-4 flex flex-wrap gap-2">
        {PHASES.map((ph, i) => (
          <button
            key={ph.k}
            type="button"
            onClick={() => setAct(i)}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition"
            style={i === act ? { background: O, color: "#fff" } : { color: O, boxShadow: `inset 0 0 0 1px ${O}55` }}
          >
            0{i + 1} {ph.k}
          </button>
        ))}
      </div>
      <motion.div key={act} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-5 grid grid-cols-1 @3xl:grid-cols-[1fr_1.6fr] gap-4 items-start">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: O }}>
            Phase 0{act + 1} · {p.mode}
          </div>
          <div className={`mt-1 text-[20px] font-bold tracking-[-0.02em] ${theme.textMain}`}>{p.q}</div>
        </div>
        <ul className="space-y-2">
          {p.items.map((it) => (
            <li key={it} className={`flex gap-2.5 text-[14px] ${theme.textBody}`}>
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: O }} />
              {it}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ---------- competitor table ---------- */
const COMP = [
  ["Data sources", "Surveys", "Surveys", "Surveys", "Surveys + web data + benchmarks"],
  ["Analysis", "AI analytics, benchmarks", "AI analytics, alerts, eNPS", "AI analytics, trends", "LLM analysis + one transparent score"],
  ["Pricing", "Paid, tiered plans", "Paid, 3 plans", "Paid, from €4/user", "Built for SME budgets"],
  ["Market", "Australia, 6500+ companies", "Sweden, global", "Sweden, large orgs", "SMEs"],
  ["Guidance", "—", "—", "—", "Levelled, step-by-step recommendations"],
  ["Gamification", "No", "No", "Yes", "—"],
];
export function CompetitorTable({ theme }) {
  const head = ["", "CultureAmp", "Eletive", "Populum", "Kallos"];
  const [col, setCol] = useState(null);
  const hov = (i) => (col === i && i > 0 && i < 4 ? { background: theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.035)" } : undefined);
  return (
    <div className="rounded-[18px] overflow-hidden overflow-x-auto" style={surface(theme)}>
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={h || "x"} onMouseEnter={() => setCol(i)} onMouseLeave={() => setCol(null)} className={`px-4 py-3 font-semibold cursor-default ${i === 4 ? "text-white" : theme.textMain}`} style={i === 4 ? { background: O } : hov(i)}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMP.map((row, r) => (
            <tr key={row[0]} className={`border-t ${theme.divider}`}>
              {row.map((c, i) => (
                <td
                  key={i}
                  onMouseEnter={() => setCol(i)}
                  onMouseLeave={() => setCol(null)}
                  className={`px-4 py-2.5 align-top ${i === 0 ? `font-semibold ${theme.textMain}` : i === 4 ? "font-semibold" : theme.textBody}`}
                  style={i === 4 ? { background: theme.isDark ? "rgba(240,120,55,0.12)" : "rgba(240,120,55,0.07)", color: theme.isDark ? "#ffb48a" : "#b4521a" } : hov(i)}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- expert panel ---------- */
const EXPERTS = [
  { i: "HR", role: "HR Director", org: "Toyota Material Handling", shaped: "How employer branding is evaluated in practice, and what HR teams actually need." },
  { i: "CM", role: "Candidate Marketing Lead", org: "Accenture", shaped: "Talent attraction and how employer-brand messages reach candidates." },
  { i: "AI", role: "AI Engineer", org: "Interviewed for the thesis", shaped: "NLP without a training set: pre-trained, open-access models are a viable starting point.", quote: true },
  { i: "DE", role: "Data Engineer", org: "Interviewed for the thesis", shaped: "Data architecture and the analysis pipeline." },
  { i: "SE", role: "Software Engineer", org: "Interviewed for the thesis", shaped: "Secure software development and system architecture." },
];
export function ExpertPanel({ theme }) {
  return (
    <div>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-5 gap-3">
        {EXPERTS.map((e, k) => (
          <motion.div key={e.role} {...rise(k)} className="rounded-[16px] p-4 flex flex-col" style={surface(theme)}>
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: k < 2 ? O : G }}>
              {e.i}
            </span>
            <div className={`mt-3 text-[14px] font-semibold leading-tight ${theme.textMain}`}>{e.role}</div>
            <div className={`text-[11.5px] ${theme.textSub}`}>{e.org}</div>
            <div className={`mt-3 text-[12.5px] leading-snug ${theme.textBody}`}>{e.shaped}</div>
          </motion.div>
        ))}
      </div>
      <motion.figure {...rise(2)} className="mt-5 rounded-[18px] p-5 @2xl:p-6 grid grid-cols-1 @3xl:grid-cols-[auto_1fr] gap-4 items-start" style={surface(theme)}>
        <span className="text-[44px] leading-[0.7] font-serif" style={{ color: O }}>
          “
        </span>
        <div>
          <div className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${theme.textSub}`}>Q: Is NLP feasible without a training dataset?</div>
          <blockquote className={`mt-2 text-[16px] @2xl:text-[18px] leading-snug font-medium ${theme.textMain}`}>
            Yes, through <mark style={{ background: "rgba(240,120,55,0.2)", color: "inherit", padding: "0 3px" }}>pre-trained models</mark> from{" "}
            <mark style={{ background: "rgba(240,120,55,0.2)", color: "inherit", padding: "0 3px" }}>open-access repositories or enterprise solutions</mark>. They provide a starting point for NLP tasks
            without custom training data.
          </blockquote>
          <figcaption className={`mt-2 text-[12.5px] ${theme.textSub}`}>AI engineer, expert interview · this is why Kallos runs a pre-trained Llama model instead of training its own.</figcaption>
        </div>
      </motion.figure>
    </div>
  );
}

/* ---------- UX sketch sheet ---------- */
const INK = "#1f1f24";
const MK = '"Kalam", "Bradley Hand", "Marker Felt", cursive';
function useKalam() {
  useEffect(() => {
    const id = "kalam-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap";
    document.head.appendChild(l);
  }, []);
}
const Ln = ({ d, w = 2.2, c = INK, o = 1 }) => <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
const Tx = ({ x, y, s = 14, c = INK, w = 400, children, a }) => (
  <text x={x} y={y} fontFamily={MK} fontSize={s} fontWeight={w} fill={c} textAnchor={a}>
    {children}
  </text>
);
const Grey = ({ x, y, w, h }) => <rect x={x} y={y} width={w} height={h} fill="#c9cbd1" opacity="0.55" />;
const Callout = ({ x, y, n }) => (
  <g>
    <circle cx={x} cy={y} r="11" fill={O} />
    <Tx x={x} y={y + 5} s={13} c="#fff" w={700} a="middle">
      {n}
    </Tx>
  </g>
);
function Frame({ x, y, w, h, label }) {
  // printed browser template (light blue), drawn over in marker
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="6" fill="#fff" stroke="#9cc3e6" strokeWidth="1.2" />
      <rect width={w} height="18" rx="6" fill="#e7f1fb" />
      {[10, 20, 30].map((cx) => (
        <circle key={cx} cx={cx} cy="9" r="2.6" fill="#9cc3e6" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={(w / 12) * (i + 1)} y1="18" x2={(w / 12) * (i + 1)} y2={h} stroke="#d8e8f6" strokeWidth="0.8" />
      ))}
      <text x="0" y={h + 20} fontFamily={POP} fontSize="10" letterSpacing="1.5" fill="#7fa8cf">
        {label}
      </text>
    </g>
  );
}

export function UXSketchSheet({ theme }) {
  useKalam();
  return (
    <figure>
      <div className="rounded-[18px] overflow-hidden" style={{ background: "#f4f7fb", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 22px 46px -28px rgba(0,0,0,0.4)" }}>
        <svg viewBox="0 0 1000 600" className="block w-full h-auto" role="img" aria-label="UX sketch sheet with annotated wireframes for Kallos">
          <defs>
            <filter id="ux-hand">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" />
              <feDisplacementMap in="SourceGraphic" scale="1.8" />
            </filter>
            <marker id="ux-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10" fill="none" stroke={INK} strokeWidth="1.8" />
            </marker>
          </defs>
          <text x="36" y="44" fontFamily={POP} fontSize="11" letterSpacing="2" fill="#7fa8cf">
            KALLOS · UI SKETCH SHEET · V1
          </text>
          <Tx x={36} y={74} s={26} w={700}>
            Core flow: data in → insight → action
          </Tx>

          <Frame x={36} y={100} w={290} h={200} label="A · MY SURVEYS" />
          <Frame x={356} y={100} w={290} h={200} label="B · DASHBOARD" />
          <Frame x={676} y={100} w={290} h={200} label="C · RECOMMENDATIONS" />
          <Frame x={196} y={360} w={290} h={180} label="D · UPLOAD STATES" />
          <Frame x={516} y={360} w={290} h={180} label="E · ONBOARDING" />

          <g filter="url(#ux-hand)">
            {/* A surveys */}
            <Grey x={36} y={118} w={56} h={182} />
            <Ln d="M44 134 h40 M44 152 h34 M44 170 h38 M44 188 h30" w={2} o={0.7} />
            <Tx x={104} y={140} s={15} w={700}>
              My surveys
            </Tx>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Ln d={`M104 ${156 + i * 44} h 200 v 34 h -200 z`} w={1.8} />
                <Tx x={112} y={178 + i * 44} s={12}>
                  {["eNPS", "candidate exp.", "retention"][i]}
                </Tx>
                <Ln d={`M250 ${164 + i * 44} h 46 v 18 h -46 z`} c={O} w={2} />
              </g>
            ))}

            {/* B dashboard */}
            <Grey x={356} y={118} w={56} h={182} />
            <Tx x={424} y={140} s={15} w={700}>
              Dashboard
            </Tx>
            <Ln d="M424 152 h 104 v 130 h -104 z" w={1.8} />
            <Ln d="M476 172 l 34 24 l -13 40 h -42 l -13 -40 z" w={1.6} o={0.6} />
            <Ln d="M476 184 l 22 18 l -9 26 h -26 l -8 -28 z" c={O} w={2.4} />
            <Ln d="M538 152 h 98 v 130 h -98 z" w={1.8} />
            {[0, 1, 2, 3].map((i) => (
              <Ln key={i} d={`M${552 + i * 20} 270 v ${-24 - i * 18} h 12 v ${24 + i * 18}`} w={1.8} />
            ))}

            {/* C recommendations */}
            <Grey x={676} y={118} w={56} h={182} />
            <Tx x={744} y={210} s={56} w={700} c={O}>
              27
            </Tx>
            <Tx x={806} y={210} s={20}>
              /100
            </Tx>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Ln d={`M876 ${150 + i * 30} h 70 v 20 h -70 z`} w={1.8} c={i === 0 ? O : INK} />
                <Tx x={886} y={165 + i * 30} s={12}>
                  Level {i + 1}
                </Tx>
              </g>
            ))}
            <Ln d="M744 236 h 112 M744 252 h 90 M744 268 h 104" w={1.6} o={0.6} />

            {/* D upload states */}
            <Tx x={210} y={402} s={13} w={700}>
              ✓ ok
            </Tx>
            <Ln d="M210 410 h 76 v 40 h -76 z" w={1.8} c="#008858" />
            <Tx x={302} y={402} s={13} w={700}>
              &gt; 10 MB
            </Tx>
            <Ln d="M302 410 h 76 v 40 h -76 z" w={1.8} c="#ee5555" />
            <Tx x={394} y={402} s={13} w={700}>
              wrong type
            </Tx>
            <Ln d="M394 410 h 76 v 40 h -76 z" w={1.8} c="#ee5555" />
            <Ln d="M210 470 h 120 M210 488 h 90" w={1.6} o={0.6} />
            <Ln d="M400 480 h 70 v 24 h -70 z" w={1.8} />
            <Tx x={410} y={497} s={11}>
              delete?
            </Tx>

            {/* E onboarding */}
            <Tx x={530} y={404} s={13} w={700}>
              Tutorials
            </Tx>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Ln d={`M530 ${418 + i * 28} h 18 v 18 h -18 z`} w={1.8} />
                {i < 2 && <Ln d={`M533 ${427 + i * 28} l 4 5 l 9 -10`} c="#008858" w={2.4} />}
                <Ln d={`M558 ${427 + i * 28} h 110`} w={1.6} o={0.6} />
              </g>
            ))}
            <Ln d="M690 420 h 100 v 10 h -100 z" w={1.6} />
            <rect x="690" y="420" width="66" height="10" fill={O} opacity="0.7" />
            <Tx x={690} y={448} s={12}>
              66% done
            </Tx>
            <Ln d="M700 486 h 84 v 30 h -84 z" w={1.8} o={0.45} />
            <Tx x={720} y={506} s={13} c="#999">
              Done
            </Tx>

            {/* flow arrows */}
            <Ln d="M328 200 h 22" w={2} />
            <Ln d="M648 200 h 22" w={2} />
          </g>

          {/* callouts + notes */}
          <Callout x={300} y={112} n="1" />
          <Callout x={620} y={112} n="2" />
          <Callout x={940} y={112} n="3" />
          <Callout x={460} y={372} n="4" />
          <Callout x={780} y={372} n="5" />
          <g fontFamily={MK} fontSize="13.5" fill={INK}>
            <text x="836" y="380">
              <tspan x="836">1 · manual KPI input</tspan>
              <tspan x="836" dy="19">  if no survey</tspan>
              <tspan x="836" dy="21">2 · themes, not 40 charts</tspan>
              <tspan x="836" dy="21">3 · score + “how it’s</tspan>
              <tspan x="836" dy="19">  calculated”, levels first</tspan>
              <tspan x="836" dy="21">4 · a message per error</tspan>
              <tspan x="836" dy="21">5 · Done locked till</tspan>
              <tspan x="836" dy="19">  tutorials watched</tspan>
            </text>
          </g>
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: O }} />
        UI sketch sheet on a printed 12-column browser template: five key screens, with numbered annotations for the decisions behind them.
      </figcaption>
    </figure>
  );
}

/* ---------- KPI framework ---------- */
const KPIS = [
  { g: "Recruitment", c: "#00769e", k: ["Average position coverage time", "Open positions vs. candidates", "Spontaneous applications via career site", "Quality of applications"] },
  { g: "Brand perception", c: "#f07837", k: ["Brand awareness & sentiment", "Position in employer rankings", "Competitor benchmarking (web-scraped KPIs)"] },
  { g: "Employee experience", c: "#5355a0", k: ["eNPS", "Candidate experience rating", "Employee referral rate"] },
  { g: "Retention & growth", c: "#008858", k: ["Retention rate", "Career development opportunities"] },
];
export function KPIFramework({ theme }) {
  return (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
      {KPIS.map((grp, i) => (
        <motion.div key={grp.g} {...rise(i)} className="rounded-[16px] overflow-hidden" style={surface(theme)}>
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: `${grp.c}12` }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: grp.c }} />
            <span className={`flex-1 text-[14px] font-semibold whitespace-nowrap ${theme.textMain}`}>{grp.g}</span>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: grp.c }}>
              {grp.k.length}
            </span>
          </div>
          <ul className="px-4 py-2">
            {grp.k.map((k, n) => (
              <li key={k} className={`flex items-baseline gap-3 py-1.5 text-[13px] ${n ? `border-t ${theme.divider}` : ""} ${theme.textBody}`}>
                <span className="w-4 shrink-0 text-[10.5px] font-semibold tabular-nums" style={{ color: grp.c }}>
                  {String(n + 1).padStart(2, "0")}
                </span>
                {k}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- tech stack ---------- */
const STACK = [
  ["Flask", "App factory, blueprints", "#2f2f35", "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9"],
  ["PostgreSQL", "SQLAlchemy ORM, Alembic", "#336791", "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"],
  ["Meta Llama 3", "Runs locally in LM Studio", "#0866ff", "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"],
  ["PyNaCl", "Field-level encryption", "#f07837", "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2"],
  ["Flask-Login", "Sessions, protected routes", "#5355a0", "M15 7a4 4 0 1 1-3.5 6L4 20.5M7 17.5l2 2M9.5 15l2 2"],
  ["Werkzeug", "PBKDF2-SHA256 hashing", "#008858", "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4"],
  ["Docker", "One container, dev to demo", "#1d91e6", "M3 13h16c1 0 2-.6 2.5-1.5M3 13c0 4 3 7 8 7s8-3 9.5-7.5M5 10h3v3H5zM8 10h3v3H8zM11 10h3v3h-3zM8 7h3v3H8z"],
  ["OOP · SOLID", "Built to grow into SaaS", "#00769e", "M12 3l8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5"],
];
export function TechStack({ theme }) {
  return (
    <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
      {STACK.map(([h, d, c, path], i) => (
        <motion.div key={h} {...rise(i * 0.5)} className="rounded-[16px] p-4 flex items-center gap-3" style={surface(theme)}>
          <span className="w-10 h-10 shrink-0 rounded-[11px] flex items-center justify-center" style={{ background: `${c}16`, color: c }}>
            <Ico d={path} className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className={`block text-[14px] font-semibold ${theme.textMain}`}>{h}</span>
            <span className={`block text-[11.5px] leading-snug ${theme.textSub}`}>{d}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- iterations: before / after ---------- */
const mini = { fontFamily: POP, color: G };
const Btn = ({ children, solid, c = O, faded }) => (
  <span className="inline-block px-2 py-1 rounded-[4px] text-[9.5px] font-semibold" style={{ ...(solid ? { background: c, color: "#fff" } : { color: c, boxShadow: `inset 0 0 0 1px ${c}` }), opacity: faded ? 0.4 : 1 }}>
    {children}
  </span>
);
const Field = ({ w = "100%", children }) => (
  <span className="block h-6 rounded-[4px] px-2 text-[9.5px] leading-6 text-black/35" style={{ width: w, boxShadow: "inset 0 0 0 1px #d4d4d4" }}>
    {children}
  </span>
);

const ITER = [
  {
    t: "Explain the recommendation levels",
    saw: "Testers saw Level 1, 2 and 3 but weren’t sure what separated them.",
    why: "Each level now says what it’s for, so HR knows where to start.",
    before: (
      <div>
        <div className="text-[22px] font-extrabold leading-none" style={{ color: O }}>
          27<span className="text-[11px] text-black/40">/100</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <Btn>Level 1</Btn>
          <Btn>Level 2</Btn>
          <Btn>Level 3</Btn>
        </div>
      </div>
    ),
    after: (
      <div>
        <div className="text-[22px] font-extrabold leading-none" style={{ color: O }}>
          27<span className="text-[11px] text-black/40">/100</span>
        </div>
        <div className="mt-2 space-y-1">
          {[
            ["Level 1", "Build your EVP"],
            ["Level 2", "Define its pillars"],
            ["Level 3", "Tell it as a story"],
          ].map(([l, d], i) => (
            <div key={l} className="flex items-center gap-2">
              <Btn solid={i === 0}>{l}</Btn>
              <span className="text-[9.5px] text-black/55">{d}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    t: "Manual KPI input",
    saw: "Some companies don’t run every survey, so upload-only left them stuck.",
    why: "Every survey can be uploaded or typed in, so nobody hits a dead end.",
    before: (
      <div className="space-y-2">
        <div className="text-[10.5px] font-semibold">eNPS Survey</div>
        <div className="h-10 rounded-[6px] flex items-center justify-center text-[9.5px] text-black/35" style={{ boxShadow: "inset 0 0 0 1px #d4d4d4", borderStyle: "dashed" }}>
          Upload file only
        </div>
        <Btn solid>Upload</Btn>
      </div>
    ),
    after: (
      <div className="space-y-2">
        <div className="text-[10.5px] font-semibold">eNPS Survey</div>
        <div className="grid grid-cols-2 gap-2 items-end">
          <div>
            <div className="text-[9px] text-black/45 mb-1">Input</div>
            <Field>e.g. +32</Field>
          </div>
          <div className="text-[9px] text-black/45">
            or file
            <div className="mt-1">
              <Btn>Upload survey</Btn>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    t: "Focused benchmarking",
    saw: "Open-ended competitor lists made benchmarks less precise.",
    why: "Limiting input to 3–5 competitors keeps comparisons meaningful.",
    before: (
      <div className="space-y-1">
        <div className="text-[10.5px] font-semibold">Competitors</div>
        {["Company A", "Company B", "Company C", "Company D", "Company E", "Company F", "…"].map((c) => (
          <Field key={c}>{c}</Field>
        ))}
      </div>
    ),
    after: (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold">Competitors</span>
          <span className="text-[9px] font-semibold" style={{ color: O }}>
            3 of 3–5
          </span>
        </div>
        {["Company A", "Company B", "Company C"].map((c) => (
          <Field key={c}>{c}</Field>
        ))}
        <Btn>+ Add competitor</Btn>
      </div>
    ),
  },
  {
    t: "Better questions",
    saw: "Key topics were missing and the diversity question felt off.",
    why: "New questions on budget, growth and recruitment channels; diversity rephrased to be clearer and more inclusive.",
    before: (
      <ul className="space-y-1.5 text-[9.5px]">
        <li>· Workplace culture rating</li>
        <li>· Salary satisfaction</li>
        <li className="line-through decoration-[#ee5555]">· Diversity question (original wording)</li>
      </ul>
    ),
    after: (
      <ul className="space-y-1.5 text-[9.5px]">
        <li>· Workplace culture rating</li>
        <li>· Salary satisfaction</li>
        <li style={{ color: "#008858" }}>· Diversity, rephrased</li>
        <li style={{ color: O }}>+ Employer-branding budget</li>
        <li style={{ color: O }}>+ Growth opportunities</li>
        <li style={{ color: O }}>+ Recruitment channels</li>
      </ul>
    ),
  },
  {
    t: "Findable, guided editing",
    saw: "Editing surveys and the question bank was hard to discover.",
    why: "A clearer section name plus guidance on how to edit, so people know where to go.",
    before: (
      <div className="space-y-1.5">
        {["Home", "Data", "Recommendations"].map((n, i) => (
          <div key={n} className="text-[10px] font-semibold px-2 py-1 rounded-[4px]" style={i === 1 ? { background: "#f3f3f3" } : undefined}>
            {n}
          </div>
        ))}
      </div>
    ),
    after: (
      <div className="space-y-1.5">
        {["Home", "My Surveys", "My Questions", "Recommendations"].map((n, i) => (
          <div key={n} className="text-[10px] font-semibold px-2 py-1 rounded-[4px]" style={i === 1 || i === 2 ? { background: "rgba(240,120,55,0.1)", color: O } : undefined}>
            {n}
          </div>
        ))}
        <div className="text-[9px] text-black/45 px-2">“Revisit, update or answer any surveys you missed.”</div>
      </div>
    ),
  },
];

function Panel({ label, children, after }) {
  return (
    <div className="rounded-[12px] bg-white p-3 min-h-[150px]" style={{ ...mini, boxShadow: after ? `0 0 0 1.5px ${O}, 0 10px 24px -16px rgba(240,120,55,0.6)` : "0 0 0 1px rgba(0,0,0,0.08)" }}>
      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: after ? O : "rgba(0,0,0,0.35)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export function BeforeAfter({ theme }) {
  return (
    <div className="space-y-4">
      {ITER.map((it, i) => (
        <motion.div key={it.t} {...rise(i)} className="rounded-[18px] p-4 @2xl:p-5 grid grid-cols-1 @3xl:grid-cols-[1fr_1.5fr] gap-4 @3xl:gap-6 items-center" style={surface(theme)}>
          <div>
            <div className="text-[11px] font-semibold tabular-nums" style={{ color: O }}>
              Iteration {String(i + 1).padStart(2, "0")}
            </div>
            <div className={`mt-1 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>{it.t}</div>
            <p className={`mt-2 text-[13px] leading-snug ${theme.textSub}`}>
              <b className={theme.textMain}>Saw: </b>
              {it.saw}
            </p>
            <p className={`mt-1.5 text-[13px] leading-snug ${theme.textSub}`}>
              <b style={{ color: O }}>Helped: </b>
              {it.why}
            </p>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
            <Panel label="Before">{it.before}</Panel>
            <span style={{ color: O }}>→</span>
            <Panel label="After" after>
              {it.after}
            </Panel>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- architecture ---------- */
function Box({ x, y, w = 170, h = 56, title, sub, accent, theme }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="12" fill={accent ?? (theme.isDark ? "#26262a" : "#fff")} stroke={accent ? "none" : theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} />
      <text x={w / 2} y={sub ? 24 : 33} textAnchor="middle" fontFamily={POP} fontSize="13" fontWeight="600" fill={accent ? "#fff" : theme.isDark ? "#eee" : G}>
        {title}
      </text>
      {sub && (
        <text x={w / 2} y="42" textAnchor="middle" fontFamily={POP} fontSize="10.5" fill={accent ? "rgba(255,255,255,0.85)" : theme.isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)"}>
          {sub}
        </text>
      )}
    </g>
  );
}
function Edge({ d, label, lx, ly, theme }) {
  const c = theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  return (
    <g>
      <path d={d} fill="none" stroke={c} strokeWidth="1.5" markerEnd="url(#kd-ar)" />
      {label && (
        <text x={lx} y={ly} textAnchor="middle" fontFamily={MONO} fontSize="10.5" fill={c}>
          {label}
        </text>
      )}
    </g>
  );
}
const ArrowDefs = ({ theme }) => (
  <defs>
    <marker id="kd-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill={theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)"} />
    </marker>
  </defs>
);

export function ArchitectureDiagram({ theme }) {
  return (
    <div className="rounded-[20px] p-4 @2xl:p-6" style={surface(theme)}>
      <svg viewBox="0 0 900 380" className="w-full h-auto" role="img" aria-label="Kallos system architecture">
        <ArrowDefs theme={theme} />
        <Box theme={theme} x={365} y={10} title="Browser" sub="Jinja templates · JS" />
        <Edge theme={theme} d="M450 66 V108" label="HTTPS" lx={490} ly={92} />
        <Box theme={theme} x={330} y={110} w={240} h={64} title="Flask application" sub="auth & views blueprints · Flask-Login" accent={O} />
        <Edge theme={theme} d="M330 142 H200 V214" label="REST / local API" lx={250} ly={134} />
        <Edge theme={theme} d="M570 142 H700 V214" label="SQLAlchemy ORM" lx={642} ly={134} />
        <Edge theme={theme} d="M450 174 V214" label="PyNaCl" lx={486} ly={198} />
        <Box theme={theme} x={110} y={216} w={180} title="LM Studio" sub="Meta Llama 3, runs locally" />
        <Box theme={theme} x={360} y={216} w={180} title="Encryption" sub="SecretBox · Base64" />
        <Box theme={theme} x={610} y={216} w={180} title="PostgreSQL" sub="users · answers tables" />
        <Edge theme={theme} d="M700 272 V312" label="Alembic migrations" lx={760} ly={298} />
        <Box theme={theme} x={330} y={314} w={240} h={56} title="Docker container" sub="one environment, dev → demo" accent={G} />
        <Edge theme={theme} d="M200 272 V342 H328" />
        <Edge theme={theme} d="M700 340 H572" />
      </svg>
    </div>
  );
}

export function SecurityFlow({ theme }) {
  const steps = [
    ["Client", "logs in over HTTPS"],
    ["HTTPS", "secure transport"],
    ["Authentication", "email + hashed password (PBKDF2-SHA256)"],
    ["Authorization", "role and permission check"],
    ["Encrypt", "PyNaCl SecretBox per field"],
    ["PostgreSQL", "only ciphertext at rest"],
  ];
  const [at, setAt] = useState(-1);
  useEffect(() => {
    if (at < 0 || at >= steps.length) return;
    const id = setTimeout(() => setAt((a) => a + 1), 550);
    return () => clearTimeout(id);
  }, [at, steps.length]);
  return (
    <div>
      <button type="button" onClick={() => setAt(0)} className="mb-4 px-4 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: G }}>
        {at >= steps.length ? "↻ Send another request" : "▶ Send a request"}
      </button>
      <ol className="grid grid-cols-2 @3xl:grid-cols-6 gap-2">
        {steps.map(([h, d], i) => {
          const on = at === i, past = at > i;
          return (
            <li key={h} className="relative rounded-[14px] p-3.5 transition-all duration-300" style={{ ...surface(theme), ...(on ? { boxShadow: `0 0 0 2px ${O}, 0 10px 24px -12px rgba(240,120,55,0.6)`, transform: "translateY(-3px)" } : {}) }}>
              <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: past ? "#008858" : O }}>
                {past ? "✓ passed" : `0${i + 1}`}
              </span>
              <div className={`text-[13.5px] font-semibold ${theme.textMain}`}>{h}</div>
              <div className={`mt-1 text-[11.5px] leading-snug ${theme.textSub}`}>{d}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- data model ---------- */
const USER_COLS = [
  ["id", "Integer", "primary key", false],
  ["email", "String(150)", "unique · login", false],
  ["password", "String(150)", "PBKDF2-SHA256 hash", "hash"],
  ["first_name", "String(150)", "encrypted", true],
  ["company_name", "String(150)", "encrypted", true],
  ["job_title", "String(150)", "encrypted", true],
  ["department", "String(150)", "encrypted", true],
];
export function DataModel({ theme }) {
  const [reveal, setReveal] = useState(false);
  const sample = { first_name: "Elena", company_name: "Nordic IT AB", job_title: "HR Coordinator", department: "People" };
  const cipher = { first_name: "q9Lw…f2A=", company_name: "Zx81…Kk0=", job_title: "pA3d…7Qe=", department: "Mn6T…uJ4=" };
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1.3fr_1fr] gap-5 items-start">
      <div className="rounded-[18px] overflow-hidden" style={surface(theme)}>
        <div className="px-4 py-3 flex items-center justify-between text-white" style={{ background: G }}>
          <span className="font-mono text-[13px] font-semibold">user</span>
          <span className="text-[11px] text-white/70">models.py · SQLAlchemy</span>
        </div>
        {USER_COLS.map(([n, t, note, enc]) => (
          <div key={n} className={`grid grid-cols-[1.1fr_1fr_1.3fr] gap-2 px-4 py-2 text-[12.5px] border-t ${theme.divider}`}>
            <span className={`font-mono font-semibold ${theme.textMain}`}>{n}</span>
            <span className={`font-mono ${theme.textSub}`}>{t}</span>
            <span className="inline-flex items-center gap-1.5" style={{ color: enc ? O : undefined }}>
              {enc && <Ico d={ICON.sensitive} className="w-3.5 h-3.5" color={O} />}
              <span className={enc ? "" : theme.textSub}>{note}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-[18px] p-5" style={surface(theme)}>
        <div className="flex items-center justify-between">
          <span className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${theme.textSub}`}>What the database sees</span>
          <button type="button" onClick={() => setReveal((r) => !r)} className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-[11.5px] font-semibold text-white" style={{ background: O }}>
            {reveal ? "Encrypt" : "Decrypt"}
          </button>
        </div>
        <div className="mt-4 space-y-2 font-mono text-[12.5px]">
          {Object.keys(sample).map((k) => (
            <div key={k} className="flex justify-between gap-3">
              <span className={theme.textSub}>{k}</span>
              <motion.span key={reveal + k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={reveal ? theme.textMain : ""} style={reveal ? undefined : { color: O }}>
                {reveal ? sample[k] : cipher[k]}
              </motion.span>
            </div>
          ))}
        </div>
        <p className={`mt-4 text-[12px] leading-snug ${theme.textSub}`}>Example values. Schema changes are versioned with Alembic (Flask-Migrate).</p>
      </div>
    </div>
  );
}

/* ---------- AI pipeline ---------- */
export function AIPipeline({ theme }) {
  const steps = [
    { h: "Collect", d: "Surveys and question banks (eNPS, candidate experience, retention) plus web-scraped data and reviews.", tag: "inputs", out: "eNPS +12 · 214 reviews · 3 surveys" },
    { h: "Prepare", d: "Answers are structured per KPI theme so the model gets focused, comparable context.", tag: "Flask", out: "4 themes · 12 KPIs" },
    { h: "Analyse", d: "A pre-trained Meta Llama 3 model, running locally in LM Studio, extracts themes and sentiment.", tag: "LLM", out: "sentiment: 61% positive" },
    { h: "Score", d: "Rule-based logic built on PrideCom’s methodology turns insights into a score out of 100.", tag: "rules", out: "27 / 100" },
    { h: "Recommend", d: "Structured advice across three priority levels, with how the score was derived.", tag: "UI", out: "Level 1: build your EVP" },
  ];
  const [run, setRun] = useState(-1);
  useEffect(() => {
    if (run < 0 || run >= steps.length) return;
    const id = setTimeout(() => setRun((r) => r + 1), 750);
    return () => clearTimeout(id);
  }, [run, steps.length]);
  const done = run >= steps.length;
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={() => setRun(0)} disabled={run >= 0 && !done} className="px-4 py-2 rounded-full text-[13px] font-semibold text-white transition disabled:opacity-60" style={{ background: O }}>
          {done ? "↻ Run again" : run >= 0 ? "Analysing…" : "▶ Run an analysis"}
        </button>
        <span className={`text-[12px] ${theme.textSub}`}>{done ? "Done: from raw answers to a next step." : "Watch one company’s data move through the pipeline (example values)."}</span>
      </div>
      <div className="grid grid-cols-1 @3xl:grid-cols-5 gap-2">
        {steps.map((st, i) => {
          const on = run === i, past = run > i;
          return (
            <motion.div key={st.h} {...rise(i)} className="relative rounded-[16px] p-4 flex flex-col transition-colors duration-300" style={on ? { background: O, color: "#fff" } : surface(theme)}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tabular-nums" style={{ color: on ? "rgba(255,255,255,0.85)" : O }}>
                  {past ? "✓" : `0${i + 1}`}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${on ? "bg-white/20" : theme.isDark ? "bg-white/10" : "bg-black/[0.05]"}`}>{st.tag}</span>
              </div>
              <div className={`mt-2 text-[15px] font-semibold ${on ? "" : theme.textMain}`}>{st.h}</div>
              <p className={`mt-1 text-[12.5px] leading-snug ${on ? "text-white/90" : theme.textBody}`}>{st.d}</p>
              <motion.div
                initial={false}
                animate={{ opacity: past || on ? 1 : 0, height: past || on ? "auto" : 0 }}
                className="mt-2 overflow-hidden"
              >
                <span className="inline-block font-mono text-[10.5px] px-2 py-1 rounded-[6px]" style={on ? { background: "rgba(255,255,255,0.2)" } : { background: "rgba(240,120,55,0.1)", color: O }}>
                  {st.out}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- app factory code (website/init.py) ---------- */
const kw = (s) => <span style={{ color: "#ff9e64" }}>{s}</span>;
const fn = (s) => <span style={{ color: "#7dcfff" }}>{s}</span>;
const st = (s) => <span style={{ color: "#c3e88d" }}>{s}</span>;
const cm = (s) => <span style={{ color: "rgba(255,255,255,0.35)" }}>{s}</span>;
export function AppFactoryCode() {
  return (
    <figure className="min-w-0 rounded-[16px] overflow-hidden" style={{ background: "#1c1a19", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -26px rgba(0,0,0,0.6)" }}>
      <div className="h-9 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/50 font-mono">website/init.py · app factory (excerpt)</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11.5px] leading-[1.75] font-mono text-[#e8e2dc]">
        {cm("# Generates a random key with 32 bytes (256 bits)")}
        {"\n"}secret_key = secrets.{fn("token_hex")}({st("32")}){"\n\n"}
        {kw("def")} {fn("create_app")}():{"\n    "}app = {fn("Flask")}(__name__, template_folder={st("'./template'")}){"\n    "}app.config[{st("'SECRET_KEY'")}] = secret_key{"\n    "}db.{fn("init_app")}(app){"\n    "}
        {fn("Migrate")}(app, db){"                 "}
        {cm("# versioned schema changes")}
        {"\n\n    "}
        {kw("from")} .views {kw("import")} views{"\n    "}
        {kw("from")} .auth {kw("import")} auth{"\n    "}app.{fn("register_blueprint")}(views, url_prefix={st("'/'")}){"\n    "}app.{fn("register_blueprint")}(auth, url_prefix={st("'/'")}){"\n\n    "}login_manager = {fn("LoginManager")}(){"\n    "}login_manager.login_view = {st("'auth.login'")}
        {"    "}
        {cm("# protected routes redirect here")}
        {"\n    "}login_manager.{fn("init_app")}(app){"\n    "}
        {kw("return")} app
      </pre>
    </figure>
  );
}

/* ---------- clean lo-fi wireframes ---------- */
const W1 = "#ececef", W2 = "#d9d9de", W3 = "#b9b9c0", W4 = "#8d8d96";
const WBar = ({ w = "100%", h = 7, c = W2, className = "" }) => <span className={`block rounded-full ${className}`} style={{ width: w, height: h, background: c }} />;
const WBox = ({ className = "", children, style }) => (
  <div className={`rounded-[6px] ${className}`} style={{ boxShadow: `inset 0 0 0 1.2px ${W2}`, ...style }}>
    {children}
  </div>
);
const WImg = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded-[6px] ${className}`} style={{ background: W1 }}>
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <path d="M0 0 L100 60 M100 0 L0 60" stroke={W2} strokeWidth="0.8" />
    </svg>
  </div>
);
function SideNav({ active }) {
  return (
    <div className="w-[22%] shrink-0 border-r p-3 space-y-2.5" style={{ borderColor: W1 }}>
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-3 h-3 rounded-full" style={{ background: W3 }} />
        <WBar w="50%" h={6} c={W3} />
      </div>
      {["Home", "My Surveys", "My Questions", "Recommendations", "Benchmarking", "Account"].map((n) => (
        <div key={n} className="flex items-center gap-1.5 px-1.5 py-1 rounded-[4px]" style={n === active ? { background: W1 } : undefined}>
          <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: n === active ? W4 : W2 }} />
          <span className="text-[8.5px] font-medium truncate" style={{ color: n === active ? "#55555c" : "#9a9aa2" }}>
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}
const WH = ({ children }) => <div className="text-[13px] font-bold tracking-tight" style={{ color: "#4a4a52" }}>{children}</div>;

const WIRES = [
  {
    k: "Landing",
    notes: ["One promise above the fold", "A single sign-up CTA", "Three features: analysis, solutions, benchmarking"],
    body: () => (
      <div className="p-5 flex-1">
        <div className="flex justify-between items-center">
          <WBar w="18%" h={7} c={W3} />
          <div className="flex gap-2">
            <WBox className="w-12 h-5" />
            <div className="w-12 h-5 rounded-[6px]" style={{ background: W4 }} />
          </div>
        </div>
        <div className="mt-7 flex flex-col items-center gap-2">
          <WBar w="52%" h={12} c={W3} />
          <WBar w="40%" h={12} c={W3} />
          <WBar w="46%" h={6} className="mt-1" />
          <div className="mt-2 w-20 h-6 rounded-full" style={{ background: W4 }} />
        </div>
        <div className="mt-7 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <WBox key={i} className="p-2.5 space-y-1.5">
              <WImg className="h-10" />
              <WBar w="70%" h={6} c={W3} />
              <WBar w="90%" h={5} />
              <WBar w="60%" h={5} />
            </WBox>
          ))}
        </div>
      </div>
    ),
  },
  {
    k: "My Surveys",
    notes: ["One row per survey", "Type a value or upload a file", "Upload and delete actions on every row"],
    body: () => (
      <div className="flex flex-1 min-h-0">
        <SideNav active="My Surveys" />
        <div className="flex-1 p-4">
          <WH>My Surveys</WH>
          <WBar w="62%" h={5} className="mt-1.5" />
          <div className="mt-4 space-y-2.5">
            {["eNPS", "Candidate experience", "Retention"].map((n) => (
              <WBox key={n} className="p-2.5 grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-semibold" style={{ color: "#6a6a72" }}>
                    {n} survey
                  </span>
                  <WBox className="h-5" />
                </div>
                <div className="space-y-1.5">
                  <WBar w="70%" h={5} />
                  <WBar w="40%" h={5} />
                </div>
                <div className="space-y-1.5">
                  <WBox className="w-14 h-5" />
                  <WBox className="w-14 h-5" />
                </div>
              </WBox>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    k: "Dashboard",
    notes: ["KPIs grouped into four themes", "Radar for perception at a glance", "Bars to compare recruitment channels"],
    body: () => (
      <div className="flex flex-1 min-h-0">
        <SideNav active="Home" />
        <div className="flex-1 p-4">
          <WH>Dashboard</WH>
          <WBar w="50%" h={5} className="mt-1.5" />
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <WBox className="p-2.5">
              <WBar w="45%" h={6} c={W3} />
              <svg viewBox="0 0 100 70" className="mt-2 w-full h-20" aria-hidden="true">
                {[30, 22, 14].map((r) => (
                  <polygon key={r} points={[0, 1, 2, 3, 4].map((i) => { const a = (-90 + 72 * i) * Math.PI / 180; return `${50 + Math.cos(a) * r},${36 + Math.sin(a) * r}`; }).join(" ")} fill="none" stroke={W2} strokeWidth="0.8" />
                ))}
                <polygon points="50,12 70,32 62,58 40,52 34,30" fill={W2} stroke={W4} strokeWidth="1" />
              </svg>
            </WBox>
            <WBox className="p-2.5">
              <WBar w="55%" h={6} c={W3} />
              <svg viewBox="0 0 100 70" className="mt-2 w-full h-20" aria-hidden="true">
                <path d="M5 62 L35 50 L65 40 L95 10" fill="none" stroke={W4} strokeWidth="1.6" />
                {[20, 40, 60].map((y) => <line key={y} x1="5" y1={y} x2="95" y2={y} stroke={W1} strokeWidth="0.8" />)}
              </svg>
            </WBox>
            <WBox className="p-2.5">
              <WBar w="40%" h={6} c={W3} />
              <div className="mt-2 h-14 flex items-end gap-2 px-2">
                {[40, 65, 50, 85, 30].map((h, i) => <span key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i === 3 ? W4 : W2 }} />)}
              </div>
            </WBox>
            <WBox className="p-2.5 space-y-2">
              <WBar w="50%" h={6} c={W3} />
              {[80, 60, 70].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <WBar w="30%" h={5} />
                  <span className="flex-1 h-2 rounded-full" style={{ background: W1 }}>
                    <span className="block h-2 rounded-full" style={{ width: `${w}%`, background: W3 }} />
                  </span>
                </div>
              ))}
            </WBox>
          </div>
        </div>
      </div>
    ),
  },
  {
    k: "Recommendations",
    notes: ["The score is the first thing you see", "How it’s calculated, right below it", "Three levels, starting with Level 1"],
    body: () => (
      <div className="flex flex-1 min-h-0">
        <SideNav active="Recommendations" />
        <div className="flex-1 p-4 grid grid-cols-[1fr_1.4fr] gap-4">
          <div>
            <div className="text-[40px] font-extrabold leading-none" style={{ color: W4 }}>
              27<span className="text-[16px]" style={{ color: W3 }}>/100</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <WBar w="90%" h={5} />
              <WBar w="80%" h={5} />
              <WBar w="60%" h={5} />
            </div>
          </div>
          <div className="space-y-2.5 border-l pl-4" style={{ borderColor: W1 }}>
            <WBar w="35%" h={10} c={W3} />
            <WBar w="95%" h={5} />
            <WBar w="85%" h={5} />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold" style={{ color: W4 }}>
                  {i + 1}.
                </span>
                <WBar w="70%" h={5} />
                <span className="ml-auto w-12 h-5 rounded-[5px]" style={i === 0 ? { background: W4 } : { boxShadow: `inset 0 0 0 1.2px ${W2}` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export function LofiWireframes({ theme }) {
  const [i, setI] = useState(0);
  const w = WIRES[i];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {WIRES.map((x, k) => (
          <button
            key={x.k}
            type="button"
            onClick={() => setI(k)}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition"
            style={k === i ? { background: G, color: "#fff" } : { color: theme.isDark ? "#ddd" : G, boxShadow: `inset 0 0 0 1px ${theme.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}` }}
          >
            {x.k}
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 @3xl:grid-cols-[1.7fr_1fr] gap-6 items-center">
        <motion.div key={w.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-[12px] overflow-hidden bg-white" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 22px 44px -26px rgba(0,0,0,0.35)", fontFamily: POP }}>
          <div className="h-7 px-3 flex items-center gap-1.5" style={{ background: "#f6f6f7", borderBottom: `1px solid ${W1}` }}>
            {[0, 1, 2].map((d) => <span key={d} className="w-2.5 h-2.5 rounded-full" style={{ background: W2 }} />)}
            <span className="mx-auto w-[40%] h-3.5 rounded bg-white" style={{ boxShadow: `inset 0 0 0 1px ${W1}` }} />
          </div>
          <div className="aspect-[16/10] flex flex-col">{w.body()}</div>
        </motion.div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: O }}>
            Lo-fi · {String(i + 1).padStart(2, "0")} / {String(WIRES.length).padStart(2, "0")}
          </div>
          <div className={`mt-1 text-[22px] font-bold tracking-[-0.02em] ${theme.textMain}`}>{w.k}</div>
          <ol className="mt-3 space-y-2">
            {w.notes.map((n, k) => (
              <li key={n} className={`flex gap-3 text-[14px] ${theme.textBody}`}>
                <span className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white" style={{ background: O }}>
                  {k + 1}
                </span>
                {n}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* collapsible wrapper so code stays optional for design-focused readers */
export function CodeToggle({ label = "View the code", children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold" style={{ color: O, boxShadow: `inset 0 0 0 1px ${O}66` }}>
        <span className="font-mono">{open ? "</>" : "</>"}</span> {open ? "Hide code" : label}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          {children}
        </motion.div>
      )}
    </div>
  );
}
