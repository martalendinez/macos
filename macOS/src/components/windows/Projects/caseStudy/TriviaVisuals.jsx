// src/components/windows/Projects/caseStudy/TriviaVisuals.jsx
// Trivia Master case-study visuals:
//   Iphone          – a detailed device mockup (titanium edge, Dynamic Island, side buttons, glass sheen)
//   TriviaBlueprint – early sketches as a blueprint (chalk lines on cyan grid), distinct from Sällskap's ink-on-paper
//   LofiToHifi      – each real wireframe next to the screen it became
//   TriviaSystem    – the Trivia Master design system as a playful, live bento board
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import lofiRanking from "../../../../imgs/case-study/trivia/lofi/ranking.png";
import lofiHome from "../../../../imgs/case-study/trivia/lofi/home.png";
import lofiChallenge from "../../../../imgs/case-study/trivia/lofi/challenge.png";
import hiRanking from "../../../../imgs/case-study/trivia/screens/TriviaRanking.jpg";
import hiHome from "../../../../imgs/case-study/trivia/screens/Categories.jpg";
import hiChallenge from "../../../../imgs/case-study/trivia/screens/TriviaChallenge.jpg";
import hiLogin from "../../../../imgs/case-study/trivia/screens/Onboarding.jpg";
import hiProfile from "../../../../imgs/case-study/trivia/screens/TriviaProfile.jpg";

const C = {
  primary: "#8078ed",
  soft: "#dcdafb",
  yellow: "#ffd333",
  success: "#22c35d",
  warning: "#fa8d2e",
  danger: "#ec5151",
  info: "#25aff4",
  ink: "#1d1d30",
};
const POP = "Poppins, system-ui, sans-serif";
const DISPLAY = '"Luckiest Guy", "Lilita One", Impact, sans-serif';

function useFonts() {
  useEffect(() => {
    const id = "trivia-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Poppins:wght@400;500;600;700;800&family=Architects+Daughter&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* ---------------- device ---------------- */
// Reads the screenshot's top-left pixel so the status bar matches the app's own background.
function useTopColor(src) {
  const [c, setC] = useState(null);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      try {
        const cv = document.createElement("canvas");
        cv.width = 4;
        cv.height = 4;
        const x = cv.getContext("2d");
        x.drawImage(img, 0, 0, img.width, img.height * 0.02, 0, 0, 4, 4);
        const d = x.getImageData(1, 1, 1, 1).data;
        if (alive) setC([d[0], d[1], d[2]]);
      } catch {
        /* ignore */
      }
    };
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  return c;
}

function StatusBar({ rgb }) {
  const bg = rgb ? `rgb(${rgb.join(",")})` : "#fff";
  const dark = rgb ? rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 < 150 : false;
  const fg = dark ? "#fff" : "#111";
  return (
    <div className="relative flex items-center justify-between px-[8%] shrink-0" style={{ background: bg, color: fg, height: "6.2%", fontFamily: "-apple-system, SF Pro Text, Inter, sans-serif" }}>
      <span className="font-semibold" style={{ fontSize: "clamp(7px, 3.4cqw, 13px)" }}>
        9:41
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 top-[22%] h-[64%] w-[31%] rounded-full bg-black" />
      <span className="flex items-center gap-[3%]" aria-hidden="true">
        <svg viewBox="0 0 18 12" style={{ width: "clamp(8px, 4.2cqw, 16px)" }} fill={fg}>
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 26 12" style={{ width: "clamp(12px, 6.4cqw, 24px)" }} fill="none" stroke={fg}>
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" opacity="0.45" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill={fg} stroke="none" />
          <path d="M24.5 4 v4" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

/** iPhone 15 Pro–style mockup: titanium rim, black bezel, real status bar with Dynamic Island, home indicator. */
export function Iphone({ src, alt, onOpen, className = "", width = 230, children, interactive = true }) {
  const rgb = useTopColor(src);
  const Tag = interactive ? "button" : "div";
  return (
    <Tag
      {...(interactive ? { type: "button", onClick: () => onOpen?.(src, alt), title: "Click to enlarge" } : {})}
      className={`group relative block mx-auto [container-type:inline-size] ${interactive ? "cursor-zoom-in transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1" : ""} ${className}`}
      style={{ width: "100%", maxWidth: width }}
    >
      {/* side buttons */}
      <span className="absolute -left-[1.6%] top-[16%] w-[1.8%] h-[4%] rounded-l-sm" style={{ background: "linear-gradient(90deg,#8d8a85,#c9c6bf)" }} />
      <span className="absolute -left-[1.6%] top-[23%] w-[1.8%] h-[8%] rounded-l-sm" style={{ background: "linear-gradient(90deg,#8d8a85,#c9c6bf)" }} />
      <span className="absolute -left-[1.6%] top-[33%] w-[1.8%] h-[8%] rounded-l-sm" style={{ background: "linear-gradient(90deg,#8d8a85,#c9c6bf)" }} />
      <span className="absolute -right-[1.6%] top-[26%] w-[1.8%] h-[12%] rounded-r-sm" style={{ background: "linear-gradient(270deg,#8d8a85,#c9c6bf)" }} />
      {/* titanium rim */}
      <div
        className="relative rounded-[16%/7.6%] p-[1.6%]"
        style={{
          background: "linear-gradient(145deg,#d9d6cf 0%,#a8a59e 22%,#ece9e2 48%,#99968f 74%,#cfccc5 100%)",
          boxShadow: "0 40px 60px -30px rgba(20,20,50,0.55), 0 16px 26px -14px rgba(0,0,0,0.35)",
        }}
      >
        {/* black bezel */}
        <div className="rounded-[14.6%/6.9%] bg-black p-[3%]">
          <div className="relative overflow-hidden rounded-[11.8%/5.5%] bg-white flex flex-col aspect-[1520/3530]">
            <StatusBar rgb={rgb} />
            <div className="relative flex-1 min-h-0">
              {children ?? <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />}
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[1%] w-[34%] h-[0.55%] rounded-full bg-black/80 z-[3]" />
            <span className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 30%)" }} />
          </div>
        </div>
      </div>
    </Tag>
  );
}

/* ---------------- blueprint sketches ---------------- */
const BP = "#1f4fd1";
const CHALK = "rgba(255,255,255,0.92)";
const ARCH = '"Architects Daughter", "Bradley Hand", cursive';

function BPPhone({ x, y, label, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="180" height="340" rx="24" fill="none" stroke={CHALK} strokeWidth="2.2" />
      <rect x="66" y="12" width="48" height="10" rx="5" fill="none" stroke={CHALK} strokeWidth="1.6" />
      <text x="0" y="372" fontFamily={ARCH} fontSize="17" fill={CHALK} opacity="0.85">
        {label}
      </text>
      {children}
    </g>
  );
}
const W = (props) => <rect fill="none" stroke={CHALK} strokeWidth="1.8" {...props} />;
const L = ({ x1, y1, x2, y2, o = 1 }) => <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={CHALK} strokeWidth="1.8" strokeLinecap="round" opacity={o} />;
const T = ({ x, y, s = 18, children, o = 1 }) => (
  <text x={x} y={y} fontFamily={ARCH} fontSize={s} fill={CHALK} opacity={o}>
    {children}
  </text>
);

export function TriviaBlueprint({ theme }) {
  useFonts();
  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-[18px]"
        style={{
          background: `${BP}`,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
          boxShadow: "0 24px 50px -28px rgba(10,30,120,0.7)",
        }}
      >
        <svg viewBox="0 0 1000 590" className="relative block w-full h-auto" role="img" aria-label="Blueprint sketches of the Trivia Master flow">
          <defs>
            <filter id="chalk">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" />
              <feDisplacementMap in="SourceGraphic" scale="2.4" />
            </filter>
            <marker id="bp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0 0 L10 5 L0 10" fill="none" stroke={CHALK} strokeWidth="1.6" />
            </marker>
          </defs>

          {/* title block, like an engineering drawing */}
          <g fontFamily={ARCH} fill={CHALK}>
            <rect x="740" y="520" width="230" height="52" fill="none" stroke={CHALK} strokeWidth="1.4" opacity="0.7" />
            <line x1="740" y1="546" x2="970" y2="546" stroke={CHALK} strokeWidth="1" opacity="0.6" />
            <text x="752" y="539" fontSize="15">PROJECT · TRIVIA MASTER</text>
            <text x="752" y="564" fontSize="13" opacity="0.8">SHEET 01 · CORE GAME LOOP</text>
          </g>
          <T x={36} y={52} s={30}>
            Core game loop
          </T>
          <T x={36} y={78} s={16} o={0.7}>
            get in → pick → play → compare
          </T>

          <g filter="url(#chalk)">
            <BPPhone x={36} y={110} label="01 · login">
              <T x={26} y={92} s={24}>
                TRIVIA!
              </T>
              <W x="18" y="128" width="144" height="28" rx="14" />
              <W x="18" y="166" width="144" height="28" rx="14" />
              <W x="18" y="212" width="144" height="32" rx="16" />
              <T x={44} y={233} s={15}>
                start playing
              </T>
              <T x={34} y={278} s={15} o={0.85}>
                guest? →
              </T>
            </BPPhone>

            <BPPhone x={276} y={110} label="02 · home">
              <T x={16} y={54} s={20}>
                hi, John
              </T>
              <W x="14" y="68" width="152" height="70" rx="10" />
              <L x1={28} y1={92} x2={150} y2={92} o={0.7} />
              <W x="28" y="108" width="54" height="16" rx="8" />
              <W x="98" y="108" width="54" height="16" rx="8" />
              {[0, 1, 2].map((r) => [0, 1].map((c) => <W key={`${r}${c}`} x={16 + c * 78} y={156 + r * 38} width="70" height="28" rx="14" />))}
              <W x="44" y="290" width="92" height="28" rx="14" />
            </BPPhone>

            <BPPhone x={516} y={110} label="03 · question">
              <T x={16} y={54} s={20}>
                Q3/10
              </T>
              <T x={118} y={54} s={20}>
                ♥♥♡
              </T>
              <W x="14" y="70" width="152" height="80" rx="10" />
              <L x1={30} y1={98} x2={150} y2={98} />
              <L x1={30} y1={118} x2={124} y2={118} o={0.7} />
              {[0, 1, 2, 3].map((i) => (
                <W key={i} x="22" y={168 + i * 38} width="136" height="26" rx="13" strokeDasharray={i === 2 ? "5 4" : undefined} />
              ))}
            </BPPhone>

            <BPPhone x={756} y={110} label="04 · ranking">
              <T x={16} y={54} s={20}>
                ranking
              </T>
              <W x="14" y="68" width="152" height="60" rx="10" />
              <T x={30} y={108} s={26}>
                2nd
              </T>
              <T x={110} y={108} s={26}>
                73
              </T>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <T x={20} y={166 + i * 34} s={16}>
                    {i + 1}
                  </T>
                  <circle cx="50" cy={160 + i * 34} r="8" fill="none" stroke={CHALK} strokeWidth="1.6" />
                  <L x1={66} y1={160 + i * 34} x2={150} y2={160 + i * 34} o={0.75} />
                </g>
              ))}
            </BPPhone>
          </g>

          <g fill="none" stroke={CHALK} strokeWidth="1.8" strokeLinecap="round" filter="url(#chalk)">
            <path d="M222 280 C 240 262, 254 262, 270 276" markerEnd="url(#bp-arrow)" />
            <path d="M462 280 C 480 262, 494 262, 510 276" markerEnd="url(#bp-arrow)" />
            <path d="M702 280 C 720 262, 734 262, 750 276" markerEnd="url(#bp-arrow)" />
          </g>

          {/* annotations with leader lines */}
          <g fontFamily={ARCH} fill="#ffe27a" stroke="none">
            <text x="380" y="52" fontSize="16">
              ① no sign-up wall
            </text>
            <text x="560" y="76" fontSize="16">
              ② lives = challenge only
            </text>
            <text x="440" y="545" fontSize="16">
              ③ always show progress
            </text>
          </g>
          <g fill="none" stroke="#ffe27a" strokeWidth="1.3" strokeDasharray="4 4">
            <path d="M380 58 L 150 300" />
            <path d="M640 82 L 650 160" />
            <path d="M520 528 L 560 166" />
          </g>
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.primary }} />
        Sketch sheet: the core game loop in four screens, with the three rules that shaped the app.
      </figcaption>
    </figure>
  );
}

/* ---------------- lo-fi → hi-fi (drag to compare) ---------------- */
const PAIRS = [
  { name: "Home", lo: lofiHome, hi: hiHome, note: "Same structure; colour makes selection obvious: yellow = picked." },
  { name: "Challenge", lo: lofiChallenge, hi: hiChallenge, note: "Lives, score and the card stayed put. Answers became big, tappable pills." },
  { name: "Ranking", lo: lofiRanking, hi: hiRanking, note: "Your rank first. The final design highlights your own row." },
];

function CompareScreen({ lo, hi, name, delay }) {
  const [pos, setPos] = useState(100);
  const [touched, setTouched] = useState(false);
  const ref = useRef(null);
  // gentle hint: sweep once when it scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || touched) return;
      io.disconnect();
      const t0 = performance.now() + delay;
      let raf;
      const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / 1600));
        const ease = 0.5 - Math.cos(k * Math.PI * 2) / 2;
        setPos(100 - ease * 62);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay, touched]);

  const move = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="absolute inset-0 touch-none cursor-ew-resize select-none"
      onPointerDown={(e) => {
        setTouched(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
      role="slider"
      aria-label={`${name}: drag to compare wireframe and final design`}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
    >
      <img src={hi} alt={`${name} final`} draggable={false} className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={lo} alt={`${name} wireframe`} draggable={false} className="absolute inset-0 w-full h-full object-cover object-top grayscale bg-white" />
      </div>
      <div className="absolute top-0 bottom-0 w-[2px] bg-white" style={{ left: `${pos}%`, boxShadow: "0 0 0 1px rgba(0,0,0,0.12)" }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.3)]" style={{ color: C.primary }}>
          <svg viewBox="0 0 20 12" className="w-4 h-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 1 L1 6 L6 11 M14 1 L19 6 L14 11" />
          </svg>
        </span>
      </div>
      <span className="absolute left-2 bottom-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white transition-opacity" style={{ opacity: pos > 18 ? 1 : 0 }}>
        Lo-fi
      </span>
      <span className="absolute right-2 bottom-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white transition-opacity" style={{ background: C.primary, opacity: pos < 82 ? 1 : 0 }}>
        Final
      </span>
    </div>
  );
}

export function LofiToHifi({ theme }) {
  return (
    <div>
      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-10 @2xl:gap-6">
        {PAIRS.map((p, i) => (
          <motion.figure key={p.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
            <Iphone src={p.hi} alt={p.name} width={240} interactive={false}>
              <CompareScreen lo={p.lo} hi={p.hi} name={p.name} delay={i * 250} />
            </Iphone>
            <figcaption className="mt-5 text-center">
              <div className={`text-[15px] font-semibold ${theme.textMain}`}>{p.name}</div>
              <div className={`mt-1 text-[13px] leading-snug max-w-[240px] mx-auto ${theme.textSub}`}>{p.note}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <p className={`mt-6 text-center text-[12px] ${theme.textSub}`}>↔ Drag across any phone to wipe between the wireframe and the final app.</p>
    </div>
  );
}

/* ---------------- design system ---------------- */
function Card({ children, className = "", style, i = 0 }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[22px] p-5 @2xl:p-6 ${className}`}
      style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(29,29,48,0.06), 0 16px 36px -24px rgba(60,50,180,0.35)", fontFamily: POP, ...style }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
const Lbl = ({ children, color = "rgba(29,29,48,0.45)" }) => (
  <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
    {children}
  </div>
);
const Chunky = ({ children, bg = C.primary, fg = "#fff", shadow = "#5f57d6", className = "" }) => (
  <span className={`inline-flex items-center justify-center rounded-full font-bold ${className}`} style={{ background: bg, color: fg, boxShadow: `0 4px 0 ${shadow}` }}>
    {children}
  </span>
);

const QUIZ = [
  { q: "Which artist used small dots of colour to create a picture?", tag: "Art", a: ["Georges Seurat", "Paul Cézanne", "Vincent van Gogh"], ok: 0 },
  { q: "Which planet is known as the Red Planet?", tag: "Science", a: ["Venus", "Mars", "Jupiter"], ok: 1 },
  { q: "In which country did the Olympic Games originate?", tag: "Sports", a: ["Italy", "Egypt", "Greece"], ok: 2 },
];

function MiniQuiz() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bump, setBump] = useState(0);
  const done = i >= QUIZ.length || lives === 0;
  const item = QUIZ[Math.min(i, QUIZ.length - 1)];

  function choose(k) {
    if (pick !== null || done) return;
    setPick(k);
    if (k === item.ok) {
      setScore((s) => s + 5);
      setBump((b) => b + 1);
    } else setLives((l) => l - 1);
  }
  function next() {
    setPick(null);
    setI((x) => x + 1);
  }
  function reset() {
    setI(0);
    setPick(null);
    setScore(0);
    setLives(3);
  }
  const state = (k) => {
    if (pick === null) return { background: C.primary, color: "#fff", boxShadow: "0 3px 0 #5f57d6" };
    if (k === item.ok) return { background: C.success, color: "#fff", boxShadow: "0 3px 0 #179a46" };
    if (k === pick) return { background: C.danger, color: "#fff", boxShadow: "0 3px 0 #c43c3c" };
    return { background: "#c9c6f7", color: "#fff", boxShadow: "0 3px 0 #b2aef0" };
  };

  return (
    <div className="mt-4 grid grid-cols-1 @2xl:grid-cols-[1.25fr_1fr] gap-4 items-center">
      <div className="relative rounded-[18px] bg-white p-4 min-h-[230px]" style={{ boxShadow: "0 5px 0 #d4d1f8" }}>
        {done ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6" style={{ color: C.ink }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 30, color: C.primary }}>{lives === 0 ? "OUT OF LIVES" : "ROUND DONE!"}</div>
            <div className="mt-1 text-[13px] font-medium">You scored {score} points</div>
            <button type="button" onClick={reset} className="mt-4 px-5 py-2 rounded-full text-[12px] font-bold text-white active:translate-y-[2px] transition" style={{ background: C.primary, boxShadow: "0 3px 0 #5f57d6" }}>
              Play again
            </button>
          </div>
        ) : (
          <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold" style={{ color: C.ink }}>
                Q{i + 1}:
              </span>
              <span className="px-2 py-0.5 rounded-full border text-[10px]" style={{ borderColor: C.ink, color: C.ink }}>
                {item.tag}
              </span>
            </div>
            <div className="mt-2 text-[12.5px] font-semibold text-center leading-snug min-h-[36px]" style={{ color: C.ink }}>
              {item.q}
            </div>
            <div className="mt-3 space-y-1.5">
              {item.a.map((a, k) => (
                <motion.button
                  key={a}
                  type="button"
                  onClick={() => choose(k)}
                  animate={pick === k && k !== item.ok ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="w-full py-1.5 rounded-full text-[11.5px] font-semibold transition-colors active:translate-y-[2px]"
                  style={state(k)}
                >
                  {a} {pick !== null && k === item.ok && "✓"}
                </motion.button>
              ))}
            </div>
            {pick !== null && (
              <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} type="button" onClick={next} className="mt-3 w-full py-1.5 rounded-full text-[11.5px] font-bold" style={{ color: C.primary, boxShadow: `inset 0 0 0 1.5px ${C.primary}` }}>
                {i === QUIZ.length - 1 ? "See result" : "Next question →"}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
      <div className="text-white">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-white/80">Score</span>
          <span className="text-[16px] tracking-[0.15em]">
            {[0, 1, 2].map((k) => (
              <span key={k} style={{ color: k < lives ? "#ff8a8a" : "rgba(255,255,255,0.3)" }}>
                ♥
              </span>
            ))}
          </span>
        </div>
        <motion.div key={bump} className="text-[52px] font-extrabold leading-none" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>
          {score}
        </motion.div>
        <div className="mt-3 text-[12px] text-white/80 leading-relaxed">
          Answer states: default, correct (green ✓), wrong (red + shake). A wrong answer in Challenge mode costs a life.
        </div>
      </div>
    </div>
  );
}

export function TriviaSystem() {
  useFonts();
  const [picked, setPicked] = useState(["Entertainment", "Sports", "Art"]);
  const [copied, setCopied] = useState(null);
  const cats = ["General", "Entertainment", "Science", "Sports", "Geography", "Art"];
  const swatches = [
    ["Primary", C.primary],
    ["Primary soft", C.soft],
    ["Secondary", C.yellow],
    ["Success", C.success],
    ["Warning", C.warning],
    ["Destructive", C.danger],
    ["Info", C.info],
    ["Foreground", C.ink],
  ];
  return (
    <div>
      <div className="grid grid-cols-1 @3xl:grid-cols-6 gap-3 @2xl:gap-4">
        {/* brand */}
        <Card className="@3xl:col-span-4 min-h-[230px]" style={{ background: C.primary }} i={0}>
          <span className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/15" />
          <svg className="absolute right-16 bottom-4 w-24" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M12 88 L50 12 L88 88 Z" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.16)" strokeWidth="12" strokeLinejoin="round" />
          </svg>
          <span className="absolute left-[45%] bottom-6 w-6 h-6 rounded-full bg-white/20" />
          <Lbl color="rgba(255,255,255,0.75)">Brand · Display</Lbl>
          <div className="mt-4 text-white leading-[0.9] -rotate-2 origin-left" style={{ fontFamily: DISPLAY, fontSize: "clamp(40px, 7cqw, 64px)", textShadow: "0 5px 0 #5f57d6" }}>
            TRIVIA
            <br />
            MASTER
          </div>
          <div className="mt-5 text-white/85 text-[13px]">Playful display for the brand · Poppins for everything else</div>
        </Card>

        {/* type */}
        <Card className="@3xl:col-span-2" i={1}>
          <Lbl>Typography · Poppins</Lbl>
          <div className="mt-3 text-[56px] leading-none font-extrabold" style={{ color: C.ink }}>
            Aa
          </div>
          <div className="mt-4 space-y-2">
            {[
              ["H1", "28 / 800", "text-[22px] font-extrabold"],
              ["H2", "20 / 700", "text-[17px] font-bold"],
              ["Body", "14 / 500", "text-[14px] font-medium"],
              ["Caption", "11 / 500", "text-[11px] font-medium"],
            ].map(([n, spec, cls]) => (
              <div key={n} className="flex items-baseline justify-between gap-2" style={{ color: C.ink }}>
                <span className={cls}>{n}</span>
                <span className="text-[10px] tabular-nums text-black/40">{spec}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* colour */}
        <Card className="@3xl:col-span-6" i={2}>
          <Lbl>Colour tokens · click to copy</Lbl>
          <div className="mt-4 grid grid-cols-4 @3xl:grid-cols-8 gap-3">
            {swatches.map(([n, c]) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(c).catch(() => {});
                  setCopied(n);
                  clearTimeout(window.__swT);
                  window.__swT = setTimeout(() => setCopied(null), 1200);
                }}
                className="group/sw text-left"
                title={`Copy ${c}`}
              >
                <div className="relative h-14 rounded-[14px] transition-transform duration-200 group-hover/sw:-translate-y-1 group-active/sw:translate-y-0" style={{ background: c, boxShadow: `0 4px 0 ${c}55${c === C.soft ? ", inset 0 0 0 1px rgba(0,0,0,0.05)" : ""}` }}>
                  {copied === n && (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: [C.soft, C.yellow].includes(c) ? C.ink : "#fff" }}>
                      Copied ✓
                    </motion.span>
                  )}
                </div>
                <div className="mt-1.5 text-[11.5px] font-semibold" style={{ color: C.ink }}>
                  {n}
                </div>
                <div className="text-[10px] tabular-nums text-black/40">{c}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* buttons */}
        <Card className="@3xl:col-span-3" i={3}>
          <Lbl>Buttons · chunky, 4px “press” shadow</Lbl>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Chunky className="px-6 py-2.5 text-[14px]">Start playing</Chunky>
            <Chunky bg="#fff" fg={C.primary} shadow="#d4d1f8" className="px-6 py-2.5 text-[14px]">
              Confirm
            </Chunky>
            <Chunky bg="#fff" fg={C.danger} shadow="#f3c7c7" className="px-4 py-1.5 text-[12px]">
              Abort
            </Chunky>
          </div>
          <div className="mt-5 inline-flex rounded-full p-1" style={{ background: C.soft }}>
            <span className="px-5 py-1.5 rounded-full text-[12px] font-bold text-white" style={{ background: C.primary }}>
              Login
            </span>
            <span className="px-5 py-1.5 text-[12px] font-medium text-black/50">Signup</span>
          </div>
        </Card>

        {/* categories (interactive) */}
        <Card className="@3xl:col-span-3" i={4}>
          <Lbl>Category chips · try it</Lbl>
          <div className="mt-4 flex flex-wrap gap-2">
            {cats.map((c) => {
              const on = picked.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}
                  className="px-3.5 py-2 rounded-[12px] text-[12px] font-medium transition-transform active:translate-y-[2px]"
                  style={{ background: on ? C.yellow : "#f1f0fb", color: C.ink, boxShadow: `0 3px 0 ${on ? "#e0b51c" : "#dddbf3"}` }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3 text-[12px]" style={{ color: C.ink }}>
            <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-medium" style={{ borderColor: C.primary, color: C.primary }}>
              Medium
            </span>
            <span className="font-semibold">Lives:</span>
            <span style={{ color: C.danger }}>♥ ♥ ♥</span>
          </div>
        </Card>

        {/* playable question card */}
        <Card className="@3xl:col-span-4" style={{ background: C.primary }} i={5}>
          <Lbl color="rgba(255,255,255,0.75)">Question card · play it</Lbl>
          <MiniQuiz />
        </Card>

        {/* score card */}
        <Card className="@3xl:col-span-2 flex flex-col" i={6}>
          <Lbl>Score card</Lbl>
          <div className="mt-4 rounded-[16px] px-4 py-4 flex items-center justify-around text-white" style={{ background: C.primary, boxShadow: "0 5px 0 #5f57d6" }}>
            <div className="text-center">
              <div className="text-[32px] font-extrabold leading-none">
                2<span className="text-[13px]">nd</span>
              </div>
              <div className="text-[10px] text-white/80">out of 15</div>
            </div>
            <div className="text-center">
              <div className="text-[32px] font-extrabold leading-none">73</div>
              <div className="text-[10px] text-white/80">top score</div>
            </div>
          </div>
          <div className="mt-auto pt-4 space-y-1.5">
            {[
              [1, "John", 78, false],
              [4, "You", 73, true],
            ].map(([r, n, sc, me]) => (
              <div key={n} className="flex items-center gap-3 px-3 py-1.5 rounded-[10px] text-[12px] font-semibold" style={{ background: me ? C.yellow : C.primary, color: me ? C.ink : "#fff" }}>
                <span>{r}</span>
                <span className="flex-1">{n}</span>
                <span>{sc}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- hi-fi wall ---------------- */

const WALL = [
  { src: hiLogin, name: "Login", note: "Guest or account, one tap" },
  { src: hiHome, name: "Home", note: "Question of the day + categories" },
  { src: hiChallenge, name: "Challenge", note: "Lives, score, one question at a time" },
  { src: hiRanking, name: "Ranking", note: "Your rank first, then the world" },
  { src: hiProfile, name: "Profile", note: "Account and game history" },
];

/** Five final screens in a staggered row, each a real iPhone mockup. */
export function HifiWall({ theme, onOpen }) {
  return (
    <div>
      <div className="grid grid-cols-2 @2xl:grid-cols-5 gap-x-4 @2xl:gap-x-5 gap-y-10 items-start">
        {WALL.map((w, i) => (
          <motion.figure
            key={w.name}
            className={i % 2 ? "@2xl:mt-14" : ""}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Iphone src={w.src} alt={`${w.name} screen`} onOpen={onOpen} width={200} />
            <figcaption className="mt-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.primary }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={`text-[14px] font-semibold ${theme.textMain}`}>{w.name}</div>
              <div className={`text-[12px] leading-snug ${theme.textSub}`}>{w.note}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

/* ---------------- outcome stage (same mood as the hero photo) ---------------- */
export function OutcomeStage({ onOpen }) {
  const phones = [
    { src: hiRanking, rot: -8, y: 30, z: 1 },
    { src: hiChallenge, rot: 0, y: 0, z: 2 },
    { src: hiHome, rot: 8, y: 30, z: 1 },
  ];
  return (
    <div
      className="relative overflow-hidden rounded-[24px] px-[6%] pt-[7%] pb-[5%]"
      style={{ background: "radial-gradient(70% 60% at 50% 35%, #b7b1f7 0%, #9b93f2 45%, #8279e8 100%)" }}
    >
      <span className="absolute -left-20 -bottom-24 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(90,70,220,0.45), transparent 70%)" }} />
      <span className="absolute right-[8%] top-[10%] w-24 h-24 rounded-full bg-white/10" />
      <div className="relative grid grid-cols-3 gap-[4%] items-start">
        {phones.map((p, i) => (
          <motion.div
            key={i}
            style={{ zIndex: p.z, rotate: `${p.rot}deg` }}
            initial={{ opacity: 0, y: 40 + p.y }}
            whileInView={{ opacity: 1, y: p.y }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Iphone src={p.src} alt="Trivia Master final screen" onOpen={onOpen} width={240} />
          </motion.div>
        ))}
      </div>
      <div className="relative mt-[5%] text-center text-white" style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 4cqw, 40px)", textShadow: "0 4px 0 #5f57d6" }}>
        TRIVIA MASTER
      </div>
    </div>
  );
}

/* ---------------- build ---------------- */
function Node({ x, y, w = 150, title, sub, fill = "#fff", stroke = "rgba(29,29,48,0.12)", ink = C.ink }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height="58" rx="14" fill={fill} stroke={stroke} />
      <text x={w / 2} y="25" textAnchor="middle" fontFamily={POP} fontSize="13" fontWeight="700" fill={ink}>
        {title}
      </text>
      <text x={w / 2} y="43" textAnchor="middle" fontFamily={POP} fontSize="10.5" fill={ink} opacity="0.6">
        {sub}
      </text>
    </g>
  );
}

export function TriviaArchitecture({ theme }) {
  const line = theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(29,29,48,0.3)";
  return (
    <div className="rounded-[20px] p-4 @2xl:p-6" style={{ background: theme.isDark ? "rgba(255,255,255,0.04)" : "#f6f6fb", boxShadow: theme.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.07)" : "inset 0 0 0 1px rgba(0,0,0,0.04)" }}>
      <svg viewBox="0 0 760 300" className="w-full h-auto" role="img" aria-label="Architecture: React Native screens, Redux store, OpenTDB and Firebase">
        <defs>
          <marker id="tv-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={line} />
          </marker>
        </defs>
        <text x="20" y="22" fontFamily={POP} fontSize="11" fontWeight="600" letterSpacing="2" fill={line}>
          REACT NATIVE APP
        </text>
        {["Login", "Home", "Game", "Ranking", "Profile"].map((n, i) => (
          <Node key={n} x={20 + i * 146} y={34} w={130} title={n} sub="screen" fill={C.primary} stroke="none" ink="#fff" />
        ))}
        <g stroke={line} strokeWidth="1.6" fill="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${85 + i * 146} 92 L${85 + i * 146} 112 L380 112 L380 134`} />
          ))}
        </g>
        <Node x={270} y={134} w={220} title="Redux store" sub="auth · game · settings" fill={C.yellow} stroke="none" />
        <g stroke={line} strokeWidth="1.6" fill="none">
          <path d="M300 192 L180 236" markerEnd="url(#tv-ar)" markerStart="url(#tv-ar)" />
          <path d="M460 192 L580 236" markerEnd="url(#tv-ar)" markerStart="url(#tv-ar)" />
        </g>
        <Node x={60} y={238} w={200} title="OpenTDB API" sub="live questions by category" />
        <Node x={500} y={238} w={220} title="Firebase" sub="Auth (Google) · Firestore" />
      </svg>
    </div>
  );
}

function CodeCard({ file, children }) {
  return (
    <figure className="min-w-0 rounded-[16px] overflow-hidden" style={{ background: "#16152a", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -26px rgba(40,30,120,0.6)" }}>
      <div className="h-9 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/50 font-mono">{file}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11.5px] leading-[1.75] font-mono text-[#dcdcf0]">{children}</pre>
    </figure>
  );
}
const kw = (s) => <span style={{ color: "#c792ea" }}>{s}</span>;
const st = (s) => <span style={{ color: "#c3e88d" }}>{s}</span>;
const fn = (s) => <span style={{ color: "#82aaff" }}>{s}</span>;
const cmt = (s) => <span style={{ color: "rgba(255,255,255,0.35)" }}>{s}</span>;
const tg = (s) => <span style={{ color: "#f07178" }}>{s}</span>;

/** Answer button rendered in the design-system style, next to a simplified version of its code. */
export function ComponentToCode({ theme }) {
  const [sel, setSel] = useState(null);
  const answers = ["Georges Seurat", "Paul Cézanne", "Vincent van Gogh"];
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.2fr] gap-5 items-stretch">
      <div className="rounded-[16px] p-5 flex flex-col justify-center" style={{ background: C.primary, fontFamily: POP }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">&lt;AnswerButton /&gt; · tap one</div>
        <div className="mt-4 space-y-2">
          {answers.map((a, k) => (
            <button
              key={a}
              type="button"
              onClick={() => setSel(k)}
              className="w-full py-2 rounded-full text-[12.5px] font-semibold transition active:translate-y-[2px]"
              style={sel === k ? { background: C.yellow, color: C.ink, boxShadow: "0 3px 0 #e0b51c" } : { background: "#fff", color: C.primary, boxShadow: "0 3px 0 #d4d1f8" }}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10.5px] text-white/80">
          <span>
            <b className="text-white">default</b> · white
          </span>
          <span>
            <b className="text-white">selected</b> · secondary
          </span>
        </div>
      </div>
      <CodeCard file="components/AnswerButton.js · simplified">
        {kw("export function")} {fn("AnswerButton")}({"{ "}label, selected, onPress{" }"}) {"{"}
        {"\n  "}
        {kw("return")} ({"\n    "}&lt;{tg("Pressable")}{"\n      "}onPress={"{"}onPress{"}"}
        {"\n      "}style={"{"}[styles.base, selected && styles.selected]{"}"}
        {"\n    "}&gt;{"\n      "}&lt;{tg("Text")} style={"{"}styles.label{"}"}&gt;{"{"}label{"}"}&lt;/{tg("Text")}&gt;{"\n    "}&lt;/{tg("Pressable")}&gt;{"\n  "});{"\n"}
        {"}"}
        {"\n\n"}
        {kw("const")} styles = StyleSheet.{fn("create")}({"{"}
        {"\n  "}base: {"{ "}borderRadius: {st("999")}, backgroundColor: colors.{fn("surface")},{"\n          "}borderBottomWidth: {st("3")}, borderColor: colors.{fn("primarySoft")} {"}"},{"\n  "}
        selected: {"{ "}backgroundColor: colors.{fn("secondary")} {"}"}, {cmt("// yellow")}
        {"\n"}
        {"}"});
      </CodeCard>
    </div>
  );
}

export function FetchQuestions() {
  return (
    <CodeCard file="api/questions.js · simplified">
      {cmt("// OpenTDB: questions by category & difficulty")}
      {"\n"}
      {kw("export async function")} {fn("fetchQuestions")}({"{ "}category, difficulty{" }"}) {"{"}
      {"\n  "}
      {kw("const")} url = {st("`https://opentdb.com/api.php?amount=10")}
      {"\n    "}
      {st("&category=${category}&difficulty=${difficulty}&type=multiple`")};{"\n  "}
      {kw("const")} {"{ "}results{" }"} = {kw("await")} ({kw("await")} {fn("fetch")}(url)).{fn("json")}();{"\n  "}
      {kw("return")} results.{fn("map")}(toQuestion); {cmt("// shuffle answers, decode HTML")}
      {"\n"}
      {"}"}
    </CodeCard>
  );
}
