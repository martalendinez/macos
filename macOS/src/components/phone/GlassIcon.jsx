// src/components/phone/GlassIcon.jsx
// Glass-style app icons drawn in code, matching the glass icon set in public/icons/glass:
// a frosted lilac rim around a dark navy tile with a white symbol. Used on the phone home screen
// (glass icon theme) so brand apps don't clash with the glass icons.
// ✏️ Add a glyph to GLYPHS to give another app a glass icon.

const S = { fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const GLYPHS = {
  messages: (
    <path {...S} d="M12 4.5c4.7 0 8 2.9 8 6.5s-3.3 6.5-8 6.5c-1 0-2-.1-2.9-.4L5.5 19l.9-3.3C4.9 14.5 4 12.9 4 11c0-3.6 3.3-6.5 8-6.5z" />
  ),
  music: (
    <g {...S}>
      <path d="M6.5 9.2c3.6-1.2 7.7-.9 11 .9" />
      <path d="M7.3 12.4c2.9-.9 6.1-.6 8.8.8" />
      <path d="M8 15.3c2.2-.6 4.5-.4 6.5.6" />
    </g>
  ),
  instagram: (
    <g {...S}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.6" cy="7.4" r="0.6" fill="#fff" />
    </g>
  ),
  terminal: (
    <g {...S}>
      <path d="M6 8l4 4-4 4" />
      <path d="M12.5 16.5H18" />
    </g>
  ),
  figma: (
    <g {...S} strokeWidth="1.8">
      <path d="M12 4H9.5a2.5 2.5 0 0 0 0 5H12z" />
      <path d="M12 4h2.5a2.5 2.5 0 0 1 0 5H12z" />
      <path d="M12 9H9.5a2.5 2.5 0 0 0 0 5H12z" />
      <circle cx="14.5" cy="11.5" r="2.5" />
      <path d="M12 14H9.5a2.5 2.5 0 1 0 2.5 2.5z" />
    </g>
  ),
  notion: (
    <g {...S}>
      <rect x="5" y="4.5" width="14" height="15" rx="2.5" />
      <path d="M9.5 15.5v-7l5 7v-7" />
    </g>
  ),
  vscode: (
    <g {...S}>
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
      <path d="M13 6l-2 12" />
    </g>
  ),
  claude: (
    <g {...S}>
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <path key={a} d="M12 5v14" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  ),
  github: (
    <g {...S}>
      <circle cx="7.5" cy="6.5" r="2" />
      <circle cx="7.5" cy="17.5" r="2" />
      <circle cx="16.5" cy="9" r="2" />
      <path d="M7.5 8.5v7" />
      <path d="M16.5 11c0 3-3 3.5-7.5 5" />
    </g>
  ),
  excel: (
    <g {...S}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M4.5 9.5h15M4.5 14.5h15M10 4.5v15" />
    </g>
  ),
  fundsim: (
    <g {...S}>
      <path d="M4.5 19.5h15" />
      <path d="M5.5 12.5l3 2.5 3.5-1 3-5 3.5-3" />
      <path d="M15.5 6h3v3" />
    </g>
  ),
  designsystem: (
    <g {...S}>
      <rect x="5" y="5" width="5.5" height="5.5" rx="1.2" />
      <circle cx="16.25" cy="7.75" r="2.9" />
      <path d="M7.75 13.5l3 5.5h-6z" />
      <circle cx="16.25" cy="16.25" r="2.9" />
    </g>
  ),
  accessibility: (
    <g {...S}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="8" r="1" fill="#fff" />
      <path d="M8 10.5l4 .8 4-.8M12 11.3v2.7l-2 3.5M12 14l2 3.5" />
    </g>
  ),
  achievements: (
    <g {...S}>
      <path d="M8 5h8v4.5a4 4 0 0 1-8 0z" />
      <path d="M8 6.5H5.5a2.5 2.5 0 0 0 2.6 3.5M16 6.5h2.5a2.5 2.5 0 0 1-2.6 3.5" />
      <path d="M12 13.5V16M9 19h6M10 16h4v3h-4z" />
    </g>
  ),
  /* case studies */
  thesisCaseStudy: (
    <g {...S}>
      <path d="M12 4.5l1.8 4.7 4.7 1.8-4.7 1.8L12 17.5l-1.8-4.7L5.5 11l4.7-1.8z" />
      <path d="M18 16.5v3M16.5 18h3" />
    </g>
  ),
  employerBrandingCaseStudy: (
    <g {...S}>
      <path d="M12 4.5l6.5 4.7-2.5 7.6H8l-2.5-7.6z" />
      <path d="M12 8.5l3 2.2-1.1 3.4h-3.8L9 10.7z" />
    </g>
  ),
  triviaCaseStudy: (
    <g {...S}>
      <path d="M9.2 9a3 3 0 1 1 4.3 2.7c-.9.5-1.5 1.1-1.5 2.1v.7" />
      <circle cx="12" cy="17.6" r="0.7" fill="#fff" />
    </g>
  ),
  groupDiningCaseStudy: (
    <g {...S}>
      <path d="M8 4.5v5a2 2 0 0 0 4 0v-5M10 4.5v15" />
      <path d="M16 19.5v-15c-1.7.8-2.5 3-2.5 5.5s.8 3.5 2.5 3.5" />
    </g>
  ),
};

/** A glass tile with a white glyph. `tint` adds a soft brand-coloured glow behind the glyph. */
export default function GlassIcon({ glyph, tint, size = 60 }) {
  return (
    <span
      className="relative block rounded-[26%] p-[15%]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(205,196,255,0.55) 45%, rgba(236,210,255,0.7))",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.7), inset 0 -2px 6px rgba(150,120,230,0.45), 0 4px 10px rgba(30,20,80,0.28)",
      }}
    >
      <span
        className="relative flex w-full h-full items-center justify-center rounded-[24%] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #303a5e, #141a33 70%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {tint && <span className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 60%, ${tint}66, transparent 70%)` }} />}
        <svg viewBox="0 0 24 24" className="relative w-[70%] h-[70%] drop-shadow-[0_0_3px_rgba(255,255,255,0.35)]" aria-hidden="true">
          {glyph}
        </svg>
      </span>
    </span>
  );
}
