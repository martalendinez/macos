// src/components/windows/Journey/levels.js
// Marta's Journey: pixel sprites and the five levels (one per city, in life order).
// Facts come from the Map and About data. ✏️ Edit levels here; the engine reads them.

export const T = 16; // tile size in px
export const ROWS = 11;

/* ---------- sprites: strings of palette keys ('.' = transparent) ---------- */
export const PLAYER_PAL = { h: "#2a1b14", s: "#c98d6b", g: "#15151a", w: "#ffffff", m: "#9b4434", t: "#1d1d24", p: "#3d4f7a", b: "#111111" };
const HEAD = [
  "...hhhhhh...",
  "..hhhhhhhh..",
  ".hhhhhhhhhh.",
  ".hhssssssshh",
  "hhsgggsgggsh",
  "hhsgwgsgwgsh",
  ".hssssssssh.",
  ".hhssmmssh..",
  "..h.ssss.h..",
];
const BODY = ["...tttttt...", "..tttttttt..", ".sttttttttS.".replace("S", "s"), "...tttttt..."];
export const PLAYER = {
  idle: [...HEAD, ...BODY, "...pp..pp...", "...pp..pp...", "..bbb..bbb.."],
  run1: [...HEAD, ...BODY, "...pp...pp..", "..pp....pp..", ".bbb....bbb."],
  run2: [...HEAD, ...BODY, "....pppp....", "....pp.pp...", "...bbb.bbb.."],
  jump: [...HEAD, ...BODY, "..pp....pp..", ".bb......bb.", "............"],
};

export const WALKER = [
  "....kkkk....",
  "..kkkkkkkk..",
  ".kkkkkkkkkk.",
  "kkwwkkkkwwkk",
  "kkwbkkkkwbkk",
  "kkkkkkkkkkkk",
  "kkkkmmmmkkkk",
  ".kkkkkkkkkk.",
  "..kk....kk..",
  ".kkk....kkk.",
];
export const FLYER = [
  "....kkkk......",
  "..kkkkkkkk....",
  ".kkkkkkkkkkkk.",
  "kkwwkkkkwwkkkk",
  "kkwbkkkkwbkkkk",
  "kkkkkkkkkkkkkk",
  ".kkkkmmmmkkkk.",
  "..kkkkkkkkkk..",
];
export const PUPPY = [
  "........yy",
  "y......yyy",
  "yy....yyby",
  ".yyyyyyyyn",
  ".yyyyyyyy.",
  ".y.y..y.y.",
];
export const PUPPY_PAL = { y: "#c8925a", b: "#1a1a1a", n: "#2a1b14" };

export const ITEMS = {
  pencil: { pal: { y: "#f5c542", o: "#e07a3a", w: "#f3e1c7", k: "#2a2a2a", p: "#ff8fa3" }, px: ["......pp", ".....oyp", "....oyy.", "...oyy..", "..oyy...", ".oyy....", "wwy.....", "kw......"] },
  code: { pal: { g: "#2ecc71", d: "#1b7a43", w: "#ffffff" }, px: [".gggggg.", "gddddddg", "gdwdddwg", "gwddddwg", "gdwddwdg", "gddddddg", "gddddddg", ".gggggg."] },
  pretzel: { pal: { b: "#a0622d", l: "#d08b4b", w: "#fff3d6" }, px: [".bb..bb.", "blwbbwlb", "bl.bb.lb", "bl.bb.lb", ".bbllbb.", "..bllb..", ".bl..lb.", ".b....b."] },
  maple: { pal: { r: "#d7263d", d: "#8e1b2a" }, px: ["...rr...", "r..rr..r", "rr.rr.rr", "rrrrrrrr", ".rrrrrr.", "..rrrr..", "...dd...", "...d...."] },
  bun: { pal: { b: "#b5763a", l: "#e0a868", w: "#fff7ea" }, px: ["..bbbb..", ".blllwb.", "blbbblwb", "blblllbb", "blbwblbb", "bllbblb.", ".bblllb.", "..bbbb.."] },
};

/* ---------- level builder ---------- */
function build(spec) {
  const grid = Array.from({ length: ROWS }, () => Array(spec.w).fill(0));
  const fill = (x0, x1, y0, y1, v) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (grid[y] && x >= 0 && x < spec.w) grid[y][x] = v;
  };
  spec.ground.forEach(([x0, x1, top]) => fill(x0, x1, top, ROWS - 1, 1));
  (spec.blocks || []).forEach(([x, y, len = 1, h = 1]) => fill(x, x + len - 1, y, y + h - 1, 3));
  (spec.plats || []).forEach(([x, y, len]) => fill(x, x + len - 1, y, y, 2));
  return { ...spec, grid };
}

/* ---------- the five levels ---------- */
export const LEVELS = [
  build({
    id: "madrid",
    city: "Madrid",
    country: "Spain",
    years: "2002 – 2020",
    title: "Where it began",
    facts: ["Grew up in a tiny village, dreaming about seeing the world.", "Wanted to be a pilot… until the news showed too many plane crashes.", "Fell in love with design early on."],
    item: "pencil",
    itemName: "pencils",
    skill: "Design eye",
    enemy: "Self-doubt",
    flyerName: "Paper planes",
    sky: ["#ffb35c", "#ffe4ad"],
    far: "#e9b27a",
    mid: "#cf8457",
    top: "#e0b04a",
    body: "#b5653a",
    detail: "#9a4f2c",
    pit: null,
    next: "nl",
    w: 104,
    start: [2, 8],
    ground: [[0, 15, 9], [16, 23, 8], [24, 31, 9], [35, 49, 9], [50, 56, 7], [57, 63, 9], [67, 87, 9], [88, 103, 9]],
    plats: [[9, 7, 3], [39, 7, 4], [43, 5, 3], [71, 7, 3], [75, 5, 3], [92, 7, 3]],
    blocks: [[28, 7, 1, 2]],
    items: [[10, 6], [11, 6], [19, 6], [20, 6], [33, 6], [40, 6], [44, 4], [45, 4], [53, 5], [60, 8], [72, 6], [76, 4], [77, 4], [93, 6]],
    walkers: [26, 45, 60, 81, 98],
    flyers: [[33, 4, 40], [65, 4, 34]],
    check: 52,
    goal: 101,
  }),
  build({
    id: "groningen",
    city: "Groningen",
    country: "Netherlands",
    years: "2020 – 2024",
    title: "Design school, bikes and canals",
    facts: ["First time living abroad: Covid, distance and homesickness.", "BEng Communication & Multimedia Design at Hanze.", "Took a coding course and found out I love programming."],
    item: "code",
    itemName: "code chips",
    skill: "Programming",
    enemy: "Rainy days",
    flyerName: "Homesickness",
    sky: ["#8fa9c9", "#dfe7f0"],
    far: "#b8c4d4",
    mid: "#8a4b37",
    top: "#5e9e48",
    body: "#7d4a33",
    detail: "#5f3423",
    pit: "#3d6f9e",
    next: "de",
    w: 112,
    start: [2, 8],
    ground: [[0, 12, 9], [16, 26, 9], [30, 36, 9], [37, 44, 8], [48, 60, 9], [64, 70, 8], [74, 86, 9], [90, 111, 9]],
    plats: [[13, 7, 3], [27, 7, 3], [45, 6, 3], [61, 7, 3], [71, 6, 3], [87, 7, 3], [96, 7, 3], [100, 5, 3]],
    blocks: [[20, 7, 2, 2], [54, 7, 1, 2]],
    items: [[14, 6], [21, 5], [28, 6], [29, 6], [41, 7], [46, 5], [52, 8], [62, 6], [67, 7], [72, 5], [80, 8], [88, 6], [97, 6], [101, 4], [102, 4]],
    walkers: [9, 23, 33, 52, 58, 79, 84, 105],
    flyers: [[44, 3, 50], [76, 4, 40], [98, 3, 36]],
    check: 56,
    goal: 108,
  }),
  build({
    id: "stuttgart",
    city: "Stuttgart",
    country: "Germany",
    years: "2023 · exchange",
    title: "Where it all clicked",
    facts: ["My first exchange semester: friends right away, felt like home.", "Learned I thrive in UI and programming.", "Developed a mild (okay, major) FlixBus addiction."],
    item: "pretzel",
    itemName: "pretzels",
    skill: "UI engineering",
    enemy: "Bugs",
    flyerName: "Merge conflicts",
    sky: ["#86c5e8", "#e6f5fb"],
    far: "#9fcf8f",
    mid: "#6aa95a",
    top: "#58a845",
    body: "#6b4f3a",
    detail: "#4f3a2a",
    pit: null,
    next: "ca",
    w: 116,
    start: [2, 8],
    ground: [[0, 14, 9], [24, 36, 9], [37, 42, 7], [50, 62, 9], [72, 84, 9], [85, 90, 8], [97, 115, 9]],
    plats: [[8, 7, 3], [30, 7, 3], [56, 7, 3], [78, 7, 3], [102, 7, 3]],
    blocks: [[33, 8, 1, 1]],
    movers: [[15, 7, 3, 96, 0.6], [43, 7, 3, 80, 0.7], [63, 7, 3, 100, 0.8], [91, 7, 3, 70, 0.7]],
    items: [[9, 6], [18, 5], [22, 5], [27, 8], [31, 6], [39, 6], [46, 5], [57, 6], [66, 4], [70, 4], [79, 6], [87, 7], [94, 5], [103, 6], [110, 8]],
    walkers: [11, 28, 34, 54, 60, 76, 82, 100, 108],
    flyers: [[60, 3, 40], [96, 4, 30]],
    check: 54,
    goal: 112,
  }),
  build({
    id: "hamilton",
    city: "Hamilton",
    country: "Canada",
    years: "2025",
    title: "First time outside Europe",
    facts: ["Time zones, handled like a champ (eventually).", "Travelled across Canada, the US and the Caribbean.", "Lived with a host family, and a tiny puppy that followed me everywhere."],
    item: "maple",
    itemName: "maple leaves",
    skill: "Adaptability",
    enemy: "Time zones",
    flyerName: "Jet lag",
    sky: ["#f29a52", "#fde0b3"],
    far: "#d9875a",
    mid: "#2f5d3a",
    top: "#cf5a1e",
    body: "#5b3d2b",
    detail: "#432c1f",
    pit: null,
    puppy: true,
    next: "se",
    w: 112,
    start: [2, 8],
    ground: [[0, 13, 9], [14, 19, 7], [20, 27, 9], [31, 42, 9], [46, 48, 8], [52, 64, 9], [65, 72, 7], [73, 80, 9], [84, 111, 9]],
    plats: [[8, 7, 3], [23, 7, 3], [36, 7, 3], [38, 5, 3], [56, 7, 3], [60, 5, 3], [76, 7, 3], [92, 7, 3], [96, 5, 3]],
    blocks: [[34, 8, 1, 1], [88, 7, 1, 2]],
    items: [[9, 6], [16, 6], [24, 6], [29, 7], [37, 6], [39, 4], [40, 4], [47, 7], [57, 6], [61, 4], [62, 4], [68, 6], [77, 6], [93, 6], [97, 4]],
    walkers: [11, 25, 33, 40, 55, 62, 70, 78, 90, 102],
    flyers: [[29, 4, 30], [50, 3, 34], [82, 4, 40]],
    check: 52,
    goal: 108,
  }),
  build({
    id: "stockholm",
    city: "Stockholm",
    country: "Sweden",
    years: "2024 →",
    title: "Home: KTH, Trace and ROYC",
    facts: ["Master’s in Interactive Media Technology at KTH.", "Fika is a lifestyle. Careful, the snow is slippery.", "Started as a Design Engineer at ROYC in August 2026."],
    item: "bun",
    itemName: "kanelbullar",
    skill: "Design Engineer",
    enemy: "Scope creep",
    flyerName: "Last-minute feedback",
    sky: ["#1e2c52", "#4b6aa3"],
    far: "#2c3e6b",
    mid: "#3b4f80",
    top: "#f1f6fb",
    body: "#56607a",
    detail: "#414a60",
    pit: "#26456e",
    ice: true,
    snow: true,
    next: "royc",
    w: 118,
    start: [2, 8],
    ground: [[0, 14, 9], [18, 28, 9], [29, 34, 8], [38, 50, 9], [54, 60, 8], [64, 76, 9], [80, 117, 9]],
    plats: [[10, 7, 3], [15, 6, 3], [24, 7, 3], [35, 6, 3], [44, 7, 3], [51, 7, 3], [61, 6, 3], [70, 7, 3], [77, 7, 3]],
    blocks: [[46, 8, 1, 1]],
    items: [[11, 6], [16, 5], [25, 6], [31, 7], [36, 5], [45, 6], [52, 6], [57, 7], [62, 5], [71, 6], [78, 6], [84, 8]],
    walkers: [12, 22, 32, 42, 48, 58, 68, 74],
    flyers: [[36, 3, 40], [66, 3, 44]],
    check: 82,
    boss: 100,
    goal: 114,
  }),
];

/* flags for the goal pole: each level ends with the next destination */
export const FLAGS = {
  nl: [["#ae1c28"], ["#ffffff"], ["#21468b"]],
  de: [["#111111"], ["#dd0000"], ["#ffce00"]],
  ca: [["#d52b1e"], ["#ffffff"], ["#d52b1e"]],
  se: [["#006aa7"], ["#fecc00"], ["#006aa7"]],
};
