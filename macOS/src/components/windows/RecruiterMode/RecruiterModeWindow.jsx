// src/components/windows/RecruiterMode/RecruiterModeWindow.jsx
// 30-second overview for recruiters: pitch, quick facts, strengths, best work and one-click actions.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCaseStudyTheme from "../Projects/caseStudy/useCaseStudyTheme";
import { PROJECTS } from "../Projects/data/projectData";
import { CONTACT, PROFILE } from "../About/aboutData";
import { HIGHLIGHTS, PITCH, QUICK_FACTS, STRENGTHS } from "./data";
import heroImg from "../../../imgs/avatar/model1.jpeg";

const EASE = [0.22, 1, 0.36, 1];
const linkedIn = CONTACT.links.find((l) => l.label === "LinkedIn")?.href;

const rise = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.06, duration: 0.5, ease: EASE },
});

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
      className={`group w-full text-left rounded-2xl overflow-hidden flex ${
        t.isDark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      } transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]`}
      {...rise(6 + i)}
      whileHover={{ y: -2 }}
    >
      <span className="relative w-[132px] shrink-0 overflow-hidden" style={{ background: `${tint}18` }}>
        {project?.thumbnail && (
          <img src={project.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
        )}
        <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: tint }} />
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
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid @4xl:grid-cols-[1fr_380px] gap-8 p-4 @lg:p-6 @2xl:p-8">
          {/* LEFT */}
          <div className="min-w-0">
            <motion.div {...rise(0)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold text-white bg-[hsl(var(--accent))]">
              <span>⚡</span> Recruiter Mode · 30-second overview
            </motion.div>

            <motion.h1 {...rise(1)} className={`mt-4 text-[36px] @lg:text-[44px] @2xl:text-[52px] font-bold tracking-[-0.035em] leading-[1.02] ${t.textMain}`}>
              {PROFILE.name}
            </motion.h1>
            <motion.div {...rise(2)} className={`mt-2 text-[17px] ${t.textBody}`}>
              {PROFILE.role} at{" "}
              <a href={PROFILE.company.url} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${t.accentText}`}>
                {PROFILE.company.name}
              </a>{" "}
              · {PROFILE.location}
            </motion.div>
            <motion.p {...rise(3)} className={`mt-4 max-w-[560px] text-[16px] leading-relaxed ${t.textSub}`}>
              {PITCH}
            </motion.p>

            {/* quick facts */}
            <div className="mt-7 grid grid-cols-1 @md:grid-cols-2 gap-2.5">
              {QUICK_FACTS.map((f, i) => (
                <motion.div key={f.label} {...rise(4 + i * 0.5)} className={`rounded-xl px-3.5 py-3 flex gap-3 ${tile}`}>
                  <span className="text-[18px] leading-none mt-0.5">{f.icon}</span>
                  <span className="min-w-0">
                    <span className={`block text-[11px] ${t.textSub}`}>{f.label}</span>
                    <span className={`block text-[14px] font-semibold leading-snug ${t.textMain}`}>{f.value}</span>
                    <span className={`block text-[12px] leading-snug ${t.textSub}`}>{f.sub}</span>
                  </span>
                </motion.div>
              ))}
            </div>

            {/* strengths */}
            <div className="mt-9">
              <Label t={t}>Why Marta</Label>
              <div className="mt-3 grid @2xl:grid-cols-3 gap-5">
                {STRENGTHS.map((s, i) => (
                  <motion.div key={s.title} {...rise(5 + i * 0.5)}>
                    <span
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] font-bold text-white shadow-sm"
                      style={{ background: s.tint }}
                    >
                      {s.icon}
                    </span>
                    <div className={`mt-2.5 text-[15px] font-semibold tracking-[-0.01em] ${t.textMain}`}>{s.title}</div>
                    <p className={`mt-1 text-[13px] leading-relaxed ${t.textSub}`}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* work */}
            <div className="mt-9">
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
            <img src={heroImg} alt="Marta in Valencia" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md text-white text-[12px] font-medium">
              📍 Valencia, ES
            </span>

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
      <div className={`shrink-0 px-4 @lg:px-6 py-3 flex flex-wrap items-center justify-center @lg:justify-end gap-2 border-t ${t.divider} ${t.toolbarBg}`}>
        <span className={`hidden @lg:inline mr-auto text-[12px] ${t.textSub}`}>Like what you see? 👋</span>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.primaryButtonClass}`}>
          Download résumé
        </a>
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
        <button onClick={() => onOpenWindow?.("about")} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${t.buttonClass}`}>
          Full profile
        </button>
      </div>
    </div>
  );
}
