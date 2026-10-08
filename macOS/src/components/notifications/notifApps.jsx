// src/components/notifications/notifApps.jsx
// Which "app" a notification belongs to, and its icon. Shared by Notification Center and banners.
import AppleLogo from "../../ui/AppleLogo";

export const ACH_RE = /^🏆\s*Achievement unlocked:\s*/i;

export function appOf(n) {
  if (ACH_RE.test(n.title)) return { key: "achievements", name: "Achievements", icon: "/icons/apps/achievements.svg" };
  if (/^tip$/i.test(n.title)) return { key: "tips", name: "Tips" };
  return { key: "portfolio", name: "Portfolio" };
}

export function AppIcon({ app, size = 34 }) {
  if (app.icon) return <img src={app.icon} alt="" className="shrink-0 rounded-[9px] shadow-sm" style={{ width: size, height: size }} />;
  const grad = app.key === "tips" ? "from-[#ffd60a] to-[#ff9f0a]" : "from-[#5ac8fa] to-[#007aff]";
  return (
    <span className={`shrink-0 rounded-[9px] bg-gradient-to-b ${grad} text-white flex items-center justify-center shadow-sm`} style={{ width: size, height: size }}>
      {app.key === "tips" ? <span className="text-[17px]">💡</span> : <AppleLogo className="w-[17px] h-[17px] -mt-[2px]" />}
    </span>
  );
}
