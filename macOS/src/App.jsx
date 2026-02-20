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
import bgDark from "./imgs/wallpapers/glass/glass1-dark.png";

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

export default function App() {
  // Accent
  const [accent, setAccent] = useState("emerald");
  useAccentVar(accent);

  // wallpaper theme (background)
  const [theme, setTheme] = useState("light");
  const [wallpaperUrl, setWallpaperUrl] = useState(null);

  // UI theme (window/icon style)
  const [uiTheme, setUiTheme] = useState("glass");

  // Font scale
  const [fontScale, setFontScale] = useState(1);

  // Page load animation trigger
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(t);
  }, []);

  // active wallpaper
  const activeWallpaper = wallpaperUrl ?? (theme === "light" ? bgLight : bgDark);

  // ✅ adaptive glass contrast
  const { glassContrast, baseTextClass } = useGlassContrast({ uiTheme, activeWallpaper });

  // ✅ clock
  const currentTime = useClock({ timeZone: "Europe/Stockholm", intervalMs: 30_000 });

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

  // Dock icons by UI theme
  const icons = useMemo(() => {
    if (uiTheme === "macos") {
      return {
        about: aboutIconMac || aboutIconGlass,
        ai: aiIconMac || aiIconGlass,
        fun: funIconMac || funIconGlass,
      };
    }
    return { about: aboutIconGlass, ai: aiIconGlass, fun: funIconGlass };
  }, [uiTheme]);

  // Desktop (left rail) icons by UI theme
  const desktopIcons = useMemo(() => {
    if (uiTheme === "macos") {
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
  }, [uiTheme]);

  // Resume icon by UI theme
  const docIcon = uiTheme === "macos" ? docIconMac : docIconGlass;

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

  // ✅ One prop-bundle for all windows (same features, less prop churn)
  const appApi = useMemo(
    () => ({
      uiTheme,
      glassContrast,
      setUiTheme,
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
        setTheme={setTheme}
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