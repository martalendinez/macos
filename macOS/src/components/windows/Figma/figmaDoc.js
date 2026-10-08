// src/components/windows/Figma/figmaDoc.js
// Document model for the Figma simulator: nodes, auto layout, components & instances.
// Child coordinates are relative to their parent. Auto-layout frames position their children
// and hug their content.

let seq = 100;
export const uid = (p = "n") => `${p}${++seq}`;

const measureCanvas = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;
export function textWidth(text, size, weight) {
  if (!measureCanvas) return text.length * size * 0.55;
  measureCanvas.font = `${weight} ${size}px -apple-system, "Inter", sans-serif`;
  return Math.ceil(measureCanvas.measureText(text || " ").width);
}

/** Sample file (fictional fund data). */
export function sampleDoc() {
  return {
    nodes: {
      page: { id: "page", type: "page", name: "Page 1", children: ["card", "btnMain", "inst1", "inst2", "note"] },

      card: {
        id: "card",
        type: "frame",
        name: "Fund card",
        x: 80,
        y: 80,
        w: 320,
        h: 260,
        fill: "#ffffff",
        radius: 20,
        auto: { dir: "column", gap: 14, pad: 20 },
        children: ["cTag", "cTitle", "cSub", "cChart", "cMetrics"],
      },
      cTag: { id: "cTag", type: "frame", name: "Tag", fill: "#efeefe", radius: 999, auto: { dir: "row", gap: 6, pad: 8 }, children: ["cTagTxt"] },
      cTagTxt: { id: "cTagTxt", type: "text", name: "Tag label", text: "Private Equity", size: 11, weight: 600, color: "#5e5ce6" },
      cTitle: { id: "cTitle", type: "text", name: "Title", text: "Nordic Growth Fund II", size: 20, weight: 700, color: "#1d1d1f" },
      cSub: { id: "cSub", type: "text", name: "Subtitle", text: "Sample fund · vintage 2024 · €250M", size: 12, weight: 400, color: "#6e6e73" },
      cChart: { id: "cChart", type: "rect", name: "Chart", w: 280, h: 70, fill: "#e8f0fd", radius: 12 },
      cMetrics: { id: "cMetrics", type: "frame", name: "Metrics", fill: "transparent", radius: 0, auto: { dir: "row", gap: 18, pad: 0 }, children: ["m1", "m2", "m3"] },
      m1: { id: "m1", type: "text", name: "IRR", text: "IRR 13%", size: 13, weight: 600, color: "#1d1d1f" },
      m2: { id: "m2", type: "text", name: "TVPI", text: "TVPI 1.7x", size: 13, weight: 600, color: "#1d1d1f" },
      m3: { id: "m3", type: "text", name: "DPI", text: "DPI 0.4x", size: 13, weight: 600, color: "#1d1d1f" },

      btnMain: {
        id: "btnMain",
        type: "frame",
        name: "Button",
        component: true,
        x: 470,
        y: 80,
        fill: "#0a84ff",
        radius: 10,
        auto: { dir: "row", gap: 8, pad: 12 },
        children: ["btnTxt"],
      },
      btnTxt: { id: "btnTxt", type: "text", name: "Label", text: "Invest now", size: 14, weight: 600, color: "#ffffff" },

      inst1: { id: "inst1", type: "instance", name: "Button", of: "btnMain", x: 470, y: 180 },
      inst2: { id: "inst2", type: "instance", name: "Button", of: "btnMain", x: 470, y: 250 },

      note: { id: "note", type: "text", name: "Sticky", x: 80, y: 380, text: "Try: change the Button’s fill → both instances update ✨", size: 13, weight: 500, color: "#8e8e93" },
    },
  };
}

/** Computes absolute boxes for every visible node. Returns { id: {x,y,w,h,parent} }. */
export function layout(doc) {
  const N = doc.nodes;
  const boxes = {};

  function size(id) {
    const n = N[id];
    if (!n || n.hidden) return { w: 0, h: 0 };
    if (n.type === "text") return { w: textWidth(n.text, n.size, n.weight), h: Math.round(n.size * 1.3) };
    if (n.type === "instance") return size(n.of);
    if (n.type === "frame" && n.auto) {
      const kids = (n.children || []).filter((c) => !N[c]?.hidden).map(size);
      const { dir, gap, pad } = n.auto;
      const main = kids.reduce((a, k) => a + (dir === "row" ? k.w : k.h), 0) + gap * Math.max(0, kids.length - 1);
      const cross = kids.reduce((a, k) => Math.max(a, dir === "row" ? k.h : k.w), 0);
      return dir === "row" ? { w: main + pad * 2, h: cross + pad * 2 } : { w: Math.max(cross + pad * 2, n.w ?? 0), h: main + pad * 2 };
    }
    return { w: n.w ?? 100, h: n.h ?? 100 };
  }

  function place(id, ax, ay, parent, viaInstance) {
    const n = N[id];
    if (!n || n.hidden) return;
    const s = size(id);
    const key = viaInstance ? `${viaInstance}/${id}` : id;
    boxes[key] = { x: ax, y: ay, w: s.w, h: s.h, parent, node: n, instance: viaInstance };
    if (n.type === "instance") {
      place(n.of, ax, ay, key, id);
      return;
    }
    if (!n.children) return;
    if (n.auto) {
      const { dir, gap, pad } = n.auto;
      let cur = pad;
      n.children.forEach((c) => {
        const cs = size(c);
        if (N[c]?.hidden) return;
        place(c, dir === "row" ? ax + cur : ax + pad, dir === "row" ? ay + pad : ay + cur, key, viaInstance);
        cur += (dir === "row" ? cs.w : cs.h) + gap;
      });
    } else {
      n.children.forEach((c) => place(c, ax + (N[c].x ?? 0), ay + (N[c].y ?? 0), key, viaInstance));
    }
  }

  (N.page.children || []).forEach((c) => place(c, N[c].x ?? 0, N[c].y ?? 0, "page"));
  return boxes;
}

export function parentOf(doc, id) {
  return Object.values(doc.nodes).find((n) => n.children?.includes(id))?.id ?? null;
}

/** Deep-delete a node and its subtree; instances of a deleted component are removed too. */
export function removeNode(doc, id) {
  const nodes = { ...doc.nodes };
  const kill = (nid) => {
    (nodes[nid]?.children || []).forEach(kill);
    delete nodes[nid];
  };
  kill(id);
  Object.values(nodes).forEach((n) => {
    if (n.type === "instance" && !nodes[n.of]) delete nodes[n.id];
  });
  Object.keys(nodes).forEach((k) => {
    if (nodes[k].children) nodes[k] = { ...nodes[k], children: nodes[k].children.filter((c) => nodes[c]) };
  });
  return { ...doc, nodes };
}
