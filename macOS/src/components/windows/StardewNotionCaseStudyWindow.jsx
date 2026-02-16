// src/components/windows/StardewNotionCaseStudyWindow.jsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StardewNotionCaseStudyWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";

  // Accent tokens (same pattern as Employer Branding)
  const accentText = isMac ? "text-[hsl(var(--accent))]" : "text-sky-300";
  const accentSoftBg = isMac ? "bg-[hsl(var(--accent)/0.10)]" : "bg-white/10";
  const accentBorder = isMac ? "border-[hsl(var(--accent)/0.35)]" : "border-white/15";

  // Theme tokens
  const textMain = isMac ? "text-black/85" : "text-white/95";
  const textSub = isMac ? "text-black/55" : "text-white/70";
  const textBody = isMac ? "text-black/70" : "text-white/85";

  const pageCard = isMac
    ? "bg-white border border-black/10"
    : "bg-white/10 border border-white/15 backdrop-blur-xl";

  const softCard = isMac
    ? "bg-white border border-black/10"
    : "bg-white/6 border border-white/10";

  const buttonClass = isMac
    ? "bg-white text-black/75 border border-black/10 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] focus:outline-none focus:ring-4 focus:ring-[hsl(var(--accent)/0.25)]"
    : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15";

  const pillClass = isMac
    ? "bg-white text-black/70 border border-black/10"
    : "bg-white/10 text-white/90 border border-white/15";

  const divider = isMac ? "border-black/10" : "border-white/10";

  // Images: keep null until you plug real imports/URLs (exactly like Employer Branding)
  const IMAGES = useMemo(
    () => ({
      hero: null,
      overviewGrid1: null,
      overviewGrid2: null,
      overviewGrid3: null,
      dashboardWide: null,
      seasons: null,
      uiDetails: null,
      rewards: null,
      onboarding: null,
      finalScreens: null,
    }),
    []
  );

  // Lightbox
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const openLightbox = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: null, alt: "" });

  // TOC
  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "summary", label: "Summary" },
      { id: "role", label: "My role" },
      { id: "goals", label: "Goals" },
      { id: "mechanics", label: "Gamification mechanics" },
      { id: "ia", label: "Structure & IA" },
      { id: "ui", label: "UI direction" },
      { id: "iterations", label: "Iterations" },
      { id: "outcome", label: "Final outcome" },
    ],
    []
  );

  const [active, setActive] = useState("overview");

  function scrollToSection(id) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // UI helpers (same style as your Employer Branding file)
  function Pill({ children }) {
    return <span className={`px-3 py-1 rounded-full text-xs border ${pillClass}`}>{children}</span>;
  }

  function BulletList({ items }) {
    return (
      <ul className="mt-3 list-disc pl-5 space-y-2">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  }

  function ImageTile({ src, alt, caption, aspect = "16/9", fit = "cover" }) {
    const aspectClass =
      aspect === "16/9"
        ? "aspect-[16/9]"
        : aspect === "4/3"
        ? "aspect-[4/3]"
        : aspect === "1/1"
        ? "aspect-square"
        : "aspect-[16/9]";

    return (
      <div className={`rounded-3xl overflow-hidden border ${softCard}`}>
        <button
          type="button"
          onClick={() => openLightbox(src, alt)}
          className="w-full text-left"
          disabled={!src}
          title={src ? "Click to zoom" : "Placeholder — set an image in IMAGES"}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className={`w-full h-auto ${fit === "contain" ? "object-contain" : "object-cover"}`}
            />
          ) : (
            <div className={`${aspectClass} flex items-center justify-center`}>
              <div className={`text-xs ${textSub} px-6 text-center`}>
                Add image: <span className="font-semibold">{alt || "placeholder"}</span>
              </div>
            </div>
          )}
        </button>

        {caption ? (
          <div className={`px-5 py-4 text-xs ${textSub} border-t ${divider}`}>{caption}</div>
        ) : null}
      </div>
    );
  }

  function HeroCover() {
    return (
      <div className={`mt-10 rounded-[28px] overflow-hidden border ${softCard}`}>
        <button
          type="button"
          onClick={() => openLightbox(IMAGES.hero, "Cover image")}
          className="w-full text-left"
          disabled={!IMAGES.hero}
          title={IMAGES.hero ? "Click to zoom" : "Hero placeholder — set IMAGES.hero"}
        >
          {IMAGES.hero ? (
            <img src={IMAGES.hero} alt="Cover" className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full aspect-[16/7] flex items-center justify-center">
              <div className="text-center px-6">
                <div className={`text-sm font-semibold ${textMain}`}>Cover image (hero)</div>
                <div className={`mt-2 text-xs ${textSub}`}>
                  Add a wide screenshot of your Notion dashboard / template. <br />
                  Set it as <span className="font-semibold">IMAGES.hero</span>.
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

  function Section({ id, title, subtitle, children }) {
    return (
      <section id={id} className="scroll-mt-6">
        <div className={`mt-10 pt-6 border-t ${divider}`}>
          <div className={`text-xl font-semibold ${textMain}`}>{title}</div>
          {subtitle ? <div className={`mt-1 text-sm ${textSub}`}>{subtitle}</div> : null}
          <div className={`mt-4 text-[15px] leading-7 ${textBody}`}>{children}</div>
        </div>
      </section>
    );
  }

  function Gallery2({ a, b }) {
    return <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">{a}{b}</div>;
  }

  function Gallery3({ a, b, c }) {
    return <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">{a}{b}{c}</div>;
  }

  const metaPills = ["2025", "Personal project", "UX + UI", "Systems Design", "Notion"];

  const facts = [
    { k: "Role", v: "UX / UI Designer" },
    { k: "Timeline", v: "Iterative personal project" },
    { k: "Tools", v: "Notion · Figma (visuals) · Assets" },
    { k: "Focus", v: "Motivation, clarity, and low-maintenance planning" },
  ];

  return (
    <div className="h-full w-full">
      <div className="h-full overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto w-full max-w-[1150px] rounded-[28px] ${pageCard}`}
        >
          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10">
            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {metaPills.map((p) => (
                <Pill key={p}>{p}</Pill>
              ))}
            </div>

            {/* Title */}
            <div className={`mt-5 text-4xl md:text-5xl font-semibold tracking-tight ${textMain}`}>
              Gamified Productivity System
            </div>
            <div className={`mt-3 text-base md:text-lg ${textSub}`}>
              A Stardew-Valley-inspired Notion template that turns planning into a cozy game loop: quests, XP, streaks,
              and rewards — designed to reduce guilt and increase consistency.
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${buttonClass}`}
              >
                Duplicate template
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${buttonClass}`}
              >
                Figma / visuals
              </a>
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
              <div>
                <div className={`text-lg font-semibold ${textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${textBody}`}>
                  Traditional to-do lists can feel punishing: when you miss a day, the list becomes evidence you “failed.”
                  I wanted a system that feels more like{" "}
                  <span className={`font-semibold ${textMain}`}>progress in a cozy game</span>:
                  small wins, visible growth, and gentle recovery when life gets busy.
                  <br /><br />
                  This Notion template reframes tasks as quests, tracks XP and streaks, and includes a reward shop so
                  motivation comes from feedback and play — not pressure.
                </div>
              </div>

              <div>
                <div className={`text-lg font-semibold ${textMain}`}>Quick facts</div>

                <div className={`mt-3 rounded-2xl p-5 border ${softCard}`}>
                  <div className="grid grid-cols-1 gap-3">
                    {facts.map((f) => (
                      <div key={f.k} className={`pb-3 border-b last:border-b-0 ${divider}`}>
                        <div className={`text-xs ${textSub}`}>{f.k}</div>
                        <div className={`mt-1 text-sm font-medium ${textMain}`}>{f.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["UX", "UI", "Notion", "Gamification", "Systems"].map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* HERO */}
            <HeroCover />

            {/* Contents */}
            <div className={`mt-10 rounded-2xl p-5 border ${softCard}`}>
              <div className={`text-sm font-semibold ${textMain}`}>Contents</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {sections.map((s) => {
                  const isActive = active === s.id;

                  const activeClass = isMac
                    ? `${accentSoftBg} ${accentBorder} ${accentText}`
                    : "bg-white/20 border-white/15 text-white";

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        isActive ? activeClass : pillClass
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <Section id="summary" title="Summary" subtitle="Problem → Solution → Result">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Problem</div>
                <div className="mt-2">
                  To-do lists often create guilt and drop-off. When you miss a day, the system feels broken and motivation
                  collapses.
                </div>

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Solution</div>
                <div className="mt-2">
                  A Notion template that uses a cozy progression loop: quests → XP → levels → rewards → reflection, plus
                  “low-energy rules” so the system still works when you’re tired.
                </div>

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Result</div>
                <BulletList
                  items={[
                    "Planning feels playful instead of stressful",
                    "Progress stays visible even with small daily wins",
                    "The system is lightweight enough to maintain long-term",
                  ]}
                />
              </div>

              <Gallery2
                a={<ImageTile src={IMAGES.rewards} alt="Rewards shop" caption="Optional: reward shop view." aspect="16/9" />}
                b={<ImageTile src={IMAGES.onboarding} alt="Onboarding" caption="Optional: onboarding / first-time setup." aspect="16/9" />}
              />
            </Section>

            {/* My role */}
            <Section id="role" title="My role" subtitle="I designed the structure, mechanics, and visuals">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <BulletList
                  items={[
                    "Designed the full Notion information architecture (databases, relations, views)",
                    "Created a gamification model (quests, XP, streaks, rewards, seasonal goals)",
                    "Defined maintenance rules so the system survives low-energy days",
                    "Designed the UI layout for clarity and a cozy aesthetic",
                  ]}
                />
              </div>
            </Section>

            {/* Goals */}
            <Section id="goals" title="Goals" subtitle="What the template must achieve">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>Experience goals</div>
                  <BulletList items={["Feel cozy and encouraging", "Make progress visible", "Reduce guilt and friction"]} />
                </div>

                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>System goals</div>
                  <BulletList items={["Fast to use daily", "Low maintenance", "Scales from simple to power-user"]} />
                </div>
              </div>
            </Section>

            {/* Mechanics */}
            <Section id="mechanics" title="Gamification mechanics" subtitle="The loop and rules behind motivation">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Core loop</div>
                <div className="mt-2">Pick quests → complete → earn XP/coins → level up → redeem rewards → reflect.</div>

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Mechanics</div>
                <BulletList
                  items={[
                    "Quests: Daily (small), Weekly (medium), Boss quests (big)",
                    "XP: earned per quest; levels unlock milestones",
                    "Coins: spend in a reward shop to reinforce completion",
                    "Streaks: optional bonus; designed to be forgiving",
                    "Seasons: monthly themes + reflection prompts to keep goals meaningful",
                  ]}
                />

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Low-energy rules</div>
                <BulletList
                  items={[
                    "Grace days: you can ‘pause’ without losing progress",
                    "Minimum viable win: 1 tiny quest keeps the loop alive",
                    "Catch-up mode: convert missed tasks into smaller quests",
                  ]}
                />
              </div>

              <Gallery3
                a={<ImageTile src={IMAGES.overviewGrid1} alt="Quest board" caption="Quest board / categories." aspect="4/3" />}
                b={<ImageTile src={IMAGES.overviewGrid2} alt="XP & levels" caption="XP + level progression." aspect="4/3" />}
                c={<ImageTile src={IMAGES.overviewGrid3} alt="Daily view" caption="Daily dashboard view." aspect="4/3" />}
              />
            </Section>

            {/* IA */}
            <Section id="ia" title="Structure & IA" subtitle="How the Notion template is organized">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <BulletList
                  items={[
                    "Home Dashboard: today’s quests, energy mode, streak, quick add",
                    "Quest Board: backlog + difficulty + categories",
                    "Progress: XP bar, levels, milestones",
                    "Reward Shop: redeemable items and costs",
                    "Seasons: monthly plan + weekly review",
                  ]}
                />
              </div>

              <Gallery2
                a={<ImageTile src={IMAGES.dashboardWide} alt="Dashboard wide" caption="Optional: wide dashboard screenshot." aspect="16/9" />}
                b={<ImageTile src={IMAGES.seasons} alt="Seasons" caption="Optional: seasons planning view." aspect="16/9" />}
              />
            </Section>

            {/* UI */}
            <Section id="ui" title="UI direction" subtitle="Cozy visuals, clean scanning, minimal friction">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                The UI uses soft panels, clear hierarchy, and game-like language (quests, rewards, seasons) while keeping
                interactions minimal so it stays sustainable long-term.
              </div>

              <div className="mt-6">
                <ImageTile
                  src={IMAGES.uiDetails}
                  alt="UI details"
                  caption="Optional: UI details / typography / layout decisions."
                  aspect="16/9"
                />
              </div>
            </Section>

            {/* Iterations */}
            <Section id="iterations" title="Iterations" subtitle="What I refined over time">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <BulletList
                  items={[
                    "Reduced daily setup time (more defaults, fewer required fields)",
                    "Made streaks forgiving to avoid motivation crashes",
                    "Improved scanning: clearer ‘Today’ area and smaller secondary info",
                    "Added seasonal structure to keep goals meaningful, not just busywork",
                  ]}
                />
              </div>
            </Section>

            {/* Outcome */}
            <Section id="outcome" title="Final outcome" subtitle="A template that feels like a cozy game">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                A ready-to-duplicate Notion template that helps you plan with less guilt and more momentum — designed as a
                lightweight system you can stick to.
              </div>

              <div className="mt-6">
                <ImageTile
                  src={IMAGES.finalScreens}
                  alt="Final screens"
                  caption="Optional: collage of final screens."
                  aspect="16/9"
                />
              </div>
            </Section>

            <div className="mt-10" />
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox.open ? (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <div className="absolute inset-0 bg-black/60" />
              <motion.div
                className={`relative max-w-[1200px] w-full rounded-3xl overflow-hidden border ${
                  isMac ? "border-black/10 bg-white" : "border-white/15 bg-black/30 backdrop-blur-xl"
                }`}
                initial={{ scale: 0.98, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
                  <div className={`text-sm font-semibold ${isMac ? "text-black/80" : "text-white/90"}`}>
                    {lightbox.alt || "Screenshot"}
                  </div>
                  <button className={`px-4 py-2 rounded-2xl text-sm border ${buttonClass}`} onClick={closeLightbox}>
                    Close
                  </button>
                </div>
                <div className="p-5">
                  <img src={lightbox.src} alt={lightbox.alt} className="w-full h-auto rounded-2xl" />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
