// src/components/windows/AboutWindow.jsx
import { useMemo, useState } from "react";
import aboutIcon from "../../imgs/me.png";

/* -------------------- LINK ROW (CLICKABLE) -------------------- */
function LinkRow({ icon, label, value }) {
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
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="flex items-center gap-2 text-white/80">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>

      <a
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className="text-white/90 text-sm truncate max-w-[60%] hover:underline transition"
        title={value}
      >
        {value}
      </a>
    </div>
  );
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function AboutWindow() {
  const tabs = useMemo(() => ["Overview", "Experience", "Skills", "Contact"], []);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="h-full flex flex-col">
      {/* Top tabs */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-4 text-white/80 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`relative transition ${
                activeTab === t ? "text-white" : "hover:text-white/95"
              }`}
            >
              <span className="px-1">{t}</span>
              {activeTab === t && (
                <span className="absolute left-1 right-1 -bottom-2 h-[2px] bg-white/70 rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 h-px bg-white/10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Experience" && <ExperienceTab />}
        {activeTab === "Skills" && <SkillsTab />}
        {activeTab === "Contact" && <ContactTab />}
      </div>
    </div>
  );
}

/* -------------------- TABS -------------------- */

function OverviewTab() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white/6 border border-white/10 p-5">
        <div className="flex gap-6">
          <div className="w-44 flex-shrink-0">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="aspect-square rounded-xl border border-dashed border-white/25 flex items-center justify-center">
                <img
                  src={aboutIcon}
                  alt="Profile"
                  className="w-16 h-16 object-contain opacity-90"
                />
              </div>
              <div className="mt-3 text-white/70 text-xs">[Profile Photo]</div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-white text-lg font-semibold leading-tight">
              Marta Lendínez
            </div>
            <div className="text-white/80 text-sm mt-1">
              UX Engineer <span className="text-white/40">•</span> UI Designer
            </div>

            <div className="mt-4 text-white/70 text-sm leading-relaxed">
              Master’s in Interactive Media Technology @{" "}
              <span className="text-white/90">KTH</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <MiniRow icon="🟢" title="Location" value="Stockholm, Sweden" />
              <MiniRow
                icon="🎓"
                title="Education"
                value="Master’s in Interactive Media Technology • KTH"
              />
              <MiniRow
                icon="💼"
                title="Experience"
                value="UX/UI Designer • Frontend Developer • 2+ years"
              />
              <MiniRow
                icon="🌍"
                title="International background"
                value="NL Netherlands • DE Germany • SE Sweden • CA Canada"
              />
              <MiniRow
                icon="💡"
                title="Design philosophy"
                value="Empathy-driven, user-centered design with a focus on solving real problems through research, iteration, and collaboration."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <ActionButton icon="⬇️" label="Download Resume" />
        <ActionButton icon="🗂️" label="View Projects" />
      </div>
    </div>
  );
}

function ExperienceTab() {
  const items = [
    {
      year: "2026",
      title: (
        <>
          Master's Interactive Media Technology @{" "}
          <a
            href="https://www.kth.se/en/studies/master/interactive-media-technology"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
          >
            KTH
          </a>
        </>
      ),
      right: "Sep 2024 →",
      bullets: [
        "Interaction Design & Prototyping",
        "Frontend Development",
        "Usability Testing & Evaluation",
      ],
    },
    {
      year: "2024-25",
      title: (
        <>
          Vice Project Manager @{" "}
          <a
            href="https://studieresan.se"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
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
          Full Stack Intern @{" "}
          <a
            href="https://www.pridecom.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
          >
            PrideCom
          </a>
        </>
      ),
      right: "Feb - June 2024",
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
          Programmer Intern @{" "}
          <a
            href="https://www.extra-nice.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
          >
            Extra Nice
          </a>
        </>
      ),
      right: "Feb - June 2023",
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
          BEng Communication & Multimedia Design @{" "}
          <a
            href="https://www.hanze.nl/en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:underline"
          >
            Hanze
          </a>
        </>
      ),
      right: "Sep 2020 - June 2024 →",
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
        <div
          key={it.year}
          className="rounded-2xl bg-white/6 border border-white/10 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="text-white/70 text-sm font-medium">{it.year}</div>
            <div className="text-white/60 text-sm">{it.right}</div>
          </div>

          <div className="mt-3 text-white text-base font-semibold">{it.title}</div>

          <ul className="mt-3 space-y-2 text-white/75 text-sm">
            {it.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-white/40">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsTab() {
  return (
    <div className="space-y-5">
      <SkillGroup title="DESIGN TOOLS" icon="🎨">
        <SkillRow name="Figma" level="Expert" years="5 years" />
        <SkillRow name="Sketch" level="Advanced" years="3 years" />
        <SkillRow name="Adobe XD" level="Proficient" years="2 years" />
        <SkillRow name="Illustrator" level="Intermediate" years="" />
        <SkillRow name="Photoshop" level="Working knowledge" years="" />
      </SkillGroup>

      <SkillGroup title="DEVELOPMENT" icon="💻">
        <SkillRow name="React" level="Advanced" years="4 years" />
        <SkillRow name="TypeScript" level="Advanced" years="3 years" />
        <SkillRow name="HTML/CSS" level="Expert" years="6 years" />
        <SkillRow name="JavaScript" level="Advanced" years="4 years" />
        <SkillRow name="Tailwind CSS" level="Proficient" years="2 years" />
      </SkillGroup>

      <SkillGroup title="UX RESEARCH & METHODS" icon="🔬">
        <SkillRow name="User Interviews" level="Expert" />
        <SkillRow name="Usability Testing" level="Advanced" />
        <SkillRow name="Survey Design" level="Advanced" />
        <SkillRow name="Persona Creation" level="Advanced" />
        <SkillRow name="Journey Mapping" level="Advanced" />
        <SkillRow name="A/B Testing" level="Intermediate" />
      </SkillGroup>
    </div>
  );
}

function ContactTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-2xl bg-white/6 border border-white/10 p-5">
        <div className="flex items-center gap-3">
          <img src={aboutIcon} alt="Profile" className="w-11 h-11 object-contain" />
          <div>
            <div className="text-white font-semibold">Marta Casandra Lendínez</div>
            <div className="text-white/70 text-sm">UX Engineer</div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-white/80 text-sm">
          <LinkRow icon="✉️" label="Email" value="casandra.lendinez@outlook.com" />
          <LinkRow
            icon="🔗"
            label="LinkedIn"
            value="www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200"
          />
          <LinkRow icon="🐙" label="GitHub" value="https://github.com/martalendinez" />
          <LinkRow icon="📄" label="Resume" value="resume.pdf" />
          <LinkRow icon="🖼️" label="Portfolio" value="marta.lendinez.portfolio.com" />
        </div>
      </div>

      <div className="rounded-2xl bg-white/6 border border-white/10 p-5">
        <div className="text-white font-semibold mb-2">Let’s Connect!</div>
        <div className="text-white/75 text-sm leading-relaxed">
          I’d love to hear about opportunities, collaborations, or just chat about design!
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <QuickBtn label="Send email" />
          <QuickBtn label="View code" />
        </div>

        <div className="mt-5 rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-white/85 text-sm font-medium mb-3">Send a message</div>

          <div className="grid grid-cols-1 gap-3">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" placeholder="you@email.com" />
            <Input label="Subject" placeholder="Hello!" />
            <Textarea label="Message" placeholder="Type your message here..." />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm transition"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/10 text-white text-sm transition"
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- UI BITS -------------------- */

function MiniRow({ icon, title, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-2 text-white/85 text-sm font-medium">
        <span className="text-base">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="mt-1 text-white/70 text-sm leading-relaxed">{value}</div>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button
      type="button"
      className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3 text-white/90 text-sm transition flex items-center gap-2"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SkillGroup({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-white/6 border border-white/10 p-5">
      <div className="flex items-center gap-2 text-white/90 text-sm font-semibold mb-4">
        <span>{icon}</span>
        <span className="tracking-wide">{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SkillRow({ name, level, years }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-40 text-white/80 text-sm">{name}</div>

      <div className="flex-1">
        <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
          <div className="h-full bg-white/40" style={{ width: levelToPct(level) }} />
        </div>
      </div>

      <div className="w-28 text-white/70 text-sm">{level}</div>
      <div className="w-20 text-white/60 text-sm text-right">{years}</div>
    </div>
  );
}

function levelToPct(level) {
  const map = {
    "Working knowledge": "25%",
    Intermediate: "40%",
    Proficient: "55%",
    Advanced: "75%",
    Expert: "92%",
  };
  return map[level] ?? "50%";
}

function QuickBtn({ label }) {
  return (
    <button
      type="button"
      className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 text-white/85 text-sm transition"
    >
      {label}
    </button>
  );
}

function Input({ label, placeholder }) {
  return (
    <label className="block">
      <div className="text-white/70 text-xs mb-1">{label}</div>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 text-sm outline-none focus:border-white/20"
      />
    </label>
  );
}

function Textarea({ label, placeholder }) {
  return (
    <label className="block">
      <div className="text-white/70 text-xs mb-1">{label}</div>
      <textarea
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 text-sm outline-none focus:border-white/20 resize-none"
      />
    </label>
  );
}
