// src/components/windows/Projects/GroupDiningCaseStudyWindow.jsx
// Case study: Sällskap, a group dining coordination web app (personal project, live).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import { AtAGlance, BrowserFrame, Caption, Changes, Decision, Figure, FlowSteps, H3, Insights, Intro, Lead, Stage, Stats } from "./caseStudy/Editorial";

import interviewImg from "../../../imgs/case-study/sallskap/Sakura_Interview.png";
import competitorImg from "../../../imgs/case-study/sallskap/Competitor_Analysis_Sakura.png";
import architectureImg from "../../../imgs/case-study/sallskap/Sakura_Architecture.png";
import dataFlowImg from "../../../imgs/case-study/sallskap/Flowchart_Sakura_Data.png";
import flowchartImg from "../../../imgs/case-study/sallskap/Dining_Flowchart.png";
import personaImg from "../../../imgs/case-study/sallskap/Elina_Persona.png";
import empathyMapImg from "../../../imgs/case-study/sallskap/Elina_Empathy_Map.png";
import system1Img from "../../../imgs/case-study/sallskap/Dining_System1.png";
import system2Img from "../../../imgs/case-study/sallskap/Dining_System2.png";
import system3Img from "../../../imgs/case-study/sallskap/Dining_System3.png";
import system4Img from "../../../imgs/case-study/sallskap/Dining_System4.png";
import reviewsImg from "../../../imgs/case-study/sallskap/Dining_Reviews.png";
import darkImg from "../../../imgs/case-study/sallskap/Dining_Dark.png";
import restaurantImg from "../../../imgs/case-study/sallskap/Dining_Restaurant.png";
import restrictionsImg from "../../../imgs/case-study/sallskap/Dining_Restrictions.png";
import groupImg from "../../../imgs/case-study/sallskap/Dining_Group.png";
import heroImg from "../../../imgs/case-study/sallskap/Dining_Overall_web.jpg";
import mockupImg from "../../../imgs/case-study/sallskap/Dining_Mockup.png";

const TINT = "#34b27b";
const LIVE = "https://sallskap-git-main-martalendinezs-projects.vercel.app";
const URL = "sallskap.vercel.app";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research & pivot" },
  { id: "decisions", label: "Key decisions" },
  { id: "design", label: "Design" },
  { id: "build", label: "Build" },
  { id: "testing", label: "Testing & iteration" },
  { id: "outcome", label: "Outcome" },
];

export default function GroupDiningCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Sällskap">
      <Intro
        {...t}
        eyebrow="Personal project · 2026 · Live"
        title="Sällskap: from a messy group chat to a table that works for everyone"
        lede="Group dinners fall apart in chat threads: who’s free, who’s vegan, who’s actually booking? I researched, designed and built Sällskap, a web app that collects everyone’s availability and dietary needs privately, then recommends restaurants that fit the whole group."
        ctas={[
          { label: "Try the live app", href: LIVE },
          { label: "GitHub", href: "https://github.com/martalendinez/Sallskap" },
          { label: "Full case study", href: "https://flair-fabrica.vercel.app" },
        ]}
        facts={[
          { k: "Role", v: "UX designer & full-stack developer" },
          { k: "Timeline", v: "2026 · self-initiated" },
          { k: "Platform", v: "Responsive web app" },
          { k: "Stack", v: "React · Supabase · Lovable" },
        ]}
      />

      <Stage {...t} className="mt-10" pad="p-0">
        <button type="button" onClick={() => open(heroImg, "Sällskap screens")} className="block w-full cursor-zoom-in">
          <img src={heroImg} alt="Sällskap screens: landing page, reservations, availability and restaurants" className={`block w-full h-auto ${theme.isDark ? "" : "mix-blend-multiply"}`} />
        </button>
      </Stage>

      <CaseStudySection id="glance" title="At a glance" subtitle="The 30-second version" theme={theme}>
        <AtAGlance
          {...t}
          items={[
            { label: "Problem", text: "Booking apps are built for one person. Groups still coordinate in chats, dietary needs end up as a free-text note, and the organizer carries all the mental load." },
            { label: "What I did", text: "Ran the research, pivoted the concept to focus on groups, designed the flow and design system, and built a working app on React and Supabase." },
            { label: "Outcome", text: "A live app that takes a group from “we should have dinner” to a confirmed reservation. After iterating, organizers said they felt more in control and less worried about mistakes." },
          ]}
        />
        <div className="mt-10">
          <Stats
            {...t}
            items={[
              { value: "5", label: "user interviews, ages 20–45" },
              { value: "5", label: "booking platforms analysed" },
              { value: "5", label: "task-based usability sessions" },
              { value: "6", label: "improvements shipped after testing" },
            ]}
          />
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The problem" subtitle="Restaurants are booked by one person, eaten by many" theme={theme}>
        <Lead theme={theme}>
          OpenTable, TheFork and friends are great at helping <i>one</i> person book a table. But a group dinner is a negotiation, and that negotiation still happens in scattered chats and polls.
        </Lead>
        <p className="mt-5">
          Different schedules, budgets and dietary needs quickly turn into long threads, unclear decisions and last-minute compromises. Someone always ends up as the organizer, holding everyone’s
          constraints in their head.
        </p>
        <p className={`mt-6 pl-4 border-l-2 text-[18px] font-semibold tracking-[-0.01em] ${theme.textMain}`} style={{ borderColor: TINT }}>
          How might we help a group agree on when and where to eat, without anyone having to explain their dietary needs in the group chat?
        </p>
      </CaseStudySection>

      <CaseStudySection id="research" title="Research & pivot" subtitle="Following the evidence" theme={theme}>
        <p>
          The idea started broader: a dining app for <b className={theme.textMain}>solo diners and groups</b>. To test it, I analysed five platforms (OpenTable, Resy, TheFork, Bookatable, Quandoo) and
          interviewed five people aged 20–45 who regularly organise or join group dinners.
        </p>
        <div className="mt-8">
          <Insights
            {...t}
            items={[
              { title: "Nobody supports the group decision.", text: "Every platform optimises for discovery and booking. Coordination still happens outside the product, in chat apps.", so: "the product starts before the booking: at “who’s in, and when?”" },
              { title: "Dietary needs are an afterthought, and personal.", text: "They’re handled as a free-text “special request”, and people don’t always want to discuss them in front of the group.", so: "private, structured dietary input." },
              { title: "The organizer carries the mental load.", text: "One person ends up collecting everyone’s constraints and taking the blame if the choice doesn’t work.", so: "the system does the matching; the organizer just confirms." },
            ]}
          />
        </div>
        <div className={`mt-10 py-5 border-y ${theme.divider}`}>
          <div className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: TINT }}>
            The pivot
          </div>
          <p className={`mt-2 text-[18px] leading-snug font-semibold tracking-[-0.01em] ${theme.textMain}`}>
            Both research streams pointed the same way: group coordination was the real, underserved problem. I dropped the solo-diner use case and focused the whole product on it.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 @3xl:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <Figure theme={theme} src={competitorImg} alt="Competitive analysis" caption="Competitive analysis of five booking platforms." onOpen={open} />
          <Figure theme={theme} src={interviewImg} alt="Interview synthesis" caption="Interview synthesis." onOpen={open} />
        </div>
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={personaImg} alt="Organizer persona" caption="Elina, the organizer: social, responsible, short on time." onOpen={open} />
          <Figure theme={theme} src={empathyMapImg} alt="Empathy map" caption="What the organizer thinks, feels and worries about." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="decisions" title="Key decisions" subtitle="What I chose, and what it cost" theme={theme}>
        <Decision
          {...t}
          n={1}
          title="Dietary needs are private by default"
          tradeoff="Keeping needs private means the group doesn’t discuss them openly. The system still respects every need in the recommendations, so nobody has to explain themselves."
          visual={<BrowserFrame theme={theme} src={restrictionsImg} alt="Private dietary restrictions" url={URL} onOpen={open} />}
        >
          Each member submits their dietary needs privately, in a structured form instead of a free-text note. That removes the social pressure and gives the matching engine accurate, usable data.
        </Decision>
        <Decision
          {...t}
          n={2}
          title="Availability as a picker, not a poll"
          tradeoff="A structured picker is less flexible than a chat message, which is exactly why it works: the system can compute the overlap."
          visual={<BrowserFrame theme={theme} src={groupImg} alt="Group overview with availability and dietary needs" url={URL} onOpen={open} />}
        >
          A visual time selector replaces the “does Thursday work?” thread. The app computes overlapping availability windows automatically and shows the result, with everyone’s needs, in a single group overview.
        </Decision>
        <Decision
          {...t}
          n={3}
          title="A shortlist, not a search page"
          tradeoff="Showing fewer options means trusting the matching. Compatibility tags and per-person breakdowns make that trust earned, not assumed."
          visual={<BrowserFrame theme={theme} src={restaurantImg} alt="Restaurant shortlist" url={URL} onOpen={open} />}
        >
          The recommendation engine merges availability, dietary needs and preferences into a curated shortlist, so the organizer chooses between a few good options instead of searching from
          scratch.
        </Decision>
      </CaseStudySection>

      <CaseStudySection id="design" title="Design" subtitle="One linear flow, Scandinavian calm" theme={theme}>
        <p>
          The IA is a single, linear journey for the organizer: create a group, collect availability and dietary needs, pick from the shortlist, confirm and share. Visually it’s Scandinavian
          minimalism: light backgrounds, soft shadows, rounded geometry and a calm green accent.
        </p>
        <div className="mt-8">
          <Figure theme={theme} src={flowchartImg} alt="User flow" caption="User flow from group creation to confirmed reservation." onOpen={open} />
        </div>
        <div className="mt-8">
          <FlowSteps
            {...t}
            url={URL}
            onOpen={open}
            steps={[
              { title: "Share needs privately", text: "Each member picks their dietary restrictions on their own.", src: restrictionsImg },
              { title: "See the group at a glance", text: "Everyone’s availability and needs on one screen.", src: groupImg },
              { title: "Choose from the shortlist", text: "Restaurants that already fit everyone.", src: restaurantImg },
            ]}
          />
        </div>
        <div className="mt-10 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={system1Img} alt="Typography" caption="Typography." onOpen={open} />
          <Figure theme={theme} src={system2Img} alt="Colours" caption="Colour." onOpen={open} />
          <Figure theme={theme} src={system3Img} alt="Icons" caption="Iconography." onOpen={open} />
          <Figure theme={theme} src={system4Img} alt="Grid and layout" caption="Grid and layout." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Build" subtitle="A real app, not just a prototype" theme={theme}>
        <p>I built Sällskap as a working web app, using Lovable to iterate fast and keeping the architecture clean enough to grow into a production tool.</p>
        <CaseStudyBulletList
          items={[
            "React frontend with modular flows: group creation, availability, dietary needs, restaurants and reservations.",
            "Supabase for groups, members, preferences, restaurants and reservations, with row-level security for basic data safety.",
            "Routing and state structured around the booking journey.",
            "Room to add AI-assisted suggestions and smart defaults later.",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={dataFlowImg} alt="Data model and flow" caption="Data model and flow." onOpen={open} />
          <Figure theme={theme} src={architectureImg} alt="System architecture" caption="High-level architecture." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="testing" title="Testing & iteration" subtitle="5 participants, 5 real tasks" theme={theme}>
        <p>I brought back the five interview participants for short, task-based sessions on the working app, watching for clarity, friction and confidence:</p>
        <ol className={`mt-4 grid grid-cols-1 @2xl:grid-cols-2 gap-x-8 gap-y-2 text-[15px] ${theme.textBody}`}>
          {["Create a group and add at least two members", "Set availability and dietary restrictions for each member", "Choose a restaurant that fits the group", "Open a menu and confirm the booking", "Find the reservation in My Reservations"].map((task, i) => (
            <li key={task} className="flex gap-3">
              <span className="font-semibold tabular-nums" style={{ color: TINT }}>
                {i + 1}
              </span>
              {task}
            </li>
          ))}
        </ol>
        <H3 theme={theme} className="mt-10">
          What I shipped after testing
        </H3>
        <div className="mt-4">
          <Changes
            {...t}
            labels={["Goal", "What I shipped"]}
            items={[
              { found: "Never leave people stuck mid-flow.", changed: "A Back button across the entire flow." },
              { found: "Make navigation scannable.", changed: "Redesigned nav icons, now with labels." },
              { found: "Give enough information to decide.", changed: "Full restaurant details: reviews, address, phone and dietary tags." },
              { found: "Close the loop for organizers.", changed: "Clear confirmation messaging after booking." },
              { found: "Share where groups already talk.", changed: "Native share options instead of a generic copy link." },
              { found: "Comfort and accessibility.", changed: "Dark mode across the whole experience." },
            ]}
          />
        </div>
        <div className="mt-8 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <BrowserFrame theme={theme} src={reviewsImg} alt="Restaurant reviews" url={URL} onOpen={open} />
          <BrowserFrame theme={theme} src={darkImg} alt="Dark mode" url={URL} onOpen={open} />
        </div>
        <Caption theme={theme}>Left: restaurant details with reviews. Right: dark mode.</Caption>
        <p className="mt-8">
          After these changes, people moved through the flow faster and with fewer clarifying questions. Participants understood their role more clearly, and confidence went up most at the
          booking confirmation step.
        </p>
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome" subtitle="Live, usable, and ready to grow" theme={theme}>
        <Stage {...t} pad="px-4 pt-6 pb-2 @2xl:px-16 @2xl:pt-10">
          <button type="button" onClick={() => open(mockupImg, "Sällskap final")} className="block w-full cursor-zoom-in">
            <img src={mockupImg} alt="Sällskap on a laptop" className={`block w-full max-w-[640px] mx-auto h-auto ${theme.isDark ? "rounded-xl" : "mix-blend-multiply"}`} loading="lazy" />
          </button>
        </Stage>
        <p className="mt-8">
          A working web app, live on Vercel, that takes a group from “we should have dinner” to a confirmed reservation while respecting everyone’s constraints.{" "}
          <a href={LIVE} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4" style={{ color: TINT }}>
            Try it yourself ↗
          </a>
        </p>
        <H3 theme={theme} className="mt-8">
          What’s next
        </H3>
        <CaseStudyBulletList
          items={[
            "AI-assisted restaurant suggestions and smart defaults based on the group’s history.",
            "Measure time-to-booking against a plain group chat to quantify the improvement.",
            "Test with larger and more diverse groups.",
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
