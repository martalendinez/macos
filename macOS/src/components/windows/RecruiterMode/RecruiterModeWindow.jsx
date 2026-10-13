// src/components/windows/RecruiterMode/RecruiterModeWindow.jsx
// 30-second overview for recruiters: pitch, quick facts, strengths, best work and one-click actions.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { PROJECTS } from "../Projects/data/projectData";
import { PosterThumb } from "../Projects/ui/ProjectCover";
import { CONTACT, PROFILE } from "../About/aboutData";
import { GLANCE, HIGHLIGHTS, PITCH, STATUS, STRENGTHS } from "./data";
import Tour from "../../shell/Tour";
import EasterEgg from "../../ui/EasterEgg";
import heroImg from "../../../imgs/avatar/model1.jpeg";

const EASE = [0.22, 1, 0.36, 1];
const RM_STEPS = [
  { targets: ["rm-name", "rm-pitch"], eyebrow: "Who 👋", title: "Design Engineer at ROYC", text: "I bridge UX and front-end: research, flows, high-fidelity UI and the components that ship it." },
  { targets: ["rm-facts"], eyebrow: "At a glance 📌", title: "The quick answers", text: "Role, background, location, toolkit and domain, in one place." },
  { targets: ["rm-why"], eyebrow: "Why me ✨", title: "Three things I bring", text: "Fintech domain experience, design and code in one person, and research behind every flow." },
  { targets: ["rm-work"], eyebrow: "Best work 🏆", title: "Two theses, end to end", text: "Each case study shows the research, the decisions and the code. Open one when you have five minutes." },
  { targets: ["rm-actions"], eyebrow: "Next step 📬", title: "Let’s talk", text: "Download my résumé, copy a summary for your notes or the hiring manager, or book a call. Thanks for reading!" },
];
const linkedIn = CONTACT.links.find((l) => l.label === "LinkedIn")?.href;

const rise = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.06, duration: 0.5, ease: EASE },
});

// scroll-triggered version of rise(), for sections further down the page
const inView = (i = 0, root) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05, root },
  transition: { delay: i * 0.07, duration: 0.55, ease: EASE },
});

const GLANCE_ICONS = {
  role: "M4 7.5h12v8.5H4zM7.5 7.5V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M4 11h12",
  edu: "M2.5 7.5 10 4l7.5 3.5L10 11zM5.5 9v3.5c0 1.2 2 2.5 4.5 2.5s4.5-1.3 4.5-2.5V9M17.5 7.5V12",
  loc: "M10 17.5s5-4.6 5-8.5a5 5 0 0 0-10 0c0 3.9 5 8.5 5 8.5zM10 10.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z",
  domain: "M3.5 16h13M5.5 13l3.2-3.5 2.6 2 3.7-5M12.5 6.5h2.5V9",
  tools: "M11.5 4.5 15.5 8.5 8 16H4v-4zM10 6l4 4",
  lang: "M3 5h8M7 3v2M5 5c0 3 2 5.5 5 6.5M9 5c0 3-2.5 6-6 7M11 17l3.5-8 3.5 8M12.2 14.5h4.6",
};
function GlanceIcon({ k, tint }) {
  return (
    <span className="shrink-0 w-[26px] h-[26px] mt-0.5 rounded-[7px] flex items-center justify-center text-white" style={{ background: tint }}>
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={GLANCE_ICONS[k] || GLANCE_ICONS.role} />
      </svg>
    </span>
  );
}
function ToolLogo({ kind }) {
  if (kind === "ts")
    return (
      <span className="w-4 h-4 rounded-[3px] bg-[#3178c6] text-white text-[7px] font-bold flex items-end justify-end pr-[1.5px] pb-[1px]" title="TypeScript">
        TS
      </span>
    );
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#61dafb" strokeWidth="1.4" aria-label="React">
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="#61dafb" />
    </svg>
  );
}

function Label({ t, children }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${t.textSub}`}>{children}</div>;
}

function WorkCard({ item, t, onOpen, i }) {
  const project = PROJECTS.find((p) => p.id === item.projectId);
  const tint = project?.tint ?? "#0a84ff";
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className={`group w-full text-left rounded-2xl overflow-hidden flex flex-col @2xl:flex-row ${
        t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      } transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]`}
      {...inView(i)}
      whileHover={{ y: -2 }}
    >
      <span className="relative w-full aspect-[520/240] @2xl:aspect-auto @2xl:w-[320px] @2xl:min-h-[148px] shrink-0 overflow-hidden" style={{ background: `${tint}18` }}>
        {project && <PosterThumb project={project} />}
      </span>
      <span className="flex-1 min-w-0 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: tint }}>
          {item.badge}
        </span>
        <span className={`block mt-1 text-[16px] font-semibold leading-snug tracking-[-0.01em] ${t.textMain}`}>{item.title}</span>
        <span className={`block mt-1 text-[13px] leading-snug ${t.textSub}`}>{item.subtitle}</span>
        <span className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-medium" style={{ color: tint }}>
          Read case study <span className="transition group-hover:translate-x-0.5">→</span>
        </span>
      </span>
    </motion.button>
  );
}

export default function RecruiterModeWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light", onOpenWindow }) {
  const t = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const [copied, setCopied] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  async function copySummary() {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text = [
      `${PROFILE.name} · ${PROFILE.role} at ${PROFILE.company.name} · ${PROFILE.location}`,
      ...GLANCE.map((g) => `${g.label}: ${g.value} (${g.sub})`),
      `Portfolio: ${url}`,
      `Résumé: ${url}/resume.pdf`,
      linkedIn ? `LinkedIn: ${linkedIn}` : null,
      `Email: ${CONTACT.email}`,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  }

  const tile = t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-[#f5f5f7]";

  return (
    <div className={`no-darkwin h-full w-full flex flex-col ${t.windowBg}`}>
      <div className="relative flex-1 min-h-0 overflow-y-auto">
        <div className="grid @4xl:grid-cols-[1fr_380px] gap-8 p-4 @lg:p-6 @2xl:p-8">
          {/* LEFT */}
          <div className="min-w-0">
            <motion.div {...rise(0)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold text-white bg-[hsl(var(--accent))]">
              <span>⚡</span> Recruiter Mode · 30-second overview
            </motion.div>
            <motion.button
              {...rise(0.5)}
              type="button"
              onClick={() => setTourOpen(true)}
              className={`ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${t.isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-black/[0.05] hover:bg-black/[0.08] text-black/75"}`}
            >
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" /></svg>
              20-second walkthrough
            </motion.button>

            <motion.h1 data-tour="rm-name" {...rise(1)} className={`mt-4 text-[36px] @lg:text-[44px] @2xl:text-[52px] font-bold tracking-[-0.035em] leading-[1.02] ${t.textMain}`}>
              <EasterEgg say={<>Say it like a local: <b>MAR-ta len-DEE-neth</b> 🇪🇸<br /><span className="opacity-80 text-[12px]">The “z” is a soft “th”, like in “think”.</span></>}>
                {PROFILE.name}
              </EasterEgg>
            </motion.h1>
            <motion.div {...rise(2)} className={`mt-2 text-[17px] ${t.textBody}`}>
              {PROFILE.role} at{" "}
              <a href={PROFILE.company.url} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${t.accentText}`}>
                {PROFILE.company.name}
              </a>{" "}
              · {PROFILE.location}
            </motion.div>
            <motion.p data-tour="rm-pitch" {...rise(3)} className={`mt-4 max-w-[560px] text-[16px] leading-relaxed ${t.textSub}`}>
              {PITCH}
            </motion.p>

            {/* at a glance: the answers recruiters screen for */}
            <motion.div data-tour="rm-facts" {...rise(4)} className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <Label t={t}>At a glance</Label>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#1a8f3c] bg-[#34c759]/12">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[#34c759] animate-ping opacity-60" />
                    <span className="relative w-2 h-2 rounded-full bg-[#34c759]" />
                  </span>
                  {STATUS}
                </span>
              </div>
              <div className={`grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-px overflow-hidden rounded-[14px] ${t.isDark ? "bg-white/[0.08] ring-1 ring-white/[0.08]" : "bg-black/[0.06] ring-1 ring-black/[0.06]"}`}>
                {GLANCE.map((g) => (
                  <div key={g.key} className={`flex items-start gap-3 px-4 py-3.5 ${t.isDark ? "bg-[#2a2a2c]" : "bg-white"}`}>
                    <GlanceIcon k={g.key} tint={g.tint} />
                    <div className="min-w-0">
                      <div className={`text-[11.5px] ${t.textSub}`}>{g.label}</div>
                      <div className={`mt-0.5 text-[14px] font-semibold leading-snug ${t.textMain}`}>{g.value}</div>
                      {g.key === "tools" ? (
                        <div className="mt-1 flex items-center gap-1.5">
                          <img src="/icons/apps/figma.svg" alt="Figma" className="w-4 h-4" />
                          <ToolLogo kind="react" />
                          <ToolLogo kind="ts" />
                          <span className={`text-[12px] ${t.textSub}`}>+ research</span>
                        </div>
                      ) : (
                        <div className={`text-[12px] leading-snug ${t.textSub}`}>{g.sub}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* strengths */}
            <div data-tour="rm-why" className="mt-9">
              <Label t={t}>Why Marta</Label>
              <div className="mt-3 grid @2xl:grid-cols-3 gap-5">
                {STRENGTHS.map((s, i) => (
                  <motion.div key={s.title} {...inView(i)} whileHover={{ y: -3 }}>
                    <span
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] font-bold text-white shadow-sm"
                      style={{ background: s.tint }}
                    >
                      {s.icon}
                    </span>
                    <div className={`mt-2.5 text-[15px] font-semibold tracking-[-0.01em] ${t.textMain}`}>
                      {s.title === "Research-driven" ? (
                        <EasterEgg say="I’ve asked “why?” so many times my friends think I’m 4 years old." side="top" bubbleClass="max-w-[240px] text-[12.5px]">
                          {s.title}
                        </EasterEgg>
                      ) : (
                        s.title
                      )}
                    </div>
                    <p className={`mt-1 text-[13px] leading-relaxed ${t.textSub}`}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* work */}
            <div data-tour="rm-work" className="mt-9">
              <div className="flex items-baseline justify-between">
                <Label t={t}>Highlighted work</Label>
                <button onClick={() => onOpenWindow?.("projects")} className={`text-[13px] font-medium hover:underline ${t.accentText}`}>
                  All projects →
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {HIGHLIGHTS.map((h, i) => (
                  <WorkCard key={h.windowId} item={h} t={t} i={i} onOpen={() => onOpenWindow?.(h.windowId)} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: photo panel */}
          <motion.div
            className="relative hidden @4xl:block rounded-[22px] overflow-hidden min-h-[560px] self-start sticky top-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <img src={heroImg} alt="Marta Lendínez" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <motion.div
              className="absolute left-4 right-4 bottom-4 rounded-2xl p-4 bg-white/75 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/50 shadow-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-2 text-[12px] font-medium text-black/60">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inset-0 rounded-full bg-[#34c759] animate-ping opacity-60" />
                  <span className="relative w-2.5 h-2.5 rounded-full bg-[#34c759]" />
                </span>
                Currently
              </div>
              <div className="mt-1 text-[16px] font-semibold text-black/85">
                {PROFILE.role} @ {PROFILE.company.name}
              </div>
              <div className="text-[12px] text-black/55">Designing in Figma, building in React</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div data-tour="rm-actions" className={`shrink-0 px-4 @lg:px-6 py-3 flex flex-wrap items-center justify-center @lg:justify-end gap-2 border-t ${t.divider} ${t.toolbarBg}`}>
        <span className={`hidden @lg:inline mr-auto text-[12px] ${t.textSub}`}>Like what you see? 👋</span>
        <EasterEgg say="One page. I promise. Okay, it’s one page." side="top" focusable={false} bubbleClass="max-w-[220px] text-[12.5px]">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={`inline-block px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>
            Download résumé
          </a>
        </EasterEgg>
        <button onClick={copySummary} title="Copy a short summary to paste into your ATS or send to a hiring manager" className={`min-w-[132px] px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={summaryCopied ? "c" : "n"} className="inline-block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {summaryCopied ? "Summary copied ✓" : "📋 Copy summary"}
            </motion.span>
          </AnimatePresence>
        </button>
        <button onClick={copyEmail} className={`min-w-[104px] px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? "c" : "n"} className="inline-block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {copied ? "Copied ✓" : "Copy email"}
            </motion.span>
          </AnimatePresence>
        </button>
        {linkedIn && (
          <a href={linkedIn} target="_blank" rel="noopener noreferrer" className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
            LinkedIn
          </a>
        )}
        <button onClick={() => (window.location.href = CONTACT.bookingHref)} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          📞 Book a call
        </button>
        <button onClick={() => onOpenWindow?.("about")} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          Full profile
        </button>
      </div>
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={RM_STEPS} label="Recruiter highlights" finishLabel="Done" isDark={t.isDark} />
    </div>
  );
}
