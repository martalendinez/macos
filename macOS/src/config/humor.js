// src/config/humor.js
// Small jokes scattered around the OS. ✏️ Add your own: dad jokes, nerdy, sarcastic, cute, a bit Spanish.
// Rule of thumb: the jokes live around the work (system messages, terminal, desktop), never inside it.

export const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Restart screen: rotating status lines under the progress bar. */
export const BOOT_LINES = [
  "Compiling personality…",
  "Loading design opinions…",
  "Aligning pixels (they were 1px off)…",
  "Warming up the paella…",
  "Renaming final_final_v7.fig…",
  "Brewing coffee. Lots of it…",
];

/** Toast shown the first time someone closes a case study in a session. */
export const CLOSE_CASE_STUDY = [
  "Leaving already? That case study took me 3 months 🥲 No pressure though.",
  "Closed. It’s fine. I’m fine. Everything is fine 🙂",
  "Bye case study 👋 It’ll be right here when you miss it.",
];

/** Desktop right-click → "Make the logo bigger". */
export const LOGO_BIGGER = [
  "Logo is now 20% bigger. Client approved ✅",
  "Bigger. Bolder. Still not big enough, probably.",
  "Done! Should we also make it pop? ✨",
];

/** Daily fika reminder (15:00 Stockholm time). */
export const FIKA = "It’s 15:00 in Stockholm, which means fika time ☕ Go get a kanelbulle, the portfolio will wait.";

/** Terminal `joke`, and Messages "Tell me a joke". */
export const DAD_JOKES = [
  "Why did the designer break up with the font? It wasn’t their type.",
  "I told my code a joke. It didn’t get it, so I added a comment.",
  "Why do programmers prefer dark mode? Because light attracts bugs 🐛",
  "How do you comfort a designer? You give them some space. Preferably 8px.",
  "¿Qué le dice un pixel a otro? ¡Nos vemos en la pantalla! 👀",
  "Why was the button so calm? It had great padding.",
  "I asked the AI to make me a sandwich. It gave me 5 options and a trade-off for each 🥪",
  "There are 10 kinds of people: those who understand binary and those who don’t.",
  "Why don’t Swedes ever rush? Because there’s always time for fika ☕",
  "My Figma file has so many layers it’s basically an onion. It also makes me cry 🧅",
];
