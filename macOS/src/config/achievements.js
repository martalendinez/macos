// src/config/achievements.js
// Every achievement a visitor can unlock. Keys match localStorage `ach:<key>` (see useNotifications).
// ✏️ hint = what the locked card says; secret ones stay hidden until unlocked.

export const ACHIEVEMENTS = [
  { key: "portfolio_explorer", title: "Portfolio Explorer", icon: "🧭", tint: "#0a84ff", hint: "Open 3 different apps" },
  { key: "multitasker", title: "Multitasker", icon: "🪟", tint: "#5e5ce6", hint: "Have 4 windows open at once" },
  { key: "window_whisperer", title: "Window Whisperer", icon: "🟢", tint: "#30d158", hint: "Zoom a window with the green button" },
  { key: "speedrunner", title: "Speedrunner", icon: "⚡", tint: "#ffd60a", hint: "Open Recruiter Mode" },
  { key: "prepared_recruiter", title: "Prepared Recruiter", icon: "📄", tint: "#ff9f0a", hint: "Open the résumé" },
  { key: "deep_diver", title: "Deep Diver", icon: "🤿", tint: "#64d2ff", hint: "Open a case study" },
  { key: "case_study_collector", title: "Case Study Collector", icon: "📚", tint: "#bf5af2", hint: "Open 2 different case studies" },
  { key: "terminal_explorer", title: "Terminal Explorer", icon: "⌨️", tint: "#1c1c1e", hint: "Open Terminal" },
  { key: "command_runner", title: "Command Runner", icon: "💻", tint: "#32d74b", hint: "Run 5 Terminal commands" },
  { key: "gamer", title: "Gamer", icon: "🎮", tint: "#ff375f", hint: "Launch an arcade game" },
  { key: "say_cheese", title: "Say Cheese!", icon: "📸", tint: "#ff453a", hint: "Take a selfie in Photo Booth" },
  { key: "ig_fan", title: "Biggest Fan", icon: "💛", tint: "#e1306c", hint: "Like 3 photos on Instagram" },
  { key: "chatty", title: "Great Conversationalist", icon: "💬", tint: "#34c759", hint: "Ask Marta 4 different questions" },
  { key: "fintech_curious", title: "Fintech Curious", icon: "📈", tint: "#5e5ce6", hint: "Open the Fund Simulator" },
  { key: "quest_starter", title: "Quest Starter", icon: "🎓", tint: "#5e5ce6", hint: "Finish a Fund Quest lesson" },
  { key: "private_markets_pro", title: "Private Markets Pro", icon: "🏛️", tint: "#ffd60a", hint: "Complete all of Fund Quest" },
  { key: "pixel_pusher", title: "Pixel Pusher", icon: "❖", tint: "#a259ff", hint: "Open Figma" },
  { key: "design_nerd", title: "Design Nerd", icon: "🎨", tint: "#ff9f0a", hint: "Open the Design System app" },
  { key: "lets_talk", title: "Let’s Talk", icon: "📞", tint: "#30d158", hint: "Call Marta on FaceTime" },
  { key: "wrapped", title: "Wrapped Up", icon: "🎁", tint: "#1ed760", hint: "Watch Marta’s Wrapped in Spotify" },
  { key: "secret_finder", title: "Secret Finder", icon: "🗝️", tint: "#8e8e93", hint: "There’s a hidden command somewhere…", secret: true },
];

export const ACH_PREFIX = "ach:";

export function readUnlocked() {
  const out = {};
  try {
    ACHIEVEMENTS.forEach((a) => {
      const v = window.localStorage.getItem(ACH_PREFIX + a.key);
      if (v) out[a.key] = Number(v) > 1 ? Number(v) : true; // timestamp (new) or "1" (older unlocks)
    });
  } catch {
    /* storage blocked */
  }
  return out;
}
