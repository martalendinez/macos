// src/components/phone/PhoneIcons.jsx
// Drawn iOS-style app icons for the phone home screen: Marta's own apps (Recruiter, Extras, Résumé…)
// and the case studies, each a tiny picture of what's inside. Drawn on a 60×60 grid so they stay sharp.
import avatar from "../../imgs/avatar/profile-photo.jpg";

function Tile({ size, bg, children }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" aria-hidden="true">
      <defs>
        <clipPath id="ph-tile">
          <rect width="60" height="60" rx="13.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#ph-tile)">
        <rect width="60" height="60" fill={bg} />
        {/* soft top light, like iOS icons */}
        <rect width="60" height="30" fill="#fff" opacity="0.08" />
        {children}
      </g>
    </svg>
  );
}

/** Trace: an AI side panel next to a design, with a sparkle. */
function Trace({ size }) {
  return (
    <Tile size={size} bg="url(#cs-trace)">
      <defs>
        <linearGradient id="cs-trace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c7cf0" />
          <stop offset="1" stopColor="#4646c8" />
        </linearGradient>
      </defs>
      {/* canvas frame */}
      <rect x="10" y="16" width="22" height="28" rx="3" fill="#fff" opacity="0.28" />
      <rect x="13" y="20" width="12" height="3" rx="1.5" fill="#fff" opacity="0.7" />
      <rect x="13" y="26" width="16" height="9" rx="2" fill="#fff" opacity="0.5" />
      {/* AI panel */}
      <rect x="27" y="12" width="23" height="36" rx="4" fill="#fff" />
      <rect x="31" y="22" width="15" height="3" rx="1.5" fill="#5b5bd6" opacity="0.35" />
      <rect x="31" y="28" width="11" height="3" rx="1.5" fill="#5b5bd6" opacity="0.35" />
      <rect x="31" y="35" width="15" height="7" rx="2" fill="#5b5bd6" />
      {/* sparkle */}
      <path d="M38.5 13.5l1.5 3.6 3.6 1.5-3.6 1.5-1.5 3.6-1.5-3.6-3.6-1.5 3.6-1.5z" fill="#5b5bd6" transform="translate(0 -1)" />
    </Tile>
  );
}

/** Employer branding: a radar chart, the heart of the brand analysis. */
function Employer({ size }) {
  const ring = (r) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${30 + r * Math.cos(a)},${31 + r * Math.sin(a)}`;
    }).join(" ");
  const shape = [17, 12, 15, 9, 14]
    .map((r, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${30 + r * Math.cos(a)},${31 + r * Math.sin(a)}`;
    })
    .join(" ");
  return (
    <Tile size={size} bg="url(#cs-emp)">
      <defs>
        <linearGradient id="cs-emp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa25e" />
          <stop offset="1" stopColor="#e2672d" />
        </linearGradient>
      </defs>
      <polygon points={ring(19)} fill="#fff" opacity="0.18" />
      <polygon points={ring(19)} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
      <polygon points={ring(12)} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
      <polygon points={shape} fill="#fff" />
      <circle cx="30" cy="31" r="2" fill="#e2672d" />
    </Tile>
  );
}

/** Trivia: answer buttons, one picked in the design system's yellow. */
function Trivia({ size }) {
  return (
    <Tile size={size} bg="url(#cs-triv)">
      <defs>
        <linearGradient id="cs-triv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9a8cff" />
          <stop offset="1" stopColor="#6052e8" />
        </linearGradient>
      </defs>
      <text x="30" y="21" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="system-ui, sans-serif">
        ?
      </text>
      <rect x="12" y="26" width="36" height="7" rx="3.5" fill="#fff" opacity="0.9" />
      <rect x="12" y="35.5" width="36" height="7" rx="3.5" fill="#ffd84d" />
      <rect x="12" y="45" width="36" height="7" rx="3.5" fill="#fff" opacity="0.9" />
      <circle cx="42.5" cy="39" r="2" fill="#6052e8" />
    </Tile>
  );
}

/** Sällskap: a shared table seen from above, with friends around it. */
function Sallskap({ size }) {
  const seats = [0, 72, 144, 216, 288].map((d) => {
    const a = ((d - 90) * Math.PI) / 180;
    return [30 + 18 * Math.cos(a), 31 + 18 * Math.sin(a)];
  });
  return (
    <Tile size={size} bg="url(#cs-sall)">
      <defs>
        <linearGradient id="cs-sall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4fcf96" />
          <stop offset="1" stopColor="#23935f" />
        </linearGradient>
      </defs>
      {seats.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.6" fill="#fff" opacity={i === 0 ? 1 : 0.85} />
      ))}
      <circle cx="30" cy="31" r="11" fill="#fff" />
      <circle cx="30" cy="31" r="6.5" fill="none" stroke="#23935f" strokeWidth="1.4" opacity="0.6" />
      <path d="M26.5 26v4.2a1.6 1.6 0 0 0 3.2 0V26M28.1 26v10" stroke="#23935f" strokeWidth="1.3" strokeLinecap="round" fill="none" transform="translate(-1.5 0)" />
      <path d="M33.5 36V26c-1.4.7-2 2.4-2 4.4s.6 2.9 2 2.9" stroke="#23935f" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Tile>
  );
}

/** Recruiter Mode: a profile card with a lightning bolt (the 30-second version). */
function Recruiter({ size }) {
  return (
    <Tile size={size} bg="url(#ph-rec)">
      <defs>
        <linearGradient id="ph-rec" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ac8fa" />
          <stop offset="1" stopColor="#0a7aff" />
        </linearGradient>
      </defs>
      <rect x="11" y="15" width="38" height="30" rx="5" fill="#fff" />
      <circle cx="21" cy="26.5" r="4.2" fill="#0a7aff" opacity="0.85" />
      <path d="M14.5 39c.8-4 3.4-6 6.5-6s5.7 2 6.5 6z" fill="#0a7aff" opacity="0.85" />
      <rect x="30" y="23" width="14" height="3" rx="1.5" fill="#0a7aff" opacity="0.35" />
      <rect x="30" y="29" width="10" height="3" rx="1.5" fill="#0a7aff" opacity="0.35" />
      <circle cx="46" cy="14" r="8" fill="#ffcc00" />
      <path d="M47.3 9l-4.6 6h3.2l-1.2 4.8 4.6-6h-3.2z" fill="#fff" />
    </Tile>
  );
}

/** Extras & Fun: a little app library, four tiles with a sparkle. */
function Extras({ size }) {
  const tiles = [
    [15, 15, "#ff6b6b"],
    [32, 15, "#ffd84d"],
    [15, 32, "#4fd18b"],
  ];
  return (
    <Tile size={size} bg="url(#ph-ext)">
      <defs>
        <linearGradient id="ph-ext" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3a5f" />
          <stop offset="1" stopColor="#151a2e" />
        </linearGradient>
      </defs>
      {tiles.map(([x, y, c]) => (
        <rect key={c} x={x} y={y} width="13" height="13" rx="3.6" fill={c} />
      ))}
      <rect x="32" y="32" width="13" height="13" rx="3.6" fill="#fff" />
      <path d="M38.5 34.5l1.3 3.2 3.2 1.3-3.2 1.3-1.3 3.2-1.3-3.2-3.2-1.3 3.2-1.3z" fill="#151a2e" />
    </Tile>
  );
}

/** Résumé: a one-page PDF. */
function Resume({ size }) {
  return (
    <Tile size={size} bg="url(#ph-res)">
      <defs>
        <linearGradient id="ph-res" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e9ee" />
        </linearGradient>
      </defs>
      <path d="M17 9h18l9 9v31a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z" fill="#fff" stroke="#d1d1d6" strokeWidth="1" />
      <path d="M35 9v7a2 2 0 0 0 2 2h7" fill="#e5e5ea" />
      <rect x="20" y="22" width="14" height="2.6" rx="1.3" fill="#c7c7cc" />
      <rect x="20" y="27" width="19" height="2.6" rx="1.3" fill="#c7c7cc" />
      <rect x="20" y="32" width="16" height="2.6" rx="1.3" fill="#c7c7cc" />
      <rect x="18" y="39" width="18" height="8" rx="2" fill="#ff3b30" />
      <text x="27" y="45.3" textAnchor="middle" fontSize="6.2" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
        PDF
      </text>
    </Tile>
  );
}

/** About me: my photo, like a contact. */
function About({ size }) {
  return (
    <span className="block overflow-hidden rounded-[22.5%] shadow-[0_4px_8px_rgba(0,0,0,0.25)] ring-1 ring-white/30" style={{ width: size, height: size }}>
      <img src={avatar} alt="" draggable={false} className="w-full h-full object-cover" />
    </span>
  );
}

/** Settings: a grey gear, iOS-style. */
function Settings({ size }) {
  const teeth = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <Tile size={size} bg="url(#ph-set)">
      <defs>
        <linearGradient id="ph-set" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7c7cc" />
          <stop offset="1" stopColor="#8e8e93" />
        </linearGradient>
      </defs>
      <g transform="translate(30 30)">
        {teeth.map((d) => (
          <rect key={d} x="-2.6" y="-21" width="5.2" height="8" rx="1.4" fill="#3a3a3c" transform={`rotate(${d})`} />
        ))}
        <circle r="15" fill="#3a3a3c" />
        <circle r="10.5" fill="#8e8e93" />
        <circle r="5" fill="#3a3a3c" />
      </g>
    </Tile>
  );
}

/** Drawn icons for Marta's own apps (brand apps keep their real icons). */
export const APP_ICONS = { recruiter: Recruiter, fun: Extras, resume: Resume, about: About, settings: Settings };

export const CASE_STUDY_ICONS = {
  thesisCaseStudy: Trace,
  employerBrandingCaseStudy: Employer,
  triviaCaseStudy: Trivia,
  groupDiningCaseStudy: Sallskap,
};
