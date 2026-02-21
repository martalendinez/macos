// src/components/windows/Settings/useSettingsStyles.js

export default function useSettingsStyles(isMac, isDark = false) {
  // We keep the same shape your Settings UI expects:
  // { mainBg, textSub, btnBase, btnSelected, btnUnselected, navItemBase, navItemActive, navItemInactive }

  // ---------- MACOS LIGHT ----------
  const macLight = {
    mainBg: "bg-white",
    sidebarBg: "bg-[#f3f3f3]",
    textMain: "text-black/85",
    textSub: "text-black/50",
    cardBg: "bg-white",
    cardBorder: "border-black/10",
    btnBase: "px-3 py-2 rounded-xl text-sm border transition active:scale-[0.99]",
    // ✅ selected uses accent
    btnSelected: "bg-[hsl(var(--accent)/0.14)] border-[hsl(var(--accent)/0.40)] text-black/85",
    // ✅ unselected gets accent hover
    btnUnselected:
      "bg-white border-black/10 text-black/60 hover:bg-[hsl(var(--accent)/0.10)] hover:border-[hsl(var(--accent)/0.35)] hover:text-black/80 transition",
    navItemBase: "w-full text-left px-4 py-2.5 rounded-xl transition border text-sm",
    // (kept as-is)
    navItemActive: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
    navItemInactive: "bg-transparent border-transparent text-black/70 hover:bg-black/5",
  };

  // ---------- MACOS DARK ----------
  const macDark = {
    mainBg: "bg-[#1c1c1e]",
    sidebarBg: "bg-[#111113]",
    textMain: "text-white/90",
    textSub: "text-white/55",
    cardBg: "bg-white/5",
    cardBorder: "border-white/10",
    btnBase: "px-3 py-2 rounded-xl text-sm border transition active:scale-[0.99]",
    // ✅ selected uses accent
    btnSelected: "bg-[hsl(var(--accent)/0.18)] border-[hsl(var(--accent)/0.45)] text-white/90",
    // ✅ unselected gets accent hover
    btnUnselected:
      "bg-white/5 border-white/10 text-white/65 hover:bg-[hsl(var(--accent)/0.16)] hover:border-[hsl(var(--accent)/0.40)] hover:text-white/90 transition",
    navItemBase: "w-full text-left px-4 py-2.5 rounded-xl transition border text-sm",
    navItemActive: "bg-white/10 border-white/15 text-white/90",
    navItemInactive: "bg-transparent border-transparent text-white/60 hover:bg-white/5",
  };

  // ---------- GLASS (you can keep it simple; Settings is mostly mac-style anyway) ----------
  const glassLight = {
    mainBg: "bg-white/10 backdrop-blur-xl",
    sidebarBg: "bg-white/10 backdrop-blur-xl",
    textMain: "text-white/90",
    textSub: "text-white/60",
    cardBg: "bg-white/10",
    cardBorder: "border-white/15",
    btnBase:
      "px-3 py-2 rounded-xl text-sm border border-white/15 bg-white/10 transition active:scale-[0.99]",
    // ✅ selected uses accent (instead of just ring)
    btnSelected: "bg-[hsl(var(--accent)/0.22)] border-[hsl(var(--accent)/0.45)] text-white/95",
    // ✅ unselected accent hover
    btnUnselected:
      "hover:bg-[hsl(var(--accent)/0.18)] hover:border-[hsl(var(--accent)/0.35)] transition",
    navItemBase:
      "w-full text-left px-4 py-2.5 rounded-xl transition border border-transparent text-sm",
    navItemActive: "bg-white/20 text-white",
    navItemInactive: "text-white/70 hover:bg-white/10",
  };

  const glassDark = {
    ...glassLight,
    mainBg: "bg-black/20 backdrop-blur-xl",
    sidebarBg: "bg-black/20 backdrop-blur-xl",
  };

  const s = isMac ? (isDark ? macDark : macLight) : isDark ? glassDark : glassLight;

  return {
    // existing keys used in SettingsWindow + child components
    mainBg: s.mainBg,
    textMain: s.textMain,
    textSub: s.textSub,

    // buttons
    btnBase: s.btnBase,
    btnSelected: s.btnSelected,
    btnUnselected: s.btnUnselected,

    // for SidebarNav (if it uses these)
    sidebarBg: s.sidebarBg,
    navItemBase: s.navItemBase,
    navItemActive: s.navItemActive,
    navItemInactive: s.navItemInactive,

    // optional helpers (nice if your cards use them)
    cardBg: s.cardBg,
    cardBorder: s.cardBorder,
  };
}