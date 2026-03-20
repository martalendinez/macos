import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyPill from "./caseStudy/CaseStudyPill";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudySection from "./caseStudy/CaseStudySection";
import { Gallery2, Gallery3 } from "./caseStudy/CaseStudyGalleries";
import CaseStudyImageTile from "./caseStudy/CaseStudyImageTile";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";


import interviewImg from "../../../imgs/case-study/sallskap/Sakura_Interview.png";
import competitorImg from "../../../imgs/case-study/sallskap/Competitor_Analysis_Sakura.png";
import architectureIMG from "../../../imgs/case-study/sallskap/Sakura_Architecture.png";
import securityImg from "../../../imgs/case-study/sallskap/Flowchart_Sakura_Data.png";
import IAImg from "../../../imgs/case-study/kallos/IA.png";
import personaImg from "../../../imgs/case-study/kallos/Persona.png";
import empathyMapImg from "../../../imgs/case-study/kallos/Empathy_Map1.jpg";
import designSystem1Img from "../../../imgs/case-study/kallos/DesignSystem1.png";
import designSystem2Img from "../../../imgs/case-study/kallos/DesignSystem2.png";
import lofiImg from "../../../imgs/case-study/kallos/Lofi.png";
import testingImg from "../../../imgs/case-study/kallos/Testing.png";
import iterationsImg from "../../../imgs/case-study/kallos/Survey_Iterations.png";
import recommendationsImg from "../../../imgs/case-study/kallos/recommendations.png";
import dashboardImg from "../../../imgs/case-study/kallos/Dashboard.png";
import mockupImg from "../../../imgs/case-study/kallos/Kallos_Mockup.png";
import finalImg from "../../../imgs/case-study/kallos/Laptop_Kallos.png";

export default function GroupDiningCaseStudyWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast });

  const IMAGES = useMemo(
    () => ({
      hero: mockupImg,
      competitors: competitorImg,
      interviews: interviewImg,
      designSystem: designSystem1Img,
      designSystem2: designSystem2Img,
      lofi: lofiImg,
      architecture: architectureIMG,
      security: securityImg,
      iaFlow: IAImg,
      persona: personaImg,
      empathyMap: empathyMapImg,
      dashboard: dashboardImg,
      recommendations: recommendationsImg,
      testing: testingImg,
      iterations: iterationsImg,
      finalScreens: finalImg,
    }),
    []
  );

  const [lightbox, setLightbox] = useState({
    open: false,
    src: null,
    alt: "",
  });

  const openLightbox = (src, alt = "") => {
    if (src) setLightbox({ open: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, src: null, alt: "" });
  };

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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const metaPills = [
    "2026",
    "Sällskap",
    "Personal project",
    "UX + Full-stack",
    "Supabase",
    "Lovable · AI-focused",
  ];

  const facts = [
    { k: "Role", v: "UX Designer & Full-stack Developer (UX engineering)" },
    { k: "Timeline", v: "2026 (self-initiated, time-boxed)" },
    { k: "Type", v: "Concept prototype · Web platform" },
    { k: "Focus", v: "Group dining coordination & decision-making" },
    { k: "Tech", v: "React · Supabase · Lovable" },
  ];

  function HeroCover() {
    return (
      <div className={`mt-10 rounded-[28px] overflow-hidden border ${theme.softCard}`}>
        <button
          type="button"
          onClick={() => openLightbox(IMAGES.hero, "Cover image")}
          className="w-full text-left"
        >
          <img src={IMAGES.hero} alt="Cover" className="w-full h-auto object-cover" />
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
              Sällskap — Group Dining Coordination Platform
            </div>
            <div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
              A web-based platform that helps groups coordinate restaurant outings by aligning availability, dietary
              needs, and preferences — designed and built as a UX + full‑stack concept prototype.
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}>
                View Prototype (coming soon)
              </a>
              <a className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}>
                Read Full Case Study (PDF)
              </a>
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
                  Coordinating group dinners is surprisingly hard: different schedules, dietary restrictions, budget
                  constraints, and vague preferences often lead to endless chats and last‑minute compromises. Most tools
                  focus on booking for individuals, not on helping groups make decisions together.
                  <br />
                  <br />
                  Sällskap explores how a web-based coordination flow can help groups quickly align on who’s coming,
                  when they’re free, and which restaurants actually work for everyone — while keeping the experience
                  light, social, and low‑friction.
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
                    {["UX", "Product", "Full-stack", "Supabase", "Lovable", "AI"].map((t) => (
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
                  const activeClass =
                    theme.isMac || theme.isGlassDarkText
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
                  Group dining decisions are messy: coordinating schedules, dietary needs, and preferences usually
                  happens in long chat threads with no structure. Existing restaurant apps optimize for discovery and
                  booking, not for group alignment and decision‑making.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Solution</div>
                <div className="mt-2">
                  A web-based coordination platform where one person creates a group, collects availability and dietary
                  information, and then gets a curated set of restaurant options that work for everyone — with a clear,
                  guided flow from invite to confirmation.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Impact (conceptual)</div>
                <CaseStudyBulletList
                  items={[
                    "Reduces back‑and‑forth in group chats by centralizing decisions in one flow.",
                    "Makes dietary needs visible and respected without putting pressure on individuals.",
                    "Supports faster, more confident restaurant choices for groups.",
                    "Demonstrates how UX + full‑stack thinking can shape coordination tools, not just UIs.",
                  ]}
                />
                <div className={`mt-4 text-sm ${theme.textSub}`}>
                  As a concept prototype, impact is framed qualitatively — focusing on flow clarity, perceived ease, and
                  how well the experience supports real‑world coordination.
                </div>
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.dashboard}
                    alt="Flow highlight"
                    caption="Core coordination flow (placeholder)."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.recommendations}
                    alt="Restaurant selection highlight"
                    caption="Restaurant selection / decision view (placeholder)."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Role */}
            <CaseStudySection
              id="role"
              title="My role"
              subtitle="I led the full UX + engineering process"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                This project was a chance to work as a hybrid UX engineer — shaping the experience and building the
                underlying system.
                <CaseStudyBulletList
                  items={[
                    "Research: informal interviews, desk research on group dining pain points",
                    "UX: flows, low‑fi wireframes, interaction patterns for coordination",
                    "UI: visual language inspired by Scandinavian minimalism with playful touches",
                    "Engineering: React + Supabase backend, Lovable for rapid iteration",
                    "Architecture: schema for groups, members, preferences, and reservations",
                    "Future: planned AI‑assisted suggestions for restaurants and coordination nudges",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Research */}
            <CaseStudySection
              id="research"
              title="Research"
              subtitle="Group chats, coordination pain points, and expectations"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Context & desk research</div>
                <div className="mt-2">
                  I started by mapping how people currently coordinate group dinners: messaging apps, scattered polls,
                  and ad‑hoc spreadsheets. Most tools solve either discovery or booking — not the messy middle where
                  people negotiate constraints.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Lightweight interviews</div>
                <div className="mt-2">
                  I spoke informally with friends and peers who often organize group dinners. The focus was on:
                </div>
                <CaseStudyBulletList
                  items={[
                    "What makes group planning frustrating?",
                    "How do they currently handle dietary restrictions?",
                    "Who usually takes the lead, and what do they struggle with?",
                    "What “ideal flow” would feel respectful and low‑effort?",
                  ]}
                />

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Key insights</div>
                <CaseStudyBulletList
                  items={[
                    "Organizers feel responsible for making everyone happy but lack tools to see constraints clearly.",
                    "Dietary needs are often handled privately, which can lead to last‑minute changes or stress.",
                    "People want to avoid endless back‑and‑forth — a clear, guided flow is preferred.",
                    "Mobile‑friendly, low‑friction interactions are essential for real‑world use.",
                  ]}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
                <CaseStudyImageTile
                  src={IMAGES.competitors}
                  alt="Competitor analysis"
                  caption="Competitor analysis of existing tools."
                  aspect="auto"
                  fit="contain"
                  theme={theme}
                  onOpen={openLightbox}
                />

                <CaseStudyImageTile
                  src={IMAGES.interviews}
                  alt="Interview notes"
                  caption="Early notes on coordination pain points."
                  aspect="auto"
                  fit="contain"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>
            {/* Requirements */}
            <CaseStudySection
              id="requirements"
              title="Requirements"
              subtitle="Clarity, inclusivity, and low-friction coordination"
              theme={theme}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Design requirements</div>
                  <CaseStudyBulletList
                    items={[
                      "Clear, guided flow from group creation to confirmation",
                      "Inclusive handling of dietary needs without singling people out",
                      "Mobile‑friendly, scannable UI with minimal cognitive load",
                      "Calm, welcoming visual language for mixed groups",
                    ]}
                  />
                </div>

                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Engineering requirements</div>
                  <CaseStudyBulletList
                    items={[
                      "Simple, robust schema for groups, members, preferences, and reservations",
                      "Supabase as a reliable backend with RLS for basic data safety",
                      "Clean React architecture for future extensibility",
                      "Lovable‑friendly structure for rapid iteration and deployment",
                    ]}
                  />
                </div>
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.security}
                    alt="Architecture / data model"
                    caption="Early thinking on data model and flows."
                    aspect="16/9"
                    fit="contain"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.architecture}
                    alt="System architecture (placeholder)"
                    caption="High-level architecture for the web app."
                    aspect="16/9"
                    fit="contain"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Concept */}
            <CaseStudySection
              id="concept"
              title="Concept"
              subtitle="From messy chats → structured, gentle coordination"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                The core concept behind{" "}
                <span className={`font-semibold ${theme.textMain}`}>Sällskap</span> is to turn chaotic group chats into
                a structured, gentle flow that respects everyone’s needs. Instead of asking people to argue about
                restaurants, the platform:
                <CaseStudyBulletList
                  items={[
                    "Collects who’s joining and when they’re available",
                    "Captures dietary restrictions and preferences in a respectful way",
                    "Surfaces restaurants that work for the whole group",
                    "Guides the organizer to a clear, confident confirmation",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Users & IA */}
            <CaseStudySection
              id="uxia"
              title="Users & Information Architecture"
              subtitle="Organizer vs. participant, flows, and content"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                I mapped two primary roles — the organizer and the invited participants — and designed flows that keep
                the organizer in control without overloading them. The IA focuses on a single, linear journey:
                <CaseStudyBulletList
                  items={[
                    "Create group → define context (occasion, city, date range)",
                    "Add members → collect availability and dietary needs",
                    "Browse restaurants → filtered by group constraints",
                    "Confirm reservation → share outcome back to the group",
                  ]}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <CaseStudyImageTile
                  src={IMAGES.persona}
                  alt="Persona (placeholder)"
                  caption="Organizer persona: social, responsible, time‑poor."
                  aspect="16/10"
                  fit="cover"
                  theme={theme}
                  onOpen={openLightbox}
                />

                <CaseStudyImageTile
                  src={IMAGES.empathyMap}
                  alt="Empathy map (placeholder)"
                  caption="Mapping organizer frustrations and motivations."
                  aspect="16/10"
                  fit="cover"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.iaFlow}
                  alt="Information architecture / user flow (placeholder)"
                  caption="High-level flow from group creation to confirmation."
                  aspect="4/3"
                  fit="contain"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            {/* UI design */}
            <CaseStudySection
              id="ui"
              title="UI design"
              subtitle="Scandinavian minimalism with playful, social touches"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                The UI combines a calm, Scandinavian base with subtle playful elements — rounded cards, soft colors, and
                friendly typography — to make coordination feel less like admin and more like planning something fun.
              </div>

              <Gallery3
                a={
                  <CaseStudyImageTile
                    src={IMAGES.designSystem}
                    alt="Design system (placeholder)"
                    caption="Color system and base components."
                    aspect="16/10"
                    fit="contain"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.designSystem2}
                    alt="Design system (placeholder)"
                    caption="Typography, buttons, and interaction states."
                    aspect="16/10"
                    fit="contain"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                c={
                  <CaseStudyImageTile
                    src={IMAGES.lofi}
                    alt="Low-fi (placeholder)"
                    caption="Low‑fi sketches of the core flow."
                    aspect="16/10"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>
            {/* Development */}
            <CaseStudySection
              id="development"
              title="Development"
              subtitle="How the build supports the experience"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                The prototype is built as a web app using React and Supabase, with Lovable enabling rapid iteration.
                <CaseStudyBulletList
                  items={[
                    "React front‑end with modular flows (auth, onboarding, restaurants, reservations)",
                    "Supabase for groups, members, restaurants, and reservations data",
                    "Routing and state structured around the booking journey",
                    "Room to later integrate AI‑assisted restaurant suggestions and smart defaults",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Key features */}
            <CaseStudySection
              id="features"
              title="Key features"
              subtitle="Where groups get value"
              theme={theme}
            >
              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.dashboard}
                    alt="Flow screen (placeholder)"
                    caption="Overview of a group’s coordination status."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.recommendations}
                    alt="Restaurant selection (placeholder)"
                    caption="Filtered restaurant options that respect group constraints."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Testing & iterations (placeholder) */}
            <CaseStudySection
              id="testing"
              title="Testing & iterations"
              subtitle="Planned usability testing for the core flow"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                This prototype is now ready for usability testing. The next step is to run short, moderated sessions
                with 3–5 participants who regularly organize group dinners.
                <div className="mt-3">
                  The testing will focus on:
                  <ul className="list-disc ml-5 mt-2 text-sm">
                    <li>How easily organizers can create a group and add members</li>
                    <li>Whether availability and dietary steps feel clear and respectful</li>
                    <li>How intuitive the restaurant selection and confirmation flow feels</li>
                    <li>Where friction or confusion appears in the journey</li>
                  </ul>
                </div>
                <div className="mt-4 text-sm">
                  Once testing is completed, this section will be updated with concrete findings, quotes, and the
                  iterations made to improve the experience.
                </div>
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.testing}
                    alt="Testing (placeholder)"
                    caption="Placeholder for future usability testing artifacts."
                    aspect="4/3"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.iterations}
                    alt="Iterations (placeholder)"
                    caption="Placeholder for future iteration documentation."
                    aspect="4/3"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Trade-offs */}
            <CaseStudySection
              id="tradeoffs"
              title="Trade-offs"
              subtitle="Constraints that shaped the prototype"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <CaseStudyBulletList
                  items={[
                    "Time-boxed scope: focused on one core flow instead of multiple edge cases",
                    "Concept prototype: no production‑grade auth or payments yet",
                    "Placeholder restaurant data: real integrations would change some UX details",
                    "AI features scoped for later: current version focuses on clear, manual control",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Impact */}
            <CaseStudySection
              id="impact"
              title="Impact"
              subtitle="What this prototype demonstrates"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Conceptual impact</div>
                <div className={`mt-3 ${theme.textBody}`}>
                  Sällskap demonstrates how UX thinking and full‑stack implementation can reshape a familiar but
                  under‑served problem: group dining coordination. Even as a concept prototype, it:
                  <CaseStudyBulletList
                    items={[
                      "Shows a structured, respectful way to handle dietary needs in group contexts",
                      "Highlights how a single, guided flow can reduce coordination friction",
                      "Provides a foundation for future AI‑assisted suggestions and nudges",
                    ]}
                  />
                </div>
              </div>
            </CaseStudySection>

            {/* Final outcome */}
            <CaseStudySection
              id="outcome"
              title="Final outcome"
              subtitle="What was delivered and why it matters"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                A working web prototype that takes a group from “we should have dinner” to a concrete restaurant
                reservation — while respecting constraints, reducing friction, and leaving room for future AI‑powered
                enhancements.
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.finalScreens}
                  alt="Final screens (placeholder)"
                  caption="Final mockup (placeholder) — to be replaced with Sällskap UI."
                  fit="contain"
                  aspect="16/9"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            <div className="mt-10" />
          </div>
        </motion.div>

        <CaseStudyLightbox
          open={lightbox.open}
          src={lightbox.src || ""}
          alt={lightbox.alt}
          onClose={closeLightbox}
          theme={theme}
        />
      </div>
    </div>
  );
}
