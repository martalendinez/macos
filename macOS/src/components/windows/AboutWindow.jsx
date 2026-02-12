// src/components/windows/AboutWindow.jsx
import { useMemo, useState } from "react";

// BIG overview photo (use a different image than Contact)
import overviewPhoto from "../../imgs/profile.jpeg";

// Small avatar for contact card
import contactAvatar from "../../imgs/Avatar1.jpg";

/* -------------------- LINK ROW (CLICKABLE) -------------------- */
function LinkRow({ icon, label, value, styles }) {
  let href = value;

  const lowerLabel = (label ?? "").toLowerCase();
  const lowerValue = (value ?? "").toLowerCase();

  // email
  if (lowerLabel === "email" || value?.includes("@")) {
    href = `mailto:${value}`;
  }
  // pdf / local file
  else if (lowerValue.endsWith(".pdf")) {
    href = value.startsWith("/") ? value : `/${value}`;
  }
  // normal links (add https if missing)
  else if (!value.startsWith("http")) {
    href = `https://${value}`;
  }

  const isEmail = href.startsWith("mailto:");

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl ${styles.cardBg} border ${styles.cardBorder} px-4 py-3`}
    >
      <div className={`flex items-center gap-2 ${styles.textSub}`}>
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>

      <a
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className={`${styles.textMain} text-sm truncate max-w-[60%] hover:underline transition`}
        title={value}
      >
        {value}
      </a>
    </div>
  );
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function AboutWindow({ uiTheme = "glass", onOpenWindow }) {
  const isMac = uiTheme === "macos";

  // theme tokens
  const styles = useMemo(() => {
    return {
      // accent
      accentText: isMac ? "text-emerald-700" : "text-white",
      accentUnderline: isMac ? "bg-emerald-600" : "bg-white/70",

      // text
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",
      textSub2: isMac ? "text-black/50" : "text-white/60",

      // surfaces
      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBgSoft: isMac ? "bg-white" : "bg-white/5",
      cardHover: isMac ? "hover:bg-black/5" : "hover:bg-white/10",

      // borders/dividers
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",

      // buttons (neutral, like your screenshot)
      btn: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-emerald-50 hover:border-emerald-200 transition"
        : "bg-white/10 border border-white/10 hover:bg-white/15 text-white/90",

      // primary action buttons should ALSO be neutral (not solid green)
      btnPrimary: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-emerald-50 hover:border-emerald-200 transition"
        : "bg-white/15 border border-white/10 hover:bg-white/20 text-white",

      // inputs focus ring
      inputFocus: isMac ? "focus:ring-4 focus:ring-emerald-200" : "focus:ring-4 focus:ring-white/20",

      // tabs
      tab: isMac ? "text-black/60 hover:text-emerald-700" : "text-white/80 hover:text-white/95",
      tabActive: isMac ? "text-emerald-700" : "text-white",
    };
  }, [isMac]);

  const tabs = useMemo(() => ["Overview", "Experience", "Skills", "Contact"], []);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      {/* Top tabs */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-4 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`relative transition ${activeTab === t ? styles.tabActive : styles.tab}`}
            >
              <span className="px-1">{t}</span>
              {activeTab === t && (
                <span
                  className={`absolute left-1 right-1 -bottom-2 h-[2px] rounded-full ${styles.accentUnderline}`}
                />
              )}
            </button>
          ))}
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "Overview" && <OverviewTab styles={styles} onOpenWindow={onOpenWindow} />}
        {activeTab === "Experience" && <ExperienceTab styles={styles} />}
        {activeTab === "Skills" && <SkillsTab styles={styles} isMac={isMac} />}
        {activeTab === "Contact" && <ContactTab styles={styles} />}
      </div>
    </div>
  );
}

/* -------------------- TABS -------------------- */

function PhotoLocation({ styles, text = "Niagara Falls, CA" }) {
  return (
    <div className="absolute left-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition duration-200">
      <div className="relative group/location">
        {/* Pill */}
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs shadow-xl backdrop-blur-md ${styles.cardBg} border ${styles.cardBorder}`}
        >
          <span className={styles.textMain}>↗</span>
          <span className={`${styles.textMain} font-medium`}>{text}</span>
        </div>

        {/* Tooltip */}
        <div
          className={`pointer-events-none absolute left-0 -top-11 opacity-0 group-hover/location:opacity-100 transition duration-150 rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-md ${styles.cardBg} border ${styles.cardBorder} ${styles.textMain}`}
        >
          {text}
          <div
            className={`absolute left-4 -bottom-1 h-2 w-2 rotate-45 ${styles.cardBg} border-b ${styles.cardBorder} border-r ${styles.cardBorder}`}
          />
        </div>
      </div>
    </div>
  );
}

/** Overview: 2 columns, big photo, info blocks */
function OverviewTab({ styles, onOpenWindow }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — BIG PHOTO CARD */}
        <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div
            className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border ${styles.cardBorder} ${styles.cardBgSoft}`}
          >
            <img src={overviewPhoto} alt="Marta portrait" className="w-full h-full object-cover" />
            <PhotoLocation styles={styles} text="Niagara Falls, CA" />
          </div>

          <div className="mt-4">
            <div className={`${styles.textStrong} text-xl font-semibold leading-tight`}>Marta Lendínez</div>
            <div className={`${styles.textSub} text-sm mt-1`}>
              UX Engineer <span className={styles.textSub2}>•</span> UI Designer
            </div>

            <div className={`${styles.textSub} mt-3 text-sm leading-relaxed`}>
              Master’s in Interactive Media Technology{" "}
              <span className={styles.accentText}>@</span>{" "}
              <a
                href="https://www.kth.se/en/studies/master/interactive-media-technology"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.accentText} hover:underline`}
              >
                KTH
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT — INFO BLOCKS */}
        <div className="space-y-4">
          <InfoBlock styles={styles} icon="📍" title="Location" value="Stockholm, Sweden" />
          <InfoBlock styles={styles} icon="🎓" title="Education" value="Master’s in Interactive Media Technology • KTH" />
          <InfoBlock styles={styles} icon="💼" title="Experience" value="UX/UI Designer • Frontend Developer • 1+ year" />
          <InfoBlock
            styles={styles}
            icon="🌍"
            title="International background"
            value="ES Spain • NL Netherlands • DE Germany • SE Sweden • CA Canada"
          />
          <InfoBlock
            styles={styles}
            icon="💡"
            title="Design philosophy"
            value="I approach design with the belief that software is ultimately built for humans, so empathy, curiosity, and diverse perspectives sit at the center of my process!"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <ActionButton
          styles={styles}
          icon="⬇️"
          label="Download Resume"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "/resume.pdf";
            a.download = "Marta_Lendinez_Resume.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}
        />

        <ActionButton styles={styles} icon="🗂️" label="View Projects" onClick={() => onOpenWindow?.("projects")} />
      </div>
    </div>
  );
}

function ExperienceTab({ styles }) {
  const items = [
    {
      year: "2026",
      title: (
        <>
          Master’s Interactive Media Technology{" "}
          <span className={styles.accentText}>@</span>{" "}
          <a
            href="https://www.kth.se/en/studies/master/interactive-media-technology"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.accentText} hover:underline`}
          >
            KTH
          </a>
        </>
      ),
      right: "Sep 2024 →",
      bullets: ["Interaction Design & Prototyping", "Frontend Development", "Usability Testing & Evaluation"],
    },
    {
      year: "2024-25",
      title: (
        <>
          Vice Project Manager{" "}
          <span className={styles.accentText}>@</span>{" "}
          <a
            href="https://studieresan.se"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.accentText} hover:underline`}
          >
            STUDS
          </a>
        </>
      ),
      right: "Sep 2024 - June 2025",
      bullets: [
        "Co-led the STUDS project team as Vice Project Manager, coordinating operations and direction",
        "Planned and executed networking events connecting Master’s students with Swedish IT companies",
        "Facilitated stakeholder communication between students, partner companies, and the core team",
        "Organized and led recurring team meetings to align goals, timelines, and responsibilities",
        "Managed logistics, outreach, and event structure to ensure smooth execution",
      ],
    },
    {
      year: "2024",
      title: (
        <>
          Full Stack Intern{" "}
          <span className={styles.accentText}>@</span>{" "}
          <a
            href="https://www.pridecom.es"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.accentText} hover:underline`}
          >
            PrideCom
          </a>
        </>
      ),
      right: "Feb - Jun 2024",
      bullets: [
        "Led end-to-end design and development of an employer-branding platform for SMBs",
        "Conducted user interviews and usability tests to validate needs and refine flows",
        "Designed information architecture, wireframes, and high-fidelity UI in Figma",
        "Built full-stack application using Python, Flask, PostgreSQL, and Bootstrap",
        "Managed deployment, data structure, and backend logic",
        "Collaborated closely with stakeholders at PrideCom to align product vision",
      ],
    },
    {
      year: "2023",
      title: (
        <>
          Programmer Intern{" "}
          <span className={styles.accentText}>@</span>{" "}
          <a
            href="https://www.extra-nice.net"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.accentText} hover:underline`}
          >
            Extra Nice
          </a>
        </>
      ),
      right: "Feb - Jun 2023",
      bullets: [
        "Developed gameplay prototypes in Unity to explore and validate new mechanics",
        "Designed and implemented interactive features using C# and Unity’s component system",
        "Conducted user testing sessions to assess playability and gather actionable insights",
        "Collaborated with the team using Plastic SCM for version control and workflow alignment",
      ],
    },
    {
      year: "2020-24",
      title: (
        <>
          BEng Communication & Multimedia Design{" "}
          <span className={styles.accentText}>@</span>{" "}
          <a
            href="https://www.hanze.nl/en"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.accentText} hover:underline`}
          >
            Hanze
          </a>
        </>
      ),
      right: "Sep 2020 - Jun 2024 →",
      bullets: [
        "Programming across multiple languages and frameworks",
        "UX/UI design grounded in human-centered principles",
        "Digital product development from concept to delivery",
        "Information architecture and interaction design",
        "Collaborative teamwork in multidisciplinary groups",
        "Client communication and real-world project execution",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {items.map((it) => (
        <div key={it.year} className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className="flex items-start justify-between gap-4">
            <div className={`${styles.textSub} text-sm font-medium`}>{it.year}</div>
            <div className={`${styles.textSub2} text-sm`}>{it.right}</div>
          </div>

          <div className={`mt-3 ${styles.textStrong} text-base font-semibold`}>{it.title}</div>

          <ul className={`mt-3 space-y-2 ${styles.textSub} text-sm`}>
            {it.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className={styles.textSub2}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsTab({ styles, isMac }) {
  return (
    <div className="space-y-5">
      <SkillGroup styles={styles} title="DESIGN TOOLS" icon="🎨">
        <SkillRow styles={styles} isMac={isMac} name="Figma" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Adobe XD" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Photoshop" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Illustrator" level="Intermediate" />
        <SkillRow styles={styles} isMac={isMac} name="Framer" level="Basic" />
      </SkillGroup>

      <SkillGroup styles={styles} title="DEVELOPMENT" icon="💻">
        <SkillRow styles={styles} isMac={isMac} name="React" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="TypeScript" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="HTML/CSS" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="JavaScript" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Tailwind CSS" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Python" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="SQL" level="Proficient" />
        <SkillRow styles={styles} isMac={isMac} name="Docker" level="Basic" />
        <SkillRow styles={styles} isMac={isMac} name="Git" level="Advanced" />
      </SkillGroup>

      <SkillGroup styles={styles} title="UX RESEARCH & METHODS" icon="🔬">
        <SkillRow styles={styles} isMac={isMac} name="User Interviews" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="Usability Testing" level="Expert" />
        <SkillRow styles={styles} isMac={isMac} name="Survey Design" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Persona Creation" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="Journey Mapping" level="Advanced" />
        <SkillRow styles={styles} isMac={isMac} name="A/B Testing" level="Advanced" />
      </SkillGroup>
    </div>
  );
}

function ContactTab({ styles }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left card */}
      <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full overflow-hidden border ${styles.cardBorder}`}>
            <img src={contactAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className={`${styles.textStrong} font-semibold`}>Marta Casandra Lendínez</div>
            <div className={`${styles.textSub} text-sm`}>UX Engineer</div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <LinkRow styles={styles} icon="✉️" label="Email" value="casandra.lendinez@outlook.com" />
          <LinkRow
            styles={styles}
            icon="🔗"
            label="LinkedIn"
            value="www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200"
          />
          <LinkRow styles={styles} icon="🐙" label="GitHub" value="https://github.com/martalendinez" />
          <LinkRow styles={styles} icon="📄" label="Resume" value="resume.pdf" />
          <LinkRow styles={styles} icon="🖼️" label="Portfolio" value="marta.lendinez.portfolio.com" />
        </div>
      </div>

      {/* Right card */}
      <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
        <div className={`${styles.textStrong} font-semibold mb-2`}>Let’s Connect!</div>
        <div className={`${styles.textSub} text-sm leading-relaxed`}>
          I’d love to hear about opportunities, collaborations, or just chat about design!
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <QuickBtn styles={styles} label="Send email" />
          <QuickBtn styles={styles} label="View code" />
        </div>

        <div className={`mt-5 rounded-xl ${styles.cardBgSoft} border ${styles.cardBorder} p-4`}>
          <div className={`${styles.textMain} text-sm font-medium mb-3`}>Send a message</div>

          <div className="grid grid-cols-1 gap-3">
            <Input styles={styles} label="Name" placeholder="Your name" />
            <Input styles={styles} label="Email" placeholder="you@email.com" />
            <Input styles={styles} label="Subject" placeholder="Hello!" />
            <Textarea styles={styles} label="Message" placeholder="Type your message here..." />
          </div>

          <div className="mt-4 flex justify-between">
            <button type="button" className={`px-4 py-2 rounded-xl ${styles.btn} text-sm transition`}>
              Cancel
            </button>
            <button type="button" className={`px-4 py-2 rounded-xl ${styles.btnPrimary} text-sm transition`}>
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- UI BITS -------------------- */

function InfoBlock({ styles, icon, title, value }) {
  return (
    <div className={`rounded-xl ${styles.cardBg} border ${styles.cardBorder} p-4`}>
      <div className={`flex items-center gap-2 ${styles.textMain} text-sm font-medium`}>
        <span className="text-base">{icon}</span>
        <span>{title}</span>
      </div>
      <div className={`mt-1 ${styles.textSub} text-sm leading-relaxed`}>{value}</div>
    </div>
  );
}

function ActionButton({ styles, icon, label, onClick, href, download }) {
  const className = `rounded-xl px-4 py-3 text-sm transition flex items-center gap-2 ${styles.btnPrimary}`;

  if (href) {
    return (
      <a href={href} download={download ? "" : undefined} className={className}>
        <span>{icon}</span>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SkillGroup({ styles, title, icon, children }) {
  return (
    <div className={`rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
      <div className={`flex items-center gap-2 ${styles.textMain} text-sm font-semibold mb-4`}>
        <span>{icon}</span>
        <span className="tracking-wide">{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SkillRow({ styles, name, level, isMac }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-40 ${styles.textMain} text-sm`}>{name}</div>

      <div className="flex-1">
        <div className="h-1.5 rounded-full bg-black/10">
  <div
    className={`h-full rounded-full ${
      isMac ? "bg-emerald-500" : "bg-white/70"
    }`}
    style={{ width: levelToPct(level) }}
  />
</div>

      </div>

      <div className={`w-28 ${styles.textSub} text-sm`}>{level}</div>
    </div>
  );
}

function levelToPct(level) {
  const map = {
    Basic: "20%",
    "Working knowledge": "25%",
    Intermediate: "40%",
    Proficient: "55%",
    Advanced: "75%",
    Expert: "92%",
  };
  return map[level] ?? "50%";
}

function QuickBtn({ styles, label }) {
  return <button type="button" className={`rounded-xl px-3 py-2 text-sm transition ${styles.btn}`}>{label}</button>;
}

function Input({ styles, label, placeholder }) {
  return (
    <label className="block">
      <div className={`${styles.textSub} text-xs mb-1`}>{label}</div>
      <input
        placeholder={placeholder}
        className={`w-full rounded-xl px-3 py-2 text-sm outline-none border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
      />
    </label>
  );
}

function Textarea({ styles, label, placeholder }) {
  return (
    <label className="block">
      <div className={`${styles.textSub} text-xs mb-1`}>{label}</div>
      <textarea
        placeholder={placeholder}
        rows={4}
        className={`w-full rounded-xl px-3 py-2 text-sm outline-none resize-none border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
      />
    </label>
  );
}
