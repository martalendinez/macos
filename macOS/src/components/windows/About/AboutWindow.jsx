// src/components/windows/About/AboutWindow.jsx
// System Settings-style "About me": profile sidebar + Overview / Experience / Skills / Contact.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { placeDetails } from "../Map/data/placesData";
import avatar from "../../../imgs/avatar/profile-photo.jpg";
import photo from "../../../imgs/avatar/profile.jpeg";
import { CONTACT, CORE_TOOLBOX, EXPERIENCE, LEVELS, PROFILE, SKILL_GROUPS, STATS } from "./aboutData";

const SECTIONS = [
  { id: "overview", label: "Overview", tint: "#0a84ff", d: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" },
  { id: "experience", label: "Experience", tint: "#ff9f0a", d: "M2.5 5.5h11v7.5h-11zM6 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M2.5 9h11" },
  { id: "skills", label: "Skills", tint: "#bf5af2", d: "M8 2l1.6 3.6L13.5 6l-2.9 2.6.8 3.9L8 10.6 4.6 12.5l.8-3.9L2.5 6l3.9-.4z" },
  { id: "contact", label: "Contact", tint: "#34c759", d: "M2.5 4h11v8h-11zM2.5 4.5 8 9l5.5-4.5" },
];

const EASE = [0.22, 1, 0.36, 1];

function Glyph({ d, className = "w-[13px] h-[13px]" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function SectionTitle({ t, kicker, title }) {
  return (
    <div className="mb-6">
      <div className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${t.accentText}`}>{kicker}</div>
      <h2 className={`mt-1 text-[30px] font-bold tracking-[-0.03em] leading-tight ${t.textMain}`}>{title}</h2>
    </div>
  );
}

/* ---------------------------------- Overview ---------------------------------- */
function Overview({ t, onOpenWindow, go }) {
  const places = useMemo(
    () => ["spain", "nl", "germany", "canada", "stockholm"].map((k) => placeDetails[k]).filter(Boolean),
    []
  );
  const tile = t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

  return (
    <div>
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[22px] min-h-[250px]" style={{ background: t.isDark ? "#151520" : "#eef3ff" }}>
        {/* animated color blobs */}
        {[
          { c: "#0a84ff", x: "-10%", y: "-30%", s: 340, dx: 40, dy: 30 },
          { c: "#bf5af2", x: "35%", y: "20%", s: 300, dx: -50, dy: -20 },
          { c: "#ff9f0a", x: "65%", y: "-40%", s: 260, dx: 30, dy: 40 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, opacity: t.isDark ? 0.45 : 0.32 }}
            animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative grid @2xl:grid-cols-[1fr_auto] gap-6 items-center p-6 @2xl:p-8">
          <div>
            <motion.div
              className={`text-[34px] @lg:text-[42px] @2xl:text-[48px] font-bold tracking-[-0.035em] leading-[1.02] ${t.textMain}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Hi, I’m Marta{" "}
              <motion.span
                className="inline-block origin-[70%_70%]"
                animate={{ rotate: [0, 16, -8, 14, 0] }}
                transition={{ delay: 0.6, duration: 1.4, ease: "easeInOut" }}
              >
                👋
              </motion.span>
            </motion.div>
            <motion.div
              className={`mt-3 text-[17px] ${t.textBody}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
            >
              {PROFILE.role} at{" "}
              <a href={PROFILE.company.url} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${t.accentText}`}>
                {PROFILE.company.name}
              </a>{" "}
              · {PROFILE.secondaryRole}
            </motion.div>
            <motion.div
              className="mt-5 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.5 }}
            >
              {[`📍 ${PROFILE.location}`, `🎓 ${PROFILE.education.school}`, "🇪🇸 → 🇸🇪"].map((c) => (
                <span key={c} className={`px-3 py-1 rounded-full text-[12px] font-medium backdrop-blur-md ${t.isDark ? "bg-white/10 text-white/85" : "bg-white/70 text-black/70"}`}>
                  {c}
                </span>
              ))}
            </motion.div>
          </div>

          {/* polaroid */}
          <motion.figure
            className="hidden @2xl:block bg-white p-2.5 pb-3 rounded-md shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)] w-[190px]"
            initial={{ opacity: 0, rotate: 10, y: 20 }}
            animate={{ opacity: 1, rotate: 4, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
          >
            <img src={photo} alt="Marta at Niagara Falls" className="w-full aspect-[4/5] object-cover object-[50%_75%] rounded-[3px]" />
            <figcaption className="mt-2 text-center text-[12px] text-black/60" style={{ fontFamily: '"Marker Felt", "Chalkboard SE", "Comic Sans MS", cursive' }}>
              {PROFILE.photoCaption}
            </figcaption>
          </motion.figure>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-5 grid grid-cols-2 @4xl:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className={`rounded-2xl p-4 ${tile}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease: EASE }}
            whileHover={{ y: -2 }}
          >
            <span className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[16px]" style={{ background: `${s.tint}22` }}>
              {s.icon}
            </span>
            <div className={`mt-3 text-[22px] font-bold tracking-[-0.02em] leading-none ${t.textMain}`}>{s.value}</div>
            <div className={`mt-1.5 text-[12px] leading-snug ${t.textSub}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* PHILOSOPHY */}
      <div className="mt-12 relative pl-8">
        <span className="absolute left-0 -top-4 text-[64px] leading-none font-serif text-[hsl(var(--accent))] opacity-80" aria-hidden="true">
          “
        </span>
        <div className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>Design philosophy</div>
        <p className={`mt-2 text-[22px] @2xl:text-[24px] font-medium leading-snug tracking-[-0.015em] ${t.textMain}`}>{PROFILE.philosophy}</p>
      </div>

      {/* PLACES */}
      <div className="mt-12">
        <div className="flex items-baseline justify-between">
          <div className={`text-[17px] font-semibold ${t.textMain}`}>Places I’ve called home</div>
          <button onClick={() => onOpenWindow?.("map")} className={`text-[13px] font-medium hover:underline ${t.accentText}`}>
            Open in Maps →
          </button>
        </div>
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {places.map((p, i) => (
            <motion.button
              key={p.label}
              onClick={() => onOpenWindow?.("map")}
              className={`group shrink-0 w-[150px] rounded-2xl overflow-hidden text-left ${tile}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <div className="h-[84px] overflow-hidden">
                <img src={p.photos[0]} alt="" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="px-3 py-2">
                <div className={`text-[13px] font-semibold truncate ${t.textMain}`}>{p.label}</div>
                <div className={`text-[11px] ${t.textSub}`}>{p.year}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex flex-wrap gap-2">
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={`px-4 py-2 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>
          View résumé
        </a>
        <button onClick={() => onOpenWindow?.("projects")} className={`px-4 py-2 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          See my projects
        </button>
        <button onClick={() => go("contact")} className={`px-4 py-2 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          Get in touch
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- Experience ---------------------------------- */
const TYPE_LABEL = { work: "Work", education: "Education", leadership: "Leadership" };

function Experience({ t }) {
  const [filter, setFilter] = useState("all");
  const items = EXPERIENCE.filter((e) => filter === "all" || (filter === "work" ? e.type !== "education" : e.type === "education"));

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionTitle t={t} kicker="Journey" title="Experience" />
        <div className={`mb-6 flex rounded-[8px] p-0.5 text-[12px] font-medium ${t.isDark ? "bg-white/10" : "bg-black/[0.06]"}`}>
          {[
            ["all", "All"],
            ["work", "Work"],
            ["education", "Education"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`relative px-3 py-1 rounded-[6px] ${filter === k ? t.textMain : t.textSub}`}
            >
              {filter === k && (
                <motion.span layoutId="exp-seg" className={`absolute inset-0 rounded-[6px] ${t.isDark ? "bg-white/20" : "bg-white shadow-sm"}`} />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className={`absolute left-[19px] top-2 bottom-2 w-px ${t.isDark ? "bg-white/12" : "bg-black/10"}`} />
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((e, i) => (
            <motion.div
              layout
              key={e.org + e.role}
              className="relative pl-14 pb-9 last:pb-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            >
              {/* node */}
              <span
                className="absolute left-0 top-0 w-10 h-10 rounded-[11px] flex items-center justify-center text-white text-[15px] font-bold shadow-sm"
                style={{ background: e.tint }}
              >
                {e.org[0]}
                {e.current && (
                  <motion.span
                    className="absolute inset-0 rounded-[11px]"
                    style={{ boxShadow: `0 0 0 0 ${e.tint}` }}
                    animate={{ boxShadow: [`0 0 0 0 ${e.tint}88`, `0 0 0 10px ${e.tint}00`] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </span>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className={`text-[17px] font-semibold tracking-[-0.01em] leading-snug ${t.textMain}`}>
                    {e.role}{" "}
                    {e.current && (
                      <span className="ml-1 align-middle px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: e.tint }}>
                        Now
                      </span>
                    )}
                  </div>
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className={`text-[14px] font-medium hover:underline ${t.accentText}`}>
                    {e.org}
                  </a>
                  <span className={`ml-2 text-[12px] ${t.textSub}`}>· {TYPE_LABEL[e.type]}</span>
                </div>
                <div className={`shrink-0 text-[12px] tabular-nums pt-1 ${t.textSub}`}>{e.dates}</div>
              </div>

              <ul className={`mt-3 space-y-1.5 text-[14px] leading-relaxed ${t.textBody}`}>
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span className="mt-[0.65em] w-1 h-1 rounded-full shrink-0" style={{ background: e.tint }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------- Skills ---------------------------------- */
function Dots({ level, tint, isDark }) {
  const n = LEVELS[level] ?? 3;
  return (
    <span className="flex gap-1" aria-label={`${level} (${n} of 5)`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 500, damping: 20 }}
          style={{ background: i <= n ? tint : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }}
        />
      ))}
    </span>
  );
}

function Skills({ t }) {
  return (
    <div>
      <SectionTitle t={t} kicker="Toolbox" title="Skills" />

      <div className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>Core toolbox</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {CORE_TOOLBOX.map((s, i) => (
          <motion.span
            key={s}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-white bg-[hsl(var(--accent))]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 22 }}
          >
            {s}
          </motion.span>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 @4xl:grid-cols-2 gap-x-12 gap-y-10">
        {SKILL_GROUPS.map((g) => (
          <div key={g.title}>
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[14px]" style={{ background: `${g.tint}22` }}>
                {g.icon}
              </span>
              <div className={`text-[16px] font-semibold ${t.textMain}`}>{g.title}</div>
            </div>
            <div className={`mt-3 divide-y ${t.isDark ? "divide-white/[0.07]" : "divide-black/[0.06]"}`}>
              {g.skills.map(([name, level]) => (
                <div key={name} className="flex items-center justify-between gap-3 py-2.5">
                  <span className={`text-[14px] ${t.textMain}`}>{name}</span>
                  <span className="flex items-center gap-3">
                    <span className={`hidden @lg:inline text-[11px] ${t.textSub}`}>{level}</span>
                    <Dots level={level} tint={g.tint} isDark={t.isDark} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Contact ---------------------------------- */
function Contact({ t }) {
  const [copied, setCopied] = useState(false);
  const tile = t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  }

  return (
    <div>
      <SectionTitle t={t} kicker="Say hi" title="Let’s connect!" />
      <p className={`-mt-3 mb-7 text-[15px] ${t.textBody}`}>I’d love to hear about opportunities or collaborations.</p>

      {/* email hero */}
      <div className="relative overflow-hidden rounded-[20px] p-6 text-white" style={{ background: "linear-gradient(135deg, hsl(var(--accent)), #5856d6)" }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4 flex-wrap">
          <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-white/60" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-white/75">{PROFILE.fullName}</div>
            <div className="text-[20px] font-semibold tracking-[-0.01em] truncate">{CONTACT.email}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={copyEmail} className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-medium backdrop-blur-md transition">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? "c" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-block">
                  {copied ? "Copied ✓" : "Copy"}
                </motion.span>
              </AnimatePresence>
            </button>
            <a href={`mailto:${CONTACT.email}`} className="px-3.5 py-1.5 rounded-lg bg-white text-[13px] font-semibold text-[#1d1d1f] hover:bg-white/90 transition">
              Send email
            </a>
          </div>
        </div>
      </div>

      {/* links */}
      <div className="mt-4 grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        {CONTACT.links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 rounded-2xl p-3.5 ${tile}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05, ease: EASE }}
            whileHover={{ y: -2 }}
          >
            <span className="w-10 h-10 rounded-[11px] flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ background: l.tint }}>
              {l.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[14px] font-semibold ${t.textMain}`}>{l.label}</span>
              <span className={`block text-[12px] truncate ${t.textSub}`}>{l.value}</span>
            </span>
            <span className={`text-[15px] transition group-hover:translate-x-0.5 ${t.textSub}`}>↗</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Window ---------------------------------- */
function NavItem({ s, active, onSelect, t }) {
  return (
    <button
      onClick={() => onSelect(s.id)}
      className={`relative w-full flex items-center gap-2.5 rounded-[7px] px-2 py-[5px] text-[13px] text-left ${active ? "text-white" : `${t.textMain} ${t.hoverBg}`}`}
    >
      {active && <motion.span layoutId="about-nav" className="absolute inset-0 rounded-[7px] bg-[hsl(var(--accent))]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
      <span className="relative w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-white shadow-sm" style={{ background: s.tint }}>
        <Glyph d={s.d} />
      </span>
      <span className="relative">{s.label}</span>
    </button>
  );
}

export default function AboutWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", onOpenWindow }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [section, setSection] = useState("overview");

  const views = {
    overview: <Overview t={t} onOpenWindow={onOpenWindow} go={setSection} />,
    experience: <Experience t={t} />,
    skills: <Skills t={t} />,
    contact: <Contact t={t} />,
  };

  return (
    <div className={`no-darkwin h-full w-full flex flex-col @3xl:flex-row ${t.windowBg}`}>
      {/* SIDEBAR */}
      {/* narrow windows & phones: compact header with scrollable section tabs */}
      <div className={`@3xl:hidden shrink-0 border-b ${t.divider} ${t.sidebarBg}`}>
        <div className="flex items-center gap-3 px-4 pt-3">
          <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className={`text-[14px] font-semibold ${t.textMain}`}>{PROFILE.name}</div>
            <div className={`text-[11px] ${t.textSub}`}>
              {PROFILE.role} @ {PROFILE.company.name}
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-[13px] font-medium transition ${
                section === s.id ? "bg-[hsl(var(--accent))] text-white" : `${t.textMain} ${t.isDark ? "bg-white/[0.07]" : "bg-black/[0.05]"}`
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: s.tint }}>
                <Glyph d={s.d} className="w-[11px] h-[11px]" />
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <aside className={`hidden @3xl:flex w-[220px] shrink-0 h-full flex-col border-r ${t.divider} ${t.sidebarBg}`}>
        <div className="px-4 pt-6 pb-4 flex flex-col items-center text-center">
          <div className="p-[3px] rounded-full" style={{ background: "conic-gradient(from 180deg, #0a84ff, #bf5af2, #ff9f0a, #34c759, #0a84ff)" }}>
            <img src={avatar} alt="Marta" className={`w-[72px] h-[72px] rounded-full object-cover border-[3px] ${t.isDark ? "border-[#262628]" : "border-[#f3f3f5]"}`} />
          </div>
          <div className={`mt-3 text-[15px] font-semibold ${t.textMain}`}>{PROFILE.name}</div>
          <div className={`text-[12px] ${t.textSub}`}>
            {PROFILE.role} @ {PROFILE.company.name}
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5" aria-label="About sections">
          {SECTIONS.map((s) => (
            <NavItem key={s.id} s={s} active={section === s.id} onSelect={setSection} t={t} />
          ))}
        </nav>

        <div className="p-3">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium ${t.buttonClass}`}
          >
            📄 Download résumé
          </a>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            className="max-w-[860px] mx-auto px-4 @lg:px-6 @2xl:px-10 py-6 @2xl:py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {views[section]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
