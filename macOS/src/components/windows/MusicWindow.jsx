// src/components/windows/MusicWindow.jsx
import { useMemo, useState } from "react";

import nightDrive1 from "../../imgs/music/drive1.jfif";
import nightDrive2 from "../../imgs/music/drive2.png";
import nightDrive3 from "../../imgs/music/drive3.jfif";
import lockedIn1 from "../../imgs/music/locked1.jfif";
import lockedIn2 from "../../imgs/music/locked2.jfif";
import lockedIn3 from "../../imgs/music/locked3.jfif";
import favorites1 from "../../imgs/music/favorites1.png";
import favorites2 from "../../imgs/music/favorites2.png";
import favorites3 from "../../imgs/music/favorites3.jfif";
import gym1 from "../../imgs/music/gym1.png";
import gym2 from "../../imgs/music/gym2.jfif";
import gym3 from "../../imgs/music/gym3.jpg";

/* -------------------- MY PICKS (CURATED) -------------------- */
const myPicks = [
  {
    key: "locked-in",
    title: "💻 Locked In",
    subtitle: "Fixing bugs I created.",
    tracks: [
      {
        title: "Forbidden Friendship",
        artist: "John Powell",
        url: "https://open.spotify.com/search/Forbidden%20Friendship%20John%20Powell",
        cover: lockedIn1,
      },
      {
        title: "Buckbeak's Flight",
        artist: "John Williams",
        url: "https://open.spotify.com/search/Buckbeaks%20Flight%20John%20Williams",
        cover: lockedIn2,
      },
      {
        title: "Flying",
        artist: "James Newton Howard",
        url: "https://open.spotify.com/search/Flying%20James%20Newton%20Howard",
        cover: lockedIn3,
      },
    ],
  },
  {
    key: "night-drive",
    title: "🌙🚗 Night Drive",
    subtitle: "For legally-questionable turns.",
    tracks: [
      {
        title: "Die For You",
        artist: "The Weeknd",
        url: "https://open.spotify.com/search/Die%20For%20You%20The%20Weeknd",
        cover: nightDrive1,
      },
      {
        title: "Sanctuary",
        artist: "Joji",
        url: "https://open.spotify.com/search/Sanctuary%20Joji",
        cover: nightDrive2,
      },
      {
        title: "Somebody Else",
        artist: "The 1975",
        url: "https://open.spotify.com/search/Somebody%20Else%20The%201975",
        cover: nightDrive3,
      },
    ],
  },
  {
    key: "all-time-favorites",
    title: "⭐🎧 All Time Favorites",
    subtitle: "The ones I never skip.",
    tracks: [
      {
        title: "About You",
        artist: "The 1975",
        url: "https://open.spotify.com/search/About%20You%20The%201975",
        cover: favorites1,
      },
      {
        title: "party 4 u",
        artist: "Charli XCX",
        url: "https://open.spotify.com/search/party%204%20u%20Charli%20XCX",
        cover: favorites2,
      },
      {
        title: "The First Time",
        artist: "Damiano David",
        url: "https://open.spotify.com/search/The%20First%20Time%20Damiano%20David",
        cover: favorites3,
      },
    ],
  },
  {
    key: "strong-girl-era",
    title: "🏋️‍♀️ Strong Girl Era",
    subtitle: "Gym playlist that makes me believe I could flip a car🔥",
    tracks: [
      {
        title: "EoO",
        artist: "Bad Bunny",
        url: "https://open.spotify.com/search/EoO%20Bad%20Bunny",
        cover: gym1,
      },
      {
        title: "Feel Good",
        artist: "Illenium",
        url: "https://open.spotify.com/search/Feel%20Good%20Illenium",
        cover: gym2,
      },
      {
        title: "One Of The Girls",
        artist: "The Weeknd",
        url: "https://open.spotify.com/search/One%20Of%20The%20Girls%20The%20Weeknd",
        cover: gym3,
      },
    ],
  },
];

export default function MusicWindow({ uiTheme = "glass" }) {
  const isMac = uiTheme === "macos";
  const [activePick, setActivePick] = useState("locked-in");

  const styles = useMemo(() => {
    return {
      textMain: isMac ? "text-black/80" : "text-white/90",
      textStrong: isMac ? "text-black" : "text-white",
      textSub: isMac ? "text-black/60" : "text-white/70",
      textSub2: isMac ? "text-black/50" : "text-white/60",

      cardBg: isMac ? "bg-white" : "bg-white/6",
      cardBgSoft: isMac ? "bg-black/5" : "bg-white/5",
      cardBorder: isMac ? "border-black/10" : "border-white/10",
      divider: isMac ? "bg-black/10" : "bg-white/10",

     hover: isMac
  ? "hover:bg-[hsl(var(--accent)/0.12)] hover:border-[hsl(var(--accent)/0.35)]"
  : "hover:bg-white/10",
selected: isMac
  ? "bg-[hsl(var(--accent)/0.12)] border-[hsl(var(--accent)/0.35)]"
  : "bg-white/15",


    };
  }, [isMac]);

  const currentPick = myPicks.find((p) => p.key === activePick) ?? myPicks[0];

  return (
    <div className={`h-full flex flex-col ${styles.textMain}`}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className={`${styles.textStrong} text-lg font-semibold`}>My picks</div>
        <div className={`${styles.textSub} text-sm mt-1`}>
          Explore my tracks for every mood and moment!
        </div>
        <div className={`mt-4 h-px ${styles.divider}`} />
      </div>

      {/* Layout */}
      <div className="flex-1 overflow-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: categories */}
        <div className={`lg:col-span-1 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textSub} text-xs mb-3`}>Categories</div>

          <div className="space-y-2">
            {myPicks.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePick(p.key)}
                className={`w-full text-left rounded-xl px-3 py-3 border transition ${
  activePick === p.key
    ? isMac
      ? styles.selected
      : `${styles.selected} ${styles.cardBorder}`
    : isMac
    ? `border-black/10 ${styles.hover}`
    : `${styles.cardBorder} ${styles.hover}`
}`}

              >
                <div className={`${styles.textStrong} text-sm font-medium`}>{p.title}</div>
                <div className={`${styles.textSub} text-xs mt-1`}>{p.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: tracks */}
        <div className={`lg:col-span-2 rounded-2xl ${styles.cardBg} border ${styles.cardBorder} p-5`}>
          <div className={`${styles.textSub} text-xs mb-2`}>Now browsing</div>
          <div className={`${styles.textStrong} font-semibold`}>{currentPick.title}</div>
          <div className={`${styles.textSub} text-sm mt-1 mb-4`}>{currentPick.subtitle}</div>

          <div className="space-y-2">
            {currentPick.tracks.map((t, idx) => (
              <a
                key={idx}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 border ${styles.cardBorder} transition ${styles.hover}`}
                title="Open in Spotify"
              >
                <MiniCover styles={styles} title={t.title} cover={t.cover} />

                <div className="min-w-0 flex-1">
                  <div className={`${styles.textStrong} text-sm font-medium truncate`}>{t.title}</div>
                  <div className={`${styles.textSub} text-xs mt-1 truncate`}>{t.artist}</div>
                </div>

                <div className={`${styles.textSub} text-xs opacity-70 group-hover:opacity-100 transition`}>
                  ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- MINI COVER (WITH FALLBACK) -------------------- */
function MiniCover({ styles, title, cover }) {
  const letter = (title?.trim()?.[0] || "♪").toUpperCase();

  return (
    <div className={`w-12 h-12 rounded-xl overflow-hidden border ${styles.cardBorder} shrink-0`}>
      {cover ? (
        <img
          src={cover}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${styles.cardBgSoft}`}>
          <div className={`${styles.textSub2} text-sm font-semibold`}>{letter}</div>
        </div>
      )}
    </div>
  );
}
