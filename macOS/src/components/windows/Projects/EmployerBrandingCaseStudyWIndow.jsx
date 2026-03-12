import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyPill from "./caseStudy/CaseStudyPill";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudySection from "./caseStudy/CaseStudySection";
import { Gallery2, Gallery3 } from "./caseStudy/CaseStudyGalleries";
import CaseStudyImageTile from "./caseStudy/CaseStudyImageTile";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import interviewImg from "../../../imgs/case-study/kallos/Interview.png";
import competitorImg from "../../../imgs/case-study/kallos/competitor_analysis.png";

export default function EmployerBrandingCaseStudyWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast });

  // Images (plug real imports/urls later)
  const IMAGES = useMemo(
    () => ({
      hero: null,
      competitors: competitorImg,
      interviews: interviewImg,
      designSystem: null,
      lofi: null,
      hifi: null,
      architecture: null,
      security: null,
      dashboard: null,
      recommendations: null,
      testing: null,
      iterations: null,
      finalScreens: null,
    }),
    []
  );

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const openLightbox = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: null, alt: "" });

  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "summary", label: "Summary" },
      { id: "role", label: "My role" },
      { id: "research", label: "Research" },
      { id: "requirements", label: "Requirements" },
      { id: "concept", label: "Concept" },
      { id: "uxia", label: "Users & IA" },
      { id: "ui", label: "UI design" },
      { id: "development", label: "Development" },
      { id: "features", label: "Key features" },
      { id: "testing", label: "Testing & iterations" },
      { id: "tradeoffs", label: "Trade-offs" },
      { id: "impact", label: "Impact" },
      { id: "outcome", label: "Final outcome" },
    ],
    []
  );

  const [active, setActive] = useState("overview");
  function scrollToSection(id) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const metaPills = ["2024", "PrideCom", "UX + Full-stack", "AI (LLaMA 3)", "Security / GDPR"];

  const facts = [
    { k: "Role", v: "UX Designer & Developer (hybrid UX engineering)" },
    { k: "Timeline", v: "Feb–Jun 2024 (4 months)" },
    { k: "Team", v: "3 designers" },
    { k: "Industry", v: "HR & Communication" },
    { k: "Tech", v: "Python · Flask · PostgreSQL · Docker · LM Studio (LLaMA 3)" },
  ];

  function HeroCover() {
    return (
      <div className={`mt-10 rounded-[28px] overflow-hidden border ${theme.softCard}`}>
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
                <div className={`text-sm font-semibold ${theme.textMain}`}>Cover image (hero)</div>
                <div className={`mt-2 text-xs ${theme.textSub}`}>
                  Add a wide screenshot of your dashboard / product in context. <br />
                  Set it as <span className="font-semibold">IMAGES.hero</span>.
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

  function IconChip() {
    if (!theme.isMac) return null;
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[hsl(var(--accent)/0.10)] border border-[hsl(var(--accent)/0.35)]">
        <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />
      </span>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="h-full overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto w-full max-w-[1150px] rounded-[28px] ${theme.pageCard}`}
        >
          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10">
            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {metaPills.map((p) => (
                <CaseStudyPill key={p} theme={theme}>
                  {p}
                </CaseStudyPill>
              ))}
            </div>

            {/* Title */}
            <div className={`mt-5 text-4xl md:text-5xl font-semibold tracking-tight ${theme.textMain}`}>
              Employer Branding Platform
            </div>
            <div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
              UX Design & Full-Stack Development for PrideCom — a secure, AI-powered platform that helps SMEs understand
              and improve their employer brand.
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
  href="https://github.com/martalendinez/Kallos"
  target="_blank"
  rel="noreferrer"
  className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
>
  View on GitHub
</a>
              <a
  href="/pdfs/Case-Study-Kallos.pdf"
  target="_blank"
  rel="noreferrer"
  className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
>
  Read Full Case Study
</a>
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
                  SMEs often don’t have the budget for employer branding consultancy. Meanwhile, many existing platforms
                  rely heavily on survey data and focus on single slices of the problem. The result: HR teams struggle to
                  build a holistic, actionable understanding of their employer brand.
                  <br />
                  <br />
                  This project explored how an AI-assisted workflow could help HR teams synthesize employer branding signals
                  into a single dashboard, generate a transparent score, and translate insights into practical recommendations —
                  while meeting high trust and privacy requirements.
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <IconChip />
                  <div className={`text-lg font-semibold ${theme.textMain}`}>Quick facts</div>
                </div>

                <div className={`mt-3 rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className="grid grid-cols-1 gap-3">
                    {facts.map((f) => (
                      <div key={f.k} className={`pb-3 border-b last:border-b-0 ${theme.divider}`}>
                        <div className={`text-xs ${theme.textSub}`}>{f.k}</div>
                        <div className={`mt-1 text-sm font-medium ${theme.textMain}`}>{f.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["UX", "Product", "AI", "Full-stack", "Security", "GDPR"].map((t) => (
                      <CaseStudyPill key={t} theme={theme}>
                        {t}
                      </CaseStudyPill>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <HeroCover />

            {/* Contents */}
            <div className={`mt-10 rounded-2xl p-5 border ${theme.softCard}`}>
              <div className={`text-sm font-semibold ${theme.textMain}`}>Contents</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sections.map((s) => {
                  const isActive = active === s.id;
                  const activeClass = theme.isMac || theme.isGlassDarkText
                    ? `${theme.accentSoftBg} ${theme.accentBorder} ${theme.accentText}`
                    : "bg-white/20 border-white/15 text-white";

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        isActive ? activeClass : theme.pillClass
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <CaseStudySection id="summary" title="Summary" subtitle="Problem → Solution → Impact" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Problem</div>
                <div className="mt-2">
                  SMEs often lack the budget for employer branding consultancy. Existing tools focus on isolated areas and rely heavily on surveys,
                  leaving HR teams without a holistic view of their employer brand.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Solution</div>
                <div className="mt-2">
                  A secure, AI-powered platform that analyzes employer branding, generates a numerical score, and provides tailored recommendations
                  through a clean, intuitive dashboard.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Impact</div>
                <CaseStudyBulletList
                  items={[
                    "All participants completed the full flow without assistance, confirming an intuitive, low-friction experience.",
                    "Every HR professional interpreted the dashboard and visualizations immediately, showing strong information clarity.",
                    "Recommendations were described as actionable and aligned with HR best practices.",
                    "The interface was praised as modern, professional, and visually clean.",
                  ]}
                />
                <div className={`mt-4 text-sm ${theme.textSub}`}>
                  Quotes: “Everything is very clear.” · “Very good, very in line with HR vocabulary.” · “Very modern and professional.”
                </div>
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.dashboard}
                    alt="Dashboard highlight"
                    caption="Optional: key dashboard view."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.recommendations}
                    alt="Recommendations highlight"
                    caption="Optional: recommendations view."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Role */}
            <CaseStudySection id="role" title="My role" subtitle="I led the full UX + engineering process" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                This project let me work as a hybrid UX engineer — designing the experience and building the system behind it.
                <CaseStudyBulletList
                  items={[
                    "Research: competitor analysis, expert interviews, literature review",
                    "UX: personas, journeys, IA, low-fi and high-fi prototypes",
                    "UI: design system aligned with PrideCom’s brand",
                    "Engineering: Flask backend, PostgreSQL database, LLaMA 3 integration (via LM Studio)",
                    "Security: encryption (PyNaCl), GDPR-aligned data handling",
                    "Testing: user testing, iterations, refinements",
                    "Deployment: Docker containerization and VM setup",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Research */}
<CaseStudySection id="research" title="Research" subtitle="Competitors + expert interviews + what we learned" theme={theme}>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-sm font-semibold ${theme.textMain}`}>Competitor analysis</div>
    <div className="mt-2">
      CultureAmp, Eletive, and Populum were analyzed. None offered a holistic employer branding solution; all relied heavily on surveys.
    </div>

    <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Expert interviews</div>
    <div className="mt-2">
      To validate feasibility and trust requirements, I interviewed experts across HR, security, and AI:
    </div>
    <CaseStudyBulletList items={["HR Director at Toyota", "Marketing Lead at Accenture", "Cybersecurity expert", "AI engineer"]} />

    <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Key insights</div>
    <CaseStudyBulletList
      items={[
        "HR teams want automated data processing and clear dashboards for fast decision-making.",
        "Strong encryption and GDPR compliance are essential to build trust.",
        "AI should support recommendations — not replace HR judgment.",
      ]}
    />
  </div>
<div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
  <CaseStudyImageTile
    src={IMAGES.competitors}
    alt="Competitor analysis"
    caption="Competitor matrix / feature comparison."
    aspect="auto"
    fit="contain"
    theme={theme}
    onOpen={openLightbox}
  />

  <CaseStudyImageTile
    src={IMAGES.interviews}
    alt="Expert interviews"
    caption="Interview notes / themes / synthesis."
    aspect="auto"
    fit="contain"
    theme={theme}
    onOpen={openLightbox}
  />
</div>
</CaseStudySection>

            {/* Requirements */}
            <CaseStudySection id="requirements" title="Requirements" subtitle="Clarity + trust constraints" theme={theme}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Design requirements</div>
                  <CaseStudyBulletList items={["Clear dashboards that support scanning", "Clean, legible, brand-consistent UI", "Simple, intuitive experience for HR users"]} />
                </div>

                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Engineering requirements</div>
                  <CaseStudyBulletList items={["Clean architecture (SOLID principles)", "Encrypted data handling (PyNaCl)", "GDPR-aligned data flows and storage", "Secure authentication", "Reliable PostgreSQL schema"]} />
                </div>
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.security}
                    alt="Security / GDPR"
                    caption="Security model / GDPR considerations."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.architecture}
                    alt="Architecture"
                    caption="System architecture at a glance."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            <CaseStudySection id="concept" title="Concept" subtitle="From options → chosen direction → scoped feature set" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                Using the Six Thinking Hats method, I explored four concepts. The chosen concept was{" "}
                <span className={`font-semibold ${theme.textMain}`}>Holistic Employer Branding</span>.
              </div>
            </CaseStudySection>

            <CaseStudySection id="uxia" title="Users & Information Architecture" subtitle="Personas, journeys, content inventory, flowchart" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                I designed personas, empathy maps, user journeys, a content inventory, and a full design flowchart.
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.iaFlow}
                  alt="Information architecture / user flow"
                  caption="IA and user flow (add your flowchart screenshot here)."
                  aspect="16/9"
                  fit="contain"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            <CaseStudySection id="ui" title="UI design" subtitle="Design system + low-fi → high-fi" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                I created a design system aligned with PrideCom’s brand and developed low-fi and high-fi prototypes.
              </div>

              <Gallery3
                a={<CaseStudyImageTile src={IMAGES.designSystem} alt="Design system" caption="Tokens, components, typography, spacing." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.lofi} alt="Low-fi" caption="Low-fi key screens." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                c={<CaseStudyImageTile src={IMAGES.hifi} alt="High-fi" caption="High-fi key screens." aspect="4/3" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="development" title="Development" subtitle="How the build supported UX quality, security, and reliability" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                Built with Python, Flask, PostgreSQL, LM Studio (LLaMA 3), and Docker.
              </div>
            </CaseStudySection>

            <CaseStudySection id="features" title="Key features" subtitle="Where HR teams get value" theme={theme}>
              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.dashboard} alt="Dashboard screen" caption="Dashboard view." aspect="16/9" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.recommendations} alt="Recommendations screen" caption="Recommendations view." aspect="16/9" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="testing" title="Testing & iterations" subtitle="What changed after testing with HR professionals" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                Seven HR professionals tested the prototype.
              </div>

              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.testing} alt="Testing" caption="Testing setup / tasks / notes." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.iterations} alt="Iterations" caption="Before/after changes and iterations." aspect="4/3" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="tradeoffs" title="Trade-offs" subtitle="Constraints that shaped the product" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <CaseStudyBulletList items={["4-month timeline (scope had to be tight and prioritized)", "GDPR + encryption requirements (trust first)", "Limited real-world data (careful framing of results)"]} />
              </div>
            </CaseStudySection>

            <CaseStudySection id="impact" title="Impact" subtitle="What HR professionals validated" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Quotes</div>
                <div className={`mt-3 ${theme.textBody}`}>
                  “Everything is very clear.” · “Very good, very in line with HR vocabulary.” · “Very modern and professional.”
                </div>
              </div>
            </CaseStudySection>

            <CaseStudySection id="outcome" title="Final outcome" subtitle="What was delivered and why it matters" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                A secure, AI-powered platform that helps SMEs understand and improve their employer brand.
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.finalScreens}
                  alt="Final screens"
                  caption="Optional: a collage of final key screens."
                  aspect="16/9"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            <div className="mt-10" />
          </div>
        </motion.div>

        <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} theme={theme} />
      </div>
    </div>
  );
}