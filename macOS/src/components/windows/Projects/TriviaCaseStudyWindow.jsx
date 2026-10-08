import { useMemo, useState } from "react";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyLayout from "./caseStudy/CaseStudyLayout";
import CaseStudyHero, { CaseStudyIconChip } from "./caseStudy/CaseStudyHero";
import CaseStudyPill from "./caseStudy/CaseStudyPill";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudySection from "./caseStudy/CaseStudySection";
import { Gallery2, Gallery3 } from "./caseStudy/CaseStudyGalleries";
import CaseStudyImageTile from "./caseStudy/CaseStudyImageTile";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";
import heroImg from "../../../imgs/case-study/trivia/Mock.jpg";
import boardingImg from "../../../imgs/case-study/trivia/Onboarding.png";
import categoriesImg from "../../../imgs/case-study/trivia/Categories.png";
import gameImg from "../../../imgs/case-study/trivia/TriviaChallenge.png";
import rankingImg from "../../../imgs/case-study/trivia/TriviaRanking.png";
import profileImg from "../../../imgs/case-study/trivia/TriviaProfile.png";
import lofiImg from "../../../imgs/case-study/trivia/Trivia_Lofi.png";
import finalImg from "../../../imgs/case-study/trivia/Trivia_Final.jpg";
import uiImg from "../../../imgs/case-study/trivia/Chrome.png";
import designImg from "../../../imgs/case-study/trivia/designsystem.png";

export default function TriviaCaseStudyWindow({ uiTheme = "glass", glassContrast = "light", theme: appearance = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast, appearance });

  const IMAGES = useMemo(
    () => ({
      hero: heroImg,
      onboarding: boardingImg,
      login: null,
      categories: categoriesImg,
      difficulty: null,
      gameScreen: gameImg,
      results: null,
      leaderboard: rankingImg,
      profile: profileImg,
      designSystem: designImg,
      wireframes: lofiImg,
      uiDetails: uiImg,
      finalScreens: finalImg,
    }),
    []
  );

  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: "" });
  const openLightbox = (src, alt = "") => src && setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: null, alt: "" });

  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "summary", label: "Summary" },
      { id: "role", label: "My role" },
      { id: "goals", label: "Goals" },
      { id: "ia", label: "Information architecture" },
      { id: "designProcess", label: "Design process" },
      { id: "frontend", label: "Frontend implementation" },
      { id: "testing", label: "Usability testing" },
      { id: "outcome", label: "Final outcome" },
    ],
    []
  );

const metaPills = ["University project", "UX Engineering", "Mobile app", "React Native", "Firebase"];

  const facts = [
    { k: "Project type", v: "KTH university group project (App Development course)" },
    { k: "Team", v: "4 people — 2 UI/Frontend, 2 Backend" },
    { k: "What it is", v: "A mobile trivia game with dynamic questions and global leaderboard" },
    { k: "Tech stack", v: "React Native · Redux · Firebase Auth · Firestore · OpenTDB API" },
  ];

  return (
    <CaseStudyLayout theme={theme} sections={sections} title="Trivia App">
          <div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {metaPills.map((p) => (
                <CaseStudyPill key={p} theme={theme}>
                  {p}
                </CaseStudyPill>
              ))}
            </div>

            {/* Title */}
            <div className={`mt-5 text-[40px] @2xl:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] ${theme.textMain}`}>
              Trivia App — A Mobile Game for Knowledge Exploration
            </div>

            {/* Subtitle */}
            <div className={`mt-3 text-base @2xl:text-lg ${theme.textSub}`}>
              A mobile trivia experience where players explore categories, difficulty levels, and two game modes — with
              scoring, history, and a global leaderboard for logged‑in users.
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
  href="https://gits-15.sys.kth.se/iprog-students/arnaupg-ejaco-jintongj-mcli2-vt26-project"
  target="_blank"
  rel="noopener noreferrer"
  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${theme.primaryButtonClass}`}
>
  View GitHub
</a>

              <a
  href="/pdfs/Trivia_Case_Study.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${theme.buttonClass}`}
>
  View full case study
</a>

              
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 @4xl:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-16">
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
                  This trivia app was developed as a group project at KTH. Players can log in with Google or play as
                  guests, choose categories and difficulty levels, and play in either Leisure or Challenge mode.
                  Logged‑in users have their scores saved to Firestore, powering both a personal game history and a
                  global leaderboard.
                </div>
              </div>

              {/* Quick facts */}
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Quick facts</div>

                <div className={`mt-3`}>
                  <div className="grid grid-cols-1 gap-3">
                    {facts.map((f) => (
                      <div key={f.k} className={`pb-3 border-b last:border-b-0 ${theme.divider}`}>
                        <div className={`text-xs ${theme.textSub}`}>{f.k}</div>
                        <div className={`mt-1 text-sm font-medium ${theme.textMain}`}>{f.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["UX", "UI", "React Native", "Firebase", "Mobile"].map((t) => (
                      <CaseStudyPill key={t} theme={theme}>
                        {t}
                      </CaseStudyPill>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CaseStudyHero src={IMAGES.hero} onOpen={openLightbox} theme={theme} />

            {/* Summary */}
            <CaseStudySection
              id="summary"
              title="Summary"
              subtitle="Problem → Solution → Why it works"
              theme={theme}
            >
              <div>
                <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Problem</div>
                <div className="mt-2">
                  Many trivia apps feel cluttered, generic, or overwhelming. Players struggle to find the right
                  difficulty, understand scoring, or feel motivated to return.
                </div>

                <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Solution</div>
                <div className="mt-2">
                  A mobile trivia game with two modes (Leisure + Challenge), dynamic questions from OpenTDB,
                  difficulty‑based scoring, and persistent history + leaderboard for logged‑in users.
                </div>

                <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Why it works</div>
                <CaseStudyBulletList
                  items={[
                    "Clear separation between casual and competitive play.",
                    "Guided flow from onboarding → category → difficulty → game.",
                    "Persistent scoring and history create long‑term engagement.",
                  ]}
                />
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.onboarding}
                    alt="Onboarding"
                    caption="Onboarding: play as guest or log in with Google."
                    theme={theme}
                    onOpen={openLightbox}
                    contain="fit"
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.categories}
                    alt="Category selection"
                    caption="Category and difficulty selection."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>
            {/* My role */}
            <CaseStudySection
              id="role"
              title="My role"
              subtitle="UX Engineer across design and frontend"
              theme={theme}
            >
              <div>
                <CaseStudyBulletList
                  items={[
                    "Co‑defined the product vision and core flows with the team.",
                    "Designed the information architecture and user flows.",
                    "Created the design system in Figma (colors, typography, components).",
                    "Designed lo‑fi and hi‑fi screens for onboarding, game, results, profile, and leaderboard.",
                    "Implemented the UI in React Native using reusable components.",
                    "Collaborated with backend teammates on API integration, Firestore structure, and authentication flows.",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Goals */}
            <CaseStudySection
              id="goals"
              title="Goals"
              subtitle="Experience goals + system goals"
              theme={theme}
            >
              <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-5">
                <div>
                  <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Experience goals</div>
                  <CaseStudyBulletList
                    items={[
                      "Make trivia feel modern, intuitive, and enjoyable.",
                      "Support both casual and competitive players.",
                      "Enable fast game starts with minimal friction.",
                    ]}
                  />
                </div>

                <div>
                  <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>System goals</div>
                  <CaseStudyBulletList
                    items={[
                      "Fetch questions dynamically from OpenTDB.",
                      "Persist scores and profiles in Firestore.",
                      "Use Redux for predictable global state across the app.",
                    ]}
                  />
                </div>
              </div>
            </CaseStudySection>

            {/* Information architecture */}
            <CaseStudySection
              id="ia"
              title="Information architecture"
              subtitle="Structuring the app around clear, focused flows"
              theme={theme}
            >
              <div>
                <CaseStudyBulletList
                  items={[
                    "Onboarding — guest or Google login.",
                    "Home — category, difficulty, and mode selection.",
                    "Game flow — question screen, feedback, progress.",
                    "Me page — profile, history, settings.",
                    "Leaderboard — global ranking of top players.",
                  ]}
                />
              </div>

              <Gallery3
                a={
                  <CaseStudyImageTile
                    src={IMAGES.gameScreen}
                    alt="Game screen"
                    caption="Question layout with clear answer options and feedback."
                    aspect="4/3"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.leaderboard}
                    alt="Leaderboard"
                    caption="Global leaderboard for Challenge mode scores."
                    aspect="4/3"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                c={
                  <CaseStudyImageTile
                    src={IMAGES.profile}
                    alt="Profile page"
                    caption="Profile page with history and account settings."
                    aspect="4/3"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

            {/* Design process */}
            <CaseStudySection
              id="designProcess"
              title="Design process"
              subtitle="From research → IA → wireframes → hi‑fi"
              theme={theme}
            >
              <div>
                <CaseStudyBulletList
                  items={[
                    "Competitive scan of trivia apps (onboarding, game flows, scoring, visual style).",
                    "Quick interviews with students to understand what makes trivia fun vs frustrating.",
                    "Lo‑fi wireframes to validate navigation, game flow, and mode selection.",
                    "Design system creation for colors, typography, spacing, and components.",
                    "Hi‑fi screens for all core flows, ready to be implemented in React Native.",
                  ]}
                />
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.wireframes}
                    alt="Wireframes"
                    caption="Early lo‑fi wireframes exploring navigation and game flow."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.designSystem}
                    alt="Design system"
                    caption="Color palette, typography, spacing, and reusable components."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>
            {/* Frontend implementation */}
            <CaseStudySection
              id="frontend"
              title="Frontend implementation"
              subtitle="Bringing the UI to life in React Native"
              theme={theme}
            >
              <div>
                <CaseStudyBulletList
                  items={[
                    "Implemented navigation (stack + tabs) for core flows.",
                    "Built reusable components (buttons, cards, headers, list items).",
                    "Implemented category and difficulty selection screens with dynamic options.",
                    "Built the game screen with dynamic question rendering from OpenTDB.",
                    "Created the results screen with difficulty‑based scoring logic.",
                    "Integrated Redux for global state across auth, game, and settings.",
                  ]}
                />
              </div>

              <Gallery2
                a={
                  <CaseStudyImageTile
                    src={IMAGES.finalScreens}
                    alt="Final screens"
                    caption="Final React Native screens implemented from hi‑fi designs."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
                b={
                  <CaseStudyImageTile
                    src={IMAGES.uiDetails}
                    alt="UI details"
                    caption="Chrome developer tools showing the React Native app."
                    aspect="16/9"
                    theme={theme}
                    onOpen={openLightbox}
                  />
                }
              />
            </CaseStudySection>

          {/* Final usability testing */}
<CaseStudySection
  id="final-testing"
  title="Final usability testing"
  subtitle="Conducted with 3–4 participants using the functional prototype"
  theme={theme}
>
  <div>

    {/* Testing procedure */}
    <div className={`text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Testing procedure</div>
    <CaseStudyBulletList
      items={[
        "Think‑aloud sessions with 3–4 participants using the functional app.",
        "Task‑based flows: onboarding, playing both modes, editing account, viewing history and leaderboard.",
        "Observation of clarity, navigation, feedback, and overall gameplay experience.",
      ]}
    />

    {/* Results */}
    <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Results</div>
    <CaseStudyBulletList
      items={[
        "All participants completed core tasks successfully.",
        "Gameplay felt smooth, clear, and responsive.",
        "Scoring system and difficulty‑based points were immediately understood.",
        "Question of the Day was highly discoverable and engaging.",
        "Account editing and navigation patterns felt intuitive.",
      ]}
    />

    {/* Iterations implemented */}
    <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Iterations implemented</div>
    <CaseStudyBulletList
      items={[
        "Added suspense/loading view to registration and login.",
        "Enabled profile access via the avatar on the homepage.",
        "Introduced a basic theme switcher.",
        "Implemented a lives system (5 for easy, 3 for hard).",
        "Added a progress indicator ('1 out of X questions').",
      ]}
    />

    {/* Future improvements */}
    <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Future improvements</div>
    <CaseStudyBulletList
      items={[
        "Add richer feedback and aggregated stats for Question of the Day.",
        "Expand leaderboard with advanced filters (daily, weekly, friends, difficulty).",
        "Enhance Challenge Mode with timers, streaks, and dynamic difficulty.",
        "Introduce background music, full theme customization, and hints.",
      ]}
    />

    {/* Constraints */}
    <div className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${theme.textMain}`}>Constraints</div>
    <CaseStudyBulletList
      items={[
        "Small sample size limited diversity of player profiles.",
        "Time constraints restricted testing of advanced features.",
        "Technical limitations prevented dynamic filtering and real‑time statistics.",
      ]}
    />

  </div>


              {/* Final hi‑fi placeholders */}
              {/* Final hi‑fi placeholder */}
<div className="mt-8">
  <CaseStudyImageTile
    src={IMAGES.finalScreens}
    alt="Hi‑fi screens"
    caption="Final hi‑fi screens."
    theme={theme}
    onOpen={openLightbox}
  />
</div>

            </CaseStudySection>

          </div>
        
      

    <CaseStudyLightbox
  open={lightbox.open}
  src={lightbox.src}
  alt={lightbox.alt}
  onClose={closeLightbox}
  theme={theme}
/>
    </CaseStudyLayout>
  );
}
