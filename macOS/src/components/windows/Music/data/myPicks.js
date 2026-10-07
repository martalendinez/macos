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

// previewUrl: 30-second preview from the iTunes Search API (no key needed), played in-app.
// url: full song on Spotify.
export const myPicks = [
  {
    key: "locked-in",
    title: "💻 Locked In",
    subtitle: "Fixing bugs I created.",
    tracks: [
      { title: "Forbidden Friendship", artist: "John Powell", url: "https://open.spotify.com/search/Forbidden%20Friendship%20John%20Powell", cover: lockedIn1, album: "How To Train Your Dragon (Music From the Motion Picture)", durationSec: 251, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/dd/4a/f0/dd4af07a-0498-0c99-091f-64faf76f1786/mzaf_6383897328514494999.plus.aac.p.m4a" },
      { title: "Buckbeak's Flight", artist: "John Williams", url: "https://open.spotify.com/search/Buckbeaks%20Flight%20John%20Williams", cover: lockedIn2, album: "Harry Potter and the Prisoner of Azkaban (Soundtrack from the Motion Picture)", durationSec: 128, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/33/a9/cf/33a9cf49-9a4c-2e25-9b33-d5c3bafe360f/mzaf_7409774317967243444.plus.aac.p.m4a" },
      { title: "Flying", artist: "James Newton Howard", url: "https://open.spotify.com/search/Flying%20James%20Newton%20Howard", cover: lockedIn3, album: "Peter Pan (Original Motion Picture Soundtrack)", durationSec: 213, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/d6/69/cad66906-e15e-aa7b-fbc3-1708db4b5eda/mzaf_15746663906739297365.plus.aac.p.m4a" },
    ],
  },
  {
    key: "night-drive",
    title: "🌙🚗 Night Drive",
    subtitle: "For legally-questionable turns.",
    tracks: [
      { title: "Die For You", artist: "The Weeknd", url: "https://open.spotify.com/search/Die%20For%20You%20The%20Weeknd", cover: nightDrive1, album: "Starboy (Deluxe)", durationSec: 260, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1c/e7/f9/1ce7f9bb-42d3-fc77-1a24-68c187a55208/mzaf_5325098525476847495.plus.aac.p.m4a" },
      { title: "Sanctuary", artist: "Joji", url: "https://open.spotify.com/search/Sanctuary%20Joji", cover: nightDrive2, album: "Sanctuary - Single", durationSec: 180, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/45/b9/b045b93d-99f1-d6d1-5a70-71b972729b8b/mzaf_7644936121810147663.plus.aac.p.m4a" },
      { title: "Somebody Else", artist: "The 1975", url: "https://open.spotify.com/search/Somebody%20Else%20The%201975", cover: nightDrive3, album: "I Like It When You Sleep, For You Are So Beautiful Yet So Unaware of It", durationSec: 348, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ac/d9/27/acd927a7-da54-327e-7da2-b99638d9f139/mzaf_11691359230547115368.plus.aac.p.m4a" },
    ],
  },
  {
    key: "all-time-favorites",
    title: "⭐🎧 All Time Favorites",
    subtitle: "The ones I never skip.",
    tracks: [
      { title: "About You", artist: "The 1975", url: "https://open.spotify.com/search/About%20You%20The%201975", cover: favorites1, album: "Being Funny In A Foreign Language", durationSec: 326, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d0/8c/64/d08c6440-e727-10ab-589c-e36d5afea47e/mzaf_15879604028025493401.plus.aac.p.m4a" },
      { title: "party 4 u", artist: "Charli XCX", url: "https://open.spotify.com/search/party%204%20u%20Charli%20XCX", cover: favorites2, album: "how i'm feeling now", durationSec: 297, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ad/56/59/ad565928-39e7-e838-fe53-d802ed43028f/mzaf_6890154135250520322.plus.aac.p.m4a" },
      { title: "The First Time", artist: "Damiano David", url: "https://open.spotify.com/search/The%20First%20Time%20Damiano%20David", cover: favorites3, album: "FUNNY little FEARS", durationSec: 218, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/48/03/7c480379-f0b7-1bd2-96f6-6d1963eb4962/mzaf_11450462124703306419.plus.aac.p.m4a" },
    ],
  },
  {
    key: "strong-girl-era",
    title: "🏋️‍♀️ Strong Girl Era",
    subtitle: "Gym playlist that makes me believe I could flip a car🔥",
    tracks: [
      { title: "EoO", artist: "Bad Bunny", url: "https://open.spotify.com/search/EoO%20Bad%20Bunny", cover: gym1 },
      { title: "Feel Good", artist: "Illenium", url: "https://open.spotify.com/search/Feel%20Good%20Illenium", cover: gym2, album: "Feel Good (feat. Daya) - Single", durationSec: 248, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a8/ce/23/a8ce233e-e3bd-eea4-a925-94bc2fcd823a/mzaf_6159055369743168163.plus.aac.p.m4a" },
      { title: "One Of The Girls", artist: "The Weeknd", url: "https://open.spotify.com/search/One%20Of%20The%20Girls%20The%20Weeknd", cover: gym3, album: "The Idol Episode 4 (Music from the HBO Original Series) - Single", durationSec: 245, previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/2f/1f/9e2f1f11-20a8-767a-0e33-9029028a7024/mzaf_1603981766065362477.plus.aac.p.m4a" },
    ],
  },
];