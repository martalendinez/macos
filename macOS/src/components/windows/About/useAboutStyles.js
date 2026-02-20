// src/components/windows/About/useAboutStyles.js
import { useMemo } from "react";

export default function useAboutStyles(uiTheme = "glass", glassContrast = "light") {
  const isMac = uiTheme === "macos";

  // ✅ If wallpaper is bright in glass mode, use dark text tokens
  const glassDarkText = uiTheme === "glass" && glassContrast === "dark";
  const isDark = glassDarkText; // naming clarity

  return useMemo(() => {
    return {
      // accent
      accentText: isMac ? "text-[hsl(var(--accent))]" : isDark ? "text-black" : "text-white",
      accentUnderline: isMac ? "bg-[hsl(var(--accent))]" : isDark ? "bg-black/60" : "bg-white/70",

      // text
      textMain: isMac ? "text-black/80" : isDark ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : isDark ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : isDark ? "text-black/60" : "text-white/70",
      textSub2: isMac ? "text-black/50" : isDark ? "text-black/50" : "text-white/60",

      // surfaces
      cardBg: isMac ? "bg-white" : isDark ? "bg-white/35" : "bg-white/6",
      cardBgSoft: isMac ? "bg-white" : isDark ? "bg-white/28" : "bg-white/5",

      // borders/dividers
      cardBorder: isMac ? "border-black/10" : isDark ? "border-black/15" : "border-white/10",
      divider: isMac ? "bg-black/10" : isDark ? "bg-black/10" : "bg-white/10",

      // buttons
      btn: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] transition"
        : isDark
        ? "bg-white/35 border border-black/15 text-black/80 hover:bg-white/45 transition"
        : "bg-white/10 border border-white/10 hover:bg-white/15 text-white/90",

      btnPrimary: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] transition"
        : isDark
        ? "bg-white/45 border border-black/15 text-black/90 hover:bg-white/55 transition"
        : "bg-white/15 border border-white/10 hover:bg-white/20 text-white",

      // inputs
      inputFocus: isMac
        ? "focus:ring-4 focus:ring-[hsl(var(--accent)/0.25)] focus:border-[hsl(var(--accent)/0.35)]"
        : isDark
        ? "focus:ring-4 focus:ring-black/10 focus:border-black/20"
        : "focus:ring-4 focus:ring-white/20",

      // tabs
      tab: isMac
        ? "text-black/60 hover:text-[hsl(var(--accent))]"
        : isDark
        ? "text-black/60 hover:text-black"
        : "text-white/80 hover:text-white/95",

      tabActive: isMac ? "text-[hsl(var(--accent))]" : isDark ? "text-black" : "text-white",

      // expose flags so components can be smart without extra props
      isMac,
      glassDarkText,
    };
  }, [isMac, isDark]);
}