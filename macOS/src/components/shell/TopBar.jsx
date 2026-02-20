// src/components/shell/TopBar.jsx
import React from "react";

export default function TopBar({
  loaded,
  theme,
  setTheme,
  onToggleTheme,
  onOpenSettings,
  notifOpen,
  setNotifOpen,
  unreadCount,
  currentTime,
  moonIcon,
  gearIcon,
  notificationIcon,
}) {
  function fallbackToggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme?.(next);
  }

  const handleToggleTheme = () => {
    if (onToggleTheme) onToggleTheme();
    else fallbackToggle();
  };

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-[9999]",
        "h-10 px-4 flex items-center",
        "backdrop-blur-xl border-b",
        theme === "dark"
          ? "bg-black/25 border-white/10"
          : "bg-white/20 border-black/10",
        loaded ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300",
      ].join(" ")}
    >
      {/* LEFT SIDE (empty space) */}
      <div className="flex-1" />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* Moon */}
        <button
          onClick={handleToggleTheme}
          className={[
            "h-8 w-8 rounded-xl flex items-center justify-center transition",
            theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5",
          ].join(" ")}
          aria-label="Toggle dark mode"
        >
          <img src={moonIcon} alt="" className="h-4 w-4 opacity-90" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => setNotifOpen?.(!notifOpen)}
          className={[
            "relative h-8 w-8 rounded-xl flex items-center justify-center transition",
            theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5",
          ].join(" ")}
          aria-label="Notifications"
        >
          <img src={notificationIcon} alt="" className="h-4 w-4 opacity-90" />

          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] flex items-center justify-center bg-red-500 text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={[
            "h-8 w-8 rounded-xl flex items-center justify-center transition",
            theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5",
          ].join(" ")}
          aria-label="Open settings"
        >
          <img src={gearIcon} alt="" className="h-4 w-4 opacity-90" />
        </button>

        {/* Clock (LAST — right next to gear) */}
        <div className="text-white/90 text-sm tabular-nums select-none">
          {currentTime}
        </div>
      </div>
    </div>
  );
}