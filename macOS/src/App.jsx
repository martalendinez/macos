import { useState } from "react";
import { motion } from "framer-motion";

import moonIcon from './imgs/moon.png';
import gearIcon from './imgs/gear.png';
import notificationIcon from './imgs/notification.png';
import projectsIcon from './imgs/folders.png';
import videosIcon from './imgs/videos.png';
import timerIcon from './imgs/timer.png';
import docIcon from './imgs/doc.png';
import aboutIcon from './imgs/me.png';
import aiIcon from './imgs/bot.png';
import funIcon from './imgs/games.png';

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
    { label: "About me", icon: aboutIcon },
    { label: "AI assistant", icon: aiIcon },
    { label: "Extras & Fun", icon: funIcon },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center font-sans text-white relative"
      style={{ backgroundImage: "url('./Background.jpg')" }}
    >
      {/* Top Menu Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-white/10 backdrop-blur-md flex items-center justify-end px-6 text-sm text-white shadow-sm">
        <div className="flex items-center gap-3">
          {[moonIcon, gearIcon, notificationIcon].map((src, i) => (
            <div
              key={i}
              className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150 hover:bg-white/20 hover:scale-105 hover:-translate-y-[1px] hover:drop-shadow-sm"
            >
              <img src={src} alt={`icon-${i}`} className="w-4 h-4" />
            </div>
          ))}
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Left rail icons */}
      <div className="fixed top-12 left-4 z-40 flex flex-col gap-6 text-white text-xs font-medium">
        {[{ icon: timerIcon, label: "30-Seconds Mode" },
          { icon: projectsIcon, label: "Projects" },
          { icon: videosIcon, label: "Videos" }].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-start gap-1 cursor-pointer hover:scale-105 transition-transform duration-150 origin-top-left">
            <img src={icon} alt={label} className="w-15 h-15 object-contain" />
            <div className="bg-white/20 px-2 py-[3px] rounded-[6px] backdrop-blur-sm text-white text-[13px] whitespace-nowrap shadow-sm">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Right-side resume.pdf */}
      <div className="fixed top-12 right-4 z-40 flex flex-col items-start gap-1 text-white text-xs font-medium cursor-pointer hover:scale-105 transition-transform duration-150 origin-top-right">
        <img src={docIcon} alt="Resume" className="w-15 h-15 object-contain" />
        <div className="bg-white/20 px-2 py-[3px] rounded-[6px] backdrop-blur-sm text-white text-[13px] whitespace-nowrap shadow-sm">
          resume.pdf
        </div>
      </div>

      {/* Bottom Dock */}
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
    ? Math.min(1.35, 1 + Math.max(0, 1 - Math.abs(mouseX - getCenter(index)) / distanceFactor))
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
    </div>
  );
}
