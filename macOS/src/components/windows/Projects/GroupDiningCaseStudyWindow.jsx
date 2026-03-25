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
import personaImg from "../../../imgs/case-study/sallskap/Elina_Persona.png";
import empathyMapImg from "../../../imgs/case-study/sallskap/Elina_Empathy_Map.png";
import designSystem1Img from "../../../imgs/case-study/kallos/DesignSystem1.png";
import designSystem2Img from "../../../imgs/case-study/kallos/DesignSystem2.png";
import lofiImg from "../../../imgs/case-study/kallos/Lofi.png";
import testingImg from "../../../imgs/case-study/kallos/Testing.png";
import iterationsImg from "../../../imgs/case-study/kallos/Survey_Iterations.png";
import recommendationsImg from "../../../imgs/case-study/kallos/recommendations.png";
import dashboardImg from "../../../imgs/case-study/kallos/Dashboard.png";
import mockupImg from "../../../imgs/case-study/kallos/Kallos_Mockup.png";
import finalImg from "../../../imgs/case-study/kallos/Laptop_Kallos.png";

export default function GroupDiningCaseStudyWindow({
  uiTheme = "glass",
  glassContrast = "light",
}) {
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
  if (src) {
    setLightbox({
      open: true,
      src,
      alt,
    });
  }
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
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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
            <div
              className={`mt-5 text-4xl md:text-5xl font-semibold tracking-tight ${theme.textMain}`}
            >
              Sällskap — Group Dining Coordination Platform
            </div>
            <div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
              A web-based platform that helps groups coordinate restaurant outings by aligning
              availability, dietary needs, and preferences — designed and built as a UX + full‑stack
              concept prototype.
            </div>
{/* CTAs: Live app + GitHub + Full Case Study */}
<div className="mt-6 flex flex-wrap gap-2">
  <a
    href="https://sallskap-git-main-martalendinezs-projects.vercel.app"
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    View Live App
  </a>

  <a
    href="https://github.com/martalendinez/Sallskap"
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    View GitHub Repo
  </a>

  <a
    href="/Sallskap_Case_Study.pdf" 
    target="_blank"
    rel="noreferrer"
    className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}
  >
    Read Full Case Study
  </a>
</div>


            {/* Overview */}
            <div
              id="overview"
              className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6"
            >
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
<div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
  Coordinating group dinners sounds simple, but in reality it’s a messy, fragmented process.
  Different schedules, dietary needs, budgets, and preferences quickly turn into long chat
  threads, unclear decisions, and last‑minute compromises.
  <br /><br />
  Most restaurant platforms are built for individual bookings — not for helping a group align
  on who’s coming, when they’re free, and which restaurants actually work for everyone.
  <br /><br />
  Sällskap introduces a structured, web‑based flow that brings clarity to group coordination:
  collecting availability, capturing dietary needs, and surfacing restaurants that fit the
  whole group. The goal is to make planning feel light, social, and low‑friction.
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
                      <div
                        key={f.k}
                        className={`pb-3 border-b last:border-b-0 ${theme.divider}`}
                      >
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
<CaseStudySection
  id="summary"
  title="Summary"
  subtitle="Problem → Solution → Impact"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    <div className={`text-sm font-semibold ${theme.textMain}`}>Problem</div>
    <div className="mt-2">
      Group dining decisions are messy: coordinating schedules, dietary needs, and preferences
      usually happens in long chat threads with no structure. Existing restaurant apps optimize
      for discovery and booking, not for group alignment and decision‑making.
    </div>

    <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Solution</div>
    <div className="mt-2">
      A web-based coordination platform where one person creates a group, collects availability
      and dietary information, and then gets a curated set of restaurant options that work for
      everyone — with a clear, guided flow from invite to confirmation.
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
      As a concept prototype, impact is framed qualitatively — focusing on flow clarity,
      perceived ease, and how well the experience supports real‑world coordination.
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
    This project was a chance to work as a hybrid UX engineer — shaping the experience and
    building the underlying system.
    <CaseStudyBulletList
      items={[
        "Research: competitive analysis, 5 user interviews, discovery of unmet needs",
        "UX: flows, low‑fi wireframes, interaction patterns for coordination",
        "UI: Scandinavian minimalism with soft neutrals and calm geometry",
        "Engineering: React + Supabase backend, Lovable for rapid iteration",
        "Architecture: schema for groups, members, preferences, and reservations",
      ]}
    />
  </div>
</CaseStudySection>

{/* Research */}
<CaseStudySection
  id="research"
  title="Research"
  subtitle="Competitive landscape, user interviews, and a shift in direction"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>

    {/* Initial Direction */}
    <div className={`text-sm font-semibold ${theme.textMain}`}>Initial direction</div>
    <div className="mt-2">
      The project began as a broader concept: a platform supporting both <strong>solo diners </strong> 
      and <strong>groups</strong>, with a focus on dietary needs, menu transparency, and seating preferences.
      To validate the opportunity, I ran a competitive analysis and conducted five user interviews with 
      young adults and adults who dine out regularly.
    </div>

    {/* Competitive Analysis Summary */}
    <div className={`mt-6 text-sm font-semibold ${theme.textMain}`}>
      Competitive analysis — key takeaways
    </div>
    <div className="mt-2 text-[15px] leading-7">
      I compared major platforms (OpenTable, Resy, TheFork, Bookatable, Quandoo) to understand how well 
      they support both solo and group diners. Three clear gaps emerged:
      <ul className="list-disc ml-5 mt-2">
        <li><strong>No platform supports group decision‑making</strong> — coordination still happens in chat apps.</li>
        <li><strong>Dietary needs are handled superficially</strong> — usually as a free‑text “special request.”</li>
        <li><strong>Personalization is minimal</strong> — recommendations are generic, not based on group constraints.</li>
      </ul>
      These gaps pointed toward a stronger opportunity in <strong>group coordination</strong> rather than solo dining.
    </div>

    {/* Interview Summary */}
    <div className={`mt-6 text-sm font-semibold ${theme.textMain}`}>
      User interviews — biggest insights
    </div>
    <div className="mt-2 text-[15px] leading-7">
      I interviewed five participants (ages 22–45) who frequently organize or join group dinners. 
      The most consistent patterns were:
      <ul className="list-disc ml-5 mt-2">
        <li><strong>Group planning is chaotic</strong> — WhatsApp threads, polls, and scattered preferences slow everything down.</li>
        <li><strong>Dietary needs are sensitive</strong> — people want them respected without feeling singled out.</li>
        <li><strong>Restaurant discovery is fragmented</strong> — users bounce between Maps, Instagram, and booking apps.</li>
        <li><strong>Organizers carry the mental load</strong> — they feel responsible for making everyone happy.</li>
      </ul>
    </div>

    {/* Pivot */}
    <div className={`mt-6 text-sm font-semibold ${theme.textMain}`}>
      Why I shifted the concept
    </div>
    <div className="mt-2 text-[15px] leading-7">
      Both research streams pointed to the same conclusion: 
      <strong> group dining coordination is the real, underserved problem. </strong>   
       Solo dining had interesting emotional insights, but the clearest opportunity for impact — and 
      the biggest UX gap — was helping groups align on availability, dietary needs, and restaurant choices.
      <br /><br />
      This led to a focused product direction: a structured, low‑friction flow designed specifically 
      for group decision‑making.
    </div>
  </div>


 {/* Competitor Analysis Image */}
<div className="mt-6">
  <CaseStudyImageTile
    src={IMAGES.competitors}
    alt="Competitor analysis"
    caption="Snapshot of competitive analysis."
    aspect="16/9"
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
  subtitle="Clarity, inclusivity, and low‑friction coordination"
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
        alt="System architecture"
        caption="High‑level architecture for the web app."
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
    <span className={`font-semibold ${theme.textMain}`}>Sällskap</span> is to turn chaotic group
    chats into a structured, gentle flow that respects everyone’s needs. Instead of asking people
    to argue about restaurants, the platform:
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
    I mapped a for the role of the organizer and designed flows
    that keep them in control without overloading them. The IA focuses on a single,
    linear journey:
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
      alt="Persona"
      caption="Organizer persona: social, responsible, time‑poor."
      aspect="16/10"
      fit="cover"
      theme={theme}
      onOpen={openLightbox}
    />

    <CaseStudyImageTile
      src={IMAGES.empathyMap}
      alt="Empathy map"
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
      alt="Information architecture / user flow"
      caption="High‑level flow from group creation to confirmation."
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
   The interface uses a Scandinavian‑inspired aesthetic: light backgrounds, soft shadows, rounded
geometry, and a calm green accent that carries the brand. The spacing is generous, the typography
is approachable, and the components feel airy and modern.

  </div>

  <Gallery3
    a={
      <CaseStudyImageTile
        src={IMAGES.designSystem}
        alt="Design system"
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
        alt="Design system 2"
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
        alt="Low-fi sketches"
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
    The prototype is built as a web app using React and Supabase, with Lovable enabling rapid
    iteration. The goal was to create a clean, modular foundation that could scale into a
    production‑ready coordination tool.
    <CaseStudyBulletList
      items={[
        "React front‑end with modular flows (group creation, availability, dietary, restaurants, reservations)",
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
        alt="Flow screen"
        caption="Overview of a group’s coordination status."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    }
    b={
      <CaseStudyImageTile
        src={IMAGES.recommendations}
        alt="Restaurant selection"
        caption="Filtered restaurant options that respect group constraints."
        aspect="16/9"
        theme={theme}
        onOpen={openLightbox}
      />
    }
  />
</CaseStudySection>

{/* Testing & iterations */}
<CaseStudySection
  id="testing"
  title="Testing & iterations"
  subtitle="Usability testing with real tasks"
  theme={theme}
>
  <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
    I tested the prototype with 5 participants (from the intial interviews).
    Sessions were short, task‑based, and focused on clarity, friction, and confidence.

    <div className="mt-4 text-sm font-semibold">Tasks used in testing</div>
    <ul className="list-disc ml-5 mt-2 text-sm leading-6">
      <li><strong>Task 1 — Create a group:</strong> “Create a new group and add at least two members.”</li>
      <li><strong>Task 2 — Add availability & restrictions:</strong> “Set availability for each member.” / “Add dietary restrictions for each member.”</li>
      <li><strong>Task 3 — Browse restaurants:</strong> “Choose a restaurant that fits your group’s needs.”</li>
      <li><strong>Task 4 — View menu & confirm:</strong> “Open the menu of a restaurant you’re interested in.” / “Confirm the booking.”</li>
      <li><strong>Task 5 — Review reservation:</strong> “Find your reservation in the My Reservations section.”</li>
    </ul>
  </div>

  <Gallery2
    a={
      <CaseStudyImageTile
        src={IMAGES.testing}
        alt="Testing artifacts"
        caption="Testing artifacts and notes."
        aspect="4/3"
        theme={theme}
        onOpen={openLightbox}
      />
    }
    b={
      <CaseStudyImageTile
        src={IMAGES.iterations}
        alt="Iterations"
        caption="Iterations planned based on testing insights."
        aspect="4/3"
        theme={theme}
        onOpen={openLightbox}
      />
    }
  />

{/* Iterations */}
<div className="mt-10">
  <div className={`text-lg font-semibold ${theme.textMain}`}>Iterations</div>

  <div className="mt-6">
    <div className={`text-sm font-semibold ${theme.textMain}`}>Key improvements made after testing</div>
    <CaseStudyBulletList
      items={[
        "Added a Back button across the entire flow to reduce dead-ends and increase confidence",
        "Redesigned navigation icons and added labels to improve scannability and reduce guesswork",
        "Improved restaurant cards with clearer affordances and more visible interaction cues",
        "Added full restaurant details (address, phone, dietary tags) to support decision-making",
        "Reworked the share action to use native sharing options instead of a generic copy link",
        "Added clearer confirmation messaging after booking to close the loop for organizers",

      ]}
    />
  </div>

  <div className="mt-6">
    <div className={`text-sm font-semibold ${theme.textMain}`}>Impact of these changes</div>
    <CaseStudyBulletList
      items={[
        "Users moved through the flow faster and with fewer clarifying questions",
        "Organizers reported feeling more in control and less worried about making mistakes",
        "Participants understood their role more clearly and completed tasks with less friction",
        "Overall confidence in the product increased, especially around the booking confirmation step",
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
    A working web prototype that takes a group from “we should have dinner” to a concrete
    restaurant reservation — while respecting constraints, reducing friction, and leaving room
    for future AI‑powered enhancements.
  </div>

  <div className="mt-6">
    <CaseStudyImageTile
      src={IMAGES.finalScreens}
      alt="Final screens"
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
