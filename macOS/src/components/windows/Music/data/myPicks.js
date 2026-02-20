import nightDrive1 from "../../../../imgs/music/drive1.jfif";
import nightDrive2 from "../../../../imgs/music/drive2.png";
import nightDrive3 from "../../../../imgs/music/drive3.jfif";
import lockedIn1 from "../../../../imgs/music/locked1.jfif";
import lockedIn2 from "../../../../imgs/music/locked2.jfif";
import lockedIn3 from "../../../../imgs/music/locked3.jfif";
import favorites1 from "../../../../imgs/music/favorites1.png";
import favorites2 from "../../../../imgs/music/favorites2.png";
import favorites3 from "../../../../imgs/music/favorites3.jfif";
import gym1 from "../../../../imgs/music/gym1.png";
import gym2 from "../../../../imgs/music/gym2.jfif";
import gym3 from "../../../../imgs/music/gym3.jpg";

export const myPicks = [
  {
    key: "locked-in",
    title: "💻 Locked In",
    subtitle: "Fixing bugs I created.",
    tracks: [
      { title: "Forbidden Friendship", artist: "John Powell", url: "https://open.spotify.com/search/Forbidden%20Friendship%20John%20Powell", cover: lockedIn1 },
      { title: "Buckbeak's Flight", artist: "John Williams", url: "https://open.spotify.com/search/Buckbeaks%20Flight%20John%20Williams", cover: lockedIn2 },
      { title: "Flying", artist: "James Newton Howard", url: "https://open.spotify.com/search/Flying%20James%20Newton%20Howard", cover: lockedIn3 },
    ],
  },
  {
    key: "night-drive",
    title: "🌙🚗 Night Drive",
    subtitle: "For legally-questionable turns.",
    tracks: [
      { title: "Die For You", artist: "The Weeknd", url: "https://open.spotify.com/search/Die%20For%20You%20The%20Weeknd", cover: nightDrive1 },
      { title: "Sanctuary", artist: "Joji", url: "https://open.spotify.com/search/Sanctuary%20Joji", cover: nightDrive2 },
      { title: "Somebody Else", artist: "The 1975", url: "https://open.spotify.com/search/Somebody%20Else%20The%201975", cover: nightDrive3 },
    ],
  },
  {
    key: "all-time-favorites",
    title: "⭐🎧 All Time Favorites",
    subtitle: "The ones I never skip.",
    tracks: [
      { title: "About You", artist: "The 1975", url: "https://open.spotify.com/search/About%20You%20The%201975", cover: favorites1 },
      { title: "party 4 u", artist: "Charli XCX", url: "https://open.spotify.com/search/party%204%20u%20Charli%20XCX", cover: favorites2 },
      { title: "The First Time", artist: "Damiano David", url: "https://open.spotify.com/search/The%20First%20Time%20Damiano%20David", cover: favorites3 },
    ],
  },
  {
    key: "strong-girl-era",
    title: "🏋️‍♀️ Strong Girl Era",
    subtitle: "Gym playlist that makes me believe I could flip a car🔥",
    tracks: [
      { title: "EoO", artist: "Bad Bunny", url: "https://open.spotify.com/search/EoO%20Bad%20Bunny", cover: gym1 },
      { title: "Feel Good", artist: "Illenium", url: "https://open.spotify.com/search/Feel%20Good%20Illenium", cover: gym2 },
      { title: "One Of The Girls", artist: "The Weeknd", url: "https://open.spotify.com/search/One%20Of%20The%20Girls%20The%20Weeknd", cover: gym3 },
    ],
  },
];