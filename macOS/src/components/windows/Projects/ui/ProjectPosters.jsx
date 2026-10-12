// src/components/windows/Projects/ui/ProjectPosters.jsx
// Each project's cover as a poster in that product's own identity: its typeface, palette and UI details.
//   Sällskap      → Public Sans, warm stone + forest, square corners (their 0-radius system)
//   Trivia Master → chunky display wordmark + Poppins, periwinkle with floating shapes
//   Kallos        → Poppins, white + orange, radar chart
//   Trace         → Inter, lavender + indigo, the six-stage nav
// Sizes are in container units (cqw) so a poster scales from small cards to the hero.
import { useEffect, useRef, useState } from "react";
import elinImg from "../../../../imgs/case-study/sallskap/poster/elin_full.png";
import diningImg from "../../../../imgs/case-study/sallskap/Dining_Restaurant.png";
import kallosDash from "../../../../imgs/case-study/kallos/Dashboard.png";
import kallosScore from "../../../../imgs/case-study/kallos/poster/score.png";
import kallosRadar from "../../../../imgs/case-study/kallos/poster/radar.png";
import triviaChallenge from "../../../../imgs/case-study/trivia/screens/TriviaChallenge.jpg";
import traceScreen from "../../../../imgs/case-study/trace/screen_trace.png";
import { TracePanel } from "../caseStudy/TracePanels";

const FONTS = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&family=Luckiest+Guy&family=Rammetto+One&family=Alegreya+Sans:wght@400;500;700;800&family=Inter:wght@400;500;600;700;800&display=swap";

export function usePosterFonts() {
  useEffect(() => {
    const id = "poster-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = FONTS;
    document.head.appendChild(l);
  }, []);
}

const hover = "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
const fs = (cqw, min) => ({ fontSize: `max(${min}px, ${cqw}cqw)` });

/** Small Safari window used to drop the real web app into a poster. */
function MiniBrowser({ src, url, className = "", style }) {
  return (
    <div className={`absolute rounded-[1cqw] overflow-hidden bg-white ${className}`} style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15), 0 3cqw 6cqw -1.5cqw rgba(0,0,0,0.4)", ...style }}>
      <div className="flex items-center gap-[0.5cqw] px-[1cqw] bg-[#f1f1f3]" style={{ height: "2.4cqw" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="rounded-full" style={{ width: "0.8cqw", height: "0.8cqw", background: c }} />
        ))}
        <span className="ml-[2cqw] px-[1.2cqw] rounded-[0.4cqw] bg-white text-black/45 truncate" style={{ fontSize: "1cqw", lineHeight: "1.6cqw" }}>
          {url}
        </span>
      </div>
      <img src={src} alt="" draggable={false} loading="lazy" className="block w-full h-auto" />
    </div>
  );
}

/* ---------------- Sällskap: one hero visual, persona-sheet style ---------------- */
const RAMMETTO = '"Rammetto One", "Archivo Black", system-ui, sans-serif';
const ALEGREYA = '"Alegreya Sans", "Public Sans", system-ui, sans-serif';
function SallskapPoster() {
  const FOREST = "#1f4a3d";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#f4f1ea", fontFamily: ALEGREYA }}>
      {/* soft forest glow behind the app */}
      <span className="absolute rounded-full" style={{ width: "60cqw", height: "60cqw", right: "-14cqw", top: "-8cqw", background: "radial-gradient(circle, rgba(61,102,88,0.18), transparent 65%)" }} />

      <div className="absolute left-[6cqw] top-1/2 -translate-y-1/2 z-[3]">
        <div className="font-bold tracking-[0.32em]" style={{ color: FOREST, ...fs(1.25, 8) }}>
          SÄLLSKAP
        </div>
        <div className="mt-[1.8cqw] leading-[1.02]" style={{ fontFamily: RAMMETTO, color: FOREST, fontSize: "5.4cqw" }}>
          Dining,
          <br />
          coordinated.
        </div>
        <div className="mt-[1.6cqw] text-[#4a4a4a]" style={fs(1.7, 10)}>
          Group dinners, minus the group chat.
        </div>
      </div>

      {/* the app */}
      <MiniBrowser
        src={diningImg}
        url="sallskap.vercel.app"
        className={`z-[1] ${hover} [transform:rotate(-3deg)] group-hover:[transform:rotate(-1deg)_translateY(-2%)]`}
        style={{ right: "-8cqw", top: "11cqw", width: "50cqw" }}
      />



      {/* Elin in front */}
      <img
        src={elinImg}
        alt=""
        draggable={false}
        loading="lazy"
        className={`absolute z-[2] ${hover} group-hover:-translate-y-[1cqw]`}
        style={{ left: "50cqw", bottom: "-2cqw", height: "74%", width: "auto", filter: "drop-shadow(0 1.5cqw 2cqw rgba(0,0,0,0.15))" }}
      />

      {/* one bubble */}
      <span
        className={`absolute z-[3] rounded-[1.8cqw] rounded-bl-[0.4cqw] font-bold text-white whitespace-nowrap ${hover} group-hover:-translate-y-[0.6cqw]`}
        style={{ left: "63cqw", top: "6cqw", background: "#8b3cf0", padding: "1cqw 1.8cqw", rotate: "-3deg", boxShadow: "0 1.4cqw 3cqw -1cqw rgba(60,20,120,0.4)", ...fs(1.45, 9) }}
      >
        When is everyone free?
      </span>
    </div>
  );
}

/* ---------------- Trivia Master ---------------- */
const POP = 'Poppins, system-ui, sans-serif';
const LUCKY = '"Luckiest Guy", "Lilita One", Impact, sans-serif';
function TriviaPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#7a7cf0", fontFamily: POP }}>
      {/* floating shapes, like the app background */}
      <span className={`absolute rounded-full bg-white/20 ${hover} group-hover:scale-110`} style={{ width: "16cqw", height: "16cqw", right: "30cqw", top: "-5cqw" }} />
      <span className="absolute rounded-full bg-white/15" style={{ width: "6cqw", height: "6cqw", left: "40cqw", bottom: "4cqw" }} />
      <svg className={`absolute ${hover} group-hover:rotate-6`} style={{ left: "-4cqw", bottom: "-6cqw", width: "22cqw" }} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M10 90 L50 10 L90 90 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinejoin="round" />
      </svg>
      <svg className="absolute" style={{ right: "2cqw", bottom: "6cqw", width: "9cqw" }} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M15 80 L50 15 L85 80 Z" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.16)" strokeWidth="10" strokeLinejoin="round" transform="rotate(20 50 50)" />
      </svg>

      <div className="absolute left-[6cqw] top-1/2 -translate-y-1/2 w-[52cqw] z-[2]">
        <div className="text-white leading-[0.88] -rotate-[3deg] origin-left" style={{ fontFamily: LUCKY, fontSize: "9.4cqw", textShadow: "0 0.5cqw 0 #5557d6" }}>
          TRIVIA
          <br />
          MASTER
        </div>
        <div className="mt-[2.6cqw] font-semibold text-white/90" style={fs(1.9, 11)}>
          Quick rounds. Real rivals.
        </div>
        <div className={`mt-[2cqw] inline-block rounded-full bg-white px-[3cqw] py-[1.1cqw] font-bold text-[#6466e9] ${hover} group-hover:-translate-y-[0.3cqw]`} style={{ ...fs(1.6, 10), boxShadow: "0 0.6cqw 0 #5557d6" }}>
          Start playing
        </div>
      </div>

      {/* phone */}
      <div className={`absolute ${hover} [transform:rotate(7deg)] group-hover:[transform:rotate(3deg)_translateY(-2%)]`} style={{ right: "9cqw", top: "7cqw", width: "21cqw" }}>
        <div className="bg-[#111] rounded-[3.2cqw] p-[0.7cqw]" style={{ boxShadow: "0 3cqw 6cqw -1.5cqw rgba(30,20,90,0.55)" }}>
          <div className="overflow-hidden rounded-[2.6cqw] aspect-[1520/3290]">
            <img src={triviaChallenge} alt="" draggable={false} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className={`absolute z-[3] rounded-[2cqw] bg-white px-[1.6cqw] py-[1.1cqw] ${hover} group-hover:-translate-y-[0.6cqw]`} style={{ right: "26cqw", top: "34cqw", boxShadow: "0 0.5cqw 0 #c9caf7, 0 2cqw 4cqw -1cqw rgba(30,20,90,0.4)" }}>
        <div className="font-extrabold leading-none text-[#6466e9]" style={{ fontSize: "3.2cqw" }}>
          73
        </div>
        <div className="font-medium text-black/50" style={fs(1.1, 7)}>
          top score
        </div>
      </div>
    </div>
  );
}

/* ---------------- Kallos ---------------- */
function Radar() {
  const axes = 5;
  const pt = (i, r) => {
    const a = (-90 + (360 / axes) * i) * (Math.PI / 180);
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  };
  const ring = (r) => Array.from({ length: axes }, (_, i) => pt(i, r).join(",")).join(" ");
  const vals = [0.82, 0.58, 0.9, 0.62, 0.36];
  const shape = vals.map((v, i) => pt(i, v * 42).join(",")).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" aria-hidden="true">
      {[42, 31.5, 21, 10.5].map((r) => (
        <polygon key={r} points={ring(r)} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: axes }, (_, i) => (
        <line key={i} x1="50" y1="50" x2={pt(i, 42)[0]} y2={pt(i, 42)[1]} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      ))}
      <polygon points={shape} fill="rgba(240,122,58,0.28)" stroke="#f07a3a" strokeWidth="1.1" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const [x, y] = pt(i, v * 42);
        return <circle key={i} cx={x} cy={y} r="1.4" fill="#fff" stroke="#f07a3a" strokeWidth="0.9" />;
      })}
    </svg>
  );
}
function KallosPoster() {
  const OR = "#f07837", GR = "#474747";
  const card = { background: "#fff", borderRadius: "1.6cqw", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 1.6cqw 3.2cqw -1.6cqw rgba(0,0,0,0.18)" };
  const lbl = (t) => (
    <div className="font-semibold uppercase tracking-[0.14em] text-black/40" style={fs(0.95, 6.5)}>
      {t}
    </div>
  );
  const radar = (vals, r = 40) =>
    vals.map((v, i) => { const t = (-90 + 72 * i) * Math.PI / 180; return `${50 + Math.cos(t) * r * v},${50 + Math.sin(t) * r * v}`; }).join(" ");
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#f3f3f5", fontFamily: POP, color: GR }}>
      <div className="absolute inset-[3cqw] grid gap-[1.4cqw]" style={{ gridTemplateColumns: "1.15fr 1fr 1fr", gridTemplateRows: "minmax(0,1fr) minmax(0,1fr)" }}>
        {/* brand tile */}
        <div className={`row-span-2 relative overflow-hidden flex flex-col justify-between ${hover} group-hover:-translate-y-[0.5cqw]`} style={{ ...card, background: GR, color: "#fff", padding: "2cqw" }}>
          <div className="flex items-center gap-[0.8cqw] font-semibold" style={fs(1.4, 9)}>
            <span className="w-[1.8cqw] h-[1.8cqw] rounded-full" style={{ background: OR }} />
            Kallos
          </div>
          <div>
            <div className="font-bold tracking-[-0.03em] leading-[1.02]" style={{ fontSize: "3.6cqw" }}>
              Employer
              <br />
              branding,
              <br />
              <span style={{ color: OR }}>as a product.</span>
            </div>
            <div className="mt-[1.4cqw] text-white/65 leading-snug" style={fs(1.35, 8.5)}>
              AI analysis · dashboards · advice
            </div>
          </div>
          <svg className="absolute -right-[4cqw] -top-[4cqw] w-[20cqw] opacity-20" viewBox="0 0 100 100" aria-hidden="true">
            {[1, 0.7, 0.4].map((v) => (
              <polygon key={v} points={radar([v, v, v, v, v], 46)} fill="none" stroke="#fff" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* the platform, as a laptop mockup */}
        <div className="col-span-2 row-span-2 relative overflow-hidden flex items-center justify-center" style={{ borderRadius: "1.6cqw", background: "linear-gradient(180deg,#ffffff 0%,#eeedeb 100%)", boxShadow: "0 0 0 1px rgba(0,0,0,0.05)" }}>
          <div className={`w-[86%] ${hover} group-hover:-translate-y-[0.6cqw]`}>
            <div className="mx-[6%] rounded-t-[1.4cqw] bg-[#0c0c0e] p-[1.2%] pb-[1.8%]" style={{ boxShadow: "inset 0 0 0 1px #2b2b2f" }}>
              <img src={kallosDash} alt="" draggable={false} className="block w-full h-auto rounded-[0.3cqw]" />
            </div>
            <div className="relative h-[1.4cqw] rounded-b-[1.2cqw]" style={{ background: "linear-gradient(180deg,#e9eaec,#a5a7ac)", boxShadow: "0 2cqw 3cqw -1.4cqw rgba(0,0,0,0.4)" }}>
              <span className="absolute left-1/2 -translate-x-1/2 top-0 w-[15%] h-[45%] rounded-b-[0.6cqw] bg-[#b4b6ba]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GRAIN_P =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function RadarWhite() {
  const axes = 5;
  const pt = (i, r) => {
    const a = (-90 + (360 / axes) * i) * (Math.PI / 180);
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  };
  const ring = (r) => Array.from({ length: axes }, (_, i) => pt(i, r).join(",")).join(" ");
  const vals = [0.82, 0.58, 0.9, 0.62, 0.36];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" aria-hidden="true">
      {[42, 31.5, 21, 10.5].map((r) => (
        <polygon key={r} points={ring(r)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
      ))}
      <polygon points={vals.map((v, i) => pt(i, v * 42).join(",")).join(" ")} fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const [x, y] = pt(i, v * 42);
        return <circle key={i} cx={x} cy={y} r="1.5" fill="#ee7432" stroke="#fff" strokeWidth="0.9" />;
      })}
    </svg>
  );
}

/* ---------------- Trace ---------------- */
const INTER = 'Inter, system-ui, sans-serif';
const STAGES = ["Intent", "Context", "Options", "Critique", "Improve", "Trace"];
function FitPanel({ screen, style, className = "" }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={`absolute ${className}`} style={style}>
      {w > 0 && <TracePanel screen={screen} width={w} />}
    </div>
  );
}

/** Notion-style robot: thick even black strokes, white fills, dot eyes, minimal shapes. */
function AICritic({ className = "", style }) {
  const K = "#111";
  const st = { stroke: K, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 240 300" className={className} style={style} aria-hidden="true">
      <ellipse cx="112" cy="278" rx="56" ry="7" fill="#000" opacity="0.08" />
      {/* antenna */}
      <path d="M112 44 Q108 28 120 20" {...st} fill="none" />
      <circle cx="122" cy="17" r="6" fill={K} />
      {/* head: big rounded square */}
      <rect x="56" y="44" width="112" height="96" rx="34" fill="#f4f4f4" {...st} />
      <path d="M66 112 Q70 132 92 136 L134 136 Q158 134 162 112 L162 120 Q160 138 138 139 H88 Q62 138 60 116 Z" fill="#d9d9d9" />
      <rect x="74" y="66" width="76" height="52" rx="22" fill="#fff" stroke={K} strokeWidth="4" />
      {/* dot eyes + small smile, Notion faces */}
      <circle cx="94" cy="92" r="6" fill={K} />
      <circle cx="132" cy="92" r="6" fill={K} />
      <path d="M104 112 Q113 119 122 112" {...st} strokeWidth="5" fill="none" />
      {/* simple ear bolts */}
      <rect x="40" y="82" width="16" height="20" rx="6" fill="#bdbdbd" {...st} strokeWidth="5" />
      <rect x="168" y="82" width="16" height="20" rx="6" fill="#bdbdbd" {...st} strokeWidth="5" />
      {/* body */}
      <path d="M78 150 H146 Q154 150 154 160 L158 222 Q158 234 146 234 H78 Q66 234 66 222 L70 160 Q70 150 78 150 Z" fill="#e6e6e6" {...st} />
      <path d="M71 196 L157 196 L158 222 Q158 231 146 231 H78 Q69 231 69 222 Z" fill="#c9c9c9" />
      <path d="M100 140 V150 M124 140 V150" {...st} />
      {/* single black chest square, a Notion-like solid accent */}
      <rect x="98" y="166" width="28" height="24" rx="6" fill={K} />
      {/* legs */}
      <path d="M92 234 V272 H80" {...st} fill="none" />
      <path d="M132 234 V272 H144" {...st} fill="none" />
      {/* arm on hip */}
      <path d="M70 168 Q44 182 64 204" {...st} fill="none" />
      {/* arm raising a magnifier */}
      <path d="M154 168 Q182 156 186 122" {...st} fill="none" />
      <path d="M188 116 L198 98" {...st} />
      <circle cx="208" cy="80" r="20" fill="#ededed" {...st} />
      <path d="M200 72 q6 -6 14 -4" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* motion ticks */}
      <path d="M30 56 L40 64 M24 78 H36" {...st} strokeWidth="4" fill="none" />
    </svg>
  );
}

function TracePoster() {
  const I = "#4f5ae8", INK = "#1d1f5a";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#f3f2fb", fontFamily: INTER }}>
      {/* soft indigo glow behind the plugin */}
      <span className="absolute rounded-full" style={{ width: "60cqw", height: "60cqw", right: "-14cqw", top: "-8cqw", background: "radial-gradient(circle, rgba(79,90,232,0.18), transparent 65%)" }} />

      <div className="absolute left-[5cqw] top-1/2 -translate-y-1/2 z-[3] w-[42cqw]">
        <div className="font-bold tracking-[0.32em]" style={{ color: I, ...fs(1.6, 10) }}>
          TRACE
        </div>
        <div className="mt-[1.8cqw] font-black tracking-[-0.05em] leading-[0.98] whitespace-nowrap" style={{ color: INK, fontSize: "6.2cqw" }}>
          Think with AI,
          <br />
          not for it.
        </div>
        <div className="mt-[1.8cqw] text-[#4a4a66] max-w-[34cqw]" style={fs(2.1, 12)}>
          An AI co-pilot that keeps designers in charge.
        </div>
      </div>

      {/* the plugin */}
      <FitPanel screen="Critique" className={`z-[1] ${hover} [transform:rotate(-3deg)] group-hover:[transform:rotate(-1deg)_translateY(-2%)]`} style={{ right: "2cqw", top: "9cqw", width: "32cqw" }} />

      {/* Figma connection */}
      <div className={`absolute z-[3] ${hover} group-hover:-translate-y-[0.8cqw]`} style={{ left: "47cqw", top: "47cqw" }}>
        {/* selected frame with Figma handles */}
        <div className="relative bg-white" style={{ width: "13cqw", height: "9cqw", borderRadius: "0.6cqw", boxShadow: "0 1.4cqw 3cqw -1.2cqw rgba(30,30,90,0.35)" }}>
          <div style={{ padding: "1cqw" }}>
            <span className="block rounded-full" style={{ width: "55%", height: "0.8cqw", background: "#d9dbf6" }} />
            <span className="block rounded-full mt-[0.6cqw]" style={{ width: "80%", height: "0.6cqw", background: "#eceefb" }} />
            <span className="block rounded-[0.4cqw] mt-[1.2cqw]" style={{ width: "50%", height: "1.6cqw", background: "#a7e3bd" }} />
          </div>
          <div className="absolute inset-[-0.3cqw]" style={{ border: "2px solid #0d99ff", borderRadius: "0.6cqw" }} />
          {[["-0.7cqw", "-0.7cqw"], ["-0.7cqw", "auto"], ["auto", "-0.7cqw"], ["auto", "auto"]].map(([t, l], k) => (
            <span key={k} className="absolute bg-white" style={{ width: "1cqw", height: "1cqw", border: "2px solid #0d99ff", top: k < 2 ? "-0.7cqw" : "auto", bottom: k >= 2 ? "-0.7cqw" : "auto", left: k % 2 === 0 ? "-0.7cqw" : "auto", right: k % 2 === 1 ? "-0.7cqw" : "auto" }} />
          ))}
          <span className="absolute font-semibold text-white" style={{ top: "-2.6cqw", left: "-0.4cqw", fontSize: "max(7px,0.95cqw)", background: "#0d99ff", padding: "0.15cqw 0.6cqw", borderRadius: "0.3cqw" }}>
            Onboarding
          </span>
          {/* cursor */}
          <svg viewBox="0 0 24 24" className="absolute" style={{ right: "-2.4cqw", bottom: "-2.6cqw", width: "2.4cqw" }} aria-hidden="true">
            <path d="M4 3l15 7-6.5 2L10 19z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        {/* figma tile + connector */}
        <div className="absolute flex items-center" style={{ left: "-1cqw", top: "12.5cqw", gap: "0.8cqw" }}>
          <span className="flex items-center justify-center bg-[#1e1e1e]" style={{ width: "4cqw", height: "4cqw", borderRadius: "1cqw", boxShadow: "0 1cqw 2cqw -1cqw rgba(0,0,0,0.4)" }}>
            <svg viewBox="0 0 38 57" style={{ height: "2.2cqw" }} aria-hidden="true">
              <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
              <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
              <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
              <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
              <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
            </svg>
          </span>
          <span style={{ width: "4.5cqw", borderTop: "2px dashed rgba(79,90,232,0.5)" }} />
          <span className="inline-flex items-center bg-white font-semibold whitespace-nowrap" style={{ gap: "0.5cqw", padding: "0.6cqw 1.1cqw", borderRadius: "999px", color: "#2b2e7a", fontSize: "max(8px,1.1cqw)", boxShadow: "0 0 0 1px rgba(79,90,232,0.15), 0 1cqw 2cqw -1cqw rgba(30,30,90,0.3)" }}>
            <span className="rounded-full" style={{ width: "0.8cqw", height: "0.8cqw", background: "#22c55e" }} />
            Plugin connected
          </span>
        </div>
      </div>

      {/* one bubble */}
      <span
        className={`absolute z-[3] rounded-[1.8cqw] rounded-bl-[0.4cqw] font-bold text-white whitespace-nowrap ${hover} group-hover:-translate-y-[0.6cqw]`}
        style={{ left: "36cqw", top: "6cqw", background: I, padding: "1cqw 1.8cqw", rotate: "-3deg", boxShadow: "0 1.4cqw 3cqw -1cqw rgba(40,40,140,0.45)", ...fs(1.45, 9) }}
      >
        Here’s my reasoning. You decide.
      </span>
    </div>
  );
}

export const POSTERS = {
  restaurantCoordination: SallskapPoster,
  kthTriviaApp: TriviaPoster,
  employerBranding: KallosPoster,
  thesis: TracePoster,
};

export const POSTER_BG = {
  restaurantCoordination: "#f7f6f2",
  kthTriviaApp: "#7a7cf0",
  employerBranding: "#ee7432",
  thesis: "linear-gradient(140deg, #f3f2ff, #d9d8ff)",
};
