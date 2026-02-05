import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import moonIcon from "./imgs/moon.png";
import gearIcon from "./imgs/gear.png";
import notificationIcon from "./imgs/notification.png";

// glass icon set (your current ones)
import aboutIconGlass from "./imgs/me.png";
import aiIconGlass from "./imgs/bot.png";
import funIconGlass from "./imgs/games.png";

import projectsIconGlass from "./imgs/folders.png";
import videosIconGlass from "./imgs/videos.png";
import timerIconGlass from "./imgs/timer.png";
import docIconGlass from "./imgs/doc.png";

// macos icon set
import aboutIconMac from "./imgs/aboutMac.png";
import aiIconMac from "./imgs/aiMac.png";
import funIconMac from "./imgs/gamesMac.png";

import projectsIconMac from "./imgs/foldersMac.png";
import videosIconMac from "./imgs/videosMac.png";
import timerIconMac from "./imgs/timerMac.png";
import docIconMac from "./imgs/docMac.png";

import bgLight from "./imgs/Background.jpg";
import bgDark from "./imgs/Background-dark.png";

import MacWindow from "./components/windows/MacWindow";
import useWindowManager from "./components/windows/useWindowManager";

import SettingsWindow from "./components/windows/SettingsWindow";
import AboutWindow from "./components/windows/AboutWindow";

export default function App() {
  const [mouseX, setMouseX] = useState(null);

  // wallpaper theme (background)
  const [theme, setTheme] = useState("light");

  // UI theme (window/icon style)
  const [uiTheme, setUiTheme] = useState("glass"); // "glass" | "macos"

  // Page load animation trigger
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(t);
  }, []);

  const {
    openWindows,
    activeWindow,
    zMap,
    openWindow,
    closeWindow,
    focusWindow,
  } = useWindowManager();

  const currentTime = new Date().toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Stockholm",
  });

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

  // ✅ Resume icon by UI theme (THIS fixes your crash)
  const docIcon = uiTheme === "macos" ? docIconMac : docIconGlass;

  // Window definitions
  const WINDOW_DEFS = useMemo(
    () => ({
      settings: {
        title: "Settings",
        Component: SettingsWindow,
        width: 880,
        height: 560,
        initialPos: { x: 220, y: 90 },
      },
      about: {
        title: "About me",
        Component: AboutWindow,
        width: 760,
        height: 520,
        initialPos: { x: 260, y: 120 },
      },
    }),
    []
  );

  const dockItems = [
    { label: "About me", icon: icons.about, windowId: "about" },
    { label: "AI assistant", icon: icons.ai, windowId: null },
    { label: "Extras & Fun", icon: icons.fun, windowId: null },
  ];

  return (
    <motion.div
      className="min-h-screen bg-cover bg-center font-sans text-white relative"
      style={{
        backgroundImage: `url(${theme === "light" ? bgLight : bgDark})`,
      }}
      initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
      animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Menu Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-10 bg-white/10 backdrop-blur-md flex items-center justify-end px-6 text-sm text-white shadow-sm"
        initial={{ opacity: 0, y: -12 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          {/* Moon = wallpaper toggle */}
          <div
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150 hover:bg-white/20 hover:scale-105 cursor-pointer"
          >
            <img src={moonIcon} alt="Toggle wallpaper" className="w-4 h-4" />
          </div>

          {/* Gear = Settings window */}
          <div
            onClick={() => openWindow("settings")}
            className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150 hover:bg-white/20 hover:scale-105 cursor-pointer"
          >
            <img src={gearIcon} alt="Settings" className="w-4 h-4" />
          </div>

          {/* Notifications */}
          <div className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150 hover:bg-white/20 hover:scale-105 hover:-translate-y-[1px] hover:drop-shadow-sm">
            <img
              src={notificationIcon}
              alt="Notifications"
              className="w-4 h-4"
            />
          </div>

          <span>{currentTime}</span>
        </div>
      </motion.div>

      {/* Left rail icons */}
      <motion.div
        className="fixed top-12 left-4 z-40 flex flex-col gap-6 text-white text-xs font-medium"
        initial={{ opacity: 0, x: -18 }}
        animate={loaded ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {[
          { icon: desktopIcons.timer, label: "30-Seconds Mode" },
          { icon: desktopIcons.projects, label: "Projects" },
          { icon: desktopIcons.videos, label: "Videos" },
        ].map(({ icon, label }, idx) => (
          <motion.div
            key={label}
            className="flex flex-col items-start gap-1 cursor-pointer hover:scale-105 transition-transform duration-150 origin-top-left"
            initial={{ opacity: 0, y: 10 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.32 + idx * 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img src={icon} alt={label} className="w-15 h-15 object-contain" />
            <div className="bg-white/20 px-2 py-[3px] rounded-[6px] backdrop-blur-sm text-white text-[13px] whitespace-nowrap shadow-sm">
              {label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Right-side resume.pdf */}
      <motion.div
        className="fixed top-12 right-4 z-40 flex flex-col items-start gap-1 text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform duration-150 origin-top-right"
        initial={{ opacity: 0, x: 18 }}
        animate={loaded ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={docIcon} alt="Resume" className="w-15 h-15 object-contain" />
        <div className="bg-white/20 px-2 py-[3px] rounded-[6px] backdrop-blur-sm text-white text-[13px] whitespace-nowrap shadow-sm">
          resume.pdf
        </div>
      </motion.div>

      {/* WINDOWS LAYER */}
      <AnimatePresence>
        {openWindows.map((id) => {
          const def = WINDOW_DEFS[id];
          if (!def) return null;
          const WindowComponent = def.Component;

          return (
            <MacWindow
              key={id}
              id={id}
              title={def.title}
              width={def.width}
              height={def.height}
              initialPos={def.initialPos}
              isActive={activeWindow === id}
              zIndex={zMap[id] ?? 999}
              onFocus={focusWindow}
              onClose={closeWindow}
              uiTheme={uiTheme}
            >
              <WindowComponent uiTheme={uiTheme} setUiTheme={setUiTheme} />
            </MacWindow>
          );
        })}
      </AnimatePresence>

      {/* Bottom Dock */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex gap-6 z-50"
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
        initial={{ opacity: 0, y: 14 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {dockItems.map((item, index) => (
          <DockItem
            key={item.label}
            item={item}
            index={index}
            mouseX={mouseX}
            total={dockItems.length}
            loaded={loaded}
            onOpenWindow={openWindow}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function DockItem({ item, index, mouseX, total, loaded, onOpenWindow }) {
  const distanceFactor = 180;

  const getCenter = (i) => {
    const itemWidth = 60;
    const dockLeft = window.innerWidth / 2 - (total * itemWidth) / 2;
    return dockLeft + i * itemWidth + itemWidth / 2;
  };

  const scale = mouseX
    ? Math.min(
        1.35,
        1 + Math.max(0, 1 - Math.abs(mouseX - getCenter(index)) / distanceFactor)
      )
    : 1;

  const handleClick = () => {
    if (item.windowId) onOpenWindow(item.windowId);
  };

  return (
    <motion.div
      className="group relative flex flex-col items-center cursor-pointer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 10 }}
      animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.45 + index * 0.08,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        animate={{ scale, y: scale > 1 ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center"
      >
        <div className="w-15 h-15 flex items-center justify-center rounded-[8px] transition-all duration-150">
          <img src={item.icon} alt={item.label} className="w-15 h-15 object-contain" />
        </div>
      </motion.div>

      {/* Tooltip */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-[15px] px-3 py-[4px] rounded-[6px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap tracking-tight"
        style={{ fontFamily: "Lustria" }}
      >
        {item.label}
      </div>
    </motion.div>
  );
}
