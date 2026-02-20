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
  // window look (white mac windows vs glass blur)
  uiTheme,
  setUiTheme,

  // icon pack (glass icons vs mac icons)
  iconTheme,
  setIconTheme,

  // light/dark mode (for wallpaper pairing)
  theme = "light",

  // wallpaper selection
  wallpaperUrl,
  setWallpaperUrl,

  // font & accent
  fontScale,
  setFontScale,
  accent,
  setAccent,
}) {
  const isMac = uiTheme === "macos";
  const styles = useSettingsStyles(isMac);

  const [activeSection, setActiveSection] = useState("theme");

  // refs for scroll
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

  const handleUpload = useMemo(() => makeUploadHandler(setWallpaperUrl), [setWallpaperUrl]);

  // font logic
  const safeFontScale = clampFontScale(fontScale ?? 1);
  const setSafeFontScale = (v) => setFontScale?.(clampFontScale(v));

  return (
    <div className={`h-full flex ${isMac ? "text-black" : "text-white"}`}>
      <SidebarNav
        isMac={isMac}
        styles={styles}
        sections={sections}
        activeSection={activeSection}
        onSelect={scrollToSection}
      />

      <div className={`flex-1 p-6 ${styles.mainBg} overflow-auto space-y-10`}>
        {/* THEME */}
        <Section id="theme" title="Theme" titleClass={styles.textSub} refObj={themeRef}>
          {/* Window style */}
          <div className="space-y-3">
            <div className={styles.textSub}>Window style</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${styles.btnBase} ${
                  uiTheme === "glass" ? styles.btnSelected : styles.btnUnselected
                }`}
                onClick={() => setUiTheme?.("glass")}
              >
                Glass
              </button>
              <button
                type="button"
                className={`${styles.btnBase} ${
                  uiTheme === "macos" ? styles.btnSelected : styles.btnUnselected
                }`}
                onClick={() => setUiTheme?.("macos")}
              >
                macOS
              </button>
            </div>
          </div>

          {/* Icon style */}
          <div className="mt-6 space-y-3">
            <div className={styles.textSub}>Icon style</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${styles.btnBase} ${
                  iconTheme === "glass" ? styles.btnSelected : styles.btnUnselected
                }`}
                onClick={() => setIconTheme?.("glass")}
              >
                Glass icons
              </button>
              <button
                type="button"
                className={`${styles.btnBase} ${
                  iconTheme === "macos" ? styles.btnSelected : styles.btnUnselected
                }`}
                onClick={() => setIconTheme?.("macos")}
              >
                macOS icons
              </button>
            </div>
          </div>
        </Section>

        {/* ACCENT */}
        <Section id="accent" title="Accent color" titleClass={styles.textSub} refObj={accentRef}>
          <AccentPicker
            isMac={isMac}
            styles={styles}
            accent={accent ?? "emerald"}
            setAccent={setAccent}
            options={ACCENT_OPTIONS}
          />
        </Section>

        {/* WALLPAPERS */}
        <Section
          id="wallpapers"
          title="Wallpapers"
          titleClass={styles.textSub}
          refObj={wallpapersRef}
        >
          <WallpaperSection
            // NOTE: WallpaperSection now supports styles being undefined,
            // but we still pass styles for consistent look.
            styles={styles}
            theme={theme}
            onUpload={handleUpload}
            onReset={clearCustom}
            macWallpapers={MAC_WALLPAPERS}
            glassWallpapers={GLASS_WALLPAPERS}
            isSelected={isSelected}
            onPick={pickWallpaper}
          />
        </Section>

        {/* FONT */}
        <Section id="font" title="Font size" titleClass={styles.textSub} refObj={fontRef}>
          <FontSizeSection
            isMac={isMac}
            styles={styles}
            value={safeFontScale}
            onChange={setSafeFontScale}
            btnBase={styles.btnBase}
          />
        </Section>

        {/* QUICK */}
        <Section id="quick" title="Quick actions" titleClass={styles.textSub} refObj={quickRef}>
          <QuickActionsSection uiTheme={uiTheme} onDownloadResume={downloadResume} />
        </Section>
      </div>
    </div>
  );
}