// src/components/windows/Messages/MessagesWindow.jsx
// iMessage-style chat with a pre-recorded Marta.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import avatar from "../../../imgs/avatar/profile-photo.jpg";
import { GREETING, INTENTS, fallbackReply, matchIntent } from "./messagesData";

const BLUE = "#0b84fe";
let uid = 0;
const nextId = () => ++uid;

function TypingBubble({ isDark }) {
  return (
    <motion.div
      className={`self-start rounded-[18px] px-4 py-3 flex gap-1 ${isDark ? "bg-[#3a3a3c]" : "bg-[#e9e9eb]"}`}
      initial={{ opacity: 0, scale: 0.6, originX: 0, originY: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
    >
      {[0, 0.15, 0.3].map((d) => (
        <motion.span
          key={d}
          className={`w-2 h-2 rounded-full ${isDark ? "bg-white/55" : "bg-black/35"}`}
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: d }}
        />
      ))}
    </motion.div>
  );
}

export default function MessagesWindow({ theme = "light", onOpenWindow, unlockAchievement }) {
  const isDark = theme === "dark";
  const [messages, setMessages] = useState([]); // { id, from: "me"|"marta", text?, actions? }
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [asked, setAsked] = useState({});
  const scrollRef = useRef(null);
  const timers = useRef([]);
  const busy = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Marta "types" each bubble with a short pause, like a real chat
  function martaSays({ bubbles = [], actions }) {
    busy.current = true;
    let t = 350;
    bubbles.forEach((text, i) => {
      const typingTime = Math.min(1600, 500 + text.length * 14);
      timers.current.push(setTimeout(() => setTyping(true), t));
      t += typingTime;
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setMessages((m) => [
            ...m,
            { id: nextId(), from: "marta", text, actions: i === bubbles.length - 1 ? actions : undefined },
          ]);
        }, t)
      );
      t += 250;
    });
    timers.current.push(setTimeout(() => (busy.current = false), t));
  }

  useEffect(() => {
    martaSays({ bubbles: GREETING });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function send(text, intent) {
    if (!text.trim() || busy.current) return;
    setMessages((m) => [...m, { id: nextId(), from: "me", text: text.trim() }]);
    const hit = intent ?? matchIntent(text);
    if (hit) {
      setAsked((a) => {
        const next = { ...a, [hit.id]: true };
        if (Object.keys(next).length === 4) {
          unlockAchievement?.("chatty", "Achievement unlocked: Great Conversationalist", "You asked Marta 4 different questions 💬");
        }
        return next;
      });
    }
    martaSays(hit ? hit.reply() : fallbackReply(text));
  }

  function runAction(a) {
    if (a.windowId) onOpenWindow?.(a.windowId);
    else if (a.href?.startsWith("mailto:")) window.location.href = a.href;
    else if (a.href) window.open(a.href, "_blank", "noopener,noreferrer");
  }

  const last = messages[messages.length - 1];
  const lastMine = [...messages].reverse().find((m) => m.from === "me");

  const sideBg = isDark ? "bg-[#1e1e20] border-white/10" : "bg-[#f5f5f7] border-black/10";
  const mainBg = isDark ? "bg-[#1c1c1e]" : "bg-white";
  const theirBubble = isDark ? "bg-[#3a3a3c] text-white" : "bg-[#e9e9eb] text-black";
  const sub = isDark ? "text-white/50" : "text-black/45";
  const chip = isDark
    ? "border-[#0b84fe]/60 text-[#4aa3ff] hover:bg-[#0b84fe]/15"
    : "border-[#0b84fe]/50 text-[#0b84fe] hover:bg-[#0b84fe]/10";

  return (
    <div className={`no-darkwin h-full flex ${isDark ? "text-white" : "text-black"}`}>
      {/* sidebar */}
      <aside className={`w-[250px] shrink-0 border-r ${sideBg} p-2 hidden @lg:block`}>
        <div className={`mx-1 mb-2 rounded-[7px] px-2 py-1 text-[13px] ${isDark ? "bg-white/10 text-white/45" : "bg-black/5 text-black/40"}`}>⌕ Search</div>
        <div className="rounded-[10px] p-2 flex items-center gap-2.5" style={{ background: BLUE }}>
          <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1 text-white">
            <div className="flex justify-between text-[13px] font-semibold">
              Marta Lendínez <span className="font-normal text-white/75 text-[11px]">now</span>
            </div>
            <div className="text-[12px] text-white/80 truncate">{last?.text ?? "Typing…"}</div>
          </div>
        </div>
      </aside>

      {/* chat */}
      <section className={`flex-1 min-w-0 flex flex-col ${mainBg}`}>
        <header className={`shrink-0 flex flex-col items-center py-2 border-b ${isDark ? "border-white/10" : "border-black/10"}`}>
          <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="text-[11px] mt-0.5">
            Marta Lendínez <span className={sub}>›</span>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          <div className={`text-center text-[11px] mb-2 ${sub}`}>iMessage · Today</div>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const mine = m.from === "me";
              const nextSame = messages[i + 1]?.from === m.from;
              return (
                <motion.div
                  key={m.id}
                  layout
                  className={`flex flex-col ${mine ? "items-end" : "items-start"} ${nextSame ? "" : "mb-2"}`}
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  style={{ originX: mine ? 1 : 0, originY: 1 }}
                >
                  <div
                    className={`max-w-[75%] px-3.5 py-2 text-[14px] leading-snug ${mine ? "text-white" : theirBubble}`}
                    style={{
                      background: mine ? BLUE : undefined,
                      borderRadius: 18,
                      [mine ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: nextSame ? 18 : 5,
                    }}
                  >
                    {m.text}
                  </div>
                  {m.actions && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <button
                          key={a.label}
                          onClick={() => runAction(a)}
                          className={`px-3 py-1 rounded-full border text-[12px] font-medium transition ${chip}`}
                        >
                          {a.label} ↗
                        </button>
                      ))}
                    </div>
                  )}
                  {mine && m.id === lastMine?.id && <div className={`text-[10px] mt-0.5 mr-1 ${sub}`}>Delivered</div>}
                </motion.div>
              );
            })}
            {typing && <TypingBubble key="typing" isDark={isDark} />}
          </AnimatePresence>
        </div>

        {/* quick questions */}
        <div className="shrink-0 px-3 pt-2 flex gap-1.5 overflow-x-auto">
          {INTENTS.map((intent) => (
            <button
              key={intent.id}
              onClick={() => send(intent.question, intent)}
              className={`shrink-0 px-3 py-1 rounded-full border text-[12px] transition ${chip} ${asked[intent.id] ? "opacity-50" : ""}`}
            >
              {intent.question}
            </button>
          ))}
        </div>

        <form
          className="shrink-0 p-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="iMessage"
            aria-label="Message"
            className={`flex-1 rounded-full px-4 py-1.5 text-[14px] outline-none border ${
              isDark ? "bg-transparent border-white/20 placeholder:text-white/35" : "bg-white border-black/15 placeholder:text-black/35"
            }`}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.85 }}
            disabled={!draft.trim()}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-30"
            style={{ background: BLUE }}
            aria-label="Send"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
            </svg>
          </motion.button>
        </form>
      </section>
    </div>
  );
}
