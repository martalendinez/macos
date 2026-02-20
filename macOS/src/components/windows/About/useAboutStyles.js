// src/components/windows/About/useAboutStyles.js
import { useMemo } from "react";

export default function useAboutStyles(uiTheme = "glass") {
  const isMac = uiTheme === "macos";

  const styles = useMemo(() => {
    return {
      // accent
      accentText: isMac ? "text-[hsl(var(--accent))]" : "text-white",
      accentUnderline: isMac ? "bg-[hsl(var(--accent))]" : "bg-white/70",

      // text
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",
      textSub2: isMac ? "text-black/50" : "text-white/60",

      // surfaces
      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBgSoft: isMac ? "bg-white" : "bg-white/5",

      // borders/dividers
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",

      // buttons
      btn: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] transition"
        : "bg-white/10 border border-white/10 hover:bg-white/15 text-white/90",
      btnPrimary: isMac
        ? "bg-white border border-black/10 text-black/80 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] transition"
        : "bg-white/15 border border-white/10 hover:bg-white/20 text-white",

      // inputs focus ring uses accent
      inputFocus: isMac
        ? "focus:ring-4 focus:ring-[hsl(var(--accent)/0.25)] focus:border-[hsl(var(--accent)/0.35)]"
        : "focus:ring-4 focus:ring-white/20",

      // tabs
      tab: isMac ? "text-black/60 hover:text-[hsl(var(--accent))]" : "text-white/80 hover:text-white/95",
      tabActive: isMac ? "text-[hsl(var(--accent))]" : "text-white",

      isMac,
    };
  }, [isMac]);

  return styles;
}