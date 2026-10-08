// src/components/windows/Projects/ui/ProjectCover.jsx
// Dribbble-style "shot" covers for project cards: bold headline, real screens in tilted
// browser/phone frames bleeding off the edge, floating UI chips taken from the product,
// a mesh gradient and film grain. Everything is sized in container units (cqw), so a cover
// looks the same from the small grid card to the big featured card.
import kallosDashboard from "../../../../imgs/case-study/kallos/Dashboard.png";
import diningRestaurant from "../../../../imgs/case-study/sallskap/Dining_Restaurant.png";
import triviaChallenge from "../../../../imgs/case-study/trivia/screens/TriviaChallenge.jpg";
import triviaRanking from "../../../../imgs/case-study/trivia/screens/TriviaRanking.jpg";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const COVERS = {
  employerBranding: {
    bg: "radial-gradient(60% 80% at 10% 10%, #ffd3ad 0%, transparent 60%), radial-gradient(50% 70% at 90% 100%, #ff5d5d 0%, transparent 60%), linear-gradient(135deg, #ff9a52 0%, #f0722f 55%, #c94b1c 100%)",
    ink: "#fff",
    sub: "rgba(255,255,255,0.82)",
    brand: "Kallos",
    title: ["Your employer", "brand, scored."],
    tagline: "AI-assisted insights for HR teams",
    tags: ["UX", "Full-stack", "AI"],
  },
  kthTriviaApp: {
    bg: "radial-gradient(55% 80% at 0% 0%, #c9c0ff 0%, transparent 60%), radial-gradient(45% 60% at 95% 95%, #ff8fcf 0%, transparent 65%), linear-gradient(135deg, #7c6cf7 0%, #5a48e6 55%, #3a2bb5 100%)",
    ink: "#fff",
    sub: "rgba(255,255,255,0.82)",
    brand: "Trivia Master",
    title: ["Quick rounds.", "Real rivals."],
    tagline: "A React Native quiz game",
    tags: ["Mobile", "React Native"],
  },
  restaurantCoordination: {
    bg: "radial-gradient(55% 80% at 5% 0%, #3f7a5f 0%, transparent 65%), radial-gradient(50% 70% at 100% 100%, #c9b98f 0%, transparent 60%), linear-gradient(135deg, #2a5a45 0%, #1f4636 60%, #16352a 100%)",
    ink: "#f6f1e6",
    sub: "rgba(246,241,230,0.78)",
    brand: "Sällskap",
    title: ["Dining,", "coordinated."],
    tagline: "Group dinners without the group chat",
    tags: ["UX", "Full-stack", "Live"],
  },
};

/* ---------- frames ---------- */

function Browser({ src, url }) {
  return (
    <div className="rounded-[1.2cqw] overflow-hidden bg-white" style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15), 0 4cqw 8cqw -2cqw rgba(0,0,0,0.5)" }}>
      <div className="flex items-center gap-[0.6cqw] px-[1.2cqw] bg-[#f1f1f3]" style={{ height: "2.8cqw" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="rounded-full shrink-0" style={{ width: "0.9cqw", height: "0.9cqw", background: c }} />
        ))}
        <span className="ml-[3cqw] px-[1.4cqw] rounded-[0.5cqw] bg-white text-black/45 truncate" style={{ fontSize: "1.1cqw", lineHeight: "1.8cqw" }}>
          {url}
        </span>
      </div>
      <img src={src} alt="" draggable={false} loading="lazy" decoding="async" className="block w-full h-auto" />
    </div>
  );
}

function Phone({ src }) {
  return (
    <div className="relative bg-[#0e0e10] rounded-[3.2cqw] p-[0.8cqw]" style={{ boxShadow: "inset 0 0 0 0.35cqw rgba(255,255,255,0.16), 0 4cqw 8cqw -2cqw rgba(0,0,0,0.55)" }}>
      <div className="relative overflow-hidden rounded-[2.5cqw] bg-white aspect-[1520/3290]">
        <img src={src} alt="" draggable={false} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute left-1/2 -translate-x-1/2 top-[1.6%] rounded-full bg-[#0e0e10]" style={{ width: "32%", height: "3.2%" }} />
      </div>
    </div>
  );
}

/** Small floating UI fragment (white card). */
function Chip({ children, className = "", style }) {
  return (
    <div
      className={`absolute z-[4] @max-[460px]:hidden rounded-[1.2cqw] bg-white/95 backdrop-blur-md text-[#1d1d1f] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={{ padding: "1cqw 1.4cqw", boxShadow: "0 2cqw 4cqw -1cqw rgba(0,0,0,0.35)", ...style }}
    >
      {children}
    </div>
  );
}

/* ---------- per-project compositions ---------- */

const tiltBase = "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

function KallosArt() {
  return (
    <>
      <div className={`absolute ${tiltBase} [transform:perspective(1400px)_rotateY(-16deg)_rotateX(7deg)_rotateZ(-2deg)] group-hover:[transform:perspective(1400px)_rotateY(-8deg)_rotateX(3deg)_rotateZ(-1deg)_translateY(-1%)]`} style={{ left: "45%", top: "18%", width: "66%" }}>
        <Browser src={kallosDashboard} url="kallos / dashboard" />
      </div>
      <Chip className="group-hover:-translate-y-[0.8cqw]" style={{ left: "41%", top: "62%" }}>
        <div className="text-[max(8px,1.1cqw)] font-semibold uppercase tracking-wide text-black/45">Brand score</div>
        <div className="flex items-baseline gap-[0.5cqw]">
          <span className="text-[3.2cqw] font-black leading-none text-[#f0722f]">27</span>
          <span className="text-[max(9px,1.4cqw)] font-semibold text-black/45">/100</span>
          <span className="ml-[0.8cqw] text-[max(9px,1.2cqw)] font-bold text-[#34c759]">↑ Level 1</span>
        </div>
      </Chip>
    </>
  );
}

function TriviaArt() {
  return (
    <>
      <div className={`absolute ${tiltBase} [transform:rotate(-8deg)] group-hover:[transform:rotate(-5deg)_translateY(-2%)]`} style={{ left: "52%", top: "16%", width: "20%" }}>
        <Phone src={triviaRanking} />
      </div>
      <div className={`absolute ${tiltBase} [transform:rotate(6deg)] group-hover:[transform:rotate(3deg)_translateY(-3%)]`} style={{ left: "73%", top: "8%", width: "21%" }}>
        <Phone src={triviaChallenge} />
      </div>
      <Chip className="group-hover:-translate-y-[0.8cqw]" style={{ left: "44%", top: "58%" }}>
        <div className="flex items-center gap-[1cqw]">
          <span className="text-[2.6cqw] font-black leading-none text-[#5a48e6]">
            2<sup className="text-[max(9px,1.2cqw)]">nd</sup>
          </span>
          <span className="leading-tight">
            <span className="block text-[max(9px,1.3cqw)] font-bold">Top score 73</span>
            <span className="block text-[max(8px,1.1cqw)] text-black/45">Global leaderboard</span>
          </span>
        </div>
      </Chip>
      <Chip className="group-hover:-translate-y-[0.6cqw]" style={{ left: "77%", top: "70%" }}>
        <span className="text-[max(10px,1.5cqw)] tracking-[0.15em]">❤️❤️❤️</span>
      </Chip>
    </>
  );
}

function SallskapArt() {
  return (
    <>
      <div className={`absolute ${tiltBase} [transform:perspective(1400px)_rotateY(-16deg)_rotateX(7deg)_rotateZ(-2deg)] group-hover:[transform:perspective(1400px)_rotateY(-8deg)_rotateX(3deg)_rotateZ(-1deg)_translateY(-1%)]`} style={{ left: "45%", top: "18%", width: "66%" }}>
        <Browser src={diningRestaurant} url="sallskap.vercel.app" />
      </div>
      <Chip className="group-hover:-translate-y-[0.8cqw]" style={{ left: "41%", top: "60%" }}>
        <div className="text-[max(8px,1.1cqw)] font-semibold uppercase tracking-wide text-black/45">Group needs</div>
        <div className="mt-[0.5cqw] flex gap-[0.5cqw]">
          {["Vegetarian", "Lactose-free", "No pork"].map((t) => (
            <span key={t} className="rounded-[0.5cqw] bg-[#eef2ef] px-[0.8cqw] py-[0.3cqw] text-[max(8px,1.15cqw)] font-medium text-[#2a5a45]">
              {t}
            </span>
          ))}
        </div>
      </Chip>
      <Chip className="group-hover:-translate-y-[0.6cqw]" style={{ left: "80%", top: "10%" }}>
        <span className="flex items-center gap-[0.6cqw] text-[max(9px,1.3cqw)] font-bold text-[#2a5a45]">
          <span className="w-[1.8cqw] h-[1.8cqw] rounded-full bg-[#34c759] text-white flex items-center justify-center text-[max(8px,1.1cqw)]">✓</span>
          Table for 6
        </span>
      </Chip>
    </>
  );
}

const ART = { employerBranding: KallosArt, kthTriviaApp: TriviaArt, restaurantCoordination: SallskapArt };

export default function ProjectCover({ project, className = "" }) {
  const cover = COVERS[project.id];
  const Art = ART[project.id];

  if (!cover || !Art) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: `${project.tint}14` }}>
        <img src={project.thumbnail} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden [container-type:inline-size] ${className}`} style={{ background: cover.bg }}>
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay pointer-events-none" style={{ backgroundImage: GRAIN }} />

      {/* headline */}
      <div className="absolute z-[3] left-[5.5cqw] top-1/2 -translate-y-1/2 w-[40cqw]" style={{ color: cover.ink }}>
        <div className="inline-flex items-center gap-[0.7cqw] rounded-full border px-[1.2cqw] py-[0.45cqw] text-[max(10px,1.35cqw)] font-semibold" style={{ borderColor: cover.sub }}>
          <span className="w-[0.9cqw] h-[0.9cqw] rounded-full" style={{ background: cover.ink }} />
          {cover.brand}
        </div>
        <div className="mt-[1.8cqw] font-black tracking-[-0.045em] leading-[0.98] text-[5.1cqw]">
          {cover.title.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div className="mt-[1.4cqw] text-[max(11px,1.6cqw)] font-medium leading-snug" style={{ color: cover.sub }}>
          {cover.tagline}
        </div>
        <div className="mt-[1.8cqw] flex flex-wrap gap-[0.6cqw]">
          {cover.tags.map((t) => (
            <span key={t} className="rounded-full px-[1.1cqw] py-[0.35cqw] text-[max(9px,1.2cqw)] font-semibold bg-white/[0.16] backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      <Art />
    </div>
  );
}
