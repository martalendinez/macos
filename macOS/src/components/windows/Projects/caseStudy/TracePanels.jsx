// src/components/windows/Projects/caseStudy/TracePanels.jsx
// HD, code-drawn recreations of the real Trace plugin screens (from the thesis prototype figures),
// without figure labels or annotations. Used for hi-fi galleries, decisions and iterations.
import { useState } from "react";
import { motion } from "framer-motion";
import figmaTrace from "../../../../imgs/case-study/trace/figma_trace.png";

export const IND = "#4f5ae8";
const INTER = 'Inter, -apple-system, "Helvetica Neue", sans-serif';
const ink = "#1c1d2b";
const sub = "#6b6f80";
const line = "#e7e8ee";

const P = {
  target: "M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  layers: "M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4",
  grid: "M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z",
  chat: "M5 5h14v10H9l-4 4z",
  bulb: "M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5",
  doc: "M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h5M9.5 15.5h5",
  close: "M6 6l12 12M18 6L6 18",
  pencil: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  eye: "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM3 3l18 18",
  chev: "M7 10l5 5 5-5",
  spark: "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z",
};
const Ic = ({ d, s = 14, c = "currentColor", w = 1.8 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const STEPS = [
  ["Intent", P.target],
  ["Context", P.layers],
  ["Options", P.grid],
  ["Critique", P.chat],
  ["Improve", P.bulb],
  ["Trace", P.doc],
];

function Header() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: line }}>
      <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#eef0fd", color: IND }}>
        <Ic d={P.spark} s={14} />
      </span>
      <div className="flex-1 leading-tight">
        <div className="text-[12.5px] font-semibold" style={{ color: ink }}>
          Design Reflection
        </div>
        <div className="text-[10.5px]" style={{ color: sub }}>
          AI Assistant
        </div>
      </div>
      <span style={{ color: sub }}>
        <Ic d={P.close} s={14} />
      </span>
    </div>
  );
}
function Stepper({ active }) {
  return (
    <div className="grid grid-cols-6 gap-1 px-3 pt-3 pb-3 border-b" style={{ borderColor: line }}>
      {STEPS.map(([n, d], i) => {
        const on = i === active;
        return (
          <div key={n} className="flex flex-col items-center gap-1">
            <span className="w-8 h-8 rounded-[9px] flex items-center justify-center" style={on ? { background: IND, color: "#fff", boxShadow: "0 4px 10px -3px rgba(79,90,232,0.6)" } : { background: "#f1f2f7", color: "#8b8fa3" }}>
              <Ic d={d} s={14} />
            </span>
            <span className="text-[9.5px]" style={{ color: on ? ink : sub, fontWeight: on ? 600 : 400 }}>
              {n}
            </span>
          </div>
        );
      })}
    </div>
  );
}
const Eyebrow = ({ n }) => (
  <div className="text-[9.5px] font-semibold tracking-[0.14em]" style={{ color: "#8b8fa3" }}>
    STEP {n} OF 6
  </div>
);
const Field = ({ label, value, hint, select, focus }) => (
  <div className="mt-3">
    <div className="text-[11.5px] font-semibold" style={{ color: ink }}>
      {label}
    </div>
    <div className="mt-1.5 h-8 rounded-[8px] px-2.5 flex items-center justify-between text-[11.5px]" style={{ color: ink, boxShadow: `inset 0 0 0 1px ${focus ? IND : line}`, background: "#fff" }}>
      {value}
      {select && <Ic d={P.chev} s={12} c={sub} />}
    </div>
    {hint && (
      <div className="mt-1 text-[10px]" style={{ color: sub }}>
        {hint}
      </div>
    )}
  </div>
);
const Primary = ({ children, full }) => (
  <span className={`inline-flex items-center justify-center h-8 px-4 rounded-[8px] text-[11.5px] font-semibold text-white ${full ? "w-full" : ""}`} style={{ background: IND, boxShadow: "0 4px 12px -4px rgba(79,90,232,0.7)" }}>
    {children}
  </span>
);
const Ghost = ({ children }) => (
  <span className="inline-flex items-center justify-center h-8 px-4 rounded-[8px] text-[11.5px] font-semibold" style={{ color: ink, boxShadow: `inset 0 0 0 1px ${line}`, background: "#fff" }}>
    {children}
  </span>
);

/* ---------- screens ---------- */
function IntentBody() {
  return (
    <>
      <Eyebrow n={1} />
      <div className="mt-1 text-[15px] font-bold" style={{ color: ink }}>
        Explain your design intent
      </div>
      <div className="mt-1 text-[11px] leading-snug" style={{ color: sub }}>
        Describe what you’re trying to achieve so the AI can give relevant feedback.
      </div>
      <Field label="Task type" value="Design exploration" select hint="Select the type of support you need." />
      <Field label="What is your goal?" value="Help users complete onboarding faster" hint="What should users achieve?" />
      <Field label="Who is this for?" value="First-time users, non-technical" focus hint="Describe your target users." />
      <div className="mt-4">
        <Primary full>Continue</Primary>
      </div>
    </>
  );
}
function ContextBody() {
  return (
    <>
      <Eyebrow n={2} />
      <div className="mt-1 text-[15px] font-bold" style={{ color: ink }}>
        Provide design context
      </div>
      <div className="mt-1 text-[11px] leading-snug" style={{ color: sub }}>
        Help the AI understand your design so it can give more relevant feedback.
      </div>
      <Field label="What part of the design are you working on?" value="Onboarding screen" />
      <Field label="What is this product or feature?" value="Fitness tracking app" />
      <Field label="What stage are you in?" value="Low-fidelity sketches" select />
      <div className="mt-3 text-[11.5px] font-semibold" style={{ color: ink }}>
        What should the AI consider?
      </div>
      {[
        ["UI frames / screens", true],
        ["Buttons & CTAs", false],
      ].map(([l, on]) => (
        <div key={l} className="mt-1.5 h-8 rounded-[8px] px-2.5 flex items-center gap-2 text-[11.5px]" style={{ color: ink, boxShadow: `inset 0 0 0 1px ${on ? IND : line}`, background: on ? "#f3f4fe" : "#fff" }}>
          <span className="w-3.5 h-3.5 rounded-[4px] flex items-center justify-center text-[9px] text-white" style={{ background: on ? IND : "#fff", boxShadow: on ? "none" : `inset 0 0 0 1px ${line}` }}>
            {on && "✓"}
          </span>
          {l}
        </div>
      ))}
    </>
  );
}
function OptionCard({ t, s, p, tr, sel }) {
  return (
    <div className="mt-2.5 rounded-[10px] p-3" style={{ boxShadow: `inset 0 0 0 1px ${sel ? IND : line}`, background: sel ? "#f7f8ff" : "#fff" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] font-semibold" style={{ color: ink }}>
          {t}
        </div>
        <span className="shrink-0 px-2.5 h-6 inline-flex items-center rounded-[6px] text-[10.5px] font-semibold" style={sel ? { background: IND, color: "#fff" } : { color: IND, boxShadow: `inset 0 0 0 1px ${IND}55` }}>
          {sel ? "Selected" : "Select"}
        </span>
      </div>
      <div className="mt-1 text-[10.5px] leading-snug" style={{ color: sub }}>
        {s}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
        <div className="rounded-[6px] px-2 py-1" style={{ background: "#f1f2f7" }}>
          <span style={{ color: sub }}>Principle</span>
          <div className="font-semibold" style={{ color: ink }}>
            {p}
          </div>
        </div>
        <div className="rounded-[6px] px-2 py-1" style={{ background: "#fff6ec" }}>
          <span style={{ color: "#b0732a" }}>Trade-off</span>
          <div className="font-semibold" style={{ color: ink }}>
            {tr}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[10.5px] font-semibold" style={{ color: IND }}>
        Refine with AI →
      </div>
    </div>
  );
}
function OptionsBody() {
  return (
    <>
      <Eyebrow n={3} />
      <div className="mt-1 text-[15px] font-bold" style={{ color: ink }}>
        Explore options
      </div>
      <div className="mt-2 rounded-[10px] p-2.5 text-[10.5px] leading-snug" style={{ background: "#f6f7fb", color: sub }}>
        <span className="font-semibold" style={{ color: IND }}>
          Reasoning ·{" "}
        </span>
        Options prioritise hierarchy and clarity to help first-time, non-technical users finish onboarding faster.
      </div>
      <OptionCard t="Streamlined navigation" s="Fewer steps and clearer navigation through onboarding." p="Minimise cognitive load" tr="Less feature overview" sel />
      <OptionCard t="Guided tour" s="An interactive tour of the app’s key features." p="Learn by doing" tr="Can feel slow for experts" />
    </>
  );
}
const CRIT = [
  ["USABILITY", "Incomplete onboarding flow", "#d48a12", "#fff8e8"],
  ["ACCESSIBILITY", "Insufficient color contrast", "#d0453a", "#fdeeee"],
  ["EDGE-CASES", "Incomplete error handling", "#8b4fd8", "#f5eefd"],
];
function CritiqueBody() {
  return (
    <>
      <Eyebrow n={4} />
      <div className="mt-1 text-[15px] font-bold" style={{ color: ink }}>
        Critiques
      </div>
      <div className="mt-1 text-[11px] leading-snug" style={{ color: sub }}>
        Generated from the option you selected. Accept the ones you want, reject the rest, or discuss any with the AI.
      </div>
      {CRIT.map(([c, t, col, bg], i) => (
        <div key={t} className="mt-2.5 rounded-[10px] p-3" style={{ boxShadow: `inset 0 0 0 1.5px ${col}66`, background: i === 1 ? bg : "#fff" }}>
          <div className="flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold tracking-wide" style={{ color: col, background: bg }}>
              {c}
            </span>
            <span style={{ transform: i === 1 ? "rotate(180deg)" : undefined }}>
              <Ic d={P.chev} s={12} c={sub} />
            </span>
          </div>
          <div className="mt-1.5 text-[12px] font-semibold" style={{ color: ink }}>
            {t}
          </div>
          {i === 1 && (
            <>
              <div className="mt-1.5 text-[10.5px] leading-snug" style={{ color: sub }}>
                Light text on the primary button may fall below WCAG AA contrast.
              </div>
              <div className="mt-2 flex gap-1.5">
                <span className="px-2.5 h-6 inline-flex items-center rounded-[6px] text-[10px] font-semibold text-white" style={{ background: IND }}>
                  Apply
                </span>
                <span className="px-2.5 h-6 inline-flex items-center rounded-[6px] text-[10px] font-semibold" style={{ color: IND, boxShadow: `inset 0 0 0 1px ${IND}55` }}>
                  Suggest
                </span>
                <span className="px-2.5 h-6 inline-flex items-center rounded-[6px] text-[10px] font-semibold" style={{ color: "#d0453a", boxShadow: "inset 0 0 0 1px rgba(208,69,58,0.35)" }}>
                  Reject
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
function TraceBody() {
  const rows = [
    [P.target, "Intent", "Help users complete onboarding faster", "#eef0fd", IND],
    [P.chat, "Critique", "3 issues reviewed · 1 rejected", "#fff4e0", "#d48a12"],
    [P.bulb, "Improvements", "2 improvements applied", "#e6f7ee", "#1f9d63"],
  ];
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold" style={{ color: ink }}>
            Trace Log
          </div>
          <div className="text-[10.5px]" style={{ color: sub }}>
            Full reflection trail
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10.5px]" style={{ color: sub }}>
          <Ic d={P.eye} s={12} /> Hide
        </span>
      </div>
      <div className="mt-3 relative">
        <span className="absolute left-[13px] top-6 bottom-6 w-px" style={{ background: line }} />
        {rows.map(([d, h, v, bg, c]) => (
          <div key={h} className="relative flex items-start gap-2.5 py-2">
            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: bg, color: c }}>
              <Ic d={d} s={13} />
            </span>
            <div className="flex-1">
              <div className="text-[11.5px] font-semibold" style={{ color: ink }}>
                {h}
              </div>
              <div className="text-[10.5px]" style={{ color: sub }}>
                {v}
              </div>
            </div>
            <span style={{ color: "#9aa0b3" }}>
              <Ic d={P.pencil} s={12} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          ["INTENT", "Defined"],
          ["ISSUES", "3 found"],
          ["APPLIED", "2 applied"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[8px] py-2 text-center" style={{ background: "#f4f5f9" }}>
            <div className="text-[8.5px] font-semibold tracking-wider" style={{ color: sub }}>
              {k}
            </div>
            <div className="text-[11.5px] font-bold" style={{ color: ink }}>
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Ghost>Back</Ghost>
        <Primary>Finish</Primary>
      </div>
    </>
  );
}
function MixBody() {
  return (
    <>
      <Eyebrow n={3} />
      <div className="mt-1 text-[15px] font-bold" style={{ color: ink }}>
        Mix & match
      </div>
      <div className="mt-1 text-[11px] leading-snug" style={{ color: sub }}>
        Drag fields from any option into the builder to compose your own.
      </div>
      <div className="mt-3 rounded-[10px] p-3" style={{ background: "#f6f7fb", boxShadow: `inset 0 0 0 1.5px ${IND}33`, borderStyle: "dashed" }}>
        {[
          ["Title", "Personalized onboarding", true],
          ["Summary", "Clear, prominent CTAs guide users through", true],
          ["Principle", "Drop principle here…", false],
          ["Trade-off", "Drop trade-off here…", false],
        ].map(([k, v, on]) => (
          <div key={k} className="flex items-center gap-2 py-1.5">
            <span className="w-16 text-[10px]" style={{ color: sub }}>
              {k}
            </span>
            <span className="flex-1 rounded-[6px] px-2 py-1 text-[10.5px]" style={on ? { background: "#fff", color: ink, boxShadow: `inset 0 0 0 1px ${line}`, fontWeight: 600 } : { color: "#a2a6b8", boxShadow: "inset 0 0 0 1px #d6d8e2", borderStyle: "dashed" }}>
              {v}
            </span>
          </div>
        ))}
        <div className="mt-2">
          <Ghost>Create custom option</Ghost>
        </div>
      </div>
    </>
  );
}

const BODIES = { Intent: [0, IntentBody], Context: [1, ContextBody], Options: [2, OptionsBody], "Mix & match": [2, MixBody], Critique: [3, CritiqueBody], Trace: [5, TraceBody] };

/** One Trace plugin panel, rendered crisp at any size via CSS zoom. */
export function TracePanel({ screen = "Intent", width = 300, className = "", style }) {
  const [step, Body] = BODIES[screen];
  const k = width / 320;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height: 560 * k, ...style }}>
      <div className="absolute left-0 top-0 bg-white rounded-[16px] overflow-hidden" style={{ width: 320, height: 560, transform: `scale(${k})`, transformOrigin: "top left", fontFamily: INTER, boxShadow: "0 0 0 1px rgba(20,20,60,0.06), 0 30px 60px -28px rgba(30,30,90,0.45)" }}>
        <Header />
        <Stepper active={step} />
        <div className="px-4 pt-3.5 pb-4 overflow-hidden">
          <Body />
        </div>
      </div>
    </div>
  );
}

/** Hero-style gallery: five panels staggered on a soft canvas. */
export function TraceGallery({ theme }) {
  const screens = ["Intent", "Context", "Options", "Critique", "Trace"];
  const [hover, setHover] = useState(null);
  return (
    <div className="rounded-[22px] overflow-hidden px-3 py-10 @2xl:px-5" style={{ background: theme.isDark ? "linear-gradient(160deg,#1c1c2b,#141420)" : "linear-gradient(160deg,#f4f4fb,#e9e9f6)" }}>
      <div className="flex justify-center gap-3 pb-8">
        {screens.map((s, i) => (
          <motion.div
            key={s}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: i % 2 ? 26 : 0 }}
            viewport={{ once: true }}
            animate={hover === i ? { y: (i % 2 ? 26 : 0) - 10 } : undefined}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <TracePanel screen={s} width={138} />
            <div className={`mt-3 text-center text-[12px] font-semibold ${theme.textSub}`}>
              0{["Intent", "Context", "Options", "Critique", "Improve", "Trace"].indexOf(s) + 1} · {s}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- iterations: before / after ---------- */
export function OldLog() {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden" style={{ width: 300, fontFamily: INTER, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}>
      <div className="h-7 px-3 flex items-center gap-1.5" style={{ background: "#f3f3f5", borderBottom: `1px solid ${line}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-[#d4d4d8]" />
        ))}
        <span className="ml-2 text-[10px] font-semibold" style={{ color: sub }}>
          AI Design Reflection Assistant
        </span>
      </div>
      <div className="p-4">
        <div className="text-[10px]" style={{ color: sub }}>
          Step 6 of 6
        </div>
        <div className="text-[16px] font-bold" style={{ color: ink }}>
          Reflection log
        </div>
        {[
          ["Intent (goal)", "Improve onboarding flow"],
          ["Audience", "First-time users"],
          ["Context shared with AI", "selected-ui, button-labels"],
        ].map(([k, v]) => (
          <div key={k} className="mt-2 rounded-[8px] p-2" style={{ boxShadow: `inset 0 0 0 1px ${line}` }}>
            <div className="text-[9.5px]" style={{ color: sub }}>
              {k}
            </div>
            <div className="text-[11px] font-medium" style={{ color: ink }}>
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function OldOptions() {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden" style={{ width: 300, fontFamily: INTER, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}>
      <div className="p-4">
        <div className="text-[9.5px] font-semibold tracking-[0.14em]" style={{ color: "#8b8fa3" }}>
          STEP 3 OF 6
        </div>
        <div className="text-[15px] font-bold" style={{ color: ink }}>
          Options
        </div>
        {["Guided onboarding", "Progressive disclosure", "Contextual tooltips"].map((o) => (
          <div key={o} className="mt-2 rounded-[8px] p-2.5" style={{ boxShadow: `inset 0 0 0 1px ${line}` }}>
            <div className="text-[11.5px] font-semibold" style={{ color: ink }}>
              {o}
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-[5px] bg-[#eceef3] font-semibold" style={{ color: ink }}>
                Select
              </span>
              <span style={{ color: sub }}>⌄ View reasoning</span>
            </div>
          </div>
        ))}
        <div className="mt-3 flex gap-1.5">
          <Ghost>Back</Ghost>
          <Ghost>Generate</Ghost>
        </div>
      </div>
    </div>
  );
}

const ROUNDS = [
  {
    t: "Round 1 · Low fidelity",
    n: "4 participants",
    before: <OldLog />,
    after: <TracePanel screen="Trace" width={300} />,
    changes: ["Clearer labels, one-line descriptions, examples and tooltips", "Non-linear navigation: stepper, skip and go back", "A refinement chat to iterate on any option", "An editable, structured trace log"],
  },
  {
    t: "Round 2 · High fidelity",
    n: "8 participants",
    before: <OldOptions />,
    after: <TracePanel screen="Critique" width={300} />,
    changes: ["Apply · Suggest · Reject on every critique", "Memory of rejected ideas, so they never return", "Visible reasoning and stage-grounded critiques", "Mix & match across options, and a global Go back"],
  },
];
export function TraceIterations({ theme }) {
  const [r, setR] = useState(0);
  const [side, setSide] = useState("after");
  const R = ROUNDS[r];
  return (
    <div className="rounded-[22px] p-5 @2xl:p-6" style={{ background: theme.isDark ? "rgba(255,255,255,0.04)" : "#fff", boxShadow: theme.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "0 0 0 1px rgba(0,0,0,0.06), 0 14px 32px -24px rgba(30,30,90,0.3)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {ROUNDS.map((x, i) => (
            <button key={x.t} type="button" onClick={() => setR(i)} className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition" style={i === r ? { background: IND, color: "#fff" } : { color: IND, boxShadow: `inset 0 0 0 1px ${IND}55` }}>
              {x.t}
            </button>
          ))}
        </div>
        <div className={`inline-flex rounded-full p-1 text-[12px] font-semibold ${theme.isDark ? "bg-white/10" : "bg-black/[0.05]"}`}>
          {["before", "after"].map((s) => (
            <button key={s} type="button" onClick={() => setSide(s)} className={`px-3 py-1 rounded-full capitalize transition ${side === s ? (theme.isDark ? "bg-white/20 text-white" : "bg-white text-black shadow-sm") : theme.textSub}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 @3xl:grid-cols-[auto_1fr] gap-8 items-center">
        <div className="flex justify-center rounded-[18px] p-6" style={{ background: theme.isDark ? "rgba(255,255,255,0.03)" : "#f4f4fb" }}>
          <motion.div key={r + side} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {side === "before" ? R.before : R.after}
          </motion.div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: IND }}>
            {R.n} · what changed
          </div>
          <ol className="mt-3 space-y-2.5">
            {R.changes.map((c, i) => (
              <li key={c} className={`flex gap-3 text-[14px] ${theme.textBody}`}>
                <span className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white" style={{ background: IND }}>
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
          <p className={`mt-4 text-[12px] ${theme.textSub}`}>Toggle Before / After to compare the screen as tested and as shipped.</p>
        </div>
      </div>
    </div>
  );
}

/** Hero: the real Trace plugin running inside Figma (thesis Figure 2, cleaned), in a macOS Figma window. */
export function TraceHero({ onOpen }) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] [container-type:inline-size]" style={{ background: "radial-gradient(80% 80% at 50% 20%, #ffffff 0%, #f0f0fa 55%, #e2e2f3 100%)", padding: "3.2cqw 2.4cqw" }}>
      <button
        type="button"
        onClick={() => onOpen?.(figmaTrace, "Trace running as a plugin in Figma")}
        className="block w-full text-left cursor-zoom-in rounded-[1.2cqw] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 3cqw 6cqw -2cqw rgba(30,30,90,0.4)" }}
      >
        <div className="flex items-center" style={{ height: "3cqw", background: "#2c2c2c", padding: "0 1.2cqw", gap: "0.7cqw", fontFamily: INTER }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="rounded-full" style={{ width: "0.95cqw", height: "0.95cqw", background: c }} />
          ))}
          <svg viewBox="0 0 38 57" style={{ height: "1.4cqw", marginLeft: "1.6cqw" }} aria-hidden="true">
            <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
            <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
            <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
            <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
            <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
          </svg>
          <span className="rounded-t-[0.5cqw] text-white/90" style={{ fontSize: "1cqw", padding: "0.5cqw 1.2cqw", background: "#383838", marginTop: "0.6cqw" }}>
            Dashboard (Community)
          </span>
          <span className="ml-auto rounded-[0.4cqw] text-white font-semibold" style={{ fontSize: "0.9cqw", padding: "0.35cqw 0.9cqw", background: "#4f5ae8" }}>
            Trace plugin
          </span>
        </div>
        <img src={figmaTrace} alt="Trace running as a plugin panel inside Figma" className="block w-full h-auto" />
      </button>
    </div>
  );
}
