// src/hooks/useNotifications.js
import { useMemo, useState } from "react";
import { readUnlocked } from "../config/achievements";

function makeTimeLabel(d = new Date()) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function useNotifications() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  // unlocked achievements { key: timestamp | true }, kept in sync with localStorage for the Achievements app
  const [unlocked, setUnlocked] = useState(readUnlocked);

  function notify({ title, message = "", toast = true } = {}) {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const item = {
      id,
      title: title || "Notification",
      message,
      createdAt: Date.now(),
      timeLabel: makeTimeLabel(),
      read: false,
    };

    setNotifications((prev) => [item, ...prev]);

    if (toast) {
      setToasts((prev) => [item, ...prev]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    }

    return id;
  }

  function notifyOnce(key, payload) {
    const storageKey = `notif_once:${key}`;
    if (localStorage.getItem(storageKey)) return;
    notify(payload);
    localStorage.setItem(storageKey, "1");
  }

  function unlockAchievement(key, title, message = "") {
    const storageKey = `ach:${key}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      /* storage blocked: still unlock for this session */
    }
    if (unlocked[key]) return;

    notify({
      title: title || "Achievement unlocked",
      message,
      toast: true,
    });

    const at = Date.now();
    try {
      localStorage.setItem(storageKey, String(at));
    } catch {
      /* ignore */
    }
    setUnlocked((u) => ({ ...u, [key]: at }));
  }

  function resetAchievements() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("ach:"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    setUnlocked({});
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function clearAllNotifications() {
    setNotifications([]);
    setToasts([]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function removeOneNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    notifOpen,
    setNotifOpen,
    notifications,
    toasts,
    unreadCount,
    notify,
    notifyOnce,
    unlockAchievement,
    unlocked,
    resetAchievements,
    dismissToast,
    clearAllNotifications,
    markAllRead,
    removeOneNotification,
  };
}