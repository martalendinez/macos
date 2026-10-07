// src/components/windows/Instagram/instagramData.js
// Built from the Map's places so photos, captions and stories stay in one place.
import { placeDetails } from "../Map/data/placesData";
import avatar from "../../../imgs/avatar/Avatar1.jpg";

// ✏️ Set your real Instagram profile URL to show a "Follow" button (leave "" to hide it)
export const INSTAGRAM_URL = "";
export const USERNAME = "martalendinez";
export const AVATAR = avatar;

// newest first
const ORDER = ["canada", "stockholm", "germany", "nl", "spain"];

export const HIGHLIGHTS = ORDER.filter((k) => placeDetails[k]).map((key) => {
  const p = placeDetails[key];
  return {
    key,
    label: p.title.split(",")[0],
    location: p.label,
    year: p.year,
    cover: p.photos[0],
    slides: p.photos.map((src, i) => ({
      src,
      caption: p.funFacts[i % p.funFacts.length],
    })),
  };
});

export const POSTS = HIGHLIGHTS.flatMap((h) => {
  const p = placeDetails[h.key];
  return p.photos.map((src, i) => ({
    id: `${h.key}-${i}`,
    src,
    location: p.label,
    year: p.year,
    caption: i === 0 ? p.description : p.funFacts[(i - 1) % p.funFacts.length],
  }));
});
