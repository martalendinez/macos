// src/hooks/useAchievements.js
import { useEffect, useRef } from "react";

export default function useAchievements({
  openWindows,
  maxMap,
  unlockAchievement,
  notifyOnce,
} = {}) {
  const openedOnceRef = useRef(new Set());

  // session-only counters (reset on refresh)
  const sessionRef = useRef({
    distinctWindowsOpened: new Set(),
    commandsRun: 0,
    gamesLaunched: 0,
    usedMaximize: false,
  });

  function trackWindowOpened(id) {
    sessionRef.current.distinctWindowsOpened.add(id);
    const distinctCount = sessionRef.current.distinctWindowsOpened.size;

    if (distinctCount >= 3) {
      unlockAchievement?.(
        "portfolio_explorer",
        "🏆 Achievement unlocked: Portfolio Explorer",
        "You explored 3 apps. Nice 👀"
      );
    }

    if ((openWindows?.length ?? 0) >= 4) {
      unlockAchievement?.(
        "multitasker",
        "🏆 Achievement unlocked: Multitasker",
        "Okayyy mission control energy ✨"
      );
    }

    if (id === "terminal") {
      unlockAchievement?.(
        "terminal_explorer",
        "🏆 Achievement unlocked: Terminal Explorer",
        "Try typing “help” for commands."
      );

      notifyOnce?.("tip_terminal", {
        title: "Tip",
        message: "Terminal: Tab autocomplete • ↑/↓ history • Esc clears input.",
        toast: true,
      });
    }

    if (id === "timer") {
      unlockAchievement?.(
        "speedrunner",
        "🏆 Achievement unlocked: Speedrunner",
        "Recruiter mode is fast 🚀"
      );
    }

    if (id === "secretProjects") {
      unlockAchievement?.("secret_finder", "Secret Finder", "You unlocked the vault 👀");
    }

    if (id === "employerBrandingCaseStudy" || id === "stardewNotionCaseStudy") {
      unlockAchievement?.(
        "deep_diver",
        "🏆 Achievement unlocked: Deep Diver",
        "You opened a case study 🧠"
      );

      const opened = sessionRef.current.distinctWindowsOpened;
      if (opened.has("employerBrandingCaseStudy") && opened.has("stardewNotionCaseStudy")) {
        unlockAchievement?.(
          "case_study_collector",
          "🏆 Achievement unlocked: Case Study Collector",
          "Two case studies opened. Respect."
        );
      }
    }
  }

  useEffect(() => {
    (openWindows ?? []).forEach((id) => {
      if (openedOnceRef.current.has(id)) return;
      openedOnceRef.current.add(id);
      trackWindowOpened(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWindows]);

  useEffect(() => {
    const anyMax = Object.values(maxMap ?? {}).some(Boolean);
    if (anyMax && !sessionRef.current.usedMaximize) {
      sessionRef.current.usedMaximize = true;
      unlockAchievement?.(
        "window_whisperer",
        "Achievement unlocked: Window Whisperer",
        "You discovered maximize."
      );
    }
  }, [maxMap, unlockAchievement]);

  function trackTerminalCommand() {
    sessionRef.current.commandsRun += 1;
    if (sessionRef.current.commandsRun >= 5) {
      unlockAchievement?.(
        "command_runner",
        "Achievement unlocked: Command Runner",
        "5 commands executed. Respect."
      );
    }
  }

  function trackGameLaunch() {
    sessionRef.current.gamesLaunched += 1;
    if (sessionRef.current.gamesLaunched >= 1) {
      unlockAchievement?.(
        "gamer",
        "Achievement unlocked: Gamer",
        "You launched a terminal game 🎮"
      );
    }
  }

  return { trackTerminalCommand, trackGameLaunch };
}