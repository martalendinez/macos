// src/App.jsx
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";

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
import DesktopIcons from "./components/shell/DesktopIcons";
import Widgets from "./components/shell/Widgets";
import DesktopSurface from "./components/shell/DesktopSurface";
import Spotlight from "./components/shell/Spotlight";
import LockScreen from "./components/shell/LockScreen";
import BootOverlay from "./components/shell/BootOverlay";
import Dock from "./components/shell/Dock";
import WindowsLayer from "./components/shell/WindowsLayer";
import Loader from "./ui/Loader";
import { getApps, iconForWindow, RESUME_URL } from "./config/apps";
import useIsMobile from "./hooks/useIsMobile";

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
  const [accent, setAccent] = useState("sky");
  useAccentVar(accent);

  const [theme, setTheme] = useState("light");
  const [wallpaperUrl, setWallpaperUrl] = useState(null);

  const [uiTheme, setUiTheme] = useState("macos");
  const [iconTheme, setIconTheme] = useState("glass");

  const [fontScale, setFontScale] = useState(1);

  // Boot screen: keep it up briefly so the progress bar can finish, then reveal the desktop
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = document.getElementById("boot-splash");
    if (!el) {
      setLoaded(true);
      return;
    }
    const timers = [];
    const MIN_BOOT_MS = 1200;
    const wait = Math.max(0, MIN_BOOT_MS - performance.now());
    timers.push(
      window.setTimeout(() => {
        el.classList.add("boot-done");
        timers.push(
          window.setTimeout(() => {
            el.classList.add("boot-hide");
            setLoaded(true);
            timers.push(window.setTimeout(() => el.remove(), 500));
          }, 280)
        );
      }, wait)
    );
    return () => timers.forEach(window.clearTimeout);
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
    minMap,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMaximize,
    minimizeWindow,
    restoreWindow,
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
    if (!loaded) return;
    const t = window.setTimeout(() => {
      notif.notifyOnce("tip_30sec", {
        title: "Tip",
        message: "Want the quick version? Open ⚡ Recruiter Mode on your desktop, or press ⌘K to search.",
        toast: true,
      });
    }, 1400);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

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

  // ---------- Desktop shell state ----------
  const apps = useMemo(() => getApps(iconTheme), [iconTheme]);
  const appById = useMemo(() => Object.fromEntries(apps.map((a) => [a.id, a])), [apps]);

  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [booting, setBooting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const openResume = useCallback(() => {
    window.open(RESUME_URL, "_blank", "noopener,noreferrer");
    notif.unlockAchievement?.(
      "prepared_recruiter",
      "Achievement unlocked: Prepared Recruiter",
      "Resume viewed ✅"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notif.unlockAchievement]);

  const launch = useCallback(
    (app) => {
      if (!app) return;
      if (app.href) openResume();
      else if (app.windowId) openWindow(app.windowId);
    },
    [openResume, openWindow]
  );

  // ⌘K / Ctrl+K toggles Spotlight
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlightOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const restart = useCallback(() => {
    setBooting(true);
    resetLayout();
  }, [resetLayout]);
  const finishBoot = useCallback(() => setBooting(false), []);
  const unlock = useCallback(() => setLocked(false), []);

  const activeAppName = useMemo(() => {
    const t = WINDOW_DEFS[activeWindow]?.title;
    return t ? t.split(" — ")[0] : "Finder";
  }, [activeWindow]);

  const windowList = useMemo(
    () =>
      openWindows.map((id) => ({
        id,
        title: WINDOW_DEFS[id]?.title ?? id,
        active: id === activeWindow,
        minimized: !!minMap[id],
        maximized: !!maxMap[id],
      })),
    [openWindows, activeWindow, minMap, maxMap]
  );

  const menuActions = useMemo(
    () => ({
      openWindow,
      openResume,
      resetLayout,
      restart,
      lockScreen: () => setLocked(true),
      openSpotlight: () => setSpotlightOpen(true),
      closeActive: () => activeWindow && closeWindow(activeWindow),
      minimizeActive: () => activeWindow && minimizeWindow(activeWindow),
      zoomActive: () => activeWindow && toggleMaximize(activeWindow),
      focusOrRestore: (id) => restoreWindow(id),
      showShortcuts: () =>
        notif.notify?.({
          title: "Keyboard shortcuts",
          message: "⌘K / Ctrl+K: Spotlight · Esc: close menus · Double-click a title bar: zoom · Right-click the desktop: more options",
          toast: true,
        }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openWindow, openResume, resetLayout, restart, activeWindow, closeWindow, minimizeWindow, toggleMaximize, restoreWindow, notif.notify]
  );

  const goItems = useMemo(
    () => [
      ...apps.filter((a) => a.kind === "app" && !a.extra).map((a) => ({ label: a.label, onSelect: () => launch(a) })),
      { separator: true },
      { header: "Extras" },
      ...apps.filter((a) => a.extra).map((a) => ({ label: a.label, onSelect: () => launch(a) })),
      { separator: true },
      { label: "Résumé (PDF)", onSelect: openResume },
    ],
    [apps, launch, openResume]
  );

  const desktopItems = useMemo(
    () =>
      ["recruiter", "projects", "resume"].map((id) => ({
        id,
        label: appById[id].label,
        icon: appById[id].icon,
        onOpen: () => launch(appById[id]),
      })),
    [appById, launch]
  );

  const desktopMenu = useMemo(
    () => [
      { label: "New Folder", disabled: true },
      { separator: true },
      { label: "Get Info", onSelect: () => openWindow("about") },
      { label: "Change Wallpaper…", onSelect: () => openWindow("settings") },
      { label: theme === "dark" ? "Use Light Appearance" : "Use Dark Appearance", onSelect: toggleTheme },
      { separator: true },
      { label: "Open Recruiter Mode", onSelect: () => openWindow("recruiter") },
      { label: "View Résumé", onSelect: openResume },
      { label: "Spotlight Search…", onSelect: () => setSpotlightOpen(true) },
      { separator: true },
      { label: "Clean Up (Close All Windows)", disabled: !openWindows.length, onSelect: resetLayout },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, openWindows.length, openWindow, openResume, resetLayout]
  );

  // phones: apps are full screen, so the Dock tucks away while one is open
  const mobile = useIsMobile();
  const dockHidden = mobile && openWindows.some((id) => !minMap[id]);

  const dockApps = useMemo(() => apps.filter((a) => a.inDock), [apps]);
  const dockMinimized = useMemo(
    () =>
      openWindows
        .filter((id) => minMap[id])
        .map((id) => ({ id, title: WINDOW_DEFS[id]?.title ?? id, icon: iconForWindow(id, iconTheme) })),
    [openWindows, minMap, iconTheme]
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

      // live system state for Activity Monitor & Achievements
      unlockedAchievements: notif.unlocked,
      resetAchievements: notif.resetAchievements,
      openWindows,
      activeWindow,
      closeWindow,
      focusOrRestore: restoreWindow,
    }),
    [
      notif.unlocked,
      notif.resetAchievements,
      openWindows,
      activeWindow,
      closeWindow,
      restoreWindow,
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
    <MotionConfig reducedMotion="user">
    <Shell
      fontScale={fontScale}
      baseTextClass={baseTextClass}
      wallpaperUrl={activeWallpaper}
      previewWallpaperUrl={activeWallpaperPreview}
      loaded={loaded}
    >
      <DesktopSurface
        isDark={theme === "dark"}
        menuItems={desktopMenu}
        onDeselect={() => setSelectedIcon(null)}
      />

      <Suspense fallback={null}>
        <ToastStack
          uiTheme={uiTheme}
          theme={theme}
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
          unlocked={notif.unlocked}
          onOpenAchievements={() => openWindow("achievements")}
        />
      </Suspense>

      <TopBar
        loaded={loaded}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => openWindow("settings")}
        notifOpen={notif.notifOpen}
        setNotifOpen={notif.setNotifOpen}
        unreadCount={notif.unreadCount}
        currentTime={currentTime}
        moonIcon="/icons/ui/moon.png"
        gearIcon="/icons/ui/gear.png"
        notificationIcon="/icons/ui/notification.png"
        activeAppName={activeAppName}
        windowList={windowList}
        goItems={goItems}
        actions={menuActions}
      />

      <DesktopIcons
        loaded={loaded}
        items={desktopItems}
        selectedId={selectedIcon}
        onSelect={setSelectedIcon}
      />

      <Widgets loaded={loaded} theme={theme} onOpenWindow={openWindow} unlocked={notif.unlocked} accent={accent} />

      <WindowsLayer
        openWindows={openWindows}
        activeWindow={activeWindow}
        zMap={zMap}
        maxMap={maxMap}
        minMap={minMap}
        focusWindow={focusWindow}
        closeWindow={closeWindow}
        minimizeWindow={minimizeWindow}
        toggleMaximize={toggleMaximize}
        uiTheme={uiTheme}
        theme={theme}
        windowDefs={WINDOW_DEFS}
        appApi={appApi}
      />

      <Dock
        loaded={loaded}
        theme={theme}
        apps={dockApps}
        minimized={dockMinimized}
        runningIds={openWindows}
        hidden={dockHidden}
        onLaunch={launch}
        onRestore={restoreWindow}
      />

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        items={apps}
        isDark={theme === "dark"}
        onPick={launch}
      />

      <LockScreen open={locked} onUnlock={unlock} wallpaperUrl={activeWallpaper} timeZone={timeZone} />
      <BootOverlay open={booting} onDone={finishBoot} />
    </Shell>
    </MotionConfig>
  );
}
