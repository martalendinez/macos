// src/components/windows/About/aboutData.js
// All About-me content in one place. ✏️ Edit here; the window renders from this.

export const PROFILE = {
  name: "Marta Lendínez",
  fullName: "Marta Casandra Lendínez",
  role: "Design Engineer",
  company: { name: "Royc", url: "https://www.roycgroup.com" },
  secondaryRole: "UX Engineer",
  location: "Stockholm, Sweden",
  education: { label: "Master’s in Interactive Media Technology", school: "KTH", url: "https://www.kth.se/en/studies/master/interactive-media-technology" },
  photoCaption: "Niagara Falls, CA",
  philosophy:
    "I approach design with the belief that software is ultimately built for humans, so empathy, curiosity, and diverse perspectives sit at the center of my process!",
};

export const STATS = [
  { value: "Royc", label: "Design Engineer since Aug 2026", icon: "💼", tint: "#0a84ff" },
  { value: "5", label: "Countries I’ve lived in", icon: "🌍", tint: "#34c759" },
  { value: "KTH", label: "Master’s in Interactive Media Technology", icon: "🎓", tint: "#bf5af2" },
  { value: "Figma → Code", label: "Design and build, end to end", icon: "✨", tint: "#ff9f0a" },
];

// type: "work" | "education" | "leadership"
export const EXPERIENCE = [
  {
    role: "Design Engineer",
    org: "Royc",
    url: "https://www.roycgroup.com",
    dates: "Aug 2026 →",
    type: "work",
    current: true,
    tint: "#0a84ff",
    bullets: [
      "Design the Royc platform's UI in Figma, building and maintaining a scalable component library",
      "Use auto layout and responsive design principles to create flexible interfaces that adapt across screen sizes",
      "Implement designs as production-ready UI in JavaScript, TypeScript and React (JSX)",
      "Streamline the design-to-code workflow with GitHub Copilot and MCP",
    ],
  },
  {
    role: "Master’s Interactive Media Technology",
    org: "KTH",
    url: "https://www.kth.se/en/studies/master/interactive-media-technology",
    dates: "Sep 2024 →",
    type: "education",
    tint: "#1954a6",
    bullets: ["Interaction Design & Prototyping", "Frontend Development", "Usability Testing & Evaluation"],
  },
  {
    role: "Vice Project Manager",
    org: "STUDS",
    url: "https://studieresan.se",
    dates: "Sep 2024 – Jun 2025",
    type: "leadership",
    tint: "#ff375f",
    bullets: [
      "Co-led the STUDS project team as Vice Project Manager, coordinating operations and direction",
      "Planned and executed networking events connecting Master’s students with Swedish IT companies",
      "Facilitated stakeholder communication between students, partner companies, and the core team",
      "Organized and led recurring team meetings to align goals, timelines, and responsibilities",
      "Managed logistics, outreach, and event structure to ensure smooth execution",
    ],
  },
  {
    role: "Full Stack Intern",
    org: "PrideCom",
    url: "https://www.pridecom.es",
    dates: "Feb – Jun 2024",
    type: "work",
    tint: "#f28b4b",
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
    role: "Programmer Intern",
    org: "Extra Nice",
    url: "https://www.extra-nice.net",
    dates: "Feb – Jun 2023",
    type: "work",
    tint: "#ffcc00",
    bullets: [
      "Developed gameplay prototypes in Unity to explore and validate new mechanics",
      "Designed and implemented interactive features using C# and Unity’s component system",
      "Conducted user testing sessions to assess playability and gather actionable insights",
      "Collaborated with the team using Plastic SCM for version control and workflow alignment",
    ],
  },
  {
    role: "BEng Communication & Multimedia Design",
    org: "Hanze",
    url: "https://www.hanze.nl/en",
    dates: "Sep 2020 – Jun 2024",
    type: "education",
    tint: "#34b27b",
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

export const CORE_TOOLBOX = ["Figma", "React", "TypeScript", "GitHub Copilot", "MCP", "User Interviews"];

export const SKILL_GROUPS = [
  {
    title: "Design tools",
    icon: "🎨",
    tint: "#ff375f",
    skills: [
      ["Figma", "Advanced"],
      ["Adobe XD", "Advanced"],
      ["Photoshop", "Proficient"],
      ["Illustrator", "Intermediate"],
      ["Framer", "Basic"],
      ["Component Libraries & Auto Layout", "Advanced"],
      ["Responsive Design", "Advanced"],
    ],
  },
  {
    title: "Development",
    icon: "💻",
    tint: "#0a84ff",
    skills: [
      ["React", "Advanced"],
      ["TypeScript", "Advanced"],
      ["HTML/CSS", "Expert"],
      ["JavaScript", "Advanced"],
      ["Tailwind CSS", "Proficient"],
      ["Python", "Advanced"],
      ["SQL", "Proficient"],
      ["Docker", "Basic"],
      ["Git", "Advanced"],
    ],
  },
  {
    title: "AI tools",
    icon: "🤖",
    tint: "#bf5af2",
    skills: [
      ["GitHub Copilot", "Advanced"],
      ["MCP", "Advanced"],
      ["Claude", "Intermediate"],
      ["Supabase", "Intermediate"],
      ["Loveable", "Intermediate"],
    ],
  },
  {
    title: "UX research & methods",
    icon: "🔬",
    tint: "#34c759",
    skills: [
      ["User Interviews", "Expert"],
      ["Usability Testing", "Expert"],
      ["Survey Design", "Advanced"],
      ["Persona Creation", "Advanced"],
      ["Journey Mapping", "Advanced"],
      ["A/B Testing", "Advanced"],
    ],
  },
];

export const LEVELS = { Basic: 1, Intermediate: 2, Proficient: 3, Advanced: 4, Expert: 5 };

export const CONTACT = {
  email: "casandra.lendinez@outlook.com",
  links: [
    { label: "LinkedIn", value: "linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200", href: "https://www.linkedin.com/in/marta-casandra-lendínez-ibáñez-959259200", icon: "in", tint: "#0a66c2" },
    { label: "GitHub", value: "github.com/martalendinez", href: "https://github.com/martalendinez", icon: "⌘", tint: "#24292f" },
    { label: "Résumé", value: "resume.pdf", href: "/resume.pdf", icon: "📄", tint: "#ff3b30" },
    { label: "Portfolio", value: "portfolio-martalendinez.netlify.app", href: "https://portfolio-martalendinez.netlify.app", icon: "🖼️", tint: "#ff9f0a" },
    { label: "Source code", value: "github.com/martalendinez/macOS", href: "https://github.com/martalendinez/macOS", icon: "</>", tint: "#5856d6" },
  ],
};
