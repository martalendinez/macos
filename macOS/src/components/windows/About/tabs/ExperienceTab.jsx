// src/components/windows/About/tabs/ExperienceTab.jsx
export default function ExperienceTab({ styles }) {
  const items = [
    {
      year: "2026",
      title: (
        <>
          Master’s Interactive Media Technology <span className={styles.accentText}>@</span>{" "}
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
          Vice Project Manager <span className={styles.accentText}>@</span>{" "}
          <a href="https://studieresan.se" target="_blank" rel="noopener noreferrer" className={`${styles.accentText} hover:underline`}>
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
          Full Stack Intern <span className={styles.accentText}>@</span>{" "}
          <a href="https://www.pridecom.es" target="_blank" rel="noopener noreferrer" className={`${styles.accentText} hover:underline`}>
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
          Programmer Intern <span className={styles.accentText}>@</span>{" "}
          <a href="https://www.extra-nice.net" target="_blank" rel="noopener noreferrer" className={`${styles.accentText} hover:underline`}>
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
          BEng Communication & Multimedia Design <span className={styles.accentText}>@</span>{" "}
          <a href="https://www.hanze.nl/en" target="_blank" rel="noopener noreferrer" className={`${styles.accentText} hover:underline`}>
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