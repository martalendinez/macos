// src/App.jsx
import { useEffect, useMemo, useState } from "react";

import moonIcon from "./imgs/icons/moon.png";
import gearIcon from "./imgs/icons/gear.png";
import notificationIcon from "./imgs/icons/notification.png";

// glass icon set
import aboutIconGlass from "./imgs/icons/glass/me.png";
import aiIconGlass from "./imgs/icons/glass/bot.png";
import funIconGlass from "./imgs/icons/glass/games.png";

import projectsIconGlass from "./imgs/icons/glass/FolderGlass.png";
import videosIconGlass from "./imgs/icons/glass/MediaGlass.png";
import timerIconGlass from "./imgs/icons/glass/ProfileGlass.png";
import docIconGlass from "./imgs/icons/glass/MailGlass.png";

// macos icon set
import aboutIconMac from "./imgs/icons/mac/aboutMac.png";
import aiIconMac from "./imgs/icons/mac/aiMac.png";
import funIconMac from "./imgs/icons/mac/gamesMac.png";

import projectsIconMac from "./imgs/icons/mac/foldersMac.png";
import videosIconMac from "./imgs/icons/mac/videosMac.png";
import timerIconMac from "./imgs/icons/mac/timerMac.png";
import docIconMac from "./imgs/icons/mac/docMac.png";

import bgLight from "./imgs/wallpapers/glass/glass2.jpeg";
import bgDark from "./imgs/wallpapers/glass/glass2dark.jpeg";

import useWindowManager from "./components/windows/useWindowManager";

// ✅ Notifications UI
import NotificationCenter from "./components/notifications/NotificationCenter";
import ToastStack from "./components/notifications/ToastStack";

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

/**
 * If wallpaperUrl is one of your known wallpapers, swap to its matching light/dark pair.
 * If it’s a custom upload (or unknown), keep it unchanged.
 */
const WALLPAPER_PAIRS = [{ light: bgLight, dark: bgDark }];

function swapToThemeWallpaper(current, nextTheme) {
  if (!current) return null; // null => use default activeWallpaper based on theme
  for (const pair of WALLPAPER_PAIRS) {
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
  // Accent
  const [accent, setAccent] = useState("emerald");
  useAccentVar(accent);

  // ✅ default: glass icons + macos windows + glass2 wallpaper (bgLight)
  const [theme, setTheme] = useState("light"); // controls light/dark mode
  const [wallpaperUrl, setWallpaperUrl] = useState(null); // null => use bgLight/bgDark defaults

  // ✅ uiTheme = WINDOW STYLE only (macos windows by default)
  const [uiTheme, setUiTheme] = useState("macos");

  // ✅ iconTheme = ICON PACK only (glass icons by default)
  const [iconTheme, setIconTheme] = useState("glass");

  // Font scale
  const [fontScale, setFontScale] = useState(1);

  // Page load animation trigger
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(t);
  }, []);

  // active wallpaper (respects theme if wallpaperUrl is null)
  const activeWallpaper = wallpaperUrl ?? (theme === "light" ? bgLight : bgDark);

  // ✅ adaptive glass contrast (based on WINDOW STYLE)
  const { glassContrast, baseTextClass } = useGlassContrast({ uiTheme, activeWallpaper });

  // ✅ clock
  const timeZone = "Europe/Stockholm";
  const currentTime = useClock({ timeZone, intervalMs: 30_000 });

  // ✅ window manager
  const {
    openWindows,
    activeWindow,
    zMap,
    maxMap,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMaximize,
  } = useWindowManager();

  // ✅ notifications
  const notif = useNotifications();

  // ✅ achievements
  const ach = useAchievements({
    openWindows,
    maxMap,
    unlockAchievement: notif.unlockAchievement,
    notifyOnce: notif.notifyOnce,
  });

  // -----------------------------
  // First-time tips (only once)
  // -----------------------------
  useEffect(() => {
    const t = window.setTimeout(() => {
      notif.notifyOnce("tip_30sec", {
        title: "Tip",
        message: "Want the quick version? Open ⚡ 30-Seconds Mode on the left.",
        toast: true,
      });
    }, 900);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // 🌙 Theme toggle (moon icon)
  // -----------------------------
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

  // -----------------------------
  // 🌅 Auto dark mode by hour
  // -----------------------------
  useEffect(() => {
    const AUTO_DARK_START_HOUR = 18; // 18:00 -> dark
    const AUTO_LIGHT_START_HOUR = 6; // 06:00 -> light

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

  // ✅ Dock icons by ICON THEME
  const icons = useMemo(() => {
    if (iconTheme === "macos") {
      return {
        about: aboutIconMac || aboutIconGlass,
        ai: aiIconMac || aiIconGlass,
        fun: funIconMac || funIconGlass,
      };
    }
    return { about: aboutIconGlass, ai: aiIconGlass, fun: funIconGlass };
  }, [iconTheme]);

  // ✅ Desktop (left rail) icons by ICON THEME
  const desktopIcons = useMemo(() => {
    if (iconTheme === "macos") {
      return {
        timer: timerIconMac,
        projects: projectsIconMac,
        videos: videosIconMac,
      };
    }
    return {
      timer: timerIconGlass,
      projects: projectsIconGlass,
      videos: videosIconGlass,
    };
  }, [iconTheme]);

  // ✅ Resume icon by ICON THEME
  const docIcon = iconTheme === "macos" ? docIconMac : docIconGlass;

  const dockItems = useMemo(
    () => [
      { label: "About me", icon: icons.about, windowId: "about" },
      { label: "AI assistant", icon: icons.ai, windowId: null },
      { label: "Extras & Fun", icon: icons.fun, windowId: "fun" },
    ],
    [icons]
  );

  const leftRailItems = useMemo(
    () => [
      { icon: desktopIcons.timer, label: "30-Seconds Mode", windowId: "timer" },
      { icon: desktopIcons.projects, label: "Projects", windowId: "projects" },
      { icon: desktopIcons.videos, label: "Videos", windowId: "videos" },
    ],
    [desktopIcons]
  );

  // ✅ One prop-bundle for all windows
  const appApi = useMemo(
    () => ({
      // window style
      uiTheme,
      setUiTheme,
      glassContrast,

      // icon style
      iconTheme,
      setIconTheme,

      // light/dark wallpaper mode
      theme,
      setTheme: setThemeAndSyncWallpaper,

      wallpaperUrl,
      setWallpaperUrl,
      fontScale,
      setFontScale,
      accent,
      setAccent,
      onOpenWindow: openWindow,
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
      loaded={loaded}
    >
      {/* Toasts */}
      <ToastStack uiTheme={uiTheme} toasts={notif.toasts} onDismiss={notif.dismissToast} />

      {/* Notification Center */}
      <NotificationCenter
        uiTheme={uiTheme}
        isOpen={notif.notifOpen}
        onClose={() => notif.setNotifOpen(false)}
        items={notif.notifications}
        onClearAll={notif.clearAllNotifications}
        onMarkAllRead={notif.markAllRead}
        onRemoveOne={notif.removeOneNotification}
      />

      {/* Top Menu Bar */}
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
        moonIcon={moonIcon}
        gearIcon={gearIcon}
        notificationIcon={notificationIcon}
      />

      {/* Left rail */}
      <LeftRail loaded={loaded} items={leftRailItems} onOpenWindow={openWindow} />

      {/* Resume icon */}
      <ResumeIcon loaded={loaded} iconSrc={docIcon} unlockAchievement={notif.unlockAchievement} />

      {/* Windows */}
      <WindowsLayer
        openWindows={openWindows}
        activeWindow={activeWindow}
        zMap={zMap}
        maxMap={maxMap}
        focusWindow={focusWindow}
        closeWindow={closeWindow}
        toggleMaximize={toggleMaximize}
        uiTheme={uiTheme}
        windowDefs={WINDOW_DEFS}
        appApi={appApi}
      />

      {/* Dock */}
      <Dock loaded={loaded} items={dockItems} onOpenWindow={openWindow} />
    </Shell>
  );
}