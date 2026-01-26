import { useState } from "react";
import { motion } from "framer-motion";

import moonIcon from './imgs/moon.png';
import gearIcon from './imgs/gear.png';
import notificationIcon from './imgs/notification.png';

export default function App() {
  const [mouseX, setMouseX] = useState(null);

  const currentTime = new Date().toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Stockholm",
  });

  const dockItems = [
    { label: "About me", emoji: "🧍‍♀️" },
    { label: "AI assistant", emoji: "🤖" },
    { label: "Extras & Fun", emoji: "🎉" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center font-sans text-white relative"
      style={{ backgroundImage: "url('./Background.jpg')" }}
    >
      {/* Top Menu Bar — macOS style */}
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-white/10 backdrop-blur-md flex items-center justify-end px-6 text-sm text-white shadow-sm">
        <div className="flex items-center gap-3">
          {[
            { src: moonIcon, alt: "Moon" },
            { src: gearIcon, alt: "Settings" },
            { src: notificationIcon, alt: "Notifications" },
          ].map(({ src, alt }) => (
            <div
              key={alt}
              className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150 hover:bg-white/20 hover:scale-105 hover:-translate-y-[1px] hover:drop-shadow-sm"
            >
              <img src={src} alt={alt} className="w-4 h-4" />
            </div>
          ))}
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Bottom Dock — ripple animation with tooltips */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex gap-6 z-50"
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {dockItems.map((item, index) => (
          <DockItem
            key={item.label}
            item={item}
            index={index}
            mouseX={mouseX}
            total={dockItems.length}
          />
        ))}
      </div>
    </div>
  );
}

function DockItem({ item, index, mouseX, total }) {
  const distanceFactor = 180;

  const getCenter = (i) => {
    const itemWidth = 60;
    const dockLeft = window.innerWidth / 2 - (total * itemWidth) / 2;
    return dockLeft + i * itemWidth + itemWidth / 2;
  };

  const scale = mouseX
    ? 1 + Math.max(0, 1 - Math.abs(mouseX - getCenter(index)) / distanceFactor)
    : 1;

  return (
    <div className="group relative flex flex-col items-center cursor-pointer">
      <motion.div
        animate={{
          scale,
          y: scale > 1 ? -10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="flex flex-col items-center"
      >
        <div className="text-3xl">{item.emoji}</div>
      </motion.div>

      {/* Tooltip label */}
      <div
  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[15px] px-3 py-[4px] rounded-[6px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap tracking-tight"
  style={{ fontFamily: "Lustria" }}
>
  {item.label}
</div>

        </div>
  );
}
