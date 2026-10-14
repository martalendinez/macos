// src/components/shell/StatusMenus.jsx
// Menu bar extras with personality: Wi-Fi, Bluetooth and a coffee-powered battery.
// ✏️ The networks, devices and jokes live in the lists right below.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuSurface } from "./menu/MenuPanel";
import { MENU_BAR_H } from "../../config/shell";

const NETWORKS = [
  { name: "KTH-eduroam", lock: true, bars: 3, joke: "Connecting… connecting… still connecting 🎓" },
  { name: "Abuela’s WiFi 👵", lock: true, bars: 2, joke: "The password is her first dog’s name. Nobody remembers it." },
  { name: "Pretty Fly for a Wi-Fi", lock: true, bars: 3, joke: "Too fly. Connection refused 😎" },
  { name: "FBI Surveillance Van 🚐", lock: true, bars: 1, joke: "No need to connect, they already know you’re here 👀" },
  { name: "Fika_Guest ☕", lock: false, bars: 2, joke: "Free Wi-Fi with every kanelbulle. Sold out." },
];

const DEVICES = [
  { name: "Marta’s AirPods Pro", kind: "airpods", on: true, sub: "L 100% · R missing since 2024 🕵️" },
  { name: "Magic Mouse", kind: "mouse", on: true, sub: "Battery 3%, as always 🪫" },
  { name: "Magic Keyboard", kind: "keyboard", on: true, sub: "Mostly used for ⌘Z" },
  { name: "Abuela’s radio 📻", kind: "radio", on: false, sub: "Only plays coplas. Not connected." },
];

/* ---------- glyphs ---------- */
function WifiGlyph({ on = true, className = "w-[15px] h-[15px]" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M1.6 6.1a9.2 9.2 0 0 1 12.8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity={on ? 1 : 0.35} />
      <path d="M3.9 8.5a5.9 5.9 0 0 1 8.2 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity={on ? 1 : 0.35} />
      <path d="M6.2 10.9a2.6 2.6 0 0 1 3.6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity={on ? 1 : 0.35} />
      <circle cx="8" cy="13.2" r="1.1" fill="currentColor" opacity={on ? 1 : 0.35} />
    </svg>
  );
}
function BluetoothGlyph({ className = "w-[14px] h-[14px]" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M4.5 4.8 11 10.6 8 13.3V2.7l3 2.7-6.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Bars({ n }) {
  return (
    <svg viewBox="0 0 16 16" className="w-[14px] h-[14px]" fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <path key={i} d={["M6.3 11a2.4 2.4 0 0 1 3.4 0", "M4.1 8.7a5.6 5.6 0 0 1 7.8 0", "M1.9 6.4a8.8 8.8 0 0 1 12.2 0"][i]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={i < n ? 1 : 0.25} />
      ))}
      <circle cx="8" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
const DEVICE_ICON = { airpods: "🎧", mouse: "🖱️", keyboard: "⌨️", radio: "📻" };

/* ---------- building blocks ---------- */
function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative w-[30px] h-[18px] rounded-full transition-colors ${on ? "bg-[hsl(var(--accent))]" : "bg-gray-400/50"}`}
    >
      <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-[left] ${on ? "left-[14px]" : "left-[2px]"}`} />
    </button>
  );
}

function Panel({ anchor, width, isDark, children, label }) {
  const left = Math.max(6, Math.min(anchor - width, window.innerWidth - width - 6));
  return (
    <motion.div
      role="dialog"
      aria-label={label}
      className="fixed z-[10050] rounded-[12px] p-[6px] text-[13px] backdrop-blur-2xl backdrop-saturate-[1.8] select-none"
      style={{ ...menuSurface(isDark), top: MENU_BAR_H + 2, left, width }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

function Sep({ isDark }) {
  return <div className={`mx-[10px] my-[5px] h-px ${isDark ? "bg-white/12" : "bg-black/10"}`} />;
}
function Header({ children }) {
  return <div className="px-[10px] pt-1 pb-0.5 text-[11px] font-semibold opacity-50">{children}</div>;
}
function Row({ icon, title, sub, right, onClick, active, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 rounded-[6px] px-[8px] py-[5px] text-left ${isDark ? "hover:bg-white/10" : "hover:bg-black/[0.06]"}`}
    >
      <span
        className={`shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] ${
          active ? "bg-[hsl(var(--accent))] text-white" : isDark ? "bg-white/12" : "bg-black/[0.07]"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{title}</span>
        {sub && <span className="block text-[11.5px] leading-snug opacity-55">{sub}</span>}
      </span>
      {right}
    </button>
  );
}
function Footer({ children, onClick, isDark }) {
  return (
    <button type="button" onClick={onClick} className={`w-full h-[24px] px-[10px] rounded-[5px] text-left ${isDark ? "hover:bg-white/10" : "hover:bg-black/[0.06]"}`}>
      {children}
    </button>
  );
}

/* ---------- the menu bar extras ---------- */
export default function StatusMenus({ isDark, itemClass, openClass, onOpenSettings }) {
  const [open, setOpen] = useState(null); // { key, anchor }
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [netMsg, setNetMsg] = useState(null);
  const [devMsg, setDevMsg] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (e.target.closest?.("[data-status-panel]") || ref.current?.contains(e.target)) return;
      setOpen(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(key, e) {
    const r = e.currentTarget.getBoundingClientRect();
    setNetMsg(null);
    setDevMsg(null);
    setOpen((o) => (o?.key === key ? null : { key, anchor: r.right }));
  }

  const btn = (key, label, children, extra = "") => (
    <button type="button" aria-label={label} title={label} aria-expanded={open?.key === key} onClick={(e) => toggle(key, e)} className={`${itemClass} ${open?.key === key ? openClass : ""} ${extra}`}>
      {children}
    </button>
  );

  return (
    <div ref={ref} className="flex items-center gap-[2px]">
      {/* the battery is just coffee */}
      <span className="hidden md:flex h-[22px] px-[6px] items-center text-[14px] cursor-default [text-shadow:none]" title="Battery: 100% · Fuelled by coffee" aria-label="Battery: 100%, fuelled by coffee">
        ☕
      </span>
      {btn("bluetooth", "Bluetooth", <BluetoothGlyph />, "hidden md:flex")}
      {btn("wifi", "Wi-Fi", <WifiGlyph on={wifi} />, "hidden md:flex")}

      <AnimatePresence>
        {open?.key === "wifi" && (
          <div data-status-panel key="wifi">
            <Panel anchor={open.anchor} width={290} isDark={isDark} label="Wi-Fi">
              <div className="flex items-center justify-between px-[10px] py-1.5">
                <span className="font-semibold">Wi-Fi</span>
                <Toggle on={wifi} onChange={setWifi} label="Wi-Fi" />
              </div>
              {wifi ? (
                <>
                  <Sep isDark={isDark} />
                  <Header>Personal Hotspot</Header>
                  <Row isDark={isDark} active icon={<WifiGlyph className="w-[13px] h-[13px]" />} title="Marta’s iPhone" sub="Connected · 5G · 87% 🔋" right={<Bars n={3} />} />
                  <Header>Other Networks</Header>
                  {NETWORKS.map((n) => (
                    <Row
                      key={n.name}
                      isDark={isDark}
                      icon={<WifiGlyph className="w-[13px] h-[13px]" />}
                      title={n.name}
                      sub={netMsg === n.name ? n.joke : null}
                      onClick={() => setNetMsg(n.name)}
                      right={
                        <span className="flex items-center gap-1 opacity-70">
                          {n.lock && <span className="text-[10px]">🔒</span>}
                          <Bars n={n.bars} />
                        </span>
                      }
                    />
                  ))}
                </>
              ) : (
                <div className="px-[10px] pb-2 pt-1 text-[12px] opacity-60">Wi-Fi is off. Honestly, good for you 🌿</div>
              )}
              <Sep isDark={isDark} />
              <Footer isDark={isDark} onClick={() => { setOpen(null); onOpenSettings?.(); }}>Wi-Fi Settings…</Footer>
            </Panel>
          </div>
        )}

        {open?.key === "bluetooth" && (
          <div data-status-panel key="bt">
            <Panel anchor={open.anchor} width={290} isDark={isDark} label="Bluetooth">
              <div className="flex items-center justify-between px-[10px] py-1.5">
                <span className="font-semibold">Bluetooth</span>
                <Toggle on={bt} onChange={setBt} label="Bluetooth" />
              </div>
              {bt ? (
                <>
                  <Sep isDark={isDark} />
                  <Header>Devices</Header>
                  {DEVICES.map((d) => (
                    <Row
                      key={d.name}
                      isDark={isDark}
                      active={d.on}
                      icon={DEVICE_ICON[d.kind]}
                      title={d.name}
                      sub={devMsg === d.name && !d.on ? "Connection declined. It only takes requests from Abuela." : d.sub}
                      onClick={() => setDevMsg(d.name)}
                    />
                  ))}
                </>
              ) : (
                <div className="px-[10px] pb-2 pt-1 text-[12px] opacity-60">Bluetooth is off. The left AirPod is still missing.</div>
              )}
              <Sep isDark={isDark} />
              <Footer isDark={isDark} onClick={() => { setOpen(null); onOpenSettings?.(); }}>Bluetooth Settings…</Footer>
            </Panel>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
