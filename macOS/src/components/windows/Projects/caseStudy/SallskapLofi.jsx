// src/components/windows/Projects/caseStudy/SallskapLofi.jsx
// Early-stage artefacts for Sällskap, drawn in code: a paper sketch board (hand-drawn ink via an
// SVG roughness filter + handwriting font) and greyscale lo-fi wireframes of the core flow.
import { useEffect } from "react";
import { motion } from "framer-motion";

const INK = "#2a2a2e";
const PAPER = "#fbf8f1";
const HAND = '"Caveat", "Bradley Hand", "Comic Sans MS", cursive';
const SANS = 'Inter, -apple-system, "Helvetica Neue", sans-serif';
const FOREST = "#3d6658";

function useHandFont() {
  useEffect(() => {
    const id = "caveat-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* ---------------- sketch board ---------------- */

function Rough({ id }) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
    </filter>
  );
}

/** One sketched screen: a phone outline with scribbled UI, in SVG units (0..200 × 0..380). */
function SketchPhone({ x, y, children, title }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="200" height="380" rx="26" fill="#fff" fillOpacity="0.55" stroke={INK} strokeWidth="2.4" />
      <path d="M78 16 h44" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <text x="18" y="58" fontFamily={HAND} fontSize="26" fontWeight="700" fill={INK}>
        {title}
      </text>
      {children}
    </g>
  );
}

const line = (x1, y1, x2, y2, w = 2) => <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={INK} strokeWidth={w} strokeLinecap="round" />;
const scribble = (x, y, w) => <path d={`M${x} ${y} q ${w / 6} -5 ${w / 3} 0 t ${w / 3} 0 t ${w / 3} 0`} fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />;

function SketchBoard() {
  return (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: PAPER, boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 24px 50px -28px rgba(0,0,0,0.45)" }}>
      {/* dot grid paper */}
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.13) 1px, transparent 1.3px)", backgroundSize: "18px 18px" }} />
      <svg viewBox="0 0 980 520" className="relative block w-full h-auto" role="img" aria-label="Paper sketches of the Sällskap flow">
        <defs>
          <Rough id="rough" />
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10" fill="none" stroke={INK} strokeWidth="1.6" />
          </marker>
        </defs>

        <text x="40" y="58" fontFamily={HAND} fontSize="38" fontWeight="700" fill={INK}>
          Sällskap · first sketches
        </text>
        <path d="M40 70 q 120 8 300 -2" fill="none" stroke={FOREST} strokeWidth="3" strokeLinecap="round" filter="url(#rough)" />

        <g filter="url(#rough)">
          {/* 1. group */}
          <SketchPhone x={40} y={110} title="New group">
            <rect x="18" y="78" width="164" height="34" rx="8" fill="none" stroke={INK} strokeWidth="2" />
            {scribble(28, 96, 80)}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <circle cx="34" cy={148 + i * 44} r="13" fill="none" stroke={INK} strokeWidth="2" />
                {line(56, 144 + i * 44, 140, 144 + i * 44)}
                {line(56, 154 + i * 44, 110, 154 + i * 44, 1.6)}
              </g>
            ))}
            <text x="24" y="300" fontFamily={HAND} fontSize="22" fill={INK}>
              + add friend
            </text>
            <rect x="18" y="318" width="164" height="38" rx="9" fill={INK} fillOpacity="0.85" />
            <text x="62" y="343" fontFamily={HAND} fontSize="21" fill="#fff">
              Invite →
            </text>
          </SketchPhone>

          {/* 2. availability + diet */}
          <SketchPhone x={300} y={110} title="When + diet">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}${c}`} x={18 + c * 56} y={78 + r * 34} width="48" height="26" rx="6" fill={(r === 1 && c > 0) || (r === 2 && c === 1) ? FOREST : "none"} fillOpacity="0.7" stroke={INK} strokeWidth="1.8" />
              ))
            )}
            {line(18, 230, 182, 230, 1.4)}
            {["veg", "no pork", "lactose", "nuts"].map((t, i) => (
              <g key={t}>
                <rect x={18 + (i % 2) * 84} y={246 + Math.floor(i / 2) * 40} width="76" height="30" rx="15" fill="none" stroke={INK} strokeWidth="1.8" />
                <text x={30 + (i % 2) * 84} y={267 + Math.floor(i / 2) * 40} fontFamily={HAND} fontSize="19" fill={INK}>
                  {t}
                </text>
              </g>
            ))}
            <path d="M150 360 l10 -12 l10 12 z" fill="none" stroke={INK} strokeWidth="1.8" />
          </SketchPhone>

          {/* 3. shortlist */}
          <SketchPhone x={560} y={110} title="Best matches">
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x="18" y={78 + i * 128} width="164" height="112" rx="10" fill="none" stroke={INK} strokeWidth="2" />
                <path d={`M18 ${140 + i * 128} L70 ${100 + i * 128} L110 ${130 + i * 128} L140 ${110 + i * 128} L182 ${145 + i * 128}`} fill="none" stroke={INK} strokeWidth="1.6" />
                <circle cx="150" cy={96 + i * 128} r="8" fill="none" stroke={INK} strokeWidth="1.6" />
                {line(28, 166 + i * 128, 100, 166 + i * 128)}
                <text x="128" y={172 + i * 128} fontFamily={HAND} fontSize="19" fill={INK}>
                  ★ 4.8
                </text>
              </g>
            ))}
            <rect x="18" y="338" width="164" height="30" rx="8" fill="none" stroke={INK} strokeWidth="2" />
            <text x="74" y="359" fontFamily={HAND} fontSize="20" fill={INK}>
              Book
            </text>
          </SketchPhone>
        </g>

        {/* flow arrows */}
        <g filter="url(#rough)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
          <path d="M246 290 q 24 -26 50 -6" markerEnd="url(#arrow)" />
          <path d="M506 290 q 24 -26 50 -6" markerEnd="url(#arrow)" />
        </g>

        {/* handwritten notes */}
        <g fontFamily={HAND} fill={INK}>
          <g transform="rotate(-4 830 160)">
            <rect x="790" y="120" width="160" height="96" rx="4" fill="#ffe58a" stroke="none" />
            <text x="802" y="150" fontSize="22" fontWeight="700">
              diet = PRIVATE
            </text>
            <text x="802" y="176" fontSize="20">
              nobody should have
            </text>
            <text x="802" y="198" fontSize="20">
              to explain in chat!
            </text>
          </g>
          <g transform="rotate(3 860 330)">
            <rect x="790" y="280" width="164" height="92" rx="4" fill="#cfe8dc" stroke="none" />
            <text x="802" y="310" fontSize="22" fontWeight="700">
              overlap → best time
            </text>
            <text x="802" y="336" fontSize="20">
              app computes it,
            </text>
            <text x="802" y="358" fontSize="20">
              not the organizer
            </text>
          </g>
          <text x="800" y="438" fontSize="23" transform="rotate(-3 800 438)">
            only 3–5 picks?
          </text>
          <path d="M796 430 q -28 -2 -36 -22" fill="none" stroke={INK} strokeWidth="2" markerEnd="url(#arrow)" filter="url(#rough)" />
          <text x="300" y="512" fontSize="21" fillOpacity="0.75">
            v1: solo + groups → too broad. focus on groups ✓
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ---------------- lo-fi wireframes ---------------- */

const G1 = "#e7e7ea";
const G2 = "#cfcfd4";
const G3 = "#a9a9b0";

function Bar({ w = "100%", h = 8, c = G2, className = "" }) {
  return <div className={`rounded-full ${className}`} style={{ width: w, height: h, background: c }} />;
}

function Wire({ n, title, note, children }) {
  return (
    <motion.figure
      className="min-w-0"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay: n * 0.06, duration: 0.45 }}
    >
      <div className="rounded-[12px] overflow-hidden bg-white" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 16px 34px -22px rgba(0,0,0,0.4)" }}>
        <div className="h-6 px-2.5 flex items-center gap-1 border-b" style={{ borderColor: G1, background: "#f6f6f7" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full" style={{ background: G2 }} />
          ))}
          <span className="ml-auto mr-auto w-[45%] h-3 rounded" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${G1}` }} />
        </div>
        <div className="h-7 px-3 flex items-center justify-between border-b" style={{ borderColor: G1 }}>
          <Bar w={46} h={6} c={G3} />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: G2 }} />
            ))}
          </div>
        </div>
        <div className="px-[10%] pt-5 pb-6" style={{ fontFamily: SANS }}>
          <Bar w={32} h={5} c={G2} />
          <div className="mt-2 text-[11px] font-bold tracking-tight" style={{ color: "#3a3a40" }}>
            {title}
          </div>
          <Bar w="70%" h={5} c={G1} className="mt-1.5" />
          <div className="mt-3">{children}</div>
        </div>
      </div>
      <figcaption className="mt-3 flex gap-2.5">
        <span className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: FOREST }}>
          {n}
        </span>
        <span className="text-[13px] leading-snug opacity-70">{note}</span>
      </figcaption>
    </motion.figure>
  );
}

const Btn = ({ dark = true, w = "100%" }) => <div className="h-[18px] rounded-[4px]" style={{ width: w, background: dark ? "#55555c" : "transparent", boxShadow: dark ? undefined : `inset 0 0 0 1.5px ${G2}` }} />;

function Wireframes() {
  return (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-x-6 gap-y-8">
      <Wire n={1} title="Create a group" note="Name the occasion and add friends. One shareable link instead of a group chat.">
        <div className="h-[18px] rounded-[4px]" style={{ boxShadow: `inset 0 0 0 1.5px ${G2}` }} />
        <div className="mt-2.5 space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ background: G1 }} />
              <Bar w={`${50 - i * 8}%`} h={5} />
              <span className="ml-auto w-8 h-3 rounded" style={{ background: G1 }} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Btn />
        </div>
      </Wire>

      <Wire n={2} title="Your availability" note="Tap the times you’re free. Overlaps are computed for the whole group.">
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-[16px] rounded-[3px]" style={[3, 4, 7].includes(i) ? { background: "#6b6b73" } : { boxShadow: `inset 0 0 0 1.5px ${G2}` }} />
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Btn dark={false} w="30%" />
          <Btn w="70%" />
        </div>
      </Wire>

      <Wire n={3} title="Dietary needs (private)" note="Each person picks restrictions on their own. Only the system sees them.">
        <div className="flex flex-wrap gap-1.5">
          {[38, 52, 44, 34, 48, 40, 30].map((w, i) => (
            <span key={i} className="h-[15px] rounded-full" style={{ width: w, ...(i === 1 || i === 4 ? { background: "#6b6b73" } : { boxShadow: `inset 0 0 0 1.5px ${G2}` }) }} />
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: G2 }} />
          <Bar w="55%" h={5} c={G1} />
        </div>
        <div className="mt-3">
          <Btn />
        </div>
      </Wire>

      <Wire n={4} title="Best matches" note="A short list that already fits everyone, with match tags and ratings.">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-10 h-3.5 rounded" style={{ boxShadow: `inset 0 0 0 1.5px ${G2}` }} />
          <span className="w-12 h-3.5 rounded-full" style={{ background: G1 }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-[4px] p-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${G1}` }}>
              <div className="relative h-8 rounded-[3px] overflow-hidden" style={{ background: G1 }}>
                <svg viewBox="0 0 40 20" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <path d="M0 0 L40 20 M40 0 L0 20" stroke={G2} strokeWidth="0.8" />
                </svg>
              </div>
              <Bar w="70%" h={4} className="mt-1.5" />
              <div className="mt-1.5 h-[11px] rounded-[3px]" style={{ background: "#6b6b73" }} />
            </div>
          ))}
        </div>
      </Wire>
    </div>
  );
}

export default function SallskapLofi({ theme }) {
  useHandFont();
  return (
    <div>
      <SketchBoard />
      <p className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: FOREST }} />
        Paper sketches: exploring the three moments that matter and where the friction hides.
      </p>
      <div className={`mt-12 ${theme.textMain}`}>
        <Wireframes />
      </div>
    </div>
  );
}
