// src/components/windows/Notes/notesData.js
// Marta's pinned notes (read-only). Content is taken from About / Recruiter Mode.
// ✏️ Block types: { h }, { p }, { ul: [] }, { check: [[text, done]] }, { quote }

export const PINNED_NOTES = [
  {
    id: "readme",
    title: "👋 Read me first",
    preview: "Hi, I'm Marta! A quick guide to this portfolio",
    blocks: [
      { h: "Hi, I'm Marta!" },
      { p: "Design Engineer at ROYC in Stockholm, and a Master's student in Interactive Media Technology at KTH." },
      { p: "I bridge UX thinking and front-end execution: research → flows → high-fidelity UI → clean components." },
      { h: "How to explore" },
      {
        ul: [
          "⚡ Short on time? Open Recruiter Mode on the desktop.",
          "🗂️ Projects has my case studies. Employer Branding is a great place to start.",
          "⌘K (or Ctrl+K) opens Spotlight to jump anywhere.",
          "💬 Messages lets you chat with a pre-recorded me.",
          "📈 Fund Simulator shows the fintech side of me: private markets, explained.",
          "🎮 Extras & Fun has games, photos and more.",
        ],
      },
    ],
  },
  {
    id: "fintech",
    title: "💳 Designing for fintech & B2B SaaS",
    preview: "Trust, clarity and complex workflows",
    blocks: [
      { h: "Designing for fintech & B2B SaaS" },
      { p: "At ROYC I design for private markets: a white-label platform that banks, wealth and asset managers use to launch and run funds. These are the principles I keep coming back to." },
      { h: "1. Trust is the feature" },
      { p: "People are moving real money. Every number needs a clear source, a date and a unit, and nothing should feel surprising. Calm, consistent UI earns more trust than flashy UI." },
      { h: "2. Make complexity navigable, not hidden" },
      { p: "Private markets are genuinely complex (capital calls, NAVs, waterfalls). The goal isn't to remove that complexity but to layer it: a clear summary first, the detail one click away." },
      { h: "3. Regulated flows still deserve good UX" },
      { p: "Onboarding with KYC/AML checks can't be skipped, so it should be predictable: show progress, explain why each document is needed, and let people save and come back." },
      { h: "4. B2B means many roles" },
      { p: "An operations analyst, a relationship manager and an end investor need different views of the same data. Permissions and roles are a design problem, not just a backend one." },
      { h: "5. White-label = design systems at their best" },
      { p: "One product has to look native under many brands. That only works with a disciplined component library and design tokens, which is exactly where Figma auto layout and React components meet." },
      { quote: "In fintech, clarity is a form of respect for people's money." },
    ],
  },
  {
    id: "privatemarkets",
    title: "📚 Private markets 101",
    preview: "GPs, LPs, capital calls and the J-curve",
    blocks: [
      { h: "Private markets 101" },
      { p: "Private markets are investments that aren't traded on a public stock exchange: private equity, venture capital, private credit, infrastructure and real estate." },
      { h: "Who's who" },
      {
        ul: [
          "GP (General Partner): the fund manager who picks and manages the investments.",
          "LP (Limited Partner): the investor, e.g. a pension fund, family office or wealth client.",
          "Distributors: banks and wealth managers who offer these funds to their clients.",
        ],
      },
      { h: "How the money moves" },
      {
        ul: [
          "Commitment: an LP promises an amount, but pays it in gradually.",
          "Capital calls: the GP draws money when it finds investments.",
          "Distributions: cash comes back when investments pay out or are sold.",
          "The J-curve: returns dip at first, then rise as investments mature.",
        ],
      },
      { h: "How performance is measured" },
      { check: [["TVPI: total value ÷ paid in", true], ["DPI: cash returned ÷ paid in", true], ["IRR: annualised, time-weighted return", true]] },
      { p: "Want to see it in action? Open the Fund Simulator in Extras & Fun." },
    ],
  },
  {
    id: "philosophy",
    title: "💡 Design philosophy",
    preview: "Software is ultimately built for humans",
    blocks: [
      { h: "Design philosophy" },
      {
        quote:
          "I approach design with the belief that software is ultimately built for humans, so empathy, curiosity, and diverse perspectives sit at the center of my process!",
      },
      { p: "In practice: I bridge UX thinking and front-end execution, so ideas go from research to flows to polished, working UI." },
    ],
  },
  {
    id: "toolbox",
    title: "🧰 My toolbox",
    preview: "Figma, React, TypeScript, Copilot, MCP…",
    blocks: [
      { h: "Design" },
      { check: [["Figma (advanced)", true], ["Component libraries & auto layout", true], ["Responsive design", true], ["Adobe XD (advanced)", true], ["Photoshop (proficient)", true], ["Illustrator (intermediate)", true], ["Framer (learning!)", false]] },
      { h: "Development" },
      { check: [["React & JSX", true], ["TypeScript", true], ["HTML / CSS", true], ["JavaScript", true], ["Tailwind CSS", true], ["Python & SQL", true], ["Git", true], ["Docker (learning!)", false]] },
      { h: "AI-assisted workflow" },
      { check: [["GitHub Copilot", true], ["MCP", true], ["Claude", true]] },
      { h: "UX research" },
      { check: [["User interviews", true], ["Usability testing", true], ["Survey design", true], ["Personas & journey maps", true], ["A/B testing", true]] },
    ],
  },
  {
    id: "timeline",
    title: "🗓️ Timeline",
    preview: "ROYC, KTH, STUDS, PrideCom, Extra Nice",
    blocks: [
      { h: "Aug 2026 → · ROYC" },
      { p: "Design Engineer. I design our platform's UI in Figma, building and maintaining a scalable component library with auto layout and responsive behavior across screen sizes. I then implement it as production-ready UI in JavaScript, TypeScript and React, using GitHub Copilot and MCP to streamline the design-to-code workflow." },
      { h: "Sep 2024 → · KTH" },
      { p: "Master's in Interactive Media Technology: interaction design & prototyping, frontend development, usability testing." },
      { h: "Sep 2024 – Jun 2025 · STUDS" },
      { p: "Vice Project Manager. Co-led the team and ran networking events between Master's students and Swedish IT companies." },
      { h: "Feb – Jun 2024 · PrideCom" },
      { p: "Led end-to-end design and development of an employer-branding platform for SMBs, from user interviews to a full-stack app (Python, Flask, PostgreSQL)." },
      { h: "Feb – Jun 2023 · Extra Nice" },
      { p: "Built gameplay prototypes in Unity and C#, and ran playtests to gather insights." },
    ],
  },
];
