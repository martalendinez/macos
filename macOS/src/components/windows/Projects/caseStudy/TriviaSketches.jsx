// src/components/windows/Projects/caseStudy/TriviaSketches.jsx
// Paper sketch board for Trivia Master, drawn in code (hand-drawn ink filter + handwriting font).
import { useEffect } from "react";

const INK = "#2a2a2e";
const PAPER = "#fbf8f1";
const HAND = '"Caveat", "Bradley Hand", "Comic Sans MS", cursive';
const PURPLE = "#7a7cf0";

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

const ln = (x1, y1, x2, y2, w = 2) => <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={INK} strokeWidth={w} strokeLinecap="round" />;

function Phone({ x, y, title, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="190" height="360" rx="26" fill="#fff" fillOpacity="0.55" stroke={INK} strokeWidth="2.4" />
      <path d="M74 15 h42" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      {title && (
        <text x="16" y="56" fontFamily={HAND} fontSize="25" fontWeight="700" fill={INK}>
          {title}
        </text>
      )}
      {children}
    </g>
  );
}

export default function TriviaSketches({ theme }) {
  useHandFont();
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[18px]" style={{ background: PAPER, boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 24px 50px -28px rgba(0,0,0,0.45)" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.13) 1px, transparent 1.3px)", backgroundSize: "18px 18px" }} />
        <svg viewBox="0 0 1000 520" className="relative block w-full h-auto" role="img" aria-label="Paper sketches of the Trivia Master flow">
          <defs>
            <filter id="t-rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="3.2" />
            </filter>
            <marker id="t-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10" fill="none" stroke={INK} strokeWidth="1.6" />
            </marker>
          </defs>

          <text x="40" y="56" fontFamily={HAND} fontSize="38" fontWeight="700" fill={INK}>
            Trivia · first sketches
          </text>
          <path d="M40 68 q 120 8 250 -2" fill="none" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" filter="url(#t-rough)" />

          <g filter="url(#t-rough)">
            {/* 1 login */}
            <Phone x={30} y={110}>
              <text x="30" y="92" fontFamily={HAND} fontSize="30" fontWeight="700" fill={INK}>
                TRIVIA!!
              </text>
              <rect x="20" y="130" width="150" height="30" rx="15" fill="none" stroke={INK} strokeWidth="2" />
              <rect x="20" y="172" width="150" height="30" rx="15" fill="none" stroke={INK} strokeWidth="2" />
              <rect x="20" y="222" width="150" height="34" rx="17" fill={PURPLE} fillOpacity="0.75" stroke={INK} strokeWidth="2" />
              <text x="56" y="245" fontFamily={HAND} fontSize="20" fill="#fff">
                Start playing
              </text>
              <text x="40" y="290" fontFamily={HAND} fontSize="20" fill={INK}>
                play as guest →
              </text>
            </Phone>

            {/* 2 home */}
            <Phone x={270} y={110} title="Hi, John!">
              <rect x="16" y="72" width="158" height="74" rx="10" fill="none" stroke={INK} strokeWidth="2" />
              <text x="26" y="94" fontFamily={HAND} fontSize="17" fill={INK}>
                question of the day
              </text>
              {ln(30, 112, 160, 112, 1.6)}
              <rect x="30" y="122" width="56" height="16" rx="8" fill="none" stroke={INK} strokeWidth="1.6" />
              <rect x="104" y="122" width="56" height="16" rx="8" fill="none" stroke={INK} strokeWidth="1.6" />
              {[0, 1, 2].map((r) =>
                [0, 1].map((c) => <rect key={`${r}${c}`} x={18 + c * 80} y={164 + r * 40} width="72" height="30" rx="8" fill={r === 0 && c === 1 ? PURPLE : "none"} fillOpacity="0.6" stroke={INK} strokeWidth="1.8" />)
              )}
              <rect x="40" y="300" width="110" height="30" rx="15" fill="none" stroke={INK} strokeWidth="2" />
              <text x="78" y="321" fontFamily={HAND} fontSize="20" fill={INK}>
                Start
              </text>
            </Phone>

            {/* 3 question */}
            <Phone x={510} y={110} title="Q3 / 10">
              <text x="120" y="56" fontFamily={HAND} fontSize="20" fill={INK}>
                ♥♥♥
              </text>
              <rect x="16" y="72" width="158" height="80" rx="10" fill="none" stroke={INK} strokeWidth="2" />
              {ln(30, 100, 160, 100)}
              {ln(30, 120, 130, 120)}
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x="24" y={170 + i * 40} width="142" height="28" rx="14" fill={i === 0 ? "#ffd84d" : "none"} fillOpacity="0.8" stroke={INK} strokeWidth="1.8" />
              ))}
            </Phone>

            {/* 4 ranking */}
            <Phone x={750} y={110} title="Ranking">
              <rect x="16" y="72" width="158" height="62" rx="10" fill={PURPLE} fillOpacity="0.55" stroke={INK} strokeWidth="2" />
              <text x="32" y="112" fontFamily={HAND} fontSize="28" fontWeight="700" fill={INK}>
                2nd
              </text>
              <text x="108" y="112" fontFamily={HAND} fontSize="28" fontWeight="700" fill={INK}>
                73
              </text>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <text x="24" y={170 + i * 36} fontFamily={HAND} fontSize="20" fill={INK}>
                    {i + 1}
                  </text>
                  <circle cx="54" cy={164 + i * 36} r="9" fill="none" stroke={INK} strokeWidth="1.6" />
                  {ln(72, 164 + i * 36, 136, 164 + i * 36, 1.6)}
                </g>
              ))}
            </Phone>
          </g>

          <g filter="url(#t-rough)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
            <path d="M224 290 q 22 -24 42 -6" markerEnd="url(#t-arrow)" />
            <path d="M464 290 q 22 -24 42 -6" markerEnd="url(#t-arrow)" />
            <path d="M704 290 q 22 -24 42 -6" markerEnd="url(#t-arrow)" />
          </g>

          <g fontFamily={HAND} fill={INK}>
            <g transform="rotate(-4 470 80)">
              <rect x="400" y="40" width="180" height="58" rx="4" fill="#ffe58a" />
              <text x="412" y="66" fontSize="21" fontWeight="700">
                no sign-up wall!
              </text>
              <text x="412" y="88" fontSize="19">
                guest → straight to play
              </text>
            </g>
            <g transform="rotate(3 840 70)">
              <rect x="700" y="36" width="190" height="58" rx="4" fill="#dcdcff" />
              <text x="712" y="62" fontSize="21" fontWeight="700">
                leisure vs challenge
              </text>
              <text x="712" y="84" fontSize="19">
                lives only in challenge
              </text>
            </g>
            <text x="560" y="506" fontSize="21" fillOpacity="0.75">
              show progress “3 of 10” ✓
            </text>
          </g>
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PURPLE }} />
        Paper sketches: the four moments of a game, from login to leaderboard.
      </figcaption>
    </figure>
  );
}
