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

  // Images: keep null until you plug real imports/URLs (same behavior as your Employer Branding window)
  const IMAGES = useMemo(
    () => ({
      hero: null, // wide cover screenshot (Welcome page / dashboard)
      welcome: null,
      farmOverview: null,
      cozyCorner: null,
      workshop: null,

      calendar: null,
      sunriseQuests: null,
      weeklyFields: null,
      questsDatabases: null, // tasks/subtasks/projects/habits view collage
      harvestedMemories: null,

      goldPouch: null,
      shop: null,
      inventory: null,

      skillTree: null,
      characterProfile: null,
      dailyFortune: null,
      letters: null,
      mealPlanner: null,

      finalScreens: null, // collage of best screens
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

  // UI helpers (same style as Employer Branding file)
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
              Gamified Productivity System — Stardew Valley Notion Template
            </div>
            <div className={`mt-3 text-base md:text-lg ${textSub}`}>
              “Welcome to your farm!” A cozy, narrative-driven system that turns everyday tasks into quests, rewards
              consistency with coins, and makes your Notion workspace feel like a tiny valley.
            </div>

            {/* CTA row (UPDATED BUTTON TEXTS) */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${buttonClass}`}
              >
                View this in Notion
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-2xl text-sm transition-all border ${buttonClass}`}
              >
                Download the PDF
              </a>
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 scroll-mt-6">
              <div>
                <div className={`text-lg font-semibold ${textMain}`}>Overview</div>
                <div className={`mt-3 text-[15px] leading-7 ${textBody}`}>
                  Traditional productivity tools can feel like judgment: when you fall behind, the system becomes a list
                  of failures. This template reframes planning as a cozy game world — with locations, characters, and
                  progression mechanics that turn “to-dos” into small adventures.
                  <br /><br />
                  The valley is organized into three spaces:
                  <span className={`font-semibold ${textMain}`}> The Farm</span> (work + planning),
                  <span className={`font-semibold ${textMain}`}> Your Cozy Corner</span> (stats + vibes),
                  and <span className={`font-semibold ${textMain}`}> the Workshop</span> (gamification hub).
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
                    {["UX", "UI", "Notion", "Quests", "Rewards", "Systems"].map((t) => (
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
            <Section id="summary" title="Summary" subtitle="Problem → Solution → What makes it work">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Problem</div>
                <div className="mt-2">
                  Planning tools often don’t create emotional momentum. When motivation is low, systems that feel strict
                  are the first to be abandoned.
                </div>

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Solution</div>
                <div className="mt-2">
                  A narrative Notion template that maps productivity to a cozy game world: tasks become quests, progress
                  becomes “harvest,” and consistency rewards you with coins you can spend in a shop.
                </div>

                <div className={`mt-5 text-sm font-semibold ${textMain}`}>Why it works</div>
                <BulletList
                  items={[
                    "Clear, location-based navigation (you always know where to go)",
                    "Progress is visible and celebratory (harvested memories, coins, badges)",
                    "Gamification is optional + supportive (designed to reduce guilt, not increase pressure)",
                  ]}
                />
              </div>

              <Gallery2
                a={<ImageTile src={IMAGES.welcome} alt="Welcome page" caption="Optional: Welcome to your farm page." aspect="16/9" />}
                b={<ImageTile src={IMAGES.farmOverview} alt="The Farm overview" caption="Optional: The Farm overview page." aspect="16/9" />}
              />
            </Section>

            {/* My role */}
            <Section id="role" title="My role" subtitle="I designed the system, structure, and experience">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <BulletList
                  items={[
                    "Designed the information architecture (three main locations + sub-pages and flows)",
                    "Defined the database model conceptually (tasks, subtasks, projects, habits, events, memories)",
                    "Created the gamification layer (coins, shop, inventory, skill tree, badges, pets)",
                    "Wrote the narrative microcopy to make interactions feel like a world (quests, harvest, valley vibes)",
                  ]}
                />
              </div>
            </Section>

            {/* Goals */}
            <Section id="goals" title="Goals" subtitle="Experience goals + system goals">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>Experience goals</div>
                  <BulletList
                    items={[
                      "Make planning feel cozy and inviting",
                      "Turn tasks into meaningful “quests” with story flavor",
                      "Support low-energy days (no shame spiral)",
                    ]}
                  />
                </div>

                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>System goals</div>
                  <BulletList
                    items={[
                      "Fast daily usage (minimal friction)",
                      "Clear separation between planning, reflection, and rewards",
                      "Scales across tasks, subtasks, projects, habits, and events",
                    ]}
                  />
                </div>
              </div>
            </Section>

            {/* IA */}
            <Section
              id="ia"
              title="Information architecture"
              subtitle="The valley is organized as three locations with clear sub-areas"
            >
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Top-level map</div>
                <BulletList
                  items={[
                    "Welcome to your farm (entry point + navigation hub)",
                    "🥕✨ The Farm — productivity fields (tasks, habits, planning, calendar, memories)",
                    "🕯️✨ Cozy Corner — your farmhouse (stats, mood/energy, skill tree, letters, fortune, meal planning)",
                    "🛠️✨ Workshop — gamification hub (gold pouch, shop, inventory)",
                  ]}
                />
                <div className={`mt-3 text-sm ${textSub}`}>
                  The goal is to make navigation feel like a world map: you “go” somewhere depending on what you need
                  (plan, do, reflect, or reward).
                </div>
              </div>

              <Gallery3
                a={<ImageTile src={IMAGES.cozyCorner} alt="Cozy Corner" caption="Optional: Cozy Corner page." aspect="4/3" />}
                b={<ImageTile src={IMAGES.workshop} alt="Workshop" caption="Optional: Workshop hub page." aspect="4/3" />}
                c={<ImageTile src={IMAGES.farmOverview} alt="Farm hub" caption="Optional: Farm hub page." aspect="4/3" />}
              />
            </Section>

            {/* The Farm */}
            <Section id="farm" title="🥕✨ The Farm" subtitle="Where all planning + execution lives (quests, fields, calendar)">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Core areas</div>
                <BulletList
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
                a={<ImageTile src={IMAGES.calendar} alt="Town Calendar" caption="Optional: calendar view." aspect="16/9" />}
                b={<ImageTile src={IMAGES.sunriseQuests} alt="Sunrise Quests" caption="Optional: daily quests hub." aspect="16/9" />}
              />

              <Gallery2
                a={<ImageTile src={IMAGES.weeklyFields} alt="Weekly & Daily Fields" caption="Optional: Trello board / weekly plan." aspect="16/9" />}
                b={<ImageTile src={IMAGES.harvestedMemories} alt="Harvested Memories" caption="Optional: completed archive view." aspect="16/9" />}
              />

              <div className={`mt-6 rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Quest taxonomy (how work is modeled)</div>
                <BulletList
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
                <ImageTile
                  src={IMAGES.questsDatabases}
                  alt="Tasks / Subtasks / Projects / Habits"
                  caption="Optional: collage showing the four databases and key views."
                  aspect="16/9"
                  fit="contain"
                />
              </div>
            </Section>

            {/* Cozy Corner */}
            <Section
              id="cozy"
              title="🕯️✨ Your Cozy Corner of the Valley"
              subtitle="Your farmhouse: personal stats, vibes, reflection, and life maintenance"
            >
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>What lives here</div>
                <BulletList
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
                a={<ImageTile src={IMAGES.characterProfile} alt="Character profile" caption="Optional: character profile." aspect="4/3" />}
                b={<ImageTile src={IMAGES.skillTree} alt="Skill tree" caption="Optional: skill tree page." aspect="4/3" />}
                c={<ImageTile src={IMAGES.dailyFortune} alt="Daily fortune" caption="Optional: daily fortune view." aspect="4/3" />}
              />

              <Gallery2
                a={<ImageTile src={IMAGES.letters} alt="Letters" caption="Optional: letters page." aspect="16/9" />}
                b={<ImageTile src={IMAGES.mealPlanner} alt="Kitchen / meal planner" caption="Optional: kitchen & meal planning." aspect="16/9" />}
              />
            </Section>

            {/* Workshop */}
            <Section
              id="workshopSection"
              title="🛠️✨ Workshop"
              subtitle="The gamification center: gold pouch, shop, and inventory"
            >
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Workshop spaces</div>
                <BulletList
                  items={[
                    "💰 Gold Pouch — track hard-earned coins and plan purchases",
                    "🎁 Shop — spend coins on cosmetics, upgrades, boosts, and rewards",
                    "🍯 Inventory — what you own (pets, badges, decorations, boosts, etc.)",
                  ]}
                />
                <div className={`mt-3 text-sm ${textSub}`}>
                  The workshop turns productivity into a gentle economy: effort becomes coins, and coins become rewards
                  that reinforce consistency.
                </div>
              </div>

              <Gallery3
                a={<ImageTile src={IMAGES.goldPouch} alt="Gold Pouch" caption="Optional: gold pouch view." aspect="4/3" />}
                b={<ImageTile src={IMAGES.inventory} alt="Inventory" caption="Optional: inventory view." aspect="4/3" />}
                c={<ImageTile src={IMAGES.shop} alt="Shop" caption="Optional: shop view." aspect="4/3" />}
              />
            </Section>

            {/* Mechanics */}
            <Section id="mechanics" title="Gamification mechanics" subtitle="How rewards, feedback, and motivation are designed">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                <div className={`text-sm font-semibold ${textMain}`}>Progress signals</div>
                <BulletList
                  items={[
                    "Coins (gold) earned from completing quests and habits",
                    "Badges and pets as collectible milestones",
                    "Skill growth via Skill Tree (skills attached to work items)",
                    "Harvested Memories as an archive of wins (reflection + identity reinforcement)",
                  ]}
                />

                <div className={`mt-6 text-sm font-semibold ${textMain}`}>Reward loop</div>
                <div className="mt-2">
                  Complete quests → earn coins → spend in the shop → items appear in inventory → your valley feels more
                  “yours” → motivation stays warm and personal.
                </div>

                <div className={`mt-6 text-sm font-semibold ${textMain}`}>Tone & motivation strategy</div>
                <BulletList
                  items={[
                    "Cozy language reduces anxiety (quests instead of chores)",
                    "Narrative cues make the system feel alive (morning on the farm, NPC letters)",
                    "Encouragement over pressure (fortune as gentle nudge, not demand)",
                  ]}
                />
              </div>
            </Section>

            {/* Design decisions */}
            <Section id="design" title="Design decisions" subtitle="What I intentionally optimized for">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>Clarity & scanning</div>
                  <BulletList
                    items={[
                      "Location-based structure to reduce navigation confusion",
                      "Daily entry points (Sunrise Quests) to start fast",
                      "Boards + calendar views for flexible planning styles",
                    ]}
                  />
                </div>

                <div className={`rounded-2xl p-5 border ${softCard}`}>
                  <div className={`text-sm font-semibold ${textMain}`}>Sustainable use</div>
                  <BulletList
                    items={[
                      "Gamification is supportive, not mandatory",
                      "Reflection is built-in (Harvested Memories)",
                      "Personal life support included (mood/energy, meals, letters, fortune)",
                    ]}
                  />
                </div>
              </div>

              <div className="mt-6">
                <ImageTile
                  src={IMAGES.uiDetails}
                  alt="UI details"
                  caption="Optional: collage of key UI patterns (cards, headings, icons, spacing)."
                  aspect="16/9"
                />
              </div>
            </Section>

            {/* Outcome */}
            <Section id="outcome" title="Final outcome" subtitle="A cozy, complete system you can actually stick to">
              <div className={`rounded-2xl p-5 border ${softCard}`}>
                A fully navigable Notion “valley” that blends practical planning with cozy-game motivation: you can plan
                your week, manage big goals, track habits, reflect on progress, and reward yourself — all inside a world
                that feels warm.
              </div>

              <div className="mt-6">
                <ImageTile
                  src={IMAGES.finalScreens}
                  alt="Final screens"
                  caption="Optional: collage of best final screens (Welcome + Farm + Cozy Corner + Workshop)."
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
