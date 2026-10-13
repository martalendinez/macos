// src/components/windows/Projects/GroupDiningCaseStudyWindow.jsx
// Case study: Sällskap, a group dining coordination web app (personal project, live).
import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudySection from "./caseStudy/CaseStudySection";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import SallskapSystem from "./caseStudy/SallskapSystem";
import SallskapLofi from "./caseStudy/SallskapLofi";
import heroImg from "../../../imgs/case-study/sallskap/Dining_Overall_web.jpg";
import SallskapEngineering from "./caseStudy/SallskapEngineering";
import { AvailabilityOverlap, CompetitiveMatrix, GroupMatcher, InterviewClusters } from "./caseStudy/SallskapPlay";
import { AtAGlance, BrowserFrame, Caption, Changes, Decision, Figure, FlowSteps, H3, Insights, Intro, Lead, Learnings, MetricsPlan, Stats } from "./caseStudy/Editorial";

import architectureImg from "../../../imgs/case-study/sallskap/Sakura_Architecture.png";
import dataFlowImg from "../../../imgs/case-study/sallskap/Flowchart_Sakura_Data.png";
import flowchartImg from "../../../imgs/case-study/sallskap/Dining_Flowchart.png";
import personaImg from "../../../imgs/case-study/sallskap/Elina_Persona.png";
import empathyMapImg from "../../../imgs/case-study/sallskap/Elina_Empathy_Map.png";
import reviewsImg from "../../../imgs/case-study/sallskap/Dining_Reviews.png";
import darkImg from "../../../imgs/case-study/sallskap/Dining_Dark.png";
import restaurantImg from "../../../imgs/case-study/sallskap/Dining_Restaurant.png";
import restrictionsImg from "../../../imgs/case-study/sallskap/Dining_Restrictions.png";
import groupImg from "../../../imgs/case-study/sallskap/Dining_Group.png";
import mockupImg from "../../../imgs/case-study/sallskap/Sallskap_Shot_web.jpg";
import BehindTheScenes from "./caseStudy/BehindTheScenes";

const TINT = "#34b27b";
const LIVE = "https://sallskap-git-main-martalendinezs-projects.vercel.app";
const URL = "sallskap.vercel.app";

const SECTIONS = [
  { id: "glance", label: "At a glance" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research & pivot" },
  { id: "lofi", label: "Sketches & lo-fi" },
  { id: "decisions", label: "Key decisions" },
  { id: "design", label: "Design" },
  { id: "build", label: "Design → code" },
  { id: "testing", label: "Testing & iteration" },
  { id: "metrics", label: "Measuring success" },
  { id: "outcome", label: "Outcome" },
  { id: "learnings", label: "What I learned" },
];

export default function GroupDiningCaseStudyWindow({ onOpenWindow, uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });
  const sections = useMemo(() => SECTIONS, []);
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const open = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const t = { theme, tint: TINT };

  return (
    <CaseStudyLayout tint={TINT} canvas={false} device="laptop" onOpenWindow={onOpenWindow} theme={theme} sections={sections} title="Sällskap">
      <Intro
        {...t}
        eyebrow="Personal project · 2026 · Live"
        title="Sällskap: from a messy group chat to a table that works for everyone"
        lede="Group dinners fall apart in chat threads: who’s free, who’s vegan, who’s actually booking? I researched, designed and built Sällskap, a web app that collects everyone’s availability and dietary needs privately, then recommends restaurants that fit the whole group."
        ctas={[
          { label: "Try the live app", href: LIVE },
          { label: "GitHub", href: "https://github.com/martalendinez/Sallskap" },
        ]}
        facts={[
          { k: "Role", v: "UX designer & full-stack developer" },
          { k: "Timeline", v: "2026 · self-initiated" },
          { k: "Platform", v: "Responsive web app" },
          { k: "Stack", v: "React · Supabase · Lovable" },
        ]}
      />

      <button type="button" onClick={() => open(heroImg, "Sällskap screens")} className="mt-10 block w-full cursor-zoom-in">
        <img src={heroImg} alt="Sällskap screens: landing page, reservations, availability and restaurants" className="block w-full h-auto rounded-[20px]" />
      </button>

      <div className="mt-6">
        <BehindTheScenes project="sallskap" theme={theme} tint={TINT} onOpenWindow={onOpenWindow} />
      </div>

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
        <H3 theme={theme}>
          What five people told me
        </H3>
        <p className="mt-2 mb-5">Interview notes, clustered into themes. The highlighted notes are the ones that shaped the product.</p>
        <InterviewClusters theme={theme} />
        <H3 theme={theme} className="mt-12">
          Competitive matrix
        </H3>
        <p className="mt-2 mb-5">Five booking platforms compared on what a group actually needs. None of them help a group decide together.</p>
        <CompetitiveMatrix theme={theme} />
        <div className="mt-6 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={personaImg} alt="Organizer persona" caption="Elin, the organizer: social, responsible, short on time." onOpen={open} />
          <Figure theme={theme} src={empathyMapImg} alt="Empathy map" caption="What the organizer thinks, feels and worries about." onOpen={open} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="lofi" title="Sketches & lo-fi" subtitle="Thinking on paper before pixels" theme={theme}>
        <p>
          Before any UI, I sketched the three moments the research pointed to: forming the group, sharing time and dietary needs, and choosing from a shortlist. Paper kept it fast and
          cheap to throw ideas away, and the notes in the margins became the key decisions below.
        </p>
        <p className="mt-4 mb-8">
          Then I moved to greyscale wireframes to validate structure and flow without colour or imagery getting in the way, so every review was about the journey, not the styling.
        </p>
        <SallskapLofi theme={theme} />
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
        <H3 theme={theme} className="mt-6">
          Try it: the matching, live
        </H3>
        <p className="mt-2 mb-5">
          Built on the real app’s restaurant data and filtering logic. Switch between members and change their (private) dietary needs, then watch the shortlist update.
        </p>
        <GroupMatcher theme={theme} />
        <H3 theme={theme} className="mt-12">
          Try it: finding a time
        </H3>
        <p className="mt-2 mb-5">Tap any slot to change someone’s availability. The group row shows where everyone overlaps.</p>
        <AvailabilityOverlap theme={theme} />
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
        <div className="mt-10">
          <SallskapSystem />
          <p className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TINT }} />
            The Sällskap design system: DM Serif Display + Inter, three 11-step palettes, components from the real UI, Phosphor icons and an 8px spacing grid.
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="build" title="Design → code" subtitle="How the design system became the product" theme={theme}>
        <p>
          I designed and built Sällskap myself, using Lovable to move fast and shadcn/ui primitives as a base, on React, TypeScript, Tailwind and Supabase. The interesting part isn’t the stack;
          it’s how decisions from Figma survive into code. Three examples, straight from the repo:
        </p>
        <div className="mt-10">
          <SallskapEngineering theme={theme} tint={TINT} />
        </div>
        <div className="mt-12 grid grid-cols-1 @2xl:grid-cols-2 gap-6 items-start">
          <Figure theme={theme} src={dataFlowImg} alt="Data model and flow" caption="Data model and flow, planned before building." onOpen={open} />
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

      <CaseStudySection id="metrics" title="Measuring success" subtitle="What I’d track in production" theme={theme}>
        <p className="mb-8">
          Usability testing told me the flow works. In production, these are the numbers I’d use to know whether Sällskap actually beats the group chat, and where to iterate next.
        </p>
        <MetricsPlan
          {...t}
          items={[
            { metric: "Time to booking", why: "The core promise: from “we should have dinner” to a confirmed table faster than a group chat.", how: "Timestamp from group creation to booking confirmation, compared with a chat-based baseline.", target: "North star" },
            { metric: "Step completion", why: "Shows exactly where people drop off: invite, availability, dietary needs or restaurant choice.", how: "Funnel events per step, segmented by organizer vs. member.", target: "Funnel" },
            { metric: "Invite response rate", why: "Coordination only works if everyone answers. A low rate means the share link or the ask isn’t landing.", how: "Members who submit availability ÷ members invited.", target: "Engagement" },
            { metric: "Matches found", why: "If strict dietary filtering leaves no restaurants, the experience fails at the last step.", how: "Share of groups with at least 3 matching restaurants after filtering.", target: "Quality" },
          ]}
          note="These are planned metrics, not results: Sällskap is a live prototype without production analytics yet."
        />
      </CaseStudySection>

      <CaseStudySection id="outcome" title="Outcome" subtitle="Live, usable, and ready to grow" theme={theme}>
        <button type="button" onClick={() => open(mockupImg, "Sällskap final screens")} className="block w-full cursor-zoom-in">
          <img src={mockupImg} alt="Sällskap final screens: landing, favourites, availability and reservations" className="block w-full h-auto rounded-[20px]" loading="lazy" />
        </button>
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

      <CaseStudySection id="learnings" title="What I learned" subtitle="Reflection" theme={theme}>
        <Learnings
          {...t}
          items={[
            { title: "Let research kill your favourite idea.", text: "I started out designing for solo diners and groups. Both research streams said groups were the real, unsolved problem, and narrowing the scope made every later decision easier." },
            { title: "Privacy is a UX feature, not a setting.", text: "Interviews showed dietary needs are personal, and nobody wants to explain them in a group chat. Making them private by default removes that social cost, and it’s a decision no single screen shows." },
            { title: "Tokens first saves time later.", text: "Setting up colours and radii as tokens before building screens meant dark mode was a class swap, not a redesign, when testing asked for it." },
            { title: "Fast tools still need a designer’s judgment.", text: "Lovable got a working app up quickly, but the structure, the flow and the details that made testers trust it still came from the research and the design system." },
          ]}
        />
      </CaseStudySection>

      <CaseStudyLightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} theme={theme} />
    </CaseStudyLayout>
  );
}
