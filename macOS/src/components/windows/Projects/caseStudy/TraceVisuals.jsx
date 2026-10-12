// src/components/windows/Projects/caseStudy/TraceVisuals.jsx
// Native visuals and interactive demos for the Trace case study.
// Content from the thesis (KTH, 2026) and github.com/martalendinez/Trace_Plugin
// (critique library: features/reflection/data/critiqueRules.ts · stage rules: server/reflect.ts).
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const I = "#5b5bd6";
const INK = "#16163a";
const INTER = 'Inter, -apple-system, "Helvetica Neue", sans-serif';

const surface = (theme) =>
  theme.isDark ? { background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" } : { background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 14px 32px -24px rgba(30,30,90,0.3)" };
const rise = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -40px 0px" },
  transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});
function Ico({ d, className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------- problem ---------- */
const PROBLEMS = [
  ["M4 12h16M14 6l6 6-6 6", "Automation over collaboration", "Tools hand over finished output, so designers become reviewers."],
  ["M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z", "Black-box reasoning", "No way to see why a suggestion was made, or how sure the AI is."],
  ["M4 6h16M4 10h10M4 14h12M4 18h7", "Prompting doesn’t fit design", "Visual intent is hard to put into words, so outputs miss the point."],
  ["M12 3v4M12 17v4M5 12H3M21 12h-2M7 7l-1.5-1.5M18.5 18.5 17 17M7 17l-1.5 1.5M18.5 5.5 17 7", "Skills and judgment fade", "Over-reliance reduces the reflective thinking design depends on."],
];
export function TraceProblems({ theme }) {
  return (
    <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
      {PROBLEMS.map(([d, h, p], i) => (
        <motion.div key={h} {...rise(i)} className="rounded-[16px] p-4" style={surface(theme)}>
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(91,91,214,0.12)", color: I }}>
            <Ico d={d} />
          </span>
          <div className={`mt-3 text-[14.5px] font-semibold leading-snug ${theme.textMain}`}>{h}</div>
          <div className={`mt-1 text-[12.5px] leading-snug ${theme.textSub}`}>{p}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- with vs without AI ---------- */
export function ExperimentCompare({ theme }) {
  const cols = [
    { h: "Without AI", tone: "#8a8aa0", items: ["Manual structuring of the problem", "Iterative sense-making", "Deliberate, owned decisions", "Slower to diverge"] },
    { h: "With AI", tone: I, items: ["Faster early divergence", "Cognitive offloading crept in", "Direction shifted because a suggestion said so", "Hard to put visual intent into words"] },
  ];
  return (
    <div className="rounded-[20px] p-5 @2xl:p-6" style={surface(theme)}>
      <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${theme.textSub}`}>Design experiment · same loyalty feature, designed twice</div>
      <div className="mt-4 grid grid-cols-1 @3xl:grid-cols-2 gap-4">
        {cols.map((c) => (
          <div key={c.h} className="rounded-[14px] p-4" style={{ background: `${c.tone}12` }}>
            <div className="text-[15px] font-bold" style={{ color: c.tone }}>
              {c.h}
            </div>
            <ul className="mt-2 space-y-1.5">
              {c.items.map((it) => (
                <li key={it} className={`flex gap-2 text-[13.5px] ${theme.textBody}`}>
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.tone }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-[13px] ${theme.textSub}`}>Logged per condition: time, artefacts, decision points, friction, and in the AI condition every prompt and whether its output was accepted.</p>
    </div>
  );
}

/* ---------- FigJam-style synthesis board ---------- */
const STICKY = { lit: "#ffd966", exp: "#9fd3ff", exp2: "#b8f0c8", lab: "#ffb3c7" };
function Sticky({ x, y, c, children, r = 0, who }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r} 60 40)`}>
      <rect x="2" y="4" width="120" height="78" rx="4" fill="rgba(0,0,0,0.08)" />
      <rect width="120" height="78" rx="4" fill={c} />
      <foreignObject x="8" y="8" width="104" height="58">
        <div style={{ fontFamily: INTER, fontSize: 10.5, lineHeight: 1.3, color: "#2a2a2a", fontWeight: 500 }}>{children}</div>
      </foreignObject>
      {who && (
        <g transform="translate(96 60)">
          <circle r="7" fill="#fff" />
          <text textAnchor="middle" y="3" fontFamily={INTER} fontSize="7.5" fontWeight="700" fill="#555">
            {who}
          </text>
        </g>
      )}
    </g>
  );
}
function Section({ x, y, w, h, title, c }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="10" fill="rgba(255,255,255,0.7)" stroke={c} strokeWidth="1.4" />
      <rect x="0" y="-22" width={title.length * 7 + 22} height="20" rx="6" fill={c} />
      <text x="10" y="-8" fontFamily={INTER} fontSize="11" fontWeight="700" fill="#fff">
        {title}
      </text>
    </g>
  );
}
export function SynthesisBoard({ theme }) {
  return (
    <figure>
      <div className="rounded-[18px] overflow-hidden" style={{ background: "#f5f5f7", backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1.2px)", backgroundSize: "18px 18px", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 22px 46px -28px rgba(30,30,90,0.4)" }}>
        <svg viewBox="0 0 1000 560" className="block w-full h-auto" role="img" aria-label="Synthesis board: literature, expert and experiment notes clustered into the six-stage framework">
          <defs>
            <marker id="fj-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#555" />
            </marker>
          </defs>
          <text x="32" y="44" fontFamily={INTER} fontSize="20" fontWeight="800" fill={INK}>
            Synthesis board · from evidence to framework
          </text>

          <Section x={32} y={92} w={300} h={210} title="Literature" c="#e0a800" />
          <Sticky x={44} y={108} c={STICKY.lit} r={-2}>Generative UI helps the blank page, but outputs need heavy rework</Sticky>
          <Sticky x={176} y={112} c={STICKY.lit} r={2}>LLMs don’t reliably improve problem reframing</Sticky>
          <Sticky x={48} y={208} c={STICKY.lit} r={1}>Prompting misaligned with visual work</Sticky>
          <Sticky x={180} y={210} c={STICKY.lit} r={-1.5}>Trust needs transparency + control</Sticky>

          <Section x={350} y={92} w={300} h={210} title="Expert interviews" c="#2f8ae0" />
          <Sticky x={362} y={108} c={STICKY.exp} r={1.5} who="E2">“Cognitive offloading”: the user becomes a passive evaluator</Sticky>
          <Sticky x={494} y={110} c={STICKY.exp} r={-2} who="E4">Confident tone → over-reliance</Sticky>
          <Sticky x={364} y={208} c={STICKY.exp} r={-1} who="E1">Useful early, fades with complexity</Sticky>
          <Sticky x={498} y={212} c={STICKY.exp} r={2} who="E5">When is AI appropriate at all?</Sticky>

          <Section x={668} y={92} w={300} h={210} title="Design experiment" c="#2aa35a" />
          <Sticky x={680} y={108} c={STICKY.exp2} r={-1.5}>With AI I changed direction because it said so</Sticky>
          <Sticky x={812} y={112} c={STICKY.exp2} r={1.5}>Without AI: slower, but decisions felt mine</Sticky>
          <Sticky x={684} y={210} c={STICKY.exp2} r={1}>Hard to describe visual intent in text</Sticky>
          <Sticky x={816} y={208} c={STICKY.exp2} r={-2}>Log everything: prompts, accepts, rejects</Sticky>

          <g fill="none" stroke="#555" strokeWidth="1.6">
            <path d="M182 304 C 182 360, 420 340, 470 392" markerEnd="url(#fj-ar)" />
            <path d="M500 304 V 388" markerEnd="url(#fj-ar)" />
            <path d="M818 304 C 818 360, 580 340, 530 392" markerEnd="url(#fj-ar)" />
          </g>

          <Section x={110} y={420} w={780} h={110} title="Framework: six stages" c={I} />
          {["Intent", "Context", "Options", "Critique", "Improve", "Trace"].map((s, i) => (
            <g key={s} transform={`translate(${130 + i * 126} 444)`}>
            <rect width="110" height="62" rx="10" fill={i === 5 ? I : "#ecebfd"} />
              <text x="55" y="27" textAnchor="middle" fontFamily={INTER} fontSize="10" fontWeight="700" fill={i === 5 ? "rgba(255,255,255,0.8)" : I}>
                0{i + 1}
              </text>
              <text x="55" y="45" textAnchor="middle" fontFamily={INTER} fontSize="14" fontWeight="700" fill={i === 5 ? "#fff" : INK}>
                {s}
              </text>
            </g>
          ))}
          {/* stamps */}
          <g transform="translate(626 98)">
            <circle r="13" fill="#ff5c8a" />
            <text textAnchor="middle" y="4" fontFamily={INTER} fontSize="10" fontWeight="800" fill="#fff">
              +3
            </text>
          </g>
          <g transform="translate(320 100)">
            <circle r="13" fill="#ff5c8a" />
            <text textAnchor="middle" y="4" fontFamily={INTER} fontSize="11" fill="#fff">
              ★
            </text>
          </g>
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: I }} />
        Abductive synthesis: notes from the literature, the five experts and my own experiment, clustered into the six workflow stages.
      </figcaption>
    </figure>
  );
}

/* ---------- interactive framework ---------- */
const STAGES = [
  { k: "Intent", you: "Articulate the goal, constraints and intended outcome.", ai: "Waits. Nothing is generated until the goal is explicit.", guard: "Clarifies what kind of assistance you’re asking for." },
  { k: "Context", you: "Describe the product, users, stage and anything the AI should rely on.", ai: "Adapts its focus to the design stage you choose.", guard: "Defines exactly what information the system can use." },
  { k: "Options", you: "Compare several directions instead of accepting one answer.", ai: "Proposes 3–5 options, each with principle, trade-off and reasoning.", guard: "Outputs stay steerable and open to refinement." },
  { k: "Critique", you: "Interrogate assumptions through lenses like accessibility or edge cases.", ai: "Raises concerns and suggestions, with an uncertainty note on each.", guard: "Assumptions and uncertainty are always visible." },
  { k: "Improve", you: "Apply, adapt or reject suggestions, and add your own ideas.", ai: "Respects rejections and never reintroduces them.", guard: "Verification is built into the workflow." },
  { k: "Trace", you: "Consolidate the decision and the reasoning behind it.", ai: "Drafts an editable log of what was used, adopted or rejected.", guard: "A trace log keeps decisions accountable over time." },
];
export function FrameworkExplorer({ theme }) {
  const [a, setA] = useState(0);
  const s = STAGES[a];
  return (
    <div className="rounded-[22px] p-5 @2xl:p-6" style={surface(theme)}>
      <div className="relative grid grid-cols-6 gap-1.5">
        {STAGES.map((st, i) => (
          <button
            key={st.k}
            type="button"
            onClick={() => setA(i)}
            onMouseEnter={() => setA(i)}
            className="relative rounded-[12px] px-2 py-3 text-center transition"
            style={i === a ? { background: I, color: "#fff" } : { background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f1f0fd", color: theme.isDark ? "#ddd" : INK }}
          >
            <div className="text-[10px] font-semibold tabular-nums opacity-70">0{i + 1}</div>
            <div className="text-[13px] @2xl:text-[14px] font-bold">{st.k}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: theme.isDark ? "rgba(255,255,255,0.08)" : "#ecebfd" }}>
        <motion.div className="h-full rounded-full" style={{ background: I }} animate={{ width: `${((a + 1) / 6) * 100}%` }} />
      </div>
      <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="mt-5 grid grid-cols-1 @3xl:grid-cols-3 gap-4">
        {[
          ["The designer", s.you],
          ["Trace", s.ai],
          ["Cross-cutting guardrail", s.guard],
        ].map(([h, d], i) => (
          <div key={h} className="pt-3 border-t-2" style={{ borderColor: i === 1 ? I : theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: i === 1 ? I : undefined }}>
              <span className={i === 1 ? "" : theme.textSub}>{h}</span>
            </div>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${theme.textBody}`}>{d}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- plugin lo-fi wireframes ---------- */
const G1 = "#ececef", G2 = "#d9d9de", G3 = "#b9b9c0", G4 = "#8d8d96";
const B = ({ w = "100%", h = 6, c = G2, className = "" }) => <span className={`block rounded-full ${className}`} style={{ width: w, height: h, background: c }} />;
const Bx = ({ className = "", children }) => (
  <div className={`rounded-[6px] ${className}`} style={{ boxShadow: `inset 0 0 0 1.2px ${G2}` }}>
    {children}
  </div>
);
const PANELS = {
  Intent: {
    notes: ["One clear question per step", "Example chips so nobody starts from blank", "Primary action only when the goal is filled in"],
    body: () => (
      <>
        <B w="55%" h={9} c={G3} />
        <B w="85%" className="mt-2" />
        <Bx className="mt-4 h-20 p-2">
          <B w="70%" h={5} />
        </Bx>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[40, 56, 48].map((w, i) => (
            <span key={i} className="h-5 rounded-full" style={{ width: w, boxShadow: `inset 0 0 0 1.2px ${G2}` }} />
          ))}
        </div>
      </>
    ),
  },
  Options: {
    notes: ["3–5 options side by side", "Principle and trade-off on every card", "Reasoning revealed progressively"],
    body: () => (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Bx key={i} className="p-2.5 space-y-1.5">
            <B w="50%" h={7} c={i === 0 ? G4 : G3} />
            <B w="90%" h={5} />
            <div className="flex gap-1.5 pt-0.5">
              <span className="h-4 w-14 rounded-full" style={{ background: G1 }} />
              <span className="h-4 w-12 rounded-full" style={{ background: G1 }} />
            </div>
          </Bx>
        ))}
      </div>
    ),
  },
  Critique: {
    notes: ["Lens chips to choose what to critique", "Concern, suggestion and uncertainty per card", "Apply · Suggest · Reject on every item"],
    body: () => (
      <>
        <div className="flex flex-wrap gap-1.5">
          {[54, 46, 60].map((w, i) => (
            <span key={i} className="h-5 rounded-full" style={{ width: w, background: i === 0 ? G4 : G1 }} />
          ))}
        </div>
        {[0, 1].map((i) => (
          <Bx key={i} className="mt-3 p-2.5 space-y-1.5">
            <B w="60%" h={7} c={G3} />
            <B w="95%" h={5} />
            <B w="80%" h={5} />
            <div className="pt-1 flex gap-1.5">
              <span className="h-5 w-12 rounded-[5px]" style={{ background: G4 }} />
              <span className="h-5 w-12 rounded-[5px]" style={{ boxShadow: `inset 0 0 0 1.2px ${G2}` }} />
              <span className="h-5 w-12 rounded-[5px]" style={{ boxShadow: `inset 0 0 0 1.2px ${G2}` }} />
            </div>
          </Bx>
        ))}
      </>
    ),
  },
  Trace: {
    notes: ["Intent, critiques and improvements in one log", "Everything editable", "Export it to a review or hand-off"],
    body: () => (
      <div className="space-y-3">
        {["Intent", "Critiques", "Improvements"].map((h, i) => (
          <div key={h}>
            <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: G4 }}>
              {h}
            </div>
            <Bx className="mt-1 p-2 space-y-1.5">
              <B w="90%" h={5} />
              <B w={i === 1 ? "70%" : "55%"} h={5} />
            </Bx>
          </div>
        ))}
      </div>
    ),
  },
};
export function TraceLofi({ theme }) {
  const keys = Object.keys(PANELS);
  const [k, setK] = useState(keys[0]);
  const p = PANELS[k];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {keys.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setK(x)}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition"
            style={x === k ? { background: theme.isDark ? I : INK, color: "#fff" } : { color: theme.isDark ? "#ddd" : INK, boxShadow: `inset 0 0 0 1px ${theme.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}` }}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 @3xl:grid-cols-[1.7fr_1fr] gap-6 items-center">
        <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] overflow-hidden bg-white flex" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 22px 44px -26px rgba(0,0,0,0.35)", fontFamily: INTER, aspectRatio: "16/10" }}>
          {/* canvas placeholder */}
          <div className="flex-1 relative" style={{ background: "#f6f6f7" }}>
            <div className="absolute inset-[12%] rounded-[8px] bg-white p-3" style={{ boxShadow: `inset 0 0 0 1.2px ${G2}` }}>
              <B w="40%" h={8} c={G3} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-16 rounded-[6px]" style={{ background: G1 }} />
                <div className="h-16 rounded-[6px]" style={{ background: G1 }} />
              </div>
              <span className="mt-3 block w-20 h-5 rounded-[5px]" style={{ background: G3 }} />
            </div>
            <span className="absolute left-3 top-2 text-[9px] font-semibold" style={{ color: G4 }}>
              Canvas
            </span>
          </div>
          {/* plugin panel */}
          <div className="w-[40%] border-l p-3.5" style={{ borderColor: G1 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold" style={{ color: "#55555c" }}>
                Trace
              </span>
              <span className="flex gap-1">
                {keys.map((x) => (
                  <span key={x} className="w-1.5 h-1.5 rounded-full" style={{ background: x === k ? G4 : G2 }} />
                ))}
              </span>
            </div>
            {p.body()}
          </div>
        </motion.div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: I }}>
            Lo-fi · plugin panel
          </div>
          <div className={`mt-1 text-[22px] font-bold tracking-[-0.02em] ${theme.textMain}`}>{k}</div>
          <ol className="mt-3 space-y-2">
            {p.notes.map((n, i) => (
              <li key={n} className={`flex gap-3 text-[14px] ${theme.textBody}`}>
                <span className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white" style={{ background: I }}>
                  {i + 1}
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

/* ---------- try Trace: stage-aware critique ---------- */
const STAGE_RULES = {
  "Problem definition": ["the problem, constraints, user needs, assumptions"],
  "User flows": ["flow logic, task completion, friction points, missing steps"],
  "Low fidelity": ["structure, layout intent, conceptual clarity"],
  Wireframe: ["hierarchy, navigation, clarity, usability"],
  "Mid fidelity": ["layout refinement, spacing, interaction patterns"],
  "High fidelity": ["visual polish, spacing, accessibility, hierarchy, consistency"],
  Prototype: ["interaction flow, transitions, affordances, expectations"],
  "Usability testing": ["usability risks, confusion points, testable hypotheses"],
};
const AVOID = {
  "Problem definition": "UI-level feedback",
  "User flows": "visual or layout feedback",
  "Low fidelity": "detailed UI polish",
  Wireframe: "visual styling feedback",
  "Mid fidelity": "heavy visual critique (light allowed)",
};
const CRITIQUES = [
  { id: "c1", cat: "accessibility", title: "Potential accessibility impact", concern: "Hidden or progressively revealed fields may not be announced clearly to assistive technologies.", suggestion: "Add explicit labels, preserve focus order, and announce newly revealed inputs.", unc: "This may matter more if fields are dynamically inserted or visually hidden." },
  { id: "c2", cat: "edge-cases", title: "New users may need more guidance", concern: "If onboarding relies only on placeholders, users may still hesitate or enter incomplete data.", suggestion: "Add helper text that explains why the field matters and what valid input looks like.", unc: "This depends on how familiar users already are with the product domain." },
  { id: "c3", cat: "interaction-complexity", title: "Too many steps can increase effort", concern: "Breaking the flow into too many moments may reduce overwhelm but also increase friction.", suggestion: "Keep the sequence short and show visible progress so the extra steps feel manageable.", unc: "This risk grows if users are forced through multiple screens for simple input." },
  { id: "c4", cat: "consistency", title: "Pattern may conflict with existing flows", concern: "If this screen behaves differently from the rest of the product, users may lose confidence.", suggestion: "Match existing field patterns, copy tone, and button placement where possible.", unc: "This matters most when the product already has established interaction patterns." },
  { id: "c5", cat: "usability", title: "Primary action may compete visually", concern: "If the main CTA looks too similar to secondary actions, the next step may feel unclear.", suggestion: "Increase prominence of the primary action through spacing, grouping, or stronger emphasis.", unc: "This depends on the actual visual hierarchy of the selected UI." },
];
const LENSES = ["accessibility", "usability", "consistency", "edge-cases", "interaction-complexity"];
const nice = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");

export function TryTrace({ theme }) {
  const [stage, setStage] = useState("Wireframe");
  const [lenses, setLenses] = useState(["accessibility", "usability", "edge-cases"]);
  const [state, setState] = useState({}); // id -> applied | rejected
  const [showUnc, setShowUnc] = useState(true);
  const [phase, setPhase] = useState("idle"); // idle | thinking | ready
  useEffect(() => {
    setPhase("idle");
    setState({});
  }, [stage, lenses]);
  useEffect(() => {
    if (phase !== "thinking") return;
    const id = setTimeout(() => setPhase("ready"), 1400);
    return () => clearTimeout(id);
  }, [phase]);
  const visible = phase === "ready" ? CRITIQUES.filter((c) => lenses.includes(c.cat) && !state[c.id]) : [];
  const total = CRITIQUES.filter((c) => lenses.includes(c.cat)).length;
  const allDone = phase === "ready" && total > 0 && visible.length === 0;
  const applied = CRITIQUES.filter((c) => state[c.id] === "applied");
  const rejected = CRITIQUES.filter((c) => state[c.id] === "rejected");
  const box = { fontFamily: INTER, ...surface(theme) };

  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.35fr] gap-4">
      <div className="rounded-[18px] p-5 space-y-5" style={box}>
        <div>
          <div className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] ${theme.textSub}`}>Context · design stage</div>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className={`mt-2 w-full h-9 rounded-[10px] px-3 text-[13px] outline-none ${theme.textMain}`} style={{ background: theme.isDark ? "rgba(255,255,255,0.06)" : "#f4f4f8", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
            {Object.keys(STAGE_RULES).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <motion.div key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-[12px] p-3 text-[12.5px] leading-relaxed" style={{ background: "rgba(91,91,214,0.08)" }}>
            <div>
              <b style={{ color: I }}>Focus on:</b> <span className={theme.textBody}>{STAGE_RULES[stage][0]}</span>
            </div>
            {AVOID[stage] && (
              <div className="mt-1">
                <b className="text-[#c0453a]">Avoid:</b> <span className={theme.textBody}>{AVOID[stage]}</span>
              </div>
            )}
          </motion.div>
          <p className={`mt-2 text-[11px] font-mono ${theme.textSub}`}>from server/reflect.ts · buildDesignStageBehavior()</p>
        </div>
        <div>
          <div className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] ${theme.textSub}`}>Critique lenses</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LENSES.map((l) => {
              const on = lenses.includes(l);
              return (
                <button key={l} type="button" onClick={() => setLenses((x) => (on ? x.filter((y) => y !== l) : [...x, l]))} className="px-2.5 py-1 rounded-full text-[11.5px] font-medium transition" style={on ? { background: I, color: "#fff" } : { color: theme.isDark ? "#ccc" : "#55557a", boxShadow: "inset 0 0 0 1px rgba(91,91,214,0.3)" }}>
                  {nice(l)}
                </button>
              );
            })}
          </div>
        </div>
        <label className={`flex items-center gap-2 text-[12.5px] ${theme.textBody}`}>
          <input type="checkbox" checked={showUnc} onChange={(e) => setShowUnc(e.target.checked)} className="accent-[#5b5bd6]" />
          Show uncertainty notes
        </label>
        <div className="pt-4 border-t" style={{ borderColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)" }}>
          <div className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] ${theme.textSub}`}>Trace log</div>
          {applied.length === 0 && rejected.length === 0 ? (
            <p className={`mt-2 text-[12.5px] ${theme.textSub}`}>Apply or reject a critique to start your trace.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-[12.5px]">
              {applied.map((c) => (
                <li key={c.id} className={theme.textBody}>
                  <span className="text-[#1f9d63] font-semibold">Applied · </span>
                  {c.title}
                </li>
              ))}
              {rejected.map((c) => (
                <li key={c.id} className={theme.textSub}>
                  <span className="text-[#c0453a] font-semibold">Rejected · </span>
                  {c.title} <span className="opacity-70">(won’t come back)</span>
                </li>
              ))}
            </ul>
          )}
          {(applied.length > 0 || rejected.length > 0) && (
            <button type="button" onClick={() => setState({})} className="mt-2 text-[11.5px] font-semibold" style={{ color: I }}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {phase === "idle" && (
          <div className="rounded-[18px] p-8 flex flex-col items-center justify-center text-center min-h-[320px]" style={box}>
            <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(91,91,214,0.12)", color: I }}>
              <Ico d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
            </span>
            <div className={`mt-3 text-[16px] font-bold ${theme.textMain}`}>Ready to critique your option</div>
            <p className={`mt-1 max-w-[300px] text-[13px] ${theme.textSub}`}>
              Trace will review “Streamlined navigation” for an onboarding screen, through {lenses.length} lens{lenses.length === 1 ? "" : "es"}, at the {stage.toLowerCase()} stage.
            </p>
            <button type="button" disabled={!lenses.length} onClick={() => setPhase("thinking")} className="mt-5 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white disabled:opacity-40" style={{ background: I, boxShadow: "0 8px 20px -8px rgba(91,91,214,0.7)" }}>
              Generate critiques
            </button>
          </div>
        )}
        {phase === "thinking" && (
          <div className="rounded-[18px] p-6 min-h-[320px]" style={box}>
            <div className="text-[12px] font-semibold" style={{ color: I }}>
              Reasoning…
            </div>
            {["Reading your intent and context", `Applying ${stage.toLowerCase()} stage rules`, "Checking each lens for risks", "Estimating how certain each critique is"].map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }} className={`mt-3 flex items-center gap-2 text-[13px] ${theme.textBody}`}>
                <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: I }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                {l}
              </motion.div>
            ))}
          </div>
        )}
        {allDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[18px] p-8 text-center min-h-[320px] flex flex-col items-center justify-center" style={box}>
            <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[20px]" style={{ background: "#1f9d63" }}>
              ✓
            </span>
            <div className={`mt-3 text-[16px] font-bold ${theme.textMain}`}>All critiques reviewed</div>
            <p className={`mt-1 text-[13px] ${theme.textSub}`}>
              {applied.length} applied · {rejected.length} rejected. Your decisions are in the trace log.
            </p>
            <button type="button" onClick={() => { setState({}); setPhase("idle"); }} className="mt-4 text-[13px] font-semibold" style={{ color: I }}>
              Start over
            </button>
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {visible.map((c) => {
            const done = state[c.id] === "applied";
            return (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12 * CRITIQUES.indexOf(c) } }} exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }} className="rounded-[16px] p-4" style={{ ...box, ...(done ? { boxShadow: "0 0 0 1.5px #1f9d63" } : {}) }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: "rgba(91,91,214,0.1)", color: I }}>
                    {nice(c.cat)}
                  </span>
                  {done && <span className="text-[11px] font-semibold text-[#1f9d63]">✓ Applied</span>}
                </div>
                <div className={`mt-2 text-[14.5px] font-semibold ${theme.textMain}`}>{c.title}</div>
                <p className={`mt-1 text-[13px] leading-relaxed ${theme.textBody}`}>{c.concern}</p>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${theme.textBody}`}>
                  <b style={{ color: I }}>Suggestion: </b>
                  {c.suggestion}
                </p>
                {showUnc && (
                  <p className={`mt-1.5 text-[12px] italic ${theme.textSub}`}>
                    <b className="not-italic">Uncertainty: </b>
                    {c.unc}
                  </p>
                )}
                {!done && (
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setState((s) => ({ ...s, [c.id]: "applied" }))} className="px-3 py-1 rounded-full text-[12px] font-semibold text-white" style={{ background: I }}>
                      Apply
                    </button>
                    <button type="button" onClick={() => setState((s) => ({ ...s, [c.id]: "rejected" }))} className="px-3 py-1 rounded-full text-[12px] font-semibold" style={{ color: "#c0453a", boxShadow: "inset 0 0 0 1px rgba(192,69,58,0.4)" }}>
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- mix & match ---------- */
const OPTIONS = [
  { title: "Progressive onboarding", principle: "Reduce cognitive load", tradeoff: "More steps to complete" },
  { title: "Single smart form", principle: "Speed and efficiency", tradeoff: "Can feel overwhelming" },
  { title: "Guided checklist", principle: "Visible progress", tradeoff: "Less flexible order" },
];
const FIELDS = ["title", "principle", "tradeoff"];
export function MixMatch({ theme }) {
  const [pick, setPick] = useState({ title: 0, principle: 2, tradeoff: 0 });
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1.6fr_1fr] gap-4 items-start" style={{ fontFamily: INTER }}>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((o, i) => (
          <div key={o.title} className="rounded-[14px] p-3 space-y-1.5" style={surface(theme)}>
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textSub}`}>Option {i + 1}</div>
            {FIELDS.map((f) => {
              const on = pick[f] === i;
              return (
                <button key={f} type="button" onClick={() => setPick((p) => ({ ...p, [f]: i }))} className="w-full text-left rounded-[8px] px-2 py-1.5 text-[11.5px] leading-snug transition" style={on ? { background: I, color: "#fff" } : { background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f4f4f8", color: theme.isDark ? "#ddd" : INK }}>
                  <span className="block text-[9px] uppercase tracking-wider opacity-60">{f}</span>
                  {o[f]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="rounded-[16px] p-4" style={{ ...surface(theme), boxShadow: `0 0 0 1.5px ${I}, 0 16px 34px -20px rgba(91,91,214,0.5)` }}>
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: I }}>
          Your hybrid option
        </div>
        {FIELDS.map((f) => (
          <motion.div key={f + pick[f]} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="mt-2.5">
            <div className={`text-[10px] uppercase tracking-wider ${theme.textSub}`}>{f}</div>
            <div className={`text-[14px] ${f === "title" ? "font-bold" : "font-medium"} ${theme.textMain}`}>{OPTIONS[pick[f]][f]}</div>
          </motion.div>
        ))}
        <p className={`mt-3 text-[11.5px] ${theme.textSub}`}>Click any field on the left to swap it in. In Trace this is drag-and-drop (dnd-kit).</p>
      </div>
    </div>
  );
}

/* ---------- tech stack + architecture ---------- */
const STACK = [
  ["React 19", "UI and six-stage flow", "#149eca", "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 5c4.4 0 8 3.1 8 7s-3.6 7-8 7-8-3.1-8-7 3.6-7 8-7z"],
  ["TypeScript", "Typed options & critiques", "#3178c6", "M4 4h16v16H4zM9 10h5M11.5 10v7M18 11c-.5-.8-3-1-3 .5S18 13 18 15s-2.7 2-3.5 1"],
  ["Context + reducer", "One source of truth", I, "M5 7h14M5 12h14M5 17h9"],
  ["Framer Motion", "Reasoning animations", "#e3346c", "M6 4h12v8H6zM6 12l6 8 6-8"],
  ["dnd-kit", "Mix & match", "#7c5cff", "M8 6h.01M8 12h.01M8 18h.01M14 6h.01M14 12h.01M14 18h.01"],
  ["Express", "Stateless API", "#444", "M4 7h16M4 12h10M4 17h16"],
  ["Groq · Llama 3.3", "70B, strict JSON", "#f55036", "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"],
  ["Tailwind", "Plugin styling", "#06b6d4", "M5 12c1.5-4 4-5 7-3s4.5 1 6-2M4 17c1.5-4 4-5 7-3s4.5 1 6-2"],
];
export function TraceStack({ theme }) {
  return (
    <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
      {STACK.map(([h, d, c, p], i) => (
        <motion.div key={h} {...rise(i * 0.5)} className="rounded-[16px] p-4 flex items-center gap-3" style={surface(theme)}>
          <span className="w-10 h-10 shrink-0 rounded-[11px] flex items-center justify-center" style={{ background: `${c}18`, color: c }}>
            <Ico d={p} />
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

export function TraceArchitecture({ theme }) {
  const steps = [
    ["Designer", "intent, context, stage, lenses"],
    ["React plugin", "Context + reducer state"],
    ["Express API", "builds stage-aware prompt"],
    ["Llama 3.3 70B", "on Groq, JSON mode"],
    ["Normaliser", "IDs, defaults, safe parsing"],
    ["UI", "options, critiques, trace"],
  ];
  const [at, setAt] = useState(-1);
  useEffect(() => {
    if (at < 0 || at >= steps.length) return;
    const id = setTimeout(() => setAt((a) => a + 1), 550);
    return () => clearTimeout(id);
  }, [at, steps.length]);
  return (
    <div>
      <button type="button" onClick={() => setAt(0)} className="mb-4 px-4 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: INK }}>
        {at >= steps.length ? "↻ Send another request" : "▶ Follow one request"}
      </button>
      <ol className="grid grid-cols-2 @3xl:grid-cols-6 gap-2">
        {steps.map(([h, d], i) => {
          const on = at === i, past = at > i;
          return (
            <li key={h} className="rounded-[14px] p-3.5 transition-all duration-300" style={{ ...surface(theme), ...(on ? { boxShadow: `0 0 0 2px ${I}, 0 10px 24px -12px rgba(91,91,214,0.6)`, transform: "translateY(-3px)" } : {}) }}>
              <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: past ? "#1f9d63" : I }}>
                {past ? "✓" : `0${i + 1}`}
              </span>
              <div className={`text-[13.5px] font-semibold ${theme.textMain}`}>{h}</div>
              <div className={`mt-1 text-[11.5px] leading-snug ${theme.textSub}`}>{d}</div>
            </li>
          );
        })}
      </ol>
      <p className={`mt-3 text-[12px] ${theme.textSub}`}>Stateless by design: the frontend sends the full structured context every time, so the model layer can be swapped without touching the interaction design.</p>
    </div>
  );
}
