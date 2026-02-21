// src/components/windows/Settings/SettingsWindow.jsx
import { useMemo, useRef, useState } from "react";

import useSettingsStyles from "./useSettingsStyles";
import { ACCENT_OPTIONS, GLASS_WALLPAPERS, MAC_WALLPAPERS, SECTIONS } from "./constants";
import { downloadResume, clampFontScale, makeUploadHandler } from "./utils";

import SidebarNav from "./components/SidebarNav";
import Section from "./components/Section";
import AccentPicker from "./components/AccentPicker";
import WallpaperSection from "./components/WallpaperSection";
import FontSizeSection from "./components/FontSizeSection";
import QuickActionsSection from "./components/QuickActionsSection";

export default function SettingsWindow({
  uiTheme,
  setUiTheme,
  iconTheme,
  setIconTheme,
  theme = "light",
  setTheme, // ✅ NEW (so quick actions can toggle theme if you want)
  wallpaperUrl,
  setWallpaperUrl,
  fontScale,
  setFontScale,
  accent,
  setAccent,
  onOpenWindow, // ✅ NEW (so quick actions can open windows)
  notify, // ✅ NEW (optional, if you want to toast)
}) {
  const isMac = uiTheme === "macos";
  const isDark = theme === "dark";

  const styles = useSettingsStyles(isMac, isDark);

  const [activeSection, setActiveSection] = useState("theme");

  const themeRef = useRef(null);
  const accentRef = useRef(null);
  const wallpapersRef = useRef(null);
  const fontRef = useRef(null);
  const quickRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      theme: themeRef,
      accent: accentRef,
      wallpapers: wallpapersRef,
      font: fontRef,
      quick: quickRef,
    }),
    []
  );

  const sections = useMemo(
    () => SECTIONS.map((s) => ({ ...s, ref: sectionRefs[s.id] })),
    [sectionRefs]
  );

  function scrollToSection(section) {
    setActiveSection(section.id);
    section.ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // wallpaper logic
  const isSelected = (src) => wallpaperUrl === src;
  const pickWallpaper = (src) => setWallpaperUrl?.(src);
  const clearCustom = () => setWallpaperUrl?.(null);

  // ✅ robust upload handler + hidden input props
  const upload = useMemo(() => makeUploadHandler(setWallpaperUrl), [setWallpaperUrl]);

  // font logic
  const safeFontScale = clampFontScale(fontScale ?? 1);
  const setSafeFontScale = (v) => setFontScale?.(clampFontScale(v));

  // ✅ Opt OUT of global .darkwin overrides
  // We'll keep Settings window readable with its own styling.
  return (
    <div
      className={[
        "no-darkwin h-full flex",
        isDark ? "text-white" : isMac ? "text-black" : "text-white",
      ].join(" ")}
    >
      <SidebarNav
        isMac={isMac}
        styles={styles}
        sections={sections}
        activeSection={activeSection}
        onSelect={scrollToSection}
      />

      <div
        className={[
          "flex-1 p-6 overflow-auto space-y-10",
          // override the main background in dark mode so it looks like macOS Settings dark
          isDark ? "bg-[#1c1c1e]" : styles.mainBg,
        ].join(" ")}
      >
        {/* THEME */}
        <Section
          id="theme"
          title="Theme"
          titleClass={isDark ? "text-white/70" : styles.textSub}
          refObj={themeRef}
        >
          <div className="space-y-3">
            <div className={isDark ? "text-white/60 text-sm" : styles.textSub}>Window style</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${styles.btnBase} ${uiTheme === "glass" ? styles.btnSelected : styles.btnUnselected}`}
                onClick={() => setUiTheme?.("glass")}
              >
                Glass
              </button>
              <button
                type="button"
                className={`${styles.btnBase} ${uiTheme === "macos" ? styles.btnSelected : styles.btnUnselected}`}
                onClick={() => setUiTheme?.("macos")}
              >
                macOS
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className={isDark ? "text-white/60 text-sm" : styles.textSub}>Icon style</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${styles.btnBase} ${iconTheme === "glass" ? styles.btnSelected : styles.btnUnselected}`}
                onClick={() => setIconTheme?.("glass")}
              >
                Glass icons
              </button>
              <button
                type="button"
                className={`${styles.btnBase} ${iconTheme === "macos" ? styles.btnSelected : styles.btnUnselected}`}
                onClick={() => setIconTheme?.("macos")}
              >
                macOS icons
              </button>
            </div>
          </div>
        </Section>

        {/* ACCENT */}
        <Section
          id="accent"
          title="Accent color"
          titleClass={isDark ? "text-white/70" : styles.textSub}
          refObj={accentRef}
        >
          <AccentPicker
            isMac={isMac}
            styles={styles}
            accent={accent ?? "sky"}
            setAccent={setAccent}
            options={ACCENT_OPTIONS}
          />
        </Section>

        {/* WALLPAPERS */}
        <Section
          id="wallpapers"
          title="Wallpapers"
          titleClass={isDark ? "text-white/70" : styles.textSub}
          refObj={wallpapersRef}
        >
          <WallpaperSection
            styles={styles}
            theme={theme}
            // ✅ This assumes WallpaperSection renders an <input type="file" ... onChange={onUpload} />
            // If yours expects a different shape, tell me and I’ll match it.
            onUpload={upload.onChange}
            uploadInputProps={upload.inputProps} // ✅ NEW: let WallpaperSection spread these onto the input
            onReset={clearCustom}
            macWallpapers={MAC_WALLPAPERS}
            glassWallpapers={GLASS_WALLPAPERS}
            isSelected={isSelected}
            onPick={pickWallpaper}
          />
        </Section>

        {/* FONT */}
        <Section
          id="font"
          title="Font size"
          titleClass={isDark ? "text-white/70" : styles.textSub}
          refObj={fontRef}
        >
          <FontSizeSection
            isMac={isMac}
            styles={styles}
            value={safeFontScale}
            onChange={setSafeFontScale}
            btnBase={styles.btnBase}
          />
        </Section>

        {/* QUICK */}
        <Section
          id="quick"
          title="Quick actions"
          titleClass={isDark ? "text-white/70" : styles.textSub}
          refObj={quickRef}
        >
          <QuickActionsSection
            uiTheme={uiTheme}
            theme={theme}
            onDownloadResume={downloadResume}
            onOpenWindow={onOpenWindow}
            onToggleTheme={() => setTheme?.(theme === "dark" ? "light" : "dark")}
            notify={notify}
          />
        </Section>
      </div>
    </div>
  );
}