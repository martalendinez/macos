// src/components/windows/TrafficLights.jsx
import { useState } from "react";

const COLORS = {
  close: { bg: "#ff5f57", ring: "#e0443e" },
  min: { bg: "#febc2e", ring: "#dea123" },
  zoom: { bg: "#28c840", ring: "#1aab29" },
};

function Glyph({ kind, isMaximized }) {
  const stroke = "rgba(0,0,0,0.55)";
  if (kind === "close") {
    return (
      <svg viewBox="0 0 12 12" className="w-[8px] h-[8px]" aria-hidden="true">
        <path d="M3.2 3.2l5.6 5.6M8.8 3.2L3.2 8.8" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "min") {
    return (
      <svg viewBox="0 0 12 12" className="w-[8px] h-[8px]" aria-hidden="true">
        <path d="M2.6 6h6.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  // zoom: two triangles pointing out (or in when maximized)
  return (
    <svg viewBox="0 0 12 12" className="w-[8px] h-[8px]" aria-hidden="true">
      {isMaximized ? (
        <>
          <path d="M6.6 5.4V1.8L10.2 5.4z" fill={stroke} />
          <path d="M5.4 6.6v3.6L1.8 6.6z" fill={stroke} />
        </>
      ) : (
        <>
          <path d="M3 2.6h5.2L3 7.8z" fill={stroke} />
          <path d="M9 9.4H3.8L9 4.2z" fill={stroke} />
        </>
      )}
    </svg>
  );
}

export default function TrafficLights({
  isActive,
  isDark,
  isMaximized,
  onClose,
  onMinimize,
  onZoom,
  canZoom = true,
}) {
  const [hover, setHover] = useState(false);
  const lit = isActive || hover;

  const inactiveBg = isDark ? "#4d4d50" : "#d1d1d1";
  const inactiveRing = isDark ? "#3e3e41" : "#bdbdbd";

  const buttons = [
    { kind: "close", label: "Close", onClick: onClose },
    { kind: "min", label: "Minimize", onClick: onMinimize },
    { kind: "zoom", label: isMaximized ? "Exit Zoom" : "Zoom", onClick: onZoom, disabled: !canZoom },
  ];

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {buttons.map(({ kind, label, onClick, disabled }) => (
        <button
          key={kind}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          aria-label={label}
          title={label}
          disabled={disabled}
          className="relative w-3 h-3 rounded-full flex items-center justify-center transition-colors duration-150 active:brightness-75"
          style={{
            backgroundColor: lit && !disabled ? COLORS[kind].bg : inactiveBg,
            boxShadow: `inset 0 0 0 0.5px ${lit ? COLORS[kind].ring : inactiveRing}`,
          }}
        >
          <span className={`transition-opacity duration-100 ${hover && !disabled ? "opacity-100" : "opacity-0"}`}>
            <Glyph kind={kind} isMaximized={isMaximized} />
          </span>
        </button>
      ))}
    </div>
  );
}
