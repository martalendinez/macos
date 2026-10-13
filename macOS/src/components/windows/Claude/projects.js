// src/components/windows/Claude/projects.js
// Claude "Projects" tied to case studies. Sessions are reconstructions of how Marta worked with AI;
// where a session ends in shipped code, that excerpt is real (Trace_Plugin/server/reflect.ts).

export const CLAUDE_PROJECTS = {
  trace: {
    footnote: "Reconstructed sessions showing how I worked. Shipped code excerpts are real, from Trace_Plugin/server/reflect.ts.",
    name: "Trace",
    blurb: "Master thesis at KTH: a task-aware AI co-pilot that helps designers think, instead of thinking for them.",
    caseStudy: "thesisCaseStudy",
    instructions:
      "You’re my thinking partner on Trace. Challenge my assumptions, say where an idea comes from (literature, interviews or testing), and flag anything you can’t know. Never write UI copy without asking who it’s for.",
    knowledge: [
      ["Thesis draft.pdf", "PDF"],
      ["Expert interviews: synthesis.md", "Notes"],
      ["Usability round 1 + 2 notes.md", "Notes"],
      ["server/reflect.ts", "Code"],
    ],
    sessions: [
      {
        id: "trace-rules",
        title: "From interview insights to prompt rules",
        tag: "Prompt design",
        file: "server/reflect.ts",
        turns: [
          {
            role: "user",
            text: "I’m building Trace, an AI co-pilot for UX designers. Below are 5 insights from my expert interviews. Turn each into a rule the model must follow.\n\nConstraints: every rule must be enforceable in a system prompt and testable in a usability session. Don’t add rules you can’t trace back to an insight.\n\n1. AI shines early, then fades.\n2. Over-automation kills engagement.\n3. A confident tone miscalibrates trust.\n4. Nobody knows where AI belongs.\n5. Failures break the flow.",
          },
          {
            role: "assistant",
            text: "Insight → rule → how to test it:\n\n1. **Adapt to the design stage.** Feedback focuses on what matters at the current stage. *Test:* count off-stage critiques per session.\n2. **Never generate UI.** Output options with trade-offs, not finished answers. *Test:* do designers still make the final call?\n3. **Every critique states its uncertainty.** *Test:* trust ratings in the post-task questionnaire.\n4. **The designer declares task type and stage up front.** *Test:* fewer “why is it telling me this?” moments.\n5. **Strict JSON, normalised server-side.** A malformed answer never breaks the UI. *Test:* zero crashes across sessions.",
          },
          {
            role: "user",
            text: "Rule 1 is too vague for the model. Write it per stage, with what to focus on **and** what to avoid. The avoid lists matter more: that’s where off-stage feedback leaks in.",
          },
          {
            role: "assistant",
            text: "Here it is per stage, focus plus avoid:\n\n```\nIf stage includes \"problem-definition\":\n- Focus on clarifying the problem, constraints, user needs, and assumptions.\n- Avoid UI-level feedback.\n\nIf stage includes \"wireframe\":\n- Focus on hierarchy, navigation, clarity, and usability.\n- Avoid visual styling feedback.\n\nIf stage includes \"high-fidelity\":\n- Focus on visual polish, spacing, accessibility, hierarchy, and consistency.\n```\n\nThe same pattern covers all eight stages, from problem definition to usability testing.",
          },
        ],
        takeaway: "Every rule traces back to research. I wrote the “avoid” lists on purpose: telling the model what not to say mattered as much as what to say. This shipped as buildDesignStageBehavior in reflect.ts.",
      },
      {
        id: "trace-schema",
        title: "Designing the critique card schema",
        tag: "Structured output",
        file: "src/features/reflection/data/critiqueRules.ts",
        turns: [
          {
            role: "user",
            text: "Critiques render as cards in the plugin. Propose a JSON schema. Requirements: a card is scannable in 3 seconds, maps to a lens the designer chose, and shows what the AI can’t know.",
          },
          {
            role: "assistant",
            text: "```\n{\n  \"id\": \"string\",\n  \"category\": \"accessibility | usability | edge-cases | …\",\n  \"title\": \"short issue\",\n  \"concern\": \"why it matters\",\n  \"suggestion\": \"what to try\",\n  \"confidence\": 0.8\n}\n```\n`category` maps to the lens, `title` is the 3-second scan, `confidence` covers what the AI can’t know.",
          },
          {
            role: "user",
            text: "Drop the confidence score. A number like 0.8 suggests a precision the model doesn’t have, which is exactly the miscalibrated trust my experts warned about. Make it a sentence: what would change the advice.",
          },
          {
            role: "assistant",
            text: "Agreed, a sentence is more honest:\n\n```\n{\n  \"id\": \"string\",\n  \"category\": \"string\",\n  \"title\": \"short issue\",\n  \"concern\": \"explanation\",\n  \"suggestion\": \"improvement\",\n  \"uncertaintyNote\": \"note\"\n}\n```\nExample note: “This depends on how familiar users already are with the product domain.” I’d also normalise every field server-side, so a missing one falls back to a default instead of breaking the card.",
          },
        ],
        takeaway: "Schema design is UX design: the fields decide what designers see on every card. I replaced a fake-precise number with an honest sentence, and that uncertaintyNote field shipped in Trace.",
      },
      {
        id: "trace-reject",
        title: "Rejected ideas keep coming back",
        tag: "Iteration",
        file: "src/features/reflection/state/reflectionReducer.ts",
        turns: [
          {
            role: "user",
            text: "Finding from usability round 2: “If I say no, I want the system to drop it.” The model reintroduces rejected options in the next generation. Give me a prompt-level fix and a product-level fix.",
          },
          {
            role: "assistant",
            text: "Prompt level:\n- Send the rejected items with every request and add the rule: “Never suggest an option equivalent to a rejected one.”\n- Optionally, filter near-duplicates server-side by similarity.\n\nProduct level:\n- Make “no” an explicit signal: Apply / Suggest / Reject on every critique.\n- Show a visible list of what was rejected, so the designer can undo it.",
          },
          {
            role: "user",
            text: "Going with the rejected-items memory and the Apply / Suggest / Reject controls. Similarity filtering is overkill for a thesis prototype, and I’d rather make rejection visible to the designer than filter silently.",
          },
          {
            role: "assistant",
            text: "Good call: a visible control also gives you something to observe in testing. Sketch of the state change:\n\n```\ncase \"REJECT_ITEM\":\n  return {\n    ...state,\n    rejected: [...state.rejected, action.id],\n  };\n```",
          },
        ],
        takeaway: "One testing finding became a prompt rule and a UI control. I picked the version that keeps the designer in the loop over the clever one.",
      },
      {
        id: "trace-synthesis",
        title: "Clustering think-aloud notes",
        tag: "Research",
        skill: "research-synthesis",
        turns: [
          {
            role: "user",
            text: "Here are my anonymised notes from the low-fidelity sessions. Cluster them into themes. Rules: quote only what’s literally in the notes, tag every point with its participant ID, and flag anything only one person said.",
          },
          {
            role: "assistant",
            text: "Four themes:\n\n1. **Unclear inputs.** “I’m not always sure what the system expects me to write here.”\n2. **Rigid flow.** People wanted to skip steps and go back.\n3. **Static critiques.** “I want to ask the AI to elaborate, not just read static cards.”\n4. **Ownership of the trace.** It felt fixed, not theirs.\n\nParticipant tags are on every point in the full table. Theme 4 rests on fewer sessions, so treat it as a lead to test, not a finding.",
          },
          {
            role: "user",
            text: "Useful. I’ll check every quote against the recordings before anything goes into the thesis.",
          },
        ],
        takeaway: "AI speeds up the clustering; I own the evidence. Each theme became a change: clearer labels, non-linear navigation, a refinement chat and an editable trace.",
      },
      {
        id: "trace-redteam",
        title: "Red-teaming my options prompt",
        tag: "Prompt QA",
        file: "server/reflect.ts",
        turns: [
          {
            role: "user",
            text: "My first options prompt was just “Generate 3 design options.” Try to break it: where does the output go wrong for a designer?",
          },
          {
            role: "assistant",
            text: "Likely failures:\n- Generic options (“improve the onboarding”).\n- Near-duplicates with different titles.\n- No reasoning, so designers can’t judge them.\n- Invented product details.\n- Broken JSON when the answer gets long.",
          },
          {
            role: "user",
            text: "Rewrite it with a constraint for each failure. Keep the reasoning high-level: designers want to see how it got there, not a wall of chain-of-thought.",
          },
          {
            role: "assistant",
            text: "```\nYou MUST generate 3–5 strong UX options.\nEach option MUST be:\n- grounded in UX principles\n- realistic and implementable\n- clearly differentiated\n- not generic\n- not repetitive\n- not vague\n\nYou MUST also include a field called \"reasoning\" where you explain,\nin 2–4 sentences, how you arrived at these options.\nThis MUST be high-level and user-friendly.\nDo NOT reveal chain-of-thought.\n```",
          },
        ],
        takeaway: "I test prompts the way I test interfaces: try to break them first. This is the options prompt that shipped in reflect.ts, with every constraint answering a failure I found.",
      },
    ],
  },
  sallskap: {
    name: "Sällskap",
    blurb: "Group dining, coordinated: a web app that collects availability and dietary needs privately, then shortlists restaurants that fit everyone.",
    caseStudy: "groupDiningCaseStudy",
    footnote: "Reconstructed sessions showing how I worked. The matching code is real, from Sallskap/src/utils/filtering.ts.",
    instructions: "We’re building Sällskap with Lovable, React and Supabase. Keep dietary needs private by default, prefer small reviewable steps, and never invent restaurant data.",
    knowledge: [
      ["Interview notes (5 people).md", "Notes"],
      ["Competitor analysis.pdf", "PDF"],
      ["Design tokens.json", "Code"],
      ["src/data/restaurants.json", "Code"],
    ],
    sessions: [
      {
        id: "sal-lovable",
        title: "Writing the build prompt for Lovable",
        tag: "Build",
        turns: [
          { role: "user", text: "I’m building Sällskap in Lovable. Turn my flow and tokens into a build prompt.\n\nFlow: Create group → Availability → Dietary needs → Shortlist → Book → Confirmation.\nConstraints: React + Tailwind, colours from my design tokens, and dietary needs stay private to each member." },
          { role: "assistant", text: "Draft:\n\n```\nBuild a responsive web app called Sällskap that helps a group\nagree on when and where to eat.\n\nScreens: Create group, Availability, Dietary needs, Shortlist,\nBook, Confirmation. One linear flow with a progress indicator.\n\nStyling: Tailwind, colours and radii from CSS variables only.\nPrivacy: each member enters dietary needs on their own screen;\nthe group overview shows what the group needs, not who needs it.\n```" },
          { role: "user", text: "Two fixes. It must not invent restaurants: read them from `restaurants.json`. And split it into one prompt per screen. One giant prompt makes the tool cut corners, and I can’t review it properly." },
          { role: "assistant", text: "Makes sense. Six prompts, one per screen, each ending with “show me the result before continuing”. Prompt 1 sets up the tokens, the data source and the empty flow, so every later screen builds on the same foundation." },
        ],
        takeaway: "Fast tools still need judgment. I broke the build into small steps I could review, and kept the data and privacy rules explicit instead of hoping the tool would guess them.",
      },
      {
        id: "sal-matching",
        title: "Matching restaurants to the whole group",
        tag: "Logic",
        file: "src/utils/filtering.ts",
        turns: [
          { role: "user", text: "Each member has dietary restrictions; each restaurant lists what it accommodates. How should the shortlist decide what to show?" },
          { role: "assistant", text: "One option is a weighted score: rank restaurants by how many of the group’s needs they meet, and show partial matches lower down with a warning." },
          { role: "user", text: "No partial matches in v1. If one person can’t eat there, it isn’t an option. A “mostly fine” dinner is exactly the group-chat problem I’m solving. Keep it strict and explainable." },
          { role: "assistant", text: "Then it’s a simple rule anyone can predict: collect every need in the group, keep only restaurants that cover all of them.\n\n```\nexport function getGroupRestrictions(members: Member[]): string[] {\n  return [...new Set(members.flatMap((m) => m.restrictions))];\n}\n\nexport function filterRestaurants(restaurants, members) {\n  const needed = getGroupRestrictions(members);\n  if (needed.length === 0) return restaurants;\n  return restaurants.filter((r) =>\n    needed.every((n) => r.restrictionsAccommodated.includes(n))\n  );\n}\n```" },
        ],
        takeaway: "I chose a rule people can predict over a clever score, because trust in the shortlist is the whole product. This is the real filterRestaurants function in the repo.",
      },
      {
        id: "sal-guide",
        title: "Reviewing my interview guide",
        tag: "Research",
        skill: "research-synthesis",
        turns: [
          { role: "user", text: "Here’s my interview guide for people who organise group dinners. Flag anything leading, and anything that might make people uncomfortable." },
          { role: "assistant", text: "Three to change:\n1. “Don’t you find group chats frustrating?” is leading. Try: “Tell me about the last time you organised a dinner with friends.”\n2. “Which booking app is best?” invites opinions, not behaviour. Ask what they actually did.\n3. Asking about dietary needs in the first minutes may feel personal. Move it later, once there’s trust." },
          { role: "user", text: "Agreed on all three. I’ll keep dietary needs for the second half and let people choose how much to share." },
        ],
        takeaway: "How I ask matters as much as what I ask. That sensitivity around dietary needs ended up shaping the product too: private by default.",
      },
    ],
  },
  kallos: {
    name: "Kallos",
    blurb: "Bachelor thesis with PrideCom: turning a consultancy’s employer-branding methodology into a secure, self-serve product.",
    caseStudy: "employerBrandingCaseStudy",
    footnote: "Reconstructed sessions showing how I worked. The encryption helpers are real, from Kallos/website/encryption.py.",
    instructions: "Kallos handles sensitive HR data and runs Llama 3 locally. Use HR vocabulary, never invent numbers, and treat privacy as a requirement, not a feature.",
    knowledge: [
      ["PrideCom methodology.pdf", "PDF"],
      ["Expert interviews (5).md", "Notes"],
      ["KPI themes.xlsx", "Data"],
      ["website/encryption.py", "Code"],
    ],
    sessions: [
      {
        id: "kal-prompt",
        title: "Prompting a local model for HR advice",
        tag: "Prompt design",
        turns: [
          { role: "user", text: "Kallos runs Llama 3 locally in LM Studio, because HR data can’t leave our environment. Draft a prompt that turns KPI themes and sentiment into recommendations at three priority levels." },
          { role: "assistant", text: "```\nYou are an employer-branding analyst.\nGiven the KPI themes and sentiment below, write recommendations\nin three levels: Level 1 (do first), Level 2, Level 3.\nEach recommendation: what to do, why, and the KPI it improves.\n```" },
          { role: "user", text: "Testers will be HR people, not marketers. Use HR vocabulary, explain how each level was derived from the score, and never invent numbers: only use the scores I pass in." },
          { role: "assistant", text: "Added three rules: “Use the terminology of HR practitioners (EVP, eNPS, retention), avoid marketing language. Reference the score that triggered each recommendation. If a number is not in the input, do not state one.”" },
        ],
        takeaway: "I wrote the prompt for the people reading the output. Testers later called the advice “very in line with HR vocabulary”, the feedback they valued most.",
      },
      {
        id: "kal-levels",
        title: "What separates Level 1, 2 and 3?",
        tag: "Iteration",
        turns: [
          { role: "user", text: "Testing finding: people saw Level 1, 2 and 3 but weren’t sure what separated them. Suggest one-line definitions an HR manager could act on." },
          { role: "assistant", text: "- **Level 1 · Foundations:** fix these first; they hold your score back the most.\n- **Level 2 · Strengthen:** improve what already works but is underused.\n- **Level 3 · Differentiate:** stand out once the basics are in place." },
          { role: "user", text: "Good. I’ll put each definition right under the level heading, not in a tooltip. People need it at the moment they decide where to start." },
        ],
        takeaway: "Clarity belongs on the screen, not behind a hover. Each level now says what it’s for, so HR knows where to start.",
      },
      {
        id: "kal-crypto",
        title: "Encrypting survey answers",
        tag: "Security",
        file: "website/encryption.py",
        turns: [
          { role: "user", text: "Personal fields from sign-up and surveys must be encrypted before they reach the database. I’m using PyNaCl. Review the approach." },
          { role: "assistant", text: "SecretBox is a good fit: authenticated symmetric encryption, hard to misuse. Keep the helpers tiny and Base64-encode the output for storage. One thing to plan for: keep the key separate from the data it protects." },
          { role: "user", text: "Agreed. I’ll keep encryption in its own small module, so key handling can move to a secrets manager when this grows beyond a thesis prototype." },
          { role: "assistant", text: "```\ndef encrypt(message, key):\n    box = nacl.secret.SecretBox(key)\n    encrypted = box.encrypt(message.encode(), encoder=Base64Encoder)\n    return encrypted.decode('utf-8')\n\ndef generate_key():\n    return nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE)\n```" },
        ],
        takeaway: "Privacy shaped the architecture from day one: the experts made it clear Kallos was worthless without it. These are the real helpers in the repo.",
      },
    ],
  },
  trivia: {
    name: "Trivia",
    blurb: "KTH group project: a React Native quiz game for a quick round or serious competition, built by a team of four.",
    caseStudy: "triviaCaseStudy",
    footnote: "Reconstructed sessions showing how I worked on the team. Outcomes match the case study.",
    instructions: "We’re 4 people: 2 on UI and frontend, 2 on Firebase. Keep design and code in sync, write for teammates, and flag anything that affects the backend.",
    knowledge: [
      ["Figma design system", "Link"],
      ["Game rules.md", "Notes"],
      ["Testing notes.md", "Notes"],
    ],
    sessions: [
      {
        id: "tri-tokens",
        title: "Mirroring Figma tokens in React Native",
        tag: "Design system",
        turns: [
          { role: "user", text: "Two of us build the frontend. I have colours, type and spacing in Figma. Propose a theme structure for React Native so we both build from the same parts." },
          { role: "assistant", text: "```\nexport const theme = {\n  color: { purple: \"#7b6cf6\", green: \"#34c759\", grey100: \"#f2f2f7\" },\n  space: { s: 8, m: 16, l: 24 },\n  radius: { card: 16, button: 12 },\n  type: { title: 28, body: 16, caption: 13 },\n};\n```" },
          { role: "user", text: "Use semantic names instead of raw colours: primary, success, surface, text. Then a theme switcher later is one swap, not a refactor." },
          { role: "assistant", text: "Updated: `color.primary`, `color.success`, `color.surface`, `color.text`. Components only read semantic tokens, never hex values." },
        ],
        takeaway: "A design system is a team tool. Semantic tokens kept two people consistent, and made the theme switcher testers asked for a small change.",
      },
      {
        id: "tri-lives",
        title: "Balancing the lives system",
        tag: "Game design",
        turns: [
          { role: "user", text: "Testers said Challenge mode felt low-stakes. I’m thinking about lives. How many, and should Leisure have them too?" },
          { role: "assistant", text: "Tie lives to difficulty so hard rounds feel tense but fair, for example 5 on easy and 3 on hard. Keep Leisure without lives: it’s for a quick, relaxed round." },
          { role: "user", text: "Going with 5 and 3, Challenge only. Friction should add stakes where people want them, not get in the way of starting a game." },
        ],
        takeaway: "Friction is a design decision: lives where it raises the stakes, no sign-up wall where it would stop people playing.",
      },
      {
        id: "tri-handoff",
        title: "What the UI needs from Firebase",
        tag: "Team",
        turns: [
          { role: "user", text: "Draft a short handoff for our two backend teammates: what data the Ranking and Profile screens need." },
          { role: "assistant", text: "**Ranking:** user id, display name, avatar, total score, games played; sorted by score, top 50.\n**Profile:** the same user fields, plus game history: date, mode, category, difficulty, score." },
          { role: "user", text: "Add who owns what, and one rule: guests never write to the leaderboard. That’s the incentive to log in." },
        ],
        takeaway: "Being in the middle is the job: translating what the UI needs into data, and what the data makes possible back into the UI.",
      },
    ],
  },
};
