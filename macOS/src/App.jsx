// src/App.jsx
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";

import useWindowManager from "./components/windows/useWindowManager";

// ✅ Notifications UI (lazy)
const NotificationCenter = lazy(() => import("./components/notifications/NotificationCenter"));
const ToastStack = lazy(() => import("./components/notifications/ToastStack"));

// ✅ new config + hooks
import { WINDOW_DEFS } from "./config/windowDefs";
import useAccentVar from "./hooks/useAccentVar";
import Welcome, { shouldShowWelcome } from "./components/shell/Welcome";
import Tour from "./components/shell/Tour";
import Confetti from "./components/shell/Confetti";
import AirDrop from "./components/shell/AirDrop";
import PhoneHome from "./components/phone/PhoneHome";
import PhoneLock from "./components/phone/PhoneLock";
import AppSwitcher from "./components/shell/AppSwitcher";
import QuickLook from "./components/shell/QuickLook";
import { Snow, useSeason } from "./components/shell/Seasonal";
import { useA11y } from "./config/a11yStore";
import { FIKA } from "./config/humor";
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
import { getApps, getIcons, iconForWindow, RESUME_URL } from "./config/apps";
import { DOCK_STACKS } from "./config/dockStacks";
import { requestFunCategory } from "./components/windows/Fun/funBus";
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

// read once per page load (before this visit overwrites it)
const LAST_VISIT = (() => {
  try {
    return Number(localStorage.getItem("portfolio.lastVisit")) || null;
  } catch {
    return null;
  }
})();

export default function App() {
  const [accent, setAccent] = useState("sky");
  useAccentVar(accent);

  const [theme, setTheme] = useState("light");
  const [wallpaperUrl, setWallpaperUrl] = useState(null);

  const [uiTheme, setUiTheme] = useState("macos");
  const [iconTheme, setIconTheme] = useState("glass");

  const [fontScale, setFontScale] = useState(1);
  const a11y = useA11y();
  const season = useSeason();

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

  // daily fika reminder at 15:00 Stockholm time ☕
  useEffect(() => {
    if (!loaded) return undefined;
    const check = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Stockholm" }));
      if (now.getHours() === 15 && now.getMinutes() < 30) notif.notifyOnce?.(`fika_${now.toDateString()}`, { title: "Tip", message: FIKA, toast: true });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // first visit: a short welcome guide (work first, then the extras); reopen it from Help
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  // returning visitors: "Welcome back! You were last here 3 days ago 👋"
  useEffect(() => {
    if (!loaded) return;
    const last = LAST_VISIT;
    try {
      localStorage.setItem("portfolio.lastVisit", String(Date.now()));
    } catch {
      return;
    }
    const gap = last ? Date.now() - last : 0;
    if (!last || gap < 30 * 60 * 1000) return; // first visit, or just a refresh
    const days = Math.floor(gap / 86_400_000);
    const when = days === 0 ? "earlier today" : days === 1 ? "yesterday" : days < 14 ? `${days} days ago` : days < 60 ? `${Math.floor(days / 7)} weeks ago` : "a while ago";
    const id = window.setTimeout(() => notif.notify?.({ title: "Welcome back", message: `You were last here ${when} 👋`, toast: true }), 1800);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => {
    if (!loaded || !shouldShowWelcome()) return;
    const t = window.setTimeout(() => setWelcomeOpen(true), 900);
    return () => window.clearTimeout(t);
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
      showWelcome: () => setWelcomeOpen(true),
      openSpotlight: () => setSpotlightOpen(true),
      closeActive: () => activeWindow && closeWindow(activeWindow),
      minimizeActive: () => activeWindow && minimizeWindow(activeWindow),
      zoomActive: () => activeWindow && toggleMaximize(activeWindow),
      focusOrRestore: (id) => restoreWindow(id),
      notify: notif.notify,
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

  // Messages badge: "Marta sent you a message" until Messages is opened once
  const [messagesUnread, setMessagesUnread] = useState(() => {
    try {
      return localStorage.getItem("portfolio.messages.read") !== "1";
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (!messagesUnread || !openWindows.includes("messages")) return;
    setMessagesUnread(false);
    try {
      localStorage.setItem("portfolio.messages.read", "1");
    } catch {
      /* ignore */
    }
  }, [openWindows, messagesUnread]);
  const badges = useMemo(() => (messagesUnread ? { messages: 1 } : {}), [messagesUnread]);

  // Finder Quick Look: Space previews the selected desktop icon
  const [quickLook, setQuickLook] = useState(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== " " || quickLook || !selectedIcon || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      const item = desktopItems.find((d) => d.id === selectedIcon);
      if (!item) return;
      e.preventDefault();
      setQuickLook(item);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickLook, selectedIcon, desktopItems]);

  // ⌥Tab app switcher: open windows, most recent first
  const switcherWindows = useMemo(
    () =>
      [...openWindows]
        .sort((a, b) => (zMap[b] ?? 0) - (zMap[a] ?? 0))
        .map((id) => ({ id, title: WINDOW_DEFS[id]?.title?.split(" — ")[0] ?? id, icon: iconForWindow(id, iconTheme) })),
    [openWindows, zMap, iconTheme]
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

  // Dock: About me, the four Stacks, then Extras & Fun (all apps)
  const dockApps = useMemo(() => {
    const icons = getIcons(iconTheme);
    const stacks = DOCK_STACKS.map((st) => ({
      id: `stack-${st.id}`,
      label: st.label,
      icon: icons[st.iconKey],
      stack: {
        label: st.label,
        onSeeAll: () => {
          requestFunCategory(st.category);
          openWindow("fun");
        },
        items: st.items
          .map((it) => {
            const a = apps.find((x) => x.id === it.app);
            return a && { key: a.id, label: a.label, icon: a.icon, windowId: a.windowId, badge: badges[a.id], onOpen: () => openWindow(a.windowId) };
          })
          .filter(Boolean),
      },
    }));
    const inDock = apps.filter((a) => a.inDock);
    return [...inDock.filter((a) => a.id !== "fun"), ...stacks, ...inDock.filter((a) => a.id === "fun")];
  }, [apps, iconTheme, openWindow, badges]);
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

      // live system state for Achievements
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
    <MotionConfig reducedMotion={a11y.motion ? "always" : "user"}>
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
          accent={accent}
          onOpenAchievements={() => openWindow("achievements")}
        />
      </Suspense>

      {mobile ? (
        <PhoneHome
          loaded={loaded}
          apps={apps}
          launch={launch}
          openWindow={openWindow}
          appOpen={dockHidden}
          isDark={theme === "dark"}
          time={String(currentTime).split(", ").pop().split(" ").pop()}
          unread={notif.unreadCount}
          onNotifications={() => notif.setNotifOpen(!notif.notifOpen)}
          onSearch={() => setSpotlightOpen(true)}
          dockStacks={dockApps.filter((a) => a.stack)}
          iconTheme={iconTheme}
          badges={badges}
          unlocked={notif.unlocked}
        />
      ) : (
      <>
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
      </>
      )}

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

      {!mobile && (
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
      )}

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        items={apps}
        isDark={theme === "dark"}
        onPick={launch}
      />

      {!mobile && <AppSwitcher windows={switcherWindows} onPick={restoreWindow} isDark={theme === "dark"} />}
      <QuickLook item={quickLook} onClose={() => setQuickLook(null)} onOpen={(it) => it.onOpen?.()} isDark={theme === "dark"} />
      {mobile && <PhoneLock wallpaperUrl={activeWallpaper} loaded={loaded} />}
      <Confetti />
      <AirDrop isDark={theme === "dark"} onAccept={openResume} />
      {season?.snow && <Snow />}
      <Welcome
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        onOpenWindow={openWindow}
        onOpenResume={openResume}
        onStartTour={mobile ? undefined : () => { setWelcomeOpen(false); setTimeout(() => setTourOpen(true), 350); }}
        isDark={theme === "dark"}
        iconTheme={iconTheme}
      />
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} onOpenWindow={openWindow} isDark={theme === "dark"} />
      <LockScreen open={locked} onUnlock={unlock} wallpaperUrl={activeWallpaper} timeZone={timeZone} />
      <BootOverlay open={booting} onDone={finishBoot} />
    </Shell>
    </MotionConfig>
  );
}
