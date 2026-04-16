import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import useCaseStudyTheme from "./caseStudy/useCaseStudyTheme";
import CaseStudyPill from "./caseStudy/CaseStudyPill";
import CaseStudyBulletList from "./caseStudy/CaseStudyBulletList";
import CaseStudySection from "./caseStudy/CaseStudySection";
import { Gallery2, Gallery3 } from "./caseStudy/CaseStudyGalleries";
import CaseStudyImageTile from "./caseStudy/CaseStudyImageTile";
import CaseStudyLightbox from "./caseStudy/CaseStudyLightbox";

export default function TriviaCaseStudyWindow({ uiTheme = "glass", glassContrast = "light" }) {
  const theme = useCaseStudyTheme({ uiTheme, glassContrast });

  const IMAGES = useMemo(
    () => ({
      hero: null,
      welcome: null,
      farmOverview: null,
      cozyCorner: null,
      workshop: null,

      calendar: null,
      sunriseQuests: null,
      weeklyFields: null,
      questsDatabases: null,
      harvestedMemories: null,

      goldPouch: null,
      shop: null,
      inventory: null,

      skillTree: null,
      characterProfile: null,
      dailyFortune: null,
      letters: null,
      mealPlanner: null,

      uiDetails: null,
      finalScreens: null,
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
      { id: "farm", label: "The Farm" },
      { id: "cozy", label: "Cozy Corner" },
      { id: "workshopSection", label: "Workshop" },
      { id: "mechanics", label: "Gamification mechanics" },
      { id: "design", label: "Design decisions" },
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
          title={IMAGES.hero ? "Click to zoom" : "Hero placeholder — set IMAGES.hero"}
        >
          {IMAGES.hero ? (
            <img src={IMAGES.hero} alt="Cover" className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full aspect-[16/7] flex items-center justify-center">
              <div className="text-center px-6">
                <div className={`text-sm font-semibold ${theme.textMain}`}>Cover image (hero)</div>
                <div className={`mt-2 text-xs ${theme.textSub}`}>
                  Add a wide screenshot of your <span className="font-semibold">Welcome</span> page / dashboard.
                  <br />
                  Set it as <span className="font-semibold">IMAGES.hero</span>.
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

  const metaPills = ["Personal project", "Notion template", "UX + UI", "Gamification", "Systems design"];

  const facts = [
    { k: "What it is", v: "A Stardew Valley–inspired productivity template built in Notion" },
    { k: "Core promise", v: "Make planning feel cozy + motivating (not punishing)" },
    { k: "Structure", v: "Three “locations”: The Farm · Cozy Corner · Workshop" },
    { k: "Mechanics", v: "Coins, inventory, shop, skills, badges, daily fortune" },
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
            <div className="flex flex-wrap gap-2">
              {metaPills.map((p) => (
                <CaseStudyPill key={p} theme={theme}>
                  {p}
                </CaseStudyPill>
              ))}
            </div>

            <div className={`mt-5 text-4xl md:text-5xl font-semibold tracking-tight ${theme.textMain}`}>
              Gamified Productivity System — Stardew Valley Notion Template
            </div>
            <div className={`mt-3 text-base md:text-lg ${theme.textSub}`}>
              “Welcome to your farm!” A cozy, narrative-driven system that turns everyday tasks into quests, rewards
              consistency with coins, and makes your Notion workspace feel like a tiny valley.
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#" target="_blank" rel="noreferrer" className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}>
                View this in Notion
              </a>
              <a href="#" target="_blank" rel="noreferrer" className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${theme.buttonClass}`}>
                Download the PDF
              </a>
            </div>

            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
              <div>
                <div className={`text-lg font-semibold ${theme.textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${theme.textBody}`}>
                  Traditional productivity tools can feel like judgment: when you fall behind, the system becomes a list
                  of failures. This template reframes planning as a cozy game world — with locations, characters, and
                  progression mechanics that turn “to-dos” into small adventures.
                  <br />
                  <br />
                  The valley is organized into three spaces:
                  <span className={`font-semibold ${theme.textMain}`}> The Farm</span> (work + planning),
                  <span className={`font-semibold ${theme.textMain}`}> Your Cozy Corner</span> (stats + vibes),
                  and <span className={`font-semibold ${theme.textMain}`}> the Workshop</span> (gamification hub).
                </div>
              </div>

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
                    {["UX", "UI", "Notion", "Quests", "Rewards", "Systems"].map((t) => (
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

            <CaseStudySection id="summary" title="Summary" subtitle="Problem → Solution → What makes it work" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Problem</div>
                <div className="mt-2">
                  Planning tools often don’t create emotional momentum. When motivation is low, systems that feel strict
                  are the first to be abandoned.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Solution</div>
                <div className="mt-2">
                  A narrative Notion template that maps productivity to a cozy game world: tasks become quests, progress
                  becomes “harvest,” and consistency rewards you with coins you can spend in a shop.
                </div>

                <div className={`mt-5 text-sm font-semibold ${theme.textMain}`}>Why it works</div>
                <CaseStudyBulletList
                  items={[
                    "Clear, location-based navigation (you always know where to go)",
                    "Progress is visible and celebratory (harvested memories, coins, badges)",
                    "Gamification is optional + supportive (designed to reduce guilt, not increase pressure)",
                  ]}
                />
              </div>

              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.welcome} alt="Welcome page" caption="Optional: Welcome to your farm page." aspect="16/9" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.farmOverview} alt="The Farm overview" caption="Optional: The Farm overview page." aspect="16/9" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="role" title="My role" subtitle="I designed the system, structure, and experience" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <CaseStudyBulletList
                  items={[
                    "Designed the information architecture (three main locations + sub-pages and flows)",
                    "Defined the database model conceptually (tasks, subtasks, projects, habits, events, memories)",
                    "Created the gamification layer (coins, shop, inventory, skill tree, badges, pets)",
                    "Wrote the narrative microcopy to make interactions feel like a world (quests, harvest, valley vibes)",
                  ]}
                />
              </div>
            </CaseStudySection>

            <CaseStudySection id="goals" title="Goals" subtitle="Experience goals + system goals" theme={theme}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Experience goals</div>
                  <CaseStudyBulletList items={["Make planning feel cozy and inviting", "Turn tasks into meaningful “quests” with story flavor", "Support low-energy days (no shame spiral)"]} />
                </div>

                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>System goals</div>
                  <CaseStudyBulletList items={["Fast daily usage (minimal friction)", "Clear separation between planning, reflection, and rewards", "Scales across tasks, subtasks, projects, habits, and events"]} />
                </div>
              </div>
            </CaseStudySection>

            <CaseStudySection id="ia" title="Information architecture" subtitle="The valley is organized as three locations with clear sub-areas" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Top-level map</div>
                <CaseStudyBulletList
                  items={[
                    "Welcome to your farm (entry point + navigation hub)",
                    "🥕✨ The Farm — productivity fields (tasks, habits, planning, calendar, memories)",
                    "🕯️✨ Cozy Corner — your farmhouse (stats, mood/energy, skill tree, letters, fortune, meal planning)",
                    "🛠️✨ Workshop — gamification hub (gold pouch, shop, inventory)",
                  ]}
                />
                <div className={`mt-3 text-sm ${theme.textSub}`}>
                  The goal is to make navigation feel like a world map: you “go” somewhere depending on what you need
                  (plan, do, reflect, or reward).
                </div>
              </div>

              <Gallery3
                a={<CaseStudyImageTile src={IMAGES.cozyCorner} alt="Cozy Corner" caption="Optional: Cozy Corner page." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.workshop} alt="Workshop" caption="Optional: Workshop hub page." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                c={<CaseStudyImageTile src={IMAGES.farmOverview} alt="Farm hub" caption="Optional: Farm hub page." aspect="4/3" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="farm" title="🥕✨ The Farm" subtitle="Where all planning + execution lives (quests, fields, calendar)" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Core areas</div>
                <CaseStudyBulletList
                  items={[
                    "📅 The Town Calendar — tasks, events, festivals, seasonal milestones",
                    "🌅🌾 Sunrise Quests — daily tasks, subtasks, habits in one place (start the day with purpose)",
                    "🪴📅 Weekly and Daily Fields — Trello-style board + calendar views for planning and tracking",
                    "🧙‍♂️🏰 Main Quests & Side Adventures — big goals broken down into Tasks + Subtasks, grouped by Projects",
                    "🌾🕰️ Harvested Memories — archive of completed quests and achievements to reflect on progress",
                  ]}
                />
              </div>

              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.calendar} alt="Town Calendar" caption="Optional: calendar view." aspect="16/9" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.sunriseQuests} alt="Sunrise Quests" caption="Optional: daily quests hub." aspect="16/9" theme={theme} onOpen={openLightbox} />}
              />

              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.weeklyFields} alt="Weekly & Daily Fields" caption="Optional: Trello board / weekly plan." aspect="16/9" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.harvestedMemories} alt="Harvested Memories" caption="Optional: completed archive view." aspect="16/9" theme={theme} onOpen={openLightbox} />}
              />

              <div className={`mt-6 rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Quest taxonomy (how work is modeled)</div>
                <CaseStudyBulletList
                  items={[
                    "Tasks — the main storyline steps (bigger actions that move life forward)",
                    "Subtasks — small supporting steps (lightweight actions that keep momentum)",
                    "Projects — long-term sagas (themes that group tasks + subtasks)",
                    "Habits — daily rituals (streak-friendly routines that keep the farm alive)",
                    "Events — time-based items (appointments, deadlines, festivals)",
                  ]}
                />
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.questsDatabases}
                  alt="Tasks / Subtasks / Projects / Habits"
                  caption="Optional: collage showing the four databases and key views."
                  aspect="16/9"
                  fit="contain"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            <CaseStudySection id="cozy" title="🕯️✨ Your Cozy Corner of the Valley" subtitle="Your farmhouse: personal stats, vibes, reflection, and life maintenance" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>What lives here</div>
                <CaseStudyBulletList
                  items={[
                    "Character Profile — name/bio, coins, health, badges, current mood",
                    "Skill Tree — attach skills to tasks/subtasks/projects/habits to show growth over time",
                    "Daily Fortune — a motivational quote / tip (soft nudge, not pressure)",
                    "Letters — narrative messages from “NPCs” (fun, cozy, sometimes hints/quests)",
                    "Kitchen — meal planning to support energy and routines",
                    "Pets & badges — collectibles that make progress feel tangible",
                  ]}
                />
              </div>

              <Gallery3
                a={<CaseStudyImageTile src={IMAGES.characterProfile} alt="Character profile" caption="Optional: character profile." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.skillTree} alt="Skill tree" caption="Optional: skill tree page." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                c={<CaseStudyImageTile src={IMAGES.dailyFortune} alt="Daily fortune" caption="Optional: daily fortune view." aspect="4/3" theme={theme} onOpen={openLightbox} />}
              />

              <Gallery2
                a={<CaseStudyImageTile src={IMAGES.letters} alt="Letters" caption="Optional: letters page." aspect="16/9" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.mealPlanner} alt="Kitchen / meal planner" caption="Optional: kitchen & meal planning." aspect="16/9" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="workshopSection" title="🛠️✨ Workshop" subtitle="The gamification center: gold pouch, shop, and inventory" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Workshop spaces</div>
                <CaseStudyBulletList items={["💰 Gold Pouch — track hard-earned coins and plan purchases", "🎁 Shop — spend coins on cosmetics, upgrades, boosts, and rewards", "🍯 Inventory — what you own (pets, badges, decorations, boosts, etc.)"]} />
                <div className={`mt-3 text-sm ${theme.textSub}`}>
                  The workshop turns productivity into a gentle economy: effort becomes coins, and coins become rewards
                  that reinforce consistency.
                </div>
              </div>

              <Gallery3
                a={<CaseStudyImageTile src={IMAGES.goldPouch} alt="Gold Pouch" caption="Optional: gold pouch view." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                b={<CaseStudyImageTile src={IMAGES.inventory} alt="Inventory" caption="Optional: inventory view." aspect="4/3" theme={theme} onOpen={openLightbox} />}
                c={<CaseStudyImageTile src={IMAGES.shop} alt="Shop" caption="Optional: shop view." aspect="4/3" theme={theme} onOpen={openLightbox} />}
              />
            </CaseStudySection>

            <CaseStudySection id="mechanics" title="Gamification mechanics" subtitle="How rewards, feedback, and motivation are designed" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                <div className={`text-sm font-semibold ${theme.textMain}`}>Progress signals</div>
                <CaseStudyBulletList
                  items={[
                    "Coins (gold) earned from completing quests and habits",
                    "Badges and pets as collectible milestones",
                    "Skill growth via Skill Tree (skills attached to work items)",
                    "Harvested Memories as an archive of wins (reflection + identity reinforcement)",
                  ]}
                />

                <div className={`mt-6 text-sm font-semibold ${theme.textMain}`}>Reward loop</div>
                <div className="mt-2">
                  Complete quests → earn coins → spend in the shop → items appear in inventory → your valley feels more
                  “yours” → motivation stays warm and personal.
                </div>

                <div className={`mt-6 text-sm font-semibold ${theme.textMain}`}>Tone & motivation strategy</div>
                <CaseStudyBulletList
                  items={[
                    "Cozy language reduces anxiety (quests instead of chores)",
                    "Narrative cues make the system feel alive (morning on the farm, NPC letters)",
                    "Encouragement over pressure (fortune as gentle nudge, not demand)",
                  ]}
                />
              </div>
            </CaseStudySection>

            <CaseStudySection id="design" title="Design decisions" subtitle="What I intentionally optimized for" theme={theme}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Clarity & scanning</div>
                  <CaseStudyBulletList items={["Location-based structure to reduce navigation confusion", "Daily entry points (Sunrise Quests) to start fast", "Boards + calendar views for flexible planning styles"]} />
                </div>

                <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                  <div className={`text-sm font-semibold ${theme.textMain}`}>Sustainable use</div>
                  <CaseStudyBulletList items={["Gamification is supportive, not mandatory", "Reflection is built-in (Harvested Memories)", "Personal life support included (mood/energy, meals, letters, fortune)"]} />
                </div>
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.uiDetails}
                  alt="UI details"
                  caption="Optional: collage of key UI patterns (cards, headings, icons, spacing)."
                  aspect="16/9"
                  theme={theme}
                  onOpen={openLightbox}
                />
              </div>
            </CaseStudySection>

            <CaseStudySection id="outcome" title="Final outcome" subtitle="A cozy, complete system you can actually stick to" theme={theme}>
              <div className={`rounded-2xl p-5 border ${theme.softCard}`}>
                A fully navigable Notion “valley” that blends practical planning with cozy-game motivation: you can plan
                your week, manage big goals, track habits, reflect on progress, and reward yourself — all inside a world
                that feels warm.
              </div>

              <div className="mt-6">
                <CaseStudyImageTile
                  src={IMAGES.finalScreens}
                  alt="Final screens"
                  caption="Optional: collage of best final screens (Welcome + Farm + Cozy Corner + Workshop)."
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