// src/components/windows/Instagram/InstagramWindow.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AVATAR, HIGHLIGHTS, INSTAGRAM_URL, POSTS, USERNAME } from "./instagramData";

const STORY_MS = 4500;

function Heart({ filled, className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.6 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
        fill={filled ? "#ff3040" : "none"}
        stroke={filled ? "#ff3040" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ring({ children, seen = false, size = 86 }) {
  return (
    <div
      className="rounded-full p-[3px] shrink-0"
      style={{
        width: size,
        height: size,
        background: seen ? "rgba(128,128,128,0.35)" : "conic-gradient(from 200deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)",
      }}
    >
      <div className="w-full h-full rounded-full p-[3px] bg-[var(--ig-bg)]">{children}</div>
    </div>
  );
}

/* ---------------- Stories ---------------- */
function StoryViewer({ startIndex, onClose, onSeen }) {
  const [h, setH] = useState(startIndex);
  const [s, setS] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const story = HIGHLIGHTS[h];

  const go = useCallback(
    (dir) => {
      setProgress(0);
      if (dir > 0) {
        if (s < story.slides.length - 1) setS(s + 1);
        else if (h < HIGHLIGHTS.length - 1) {
          setH(h + 1);
          setS(0);
        } else onClose();
      } else {
        if (s > 0) setS(s - 1);
        else if (h > 0) {
          setH(h - 1);
          setS(HIGHLIGHTS[h - 1].slides.length - 1);
        }
      }
    },
    [h, s, story, onClose]
  );

  useEffect(() => onSeen?.(story.key), [story.key, onSeen]);

  useEffect(() => {
    if (paused) return;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const delta = (now - last) / STORY_MS; // computed outside the updater (StrictMode calls updaters twice)
      last = now;
      setProgress((p) => p + delta);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, h, s]);

  useEffect(() => {
    if (progress >= 1) go(1);
  }, [progress, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const slide = story.slides[s];

  return (
    <motion.div
      className="absolute inset-0 z-30 bg-[#111] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl" aria-label="Close stories">
        ✕
      </button>

      <motion.div
        key={story.key}
        className="relative h-[92%] aspect-[9/16] rounded-xl overflow-hidden bg-black select-none"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0.4, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            draggable={false}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 to-transparent" />

        {/* progress bars */}
        <div className="absolute top-2 inset-x-2 flex gap-1">
          {story.slides.map((_, i) => (
            <div key={i} className="flex-1 h-[2.5px] rounded-full bg-white/35 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${i < s ? 100 : i === s ? Math.min(100, progress * 100) : 0}%` }} />
            </div>
          ))}
        </div>

        <div className="absolute top-5 left-3 flex items-center gap-2 text-white">
          <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-[13px] font-semibold">{USERNAME}</span>
          <span className="text-[12px] text-white/70">{story.label} · {story.year}</span>
        </div>

        <div className="absolute bottom-5 inset-x-4 text-white text-[14px] leading-snug font-medium drop-shadow">
          {slide.caption}
        </div>

        {/* tap zones */}
        <button className="absolute left-0 top-0 h-full w-1/3" onClick={() => go(-1)} aria-label="Previous" />
        <button className="absolute right-0 top-0 h-full w-2/3" onClick={() => go(1)} aria-label="Next" />
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Post modal ---------------- */
function PostModal({ index, setIndex, onClose, liked, toggleLike, comments, addComment, isDark }) {
  const post = POSTS[index];
  const [burst, setBurst] = useState(0);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(POSTS.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, setIndex]);

  const isLiked = !!liked[post.id];
  const list = comments[post.id] ?? [];

  return (
    <motion.div
      className="absolute inset-0 z-20 bg-black/70 flex items-center justify-center p-8"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute top-3 right-4 text-white/85 text-2xl" aria-label="Close">
        ✕
      </button>
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex(index - 1);
          }}
          className="absolute left-3 w-8 h-8 rounded-full bg-white/90 text-black text-lg flex items-center justify-center"
          aria-label="Previous post"
        >
          ‹
        </button>
      )}
      {index < POSTS.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex(index + 1);
          }}
          className="absolute right-3 w-8 h-8 rounded-full bg-white/90 text-black text-lg flex items-center justify-center"
          aria-label="Next post"
        >
          ›
        </button>
      )}

      <motion.div
        className={`flex h-full max-h-[600px] w-full max-w-[860px] rounded-md overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div
          className="relative flex-[1.3] bg-black flex items-center justify-center select-none"
          onDoubleClick={() => {
            if (!isLiked) toggleLike(post.id);
            setBurst((b) => b + 1);
          }}
        >
          <img src={post.src} alt="" className="max-w-full max-h-full object-contain" draggable={false} />
          <AnimatePresence>
            {burst > 0 && (
              <motion.div
                key={burst}
                className="absolute pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.9, times: [0, 0.3, 0.6, 1] }}
                onAnimationComplete={() => setBurst(0)}
              >
                <svg viewBox="0 0 24 24" className="w-28 h-28 drop-shadow-xl" aria-hidden="true">
                  <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.6 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" fill="#fff" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex-1 min-w-[280px] flex flex-col border-l ${isDark ? "border-white/10" : "border-black/10"}`}>
          <div className={`flex items-center gap-3 p-3 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
            <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="leading-tight">
              <div className="text-[13px] font-semibold">{USERNAME}</div>
              <div className="text-[11px] opacity-70">{post.location}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[13px]">
            <div className="flex gap-3">
              <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div>
                <span className="font-semibold mr-1.5">{USERNAME}</span>
                {post.caption}
                <div className="mt-1 text-[11px] opacity-50">{post.year}</div>
              </div>
            </div>
            {list.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 shrink-0 flex items-center justify-center text-white text-[11px] font-bold">
                  you
                </div>
                <div>
                  <span className="font-semibold mr-1.5">you</span>
                  {c}
                </div>
              </div>
            ))}
          </div>

          <div className={`p-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
            <div className="flex items-center gap-3">
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleLike(post.id)} aria-label={isLiked ? "Unlike" : "Like"}>
                <Heart filled={isLiked} />
              </motion.button>
            </div>
            <div className="mt-2 text-[13px] font-semibold">{isLiked ? "Liked by you 💛" : "Be the first to like this"}</div>
            <div className="text-[10px] uppercase tracking-wide opacity-50 mt-1">Double-click the photo to like</div>
          </div>

          <form
            className={`flex items-center gap-2 px-3 py-2 border-t ${isDark ? "border-white/10" : "border-black/10"}`}
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              addComment(post.id, draft.trim());
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent outline-none text-[13px]"
            />
            <button type="submit" disabled={!draft.trim()} className="text-[13px] font-semibold text-[#0095f6] disabled:opacity-40">
              Post
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Window ---------------- */
export default function InstagramWindow({ theme = "light", onOpenWindow, unlockAchievement }) {
  const isDark = theme === "dark";
  const [storyAt, setStoryAt] = useState(null);
  const [postAt, setPostAt] = useState(null);
  const [seen, setSeen] = useState({});
  const [liked, setLiked] = useState({});
  const [comments, setComments] = useState({});
  const [tab, setTab] = useState("posts");
  const rootRef = useRef(null);

  const markSeen = useCallback((key) => setSeen((s) => (s[key] ? s : { ...s, [key]: true })), []);

  function toggleLike(id) {
    setLiked((l) => {
      const next = { ...l, [id]: !l[id] };
      if (Object.values(next).filter(Boolean).length === 3) {
        unlockAchievement?.("ig_fan", "Achievement unlocked: Biggest Fan", "You liked 3 of Marta's photos 💛");
      }
      return next;
    });
  }

  const vars = isDark
    ? { "--ig-bg": "#000", color: "#f5f5f5" }
    : { "--ig-bg": "#fff", color: "#111" };
  const line = isDark ? "border-white/15" : "border-black/10";
  const btn = isDark ? "bg-[#262626] hover:bg-[#363636]" : "bg-[#efefef] hover:bg-[#dbdbdb]";

  const posts = tab === "posts" ? POSTS : POSTS.filter((p) => liked[p.id]);

  return (
    <div ref={rootRef} className="no-darkwin relative h-full w-full overflow-hidden" style={{ ...vars, background: "var(--ig-bg)" }}>
      <div className="h-full overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 pt-8 pb-10">
          {/* PROFILE HEADER */}
          <div className="flex items-center gap-10 px-6">
            <button onClick={() => setStoryAt(0)} aria-label="Watch stories" className="hover:scale-[1.02] transition">
              <Ring size={150} seen={HIGHLIGHTS.every((h) => seen[h.key])}>
                <img src={AVATAR} alt="Marta" className="w-full h-full rounded-full object-cover" />
              </Ring>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-[20px]">{USERNAME}</div>
                {INSTAGRAM_URL && (
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-lg text-[13px] font-semibold bg-[#0095f6] hover:bg-[#1877f2] text-white">
                    Follow
                  </a>
                )}
                <button onClick={() => onOpenWindow?.("messages")} className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold ${btn}`}>
                  Message
                </button>
              </div>

              <div className="mt-4 flex gap-8 text-[15px]">
                <span><b>{POSTS.length}</b> posts</span>
                <span><b>{HIGHLIGHTS.length}</b> countries</span>
                <span><b>1</b> portfolio</span>
              </div>

              <div className="mt-4 text-[14px] leading-snug">
                <div className="font-semibold">Marta Lendínez</div>
                <div className="opacity-60 text-[13px]">UX Engineer • UI Designer</div>
                <div>🎓 Master’s in Interactive Media Technology @ KTH</div>
                <div>📍 Stockholm · 🇪🇸 → 🇳🇱 → 🇩🇪 → 🇨🇦 → 🇸🇪</div>
                <div className="opacity-80">Designing software for humans, with empathy and curiosity ✨</div>
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="mt-10 flex gap-6 px-4 overflow-x-auto pb-2">
            {HIGHLIGHTS.map((h, i) => (
              <button key={h.key} onClick={() => setStoryAt(i)} className="flex flex-col items-center gap-2 group">
                <Ring size={80} seen={seen[h.key]}>
                  <img src={h.cover} alt="" className="w-full h-full rounded-full object-cover group-hover:scale-105 transition" />
                </Ring>
                <span className="text-[12px] font-semibold">{h.label}</span>
              </button>
            ))}
          </div>

          {/* TABS */}
          <div className={`mt-6 border-t ${line} flex justify-center gap-14 text-[12px] font-semibold tracking-[0.1em]`}>
            {[
              ["posts", "▦ POSTS"],
              ["liked", "♡ LIKED BY YOU"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`py-4 -mt-px border-t ${tab === k ? (isDark ? "border-white" : "border-black") : "border-transparent opacity-50"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "liked" && posts.length === 0 && (
            <div className="py-16 text-center text-[14px] opacity-60">Photos you like will show up here. Double-click a photo to like it 💛</div>
          )}

          {/* GRID */}
          <motion.div layout className="grid grid-cols-3 gap-1">
            {posts.map((p) => {
              const i = POSTS.indexOf(p);
              return (
                <motion.button
                  layout
                  key={p.id}
                  onClick={() => setPostAt(i)}
                  className="group relative aspect-square overflow-hidden bg-black/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img src={p.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-semibold text-[15px]">
                    <span className="flex items-center gap-1.5">
                      <Heart filled={liked[p.id]} className="w-5 h-5" /> {liked[p.id] ? 1 : 0}
                    </span>
                    <span>💬 {comments[p.id]?.length ?? 0}</span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {postAt != null && (
          <PostModal
            key="post"
            index={postAt}
            setIndex={setPostAt}
            onClose={() => setPostAt(null)}
            liked={liked}
            toggleLike={toggleLike}
            comments={comments}
            addComment={(id, text) => setComments((c) => ({ ...c, [id]: [...(c[id] ?? []), text] }))}
            isDark={isDark}
          />
        )}
        {storyAt != null && <StoryViewer key="story" startIndex={storyAt} onClose={() => setStoryAt(null)} onSeen={markSeen} />}
      </AnimatePresence>
    </div>
  );
}
