// src/components/notifications/NotificationCenter.jsx
// macOS-style Notification Center: frosted panel, notifications grouped by app into stacks,
// relative times, hover-to-dismiss, and an achievements progress card at the bottom.
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ACHIEVEMENTS } from "../../config/achievements";
import { MENU_BAR_H } from "../../config/shell";
import { ACH_RE, AppIcon, appOf } from "./notifApps";

function ago(ts, now) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

function Card({ n, app, now, c, onRemove, onClick, children }) {
  const title = n.title.replace(ACH_RE, "");
  return (
    <div className={`group relative rounded-[16px] ${c.card}`} style={c.cardShadow} onClick={onClick}>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`absolute -left-[7px] -top-[7px] z-10 w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${c.close}`}
          style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15)" }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
      <div className="px-[13px] py-[11px] flex items-start gap-3">
        <AppIcon app={app} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className={`text-[11px] font-semibold uppercase tracking-[0.04em] ${c.sub}`}>{app.name}</div>
            <div className={`text-[11px] shrink-0 ${c.sub}`}>
              {!n.read && <span className="inline-block w-[7px] h-[7px] mr-1.5 rounded-full align-middle bg-[#0a84ff]" />}
              {ago(n.createdAt, now)}
            </div>
          </div>
          <div className="mt-[1px] text-[13px] font-semibold leading-snug">
            {app.key === "achievements" && <span className="mr-1">🏆</span>}
            {title}
          </div>
          {n.message && <div className={`mt-[1px] text-[13px] leading-snug ${c.body}`}>{n.message}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

function Group({ group, now, c, onRemoveOne }) {
  const [open, setOpen] = useState(false);
  const { app, items } = group;
  const stacked = items.length > 1 && !open;

  return (
    <div>
      {items.length > 1 && (
        <div className="flex items-center justify-between px-1 mb-1.5 h-6">
          <span className={`text-[13px] font-semibold ${c.title}`}>{app.name}</span>
          <AnimatePresence>
            {open && (
              <motion.div className="flex gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setOpen(false)} className={`px-2.5 h-6 rounded-full text-[11px] font-medium ${c.pill}`}>
                  Show less
                </button>
                <button onClick={() => items.forEach((n) => onRemoveOne?.(n.id))} className={`w-6 h-6 rounded-full text-[10px] ${c.pill}`} aria-label={`Clear ${app.name}`}>
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {stacked ? (
        <button onClick={() => setOpen(true)} className="relative block w-full text-left pb-[14px]" aria-label={`Show ${items.length} ${app.name} notifications`}>
          {/* layers peeking out underneath, like macOS stacks */}
          {items.length > 2 && <div className={`absolute left-[16px] right-[16px] bottom-0 h-8 rounded-[14px] ${c.layer2}`} />}
          <div className={`absolute left-[8px] right-[8px] bottom-[7px] h-8 rounded-[15px] ${c.layer1}`} />
          <div className="relative">
            <Card n={items[0]} app={app} now={now} c={c}>
              <div className={`mt-1 text-[11px] ${c.sub}`}>{items.length - 1} more notification{items.length > 2 ? "s" : ""}</div>
            </Card>
          </div>
        </button>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: -10 * i, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <Card n={n} app={app} now={now} c={c} onRemove={() => onRemoveOne?.(n.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function AchievementsCard({ unlocked, c, onOpen }) {
  const total = ACHIEVEMENTS.length;
  const got = ACHIEVEMENTS.filter((a) => unlocked?.[a.key]).length;
  const next = ACHIEVEMENTS.find((a) => !unlocked?.[a.key] && !a.secret);
  const pct = total ? got / total : 0;
  const R = 17, C = 2 * Math.PI * R;
  return (
    <div className={`rounded-[16px] p-3 flex items-center gap-3 ${c.card}`} style={c.cardShadow}>
      <svg viewBox="0 0 44 44" className="w-11 h-11 shrink-0 -rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={R} fill="none" strokeWidth="5" className={c.ringTrack} />
        <motion.circle cx="22" cy="22" r={R} fill="none" strokeWidth="5" strokeLinecap="round" stroke="url(#nc-ring)" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct) }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
        <defs>
          <linearGradient id="nc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd60a" />
            <stop offset="1" stopColor="#ff375f" />
          </linearGradient>
        </defs>
      </svg>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">
          {got} of {total} achievements
        </div>
        <div className={`text-[12px] leading-snug truncate ${c.body}`}>{next ? <>Next: {next.hint}</> : "You found them all 🎉"}</div>
      </div>
      {onOpen && (
        <button onClick={onOpen} className={`shrink-0 px-3 h-7 rounded-full text-[12px] font-semibold ${c.pill}`}>
          Open
        </button>
      )}
    </div>
  );
}

export default function NotificationCenter({ uiTheme = "glass", theme = "light", isOpen, onClose, items = [], onClearAll, onMarkAllRead, onRemoveOne, unlocked, onOpenAchievements }) {
  const isDark = theme === "dark";
  const [now, setNow] = useState(() => Date.now());

  // live relative times while open; mark everything read shortly after the panel is seen
  useEffect(() => {
    if (!isOpen) return;
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 20000);
    const read = setTimeout(() => onMarkAllRead?.(), 1500);
    return () => {
      clearInterval(tick);
      clearTimeout(read);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const c = useMemo(
    () =>
      isDark
        ? {
            panel: { background: "rgba(30,30,32,0.82)", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.8), inset 0 0 0 0.5px rgba(255,255,255,0.12), 0 24px 60px rgba(0,0,0,0.5)" },
            text: "text-white",
            title: "text-white/90",
            sub: "text-white/50",
            body: "text-white/75",
            card: "bg-white/[0.08] text-white",
            cardShadow: { boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.1)" },
            layer1: "bg-white/[0.06]",
            layer2: "bg-white/[0.035]",
            close: "bg-[#3a3a3c] text-white/80",
            pill: "bg-white/10 hover:bg-white/15 text-white/85",
            ringTrack: "stroke-white/10",
          }
        : {
            panel: { background: "rgba(242,242,247,0.86)", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 24px 60px rgba(0,0,0,0.22)" },
            text: "text-black",
            title: "text-black/80",
            sub: "text-black/45",
            body: "text-black/70",
            card: "bg-white/80 text-black",
            cardShadow: { boxShadow: "0 0 0 0.5px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.06)" },
            layer1: "bg-white/60 shadow-sm",
            layer2: "bg-white/40",
            close: "bg-white text-black/60",
            pill: "bg-black/[0.06] hover:bg-black/10 text-black/75",
            ringTrack: "stroke-black/[0.08]",
          },
    [isDark]
  );

  // group by app, newest first; groups ordered by their newest notification
  const groups = useMemo(() => {
    const m = new Map();
    items.forEach((n) => {
      const app = appOf(n);
      if (!m.has(app.key)) m.set(app.key, { app, items: [] });
      m.get(app.key).items.push(n);
    });
    return [...m.values()];
  }, [items]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[9050]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          <motion.aside
            className={`fixed right-2 z-[9100] w-[372px] max-w-[calc(100vw-16px)] rounded-[22px] overflow-hidden backdrop-blur-3xl backdrop-saturate-[1.8] flex flex-col ${c.text}`}
            style={{ ...c.panel, top: MENU_BAR_H + 6, maxHeight: `calc(100dvh - ${MENU_BAR_H + 18}px)` }}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Notification Center"
          >
            <div className="px-4 pt-4 pb-2 flex items-end justify-between">
              <div>
                <div className="text-[20px] font-bold tracking-[-0.02em]">Notifications</div>
                <div className={`text-[12px] ${c.sub}`}>{items.length ? (unread ? `${unread} new` : `${items.length} earlier`) : "Today"}</div>
              </div>
              {!!items.length && (
                <button onClick={onClearAll} className={`px-3 h-7 rounded-full text-[12px] font-medium ${c.pill}`}>
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 pt-1 space-y-3">
              {!items.length ? (
                <motion.div className="py-8 flex flex-col items-center text-center" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[26px] ${c.card}`} style={c.cardShadow}>
                    🔔
                  </div>
                  <div className="mt-3 text-[15px] font-semibold">You’re all caught up</div>
                  <div className={`mt-1 max-w-[250px] text-[12.5px] leading-snug ${c.body}`}>Explore apps, play games and open case studies. Unlocked achievements show up here.</div>
                </motion.div>
              ) : (
                groups.map((g) => <Group key={g.app.key} group={g} now={now} c={c} onRemoveOne={onRemoveOne} />)
              )}

              <AchievementsCard
                unlocked={unlocked}
                c={c}
                onOpen={
                  onOpenAchievements &&
                  (() => {
                    onOpenAchievements();
                    onClose?.();
                  })
                }
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
