import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
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
import designImg from "../../../imgs/case-study/trivia/design.png";

export default function TriviaCaseStudyWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast });

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

  const [active, setActive] = useState("overview");
  function scrollToSection(id) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function HeroCover() {
    return (
      <div className={`mt-10 rounded-[28px] overflow-hidden border ${theme.softCard}`}>
        <button
          type="button"
          onClick={() => openLightbox(IMAGES.hero, "Cover image")}
          className="w-full text-left"
          disabled={!IMAGES.hero}
        >
          {IMAGES.hero ? (
            <img src={IMAGES.hero} alt="Cover" className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full aspect-[16/7] flex items-center justify-center">
              <div className="text-center px-6">
                <div className={`text-sm font-semibold ${theme.textMain}`}>Cover image (hero)</div>
                <div className={`mt-2 text-xs ${theme.textSub}`}>
                  Add a wide screenshot of your Trivia App home or onboarding.
                  <br />
                  Set it as IMAGES.hero.
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

  const metaPills = ["University project", "UX Engineering", "Mobile app", "React Native", "Firebase"];

  const facts = [
    { k: "Project type", v: "KTH university group project (App Development course)" },
    { k: "Team", v: "4 people — 2 UI/Frontend, 2 Backend" },
    { k: "What it is", v: "A mobile trivia game with dynamic questions and global leaderboard" },
    { k: "Tech stack", v: "React Native · Redux · Firebase Auth · Firestore · OpenTDB API" },
  ];

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
              Trivia App — A Mobile Game for Knowledge Exploration
            </div>

            {/* Subtitle */}
            <div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
              A mobile trivia experience where players explore categories, difficulty levels, and two game modes — with
              scoring, history, and a global leaderboard for logged‑in users.
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#" className={`px-4 py-2.5 rounded-2xl text-sm border ${theme.buttonClass}`}>
                View GitHub
              </a>
              <a href="#" className={`px-4 py-2.5 rounded-2xl text-sm border ${theme.buttonClass}`}>
                View full case study
              </a>
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
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
                    {["UX", "UI", "React Native", "Firebase", "Mobile"].map((t) => (
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
              subtitle="Problem → Solution → Why it works"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Problem</div>
                <div className="mt-2">
                  Many trivia apps feel cluttered, generic, or overwhelming. Players struggle to find the right
                  difficulty, understand scoring, or feel motivated to return.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Solution</div>
                <div className="mt-2">
                  A mobile trivia game with two modes (Leisure + Challenge), dynamic questions from OpenTDB,
                  difficulty‑based scoring, and persistent history + leaderboard for logged‑in users.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Why it works</div>
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
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Experience goals</div>
                  <CaseStudyBulletList
                    items={[
                      "Make trivia feel modern, intuitive, and enjoyable.",
                      "Support both casual and competitive players.",
                      "Enable fast game starts with minimal friction.",
                    ]}
                  />
                </div>

                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>System goals</div>
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
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
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
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
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
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
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

            {/* Usability testing */}
            <CaseStudySection
              id="testing"
              title="Usability testing"
              subtitle="Planned testing with 5–7 students"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>What we will test</div>
                <CaseStudyBulletList
                  items={[
                    "Clarity of onboarding (guest vs login).",
                    "Ease of selecting categories and difficulty.",
                    "Understanding of Leisure vs Challenge modes.",
                    "Readability of questions and answer options.",
                    "Clarity of feedback after answering.",
                    "Discoverability of history and leaderboard.",
                  ]}
                />

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Methods</div>
                <CaseStudyBulletList
                  items={[
                    "Think‑aloud usability sessions with students.",
                    "Task‑based scenarios (start a game, change difficulty, view history).",
                    "Short post‑test survey for perceived difficulty and enjoyment.",
                  ]}
                />

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Expected improvements</div>
                <CaseStudyBulletList
                  items={[
                    "Refining copy and hierarchy in the mode selection screen.",
                    "Improving feedback timing and animations after answering.",
                    "Tweaking leaderboard layout for clarity and motivation.",
                  ]}
                />
              </div>
            </CaseStudySection>

            {/* Final outcome */}
            <CaseStudySection
              id="outcome"
              title="Final outcome & learnings"
              subtitle="What this project taught me as a UX Engineer"
              theme={theme}
            >
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Outcome</div>
                <div className="mt-2 text-sm">
                  The project resulted in a functional React Native trivia app integrated with OpenTDB and Firebase.
                  The app supports guest and logged‑in play, two game modes, difficulty‑based scoring, and a global
                  leaderboard. Final usability testing and visual polish will be added to this case study as the
                  project concludes.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Key learnings</div>
                <CaseStudyBulletList
                  items={[
                    "Designing for mobile requires ruthless prioritization of flows and content.",
                    "A solid design system speeds up React Native implementation and ensures consistency.",
                    "API‑driven products need flexible UI that handles unpredictable data gracefully.",
                    "Close collaboration between design and backend is essential for aligning UX with technical constraints.",
                    "UX engineering bridges the gap between concept and code, ensuring the final product matches the design intent.",
                  ]}
                />

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Next steps</div>
                <CaseStudyBulletList
                  items={[
                    "Run and document usability tests with real users.",
                    "Polish microinteractions and animations in key flows.",
                    "Improve accessibility (contrast, tap targets, dynamic type).",
                    "Explore social features like friend challenges or shared rooms.",
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
        </motion.div>
      </div>

    <CaseStudyLightbox
  open={lightbox.open}
  src={lightbox.src}
  alt={lightbox.alt}
  onClose={closeLightbox}
  theme={theme}
/>
    </div>
  );
}
