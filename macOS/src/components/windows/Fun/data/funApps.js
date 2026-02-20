export function getFunApps(onOpenWindow) {
  return [
    {
      key: "music",
      emoji: "🎵",
      title: "Music",
      desc: "Explore my go-to songs and hit play on one.",
      cta: "Open Music",
      onClick: () => onOpenWindow?.("music"),
    },
    {
      key: "map",
      emoji: "🗺️",
      title: "Interactive Map",
      desc: "Explore my little life-map — where I’ve lived and learned.",
      cta: "Open Map",
      onClick: () => onOpenWindow?.("map"),
    },
    {
      key: "terminal",
      emoji: "🧑‍💻",
      title: "Terminal",
      desc: "Enter the nerd zone. Code. Explore. Play.",
      cta: "Open Terminal",
      onClick: () => onOpenWindow?.("terminal"),
    },
  ];
}