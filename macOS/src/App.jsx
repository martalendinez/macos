// src/App.jsx
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

import useWindowManager from "./components/windows/useWindowManager";

// ✅ Notifications UI (lazy)
const NotificationCenter = lazy(() => import("./components/notifications/NotificationCenter"));
const ToastStack = lazy(() => import("./components/notifications/ToastStack"));

// ✅ new config + hooks
import { WINDOW_DEFS } from "./config/windowDefs";
import useAccentVar from "./hooks/useAccentVar";
import useClock from "./hooks/useClock";
import useGlassContrast from "./hooks/useGlassContrast";
import useNotifications from "./hooks/useNotifications";
import useAchievements from "./hooks/useAchievements";

// ✅ shell components
import Shell from "./components/shell/Shell";
import TopBar from "./components/shell/TopBar";
import LeftRail from "./components/shell/LeftRail";
import ResumeIcon from "./components/shell/ResumeIcon";
import Dock from "./components/shell/Dock";
import WindowsLayer from "./components/shell/WindowsLayer";
import Loader from "./ui/Loader";

// ✅ import wallpaper pairs from Settings so every wallpaper swaps correctly
import { ALL_WALLPAPER_PAIRS } from "./components/windows/Settings/constants";

// default wallpaper paths
const bgLight = "/wallpapers/glass/glass2.jpeg";
const bgDark = "/wallpapers/glass/glass2dark.jpeg";

const bgLightPreview = "/wallpapers/glass/glass2-preview.webp";
const bgDarkPreview = "/wallpapers/glass/glass2dark-preview.webp";

/**
 * Wallpaper pairing:
 * - Use the pairs defined in Settings
 * - Ensure your default pair (bgLight/bgDark) is included (in case Settings changes)
 */
const WALLPAPER_PAIRS = [{ light: bgLight, dark: bgDark }, ...(ALL_WALLPAPER_PAIRS || [])];

function swapToThemeWallpaper(current, nextTheme) {
  if (!current) return null;

  for (const pair of WALLPAPER_PAIRS) {
    if (!pair?.light || !pair?.dark) continue;
    if (current === pair.light || current === pair.dark) {
      return nextTheme === "dark" ? pair.dark : pair.light;
    }
  }

  return current;
}

function getHourInTimeZone(timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "12";
  return Number(hourStr);
}

export default function App() {
  useEffect(() => {
    const el = document.getElementById("boot-splash");
    if (!el) return;

    el.classList.add("boot-hide");
    const t = window.setTimeout(() => el.remove(), 220);
    return () => window.clearTimeout(t);
  }, []);

  const [accent, setAccent] = useState("sky");
  useAccentVar(accent);

  const [theme, setTheme] = useState("light");
  const [wallpaperUrl, setWallpaperUrl] = useState(null);

  const [uiTheme, setUiTheme] = useState("macos");
  const [iconTheme, setIconTheme] = useState("glass");

  const [fontScale, setFontScale] = useState(1);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  const activeWallpaper = wallpaperUrl ?? (theme === "light" ? bgLight : bgDark);

  const activeWallpaperPreview =
    theme === "light" ? bgLightPreview : bgDarkPreview;

  const { glassContrast, baseTextClass } = useGlassContrast({
    uiTheme,
    activeWallpaper,
  });

  const timeZone = "Europe/Stockholm";
  const currentTime = useClock({ timeZone, intervalMs: 30_000 });

  const {
    openWindows,
    activeWindow,
    zMap,
    maxMap,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMaximize,
    resetLayout,
  } = useWindowManager();

  const notif = useNotifications();

  const ach = useAchievements({
    openWindows,
    maxMap,
    unlockAchievement: notif.unlockAchievement,
    notifyOnce: notif.notifyOnce,
  });

  useEffect(() => {
    const t = window.setTimeout(() => {
      notif.notifyOnce("tip_30sec", {
        title: "Tip",
        message: "Want the quick version? Open ⚡ Recruiter Mode on the left.",
        toast: true,
      });
    }, 900);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setThemeAndSyncWallpaper(nextTheme) {
    setTheme(nextTheme);
    setWallpaperUrl((curr) => swapToThemeWallpaper(curr, nextTheme));
  }

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      setWallpaperUrl((curr) => swapToThemeWallpaper(curr, next));
      return next;
    });
  }

  useEffect(() => {
    const AUTO_DARK_START_HOUR = 18;
    const AUTO_LIGHT_START_HOUR = 6;

    const applyAutoTheme = () => {
      const h = getHourInTimeZone(timeZone);
      const shouldBeDark = h >= AUTO_DARK_START_HOUR || h < AUTO_LIGHT_START_HOUR;
      const next = shouldBeDark ? "dark" : "light";

      setTheme((prev) => {
        if (prev === next) return prev;
        setWallpaperUrl((curr) => swapToThemeWallpaper(curr, next));
        return next;
      });
    };

    applyAutoTheme();
    const id = window.setInterval(applyAutoTheme, 5 * 60 * 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dock icons by ICON THEME
  const icons = useMemo(() => {
    if (iconTheme === "macos") {
      return {
        about: "/icons/mac/aboutMac.png",
        ai: "/icons/mac/aiMac.png",
        fun: "/icons/mac/gamesMac.png",
      };
    }

    return {
      about: "/icons/glass/me-512.png",
      ai: "/icons/glass/bot-512.png",
      fun: "/icons/glass/games-512.png",
    };
  }, [iconTheme]);

  // Desktop icons by ICON THEME
  const desktopIcons = useMemo(() => {
    if (iconTheme === "macos") {
      return {
        timer: "/icons/mac/timerMac.png",
        projects: "/icons/mac/foldersMac.png",
        videos: "/icons/mac/videosMac.png",
      };
    }

    return {
      timer: "/icons/glass/ProfileGlass.png",
      projects: "/icons/glass/FolderGlass.png",
      videos: "/icons/glass/MediaGlass.png",
    };
  }, [iconTheme]);

  const docIcon =
    iconTheme === "macos"
      ? "/icons/mac/docMac.png"
      : "/icons/glass/MailGlass.png";

  // ⭐ UPDATED: AI assistant now opens aiAssistant window
  const dockItems = useMemo(
    () => [
      { label: "About me", icon: icons.about, windowId: "about" },
      { label: "AI assistant", icon: icons.ai, windowId: "aiAssistant" },
      { label: "Extras & Fun", icon: icons.fun, windowId: "fun" },
    ],
    [icons]
  );

  // ⭐ UPDATED: Videos removed
  const leftRailItems = useMemo(
    () => [
      { icon: desktopIcons.timer, label: "Recruiter Mode", windowId: "recruiter" },
      { icon: desktopIcons.projects, label: "Projects", windowId: "projects" },
      // { icon: desktopIcons.videos, label: "Videos", windowId: "videos" },
    ],
    [desktopIcons]
  );

  const appApi = useMemo(
    () => ({
      uiTheme,
      setUiTheme,
      glassContrast,

      iconTheme,
      setIconTheme,

      theme,
      setTheme: setThemeAndSyncWallpaper,

      wallpaperUrl,
      setWallpaperUrl,
      fontScale,
      setFontScale,
      accent,
      setAccent,
      onOpenWindow: openWindow,

      resetLayout,

      notify: notif.notify,
      notifyOnce: notif.notifyOnce,
      unlockAchievement: notif.unlockAchievement,
      trackTerminalCommand: ach.trackTerminalCommand,
      trackGameLaunch: ach.trackGameLaunch,
    }),
    [
      uiTheme,
      glassContrast,
      iconTheme,
      theme,
      wallpaperUrl,
      fontScale,
      accent,
      openWindow,
      resetLayout,
      notif.notify,
      notif.notifyOnce,
      notif.unlockAchievement,
      ach.trackTerminalCommand,
      ach.trackGameLaunch,
    ]
  );

  return (
    <Shell
      fontScale={fontScale}
      baseTextClass={baseTextClass}
      wallpaperUrl={activeWallpaper}
      previewWallpaperUrl={activeWallpaperPreview}
      loaded={loaded}
    >
      <Suspense fallback={null}>
        <ToastStack
          uiTheme={uiTheme}
          toasts={notif.toasts}
          onDismiss={notif.dismissToast}
        />
      </Suspense>

      <Suspense fallback={<Loader size={16} fullHeight={false} glass={false} />}>
        <NotificationCenter
          uiTheme={uiTheme}
          theme={theme}
          isOpen={notif.notifOpen}
          onClose={() => notif.setNotifOpen(false)}
          items={notif.notifications}
          onClearAll={notif.clearAllNotifications}
          onMarkAllRead={notif.markAllRead}
          onRemoveOne={notif.removeOneNotification}
        />
      </Suspense>

      <TopBar
        loaded={loaded}
        theme={theme}
        setTheme={setThemeAndSyncWallpaper}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => openWindow("settings")}
        notifOpen={notif.notifOpen}
        setNotifOpen={notif.setNotifOpen}
        unreadCount={notif.unreadCount}
        currentTime={currentTime}
        moonIcon="/icons/ui/moon.png"
        gearIcon="/icons/ui/gear.png"
        notificationIcon="/icons/ui/notification.png"
      />

      <LeftRail loaded={loaded} items={leftRailItems} onOpenWindow={openWindow} />

      <ResumeIcon
        loaded={loaded}
        iconSrc={docIcon}
        unlockAchievement={notif.unlockAchievement}
      />

      <WindowsLayer
        openWindows={openWindows}
        activeWindow={activeWindow}
        zMap={zMap}
        maxMap={maxMap}
        focusWindow={focusWindow}
        closeWindow={closeWindow}
        toggleMaximize={toggleMaximize}
        uiTheme={uiTheme}
        theme={theme}
        windowDefs={WINDOW_DEFS}
        appApi={appApi}
      />

      <Dock loaded={loaded} items={dockItems} onOpenWindow={openWindow} />
    </Shell>
  );
}
