// src/components/shell/DockItem.jsx
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useSpring,
  useTransform,
} from "framer-motion";

export const DOCK_BASE = 50;
const DOCK_MAX = 82;
const DOCK_RANGE = 150; // px from the cursor that magnification reaches

export default function DockItem({
  mouseX,
  label,
  isDark,
  running = false,
  bounceOnClick = false,
  active = false,
  onClick,
  children,
}) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const bounce = useAnimationControls();

  // classic macOS fisheye: icon size follows distance to cursor
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || !Number.isFinite(v)) return Infinity;
    return v - (b.left + b.width / 2);
  });
  const target = useTransform(distance, [-DOCK_RANGE, 0, DOCK_RANGE], [DOCK_BASE, DOCK_MAX, DOCK_BASE]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

  function handleClick(e) {
    if (bounceOnClick && !running) {
      bounce.start({
        y: [0, -26, 0, -14, 0, -5, 0],
        transition: { duration: 1.05, times: [0, 0.18, 0.38, 0.55, 0.72, 0.86, 1], ease: "easeOut" },
      });
    }
    onClick?.(e);
  }

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-end shrink-0"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AnimatePresence>
        {hover && !active && (
          <motion.div
            className={[
              "absolute bottom-full mb-3 left-1/2 px-[10px] py-[3px] rounded-[7px] text-[13px] whitespace-nowrap pointer-events-none",
              "backdrop-blur-xl",
              isDark ? "bg-[#2c2c2e]/85 text-white/90" : "bg-[#ececec]/90 text-black/85",
            ].join(" ")}
            style={{
              x: "-50%",
              boxShadow: isDark
                ? "0 0 0 0.5px rgba(0,0,0,0.8), inset 0 0 0 0.5px rgba(255,255,255,0.14), 0 6px 18px rgba(0,0,0,0.35)"
                : "0 0 0 0.5px rgba(0,0,0,0.14), 0 6px 18px rgba(0,0,0,0.18)",
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.14 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={label}
        onClick={handleClick}
        animate={bounce}
        className="w-full h-full flex items-center justify-center active:brightness-[0.65] transition-[filter] duration-100"
      >
        {children}
      </motion.button>

      {/* running indicator */}
      <span
        className={[
          "absolute -bottom-[5px] w-[4px] h-[4px] rounded-full transition-opacity duration-300",
          isDark ? "bg-white/85" : "bg-black/70",
          running ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </motion.div>
  );
}
