import { useMemo } from "react";

/**
 * Shared theme tokens for case studies.
 * - uiTheme: "glass" | "macos"
 * - glassContrast: "light" | "dark" (optional; only matters in glass)
 * - appearance: "light" | "dark" (system appearance; macOS theme has real dark colors)
 *
 * When glassContrast === "dark", we assume the wallpaper is bright and text should be dark.
 */
export default function useCaseStudyTheme({ uiTheme = "glass", glassContrast = "light", appearance = "light" } = {}) {
  const isMac = uiTheme === "macos";
  const isGlass = uiTheme === "glass";
  const isGlassDarkText = isGlass && glassContrast === "dark";
  const isDark = isMac ? appearance === "dark" : !isGlassDarkText;

  return useMemo(() => {
    const pick = (macLight, macDark, glassDarkText, glassLight) =>
      isMac ? (isDark ? macDark : macLight) : isGlassDarkText ? glassDarkText : glassLight;

    // Accent tokens
    const accentText = pick("text-[hsl(var(--accent))]", "text-[hsl(var(--accent))]", "text-[hsl(var(--accent))]", "text-sky-300");
    const accentSoftBg = pick("bg-[hsl(var(--accent)/0.10)]", "bg-[hsl(var(--accent)/0.18)]", "bg-[hsl(var(--accent)/0.10)]", "bg-white/10");
    const accentBorder = pick("border-[hsl(var(--accent)/0.35)]", "border-[hsl(var(--accent)/0.4)]", "border-[hsl(var(--accent)/0.35)]", "border-white/15");

    // Text tokens
    const textMain = pick("text-[#1d1d1f]", "text-white/[0.92]", "text-black/90", "text-white/95");
    const textSub = pick("text-black/50", "text-white/50", "text-black/60", "text-white/70");
    const textBody = pick("text-black/[0.72]", "text-white/[0.72]", "text-black/80", "text-white/85");

    // Surfaces
    const pageCard = pick("bg-white", "bg-[#1e1e20]", "bg-white/35 backdrop-blur-xl", "bg-white/10 backdrop-blur-xl");
    const softCard = pick(
      "bg-[#f5f5f7] border border-black/[0.05]",
      "bg-white/[0.05] border border-white/[0.07]",
      "bg-white/25 border border-black/10",
      "bg-white/[0.06] border border-white/10"
    );
    const pillClass = pick(
      "bg-black/[0.045] text-black/70 border border-black/[0.06]",
      "bg-white/[0.08] text-white/80 border border-white/10",
      "bg-white/30 text-black/80 border border-black/10",
      "bg-white/10 text-white/90 border border-white/15"
    );
    const buttonClass = pick(
      "bg-white text-black/80 border border-black/[0.12] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[#f5f5f7] active:bg-[#ebebed] focus:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--accent)/0.25)]",
      "bg-white/10 text-white/90 border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:bg-white/[0.15] active:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--accent)/0.35)]",
      "bg-white/35 hover:bg-white/45 text-black/80 border border-black/10",
      "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
    );
    const primaryButtonClass = isMac || isGlassDarkText
      ? "bg-[hsl(var(--accent))] text-white border border-[hsl(var(--accent))] shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--accent)/0.3)]"
      : "bg-white text-black/85 border border-white hover:bg-white/90";
    const divider = pick("border-black/10", "border-white/10", "border-black/10", "border-white/10");

    // Window chrome (layout)
    const windowBg = pick("bg-white", "bg-[#1e1e20]", "bg-white/20", "bg-black/10");
    const sidebarBg = pick("bg-[#f3f3f5]", "bg-[#262628]", "bg-white/20", "bg-white/[0.06]");
    const toolbarBg = pick("bg-white/90", "bg-[#1e1e20]/90", "bg-white/40", "bg-black/20");
    const hoverBg = pick("hover:bg-black/[0.05]", "hover:bg-white/[0.07]", "hover:bg-black/5", "hover:bg-white/10");

    return {
      uiTheme,
      isMac,
      isGlass,
      isGlassDarkText,
      isDark,

      accentText,
      accentSoftBg,
      accentBorder,

      textMain,
      textSub,
      textBody,

      pageCard,
      softCard,
      pillClass,
      buttonClass,
      primaryButtonClass,
      divider,

      windowBg,
      sidebarBg,
      toolbarBg,
      hoverBg,
    };
  }, [uiTheme, isMac, isGlass, isGlassDarkText, isDark]);
}
