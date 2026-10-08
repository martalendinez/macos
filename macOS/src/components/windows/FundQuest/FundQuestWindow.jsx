// src/components/windows/FundQuest/FundQuestWindow.jsx
// "Fund Quest": a bite-sized, game-like crash course in private markets.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLocalState from "../../../hooks/useLocalState";
import avatar from "../../../imgs/avatar/profile-photo.jpg";
import { LESSONS, PERFECT_BONUS, XP_PER_CORRECT } from "./lessons";

const EASE = [0.22, 1, 0.36, 1];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** renders **bold** segments */
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => (part.startsWith("**") ? <b key={i}>{part.slice(2, -2)}</b> : <span key={i}>{part}</span>));
}

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ i, x: Math.random() * 100, d: Math.random() * 0.4, c: ["#ff375f", "#ffd60a", "#30d158", "#0a84ff", "#bf5af2", "#ff9f0a"][i % 6], r: Math.random() * 360 })), []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => (
        <motion.span
          key={b.i}
          className="absolute top-0 w-2 h-3 rounded-[2px]"
          style={{ left: `${b.x}%`, background: b.c }}
          initial={{ y: -20, rotate: b.r, opacity: 1 }}
          animate={{ y: 520, rotate: b.r + 540, opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, delay: b.d, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ----------------------------- question types ----------------------------- */
function Choice({ label, state, onClick, disabled, dark }) {
  const cls =
    state === "right"
      ? "ring-2 ring-[#30d158] bg-[#30d158]/10"
      : state === "wrong"
      ? "ring-2 ring-[#ff453a] bg-[#ff453a]/10"
      : state === "picked"
      ? "ring-2 ring-[#0a84ff] bg-[#0a84ff]/10"
      : dark
      ? "ring-1 ring-white/15 hover:bg-white/[0.05]"
      : "ring-1 ring-black/10 hover:bg-black/[0.03]";
  return (
    <motion.button whileTap={{ scale: 0.97 }} disabled={disabled} onClick={onClick} className={`w-full text-left rounded-2xl px-4 py-3 text-[14px] font-medium transition ${cls}`}>
      {label}
    </motion.button>
  );
}

function Match({ q, onDone, onMistake, dark }) {
  const right = useMemo(() => shuffle(q.pairs.map((p) => p[1])), [q]);
  const [pick, setPick] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);
  function tapRight(r) {
    if (pick == null) return;
    const ok = q.pairs.find((p) => p[0] === pick)?.[1] === r;
    if (ok) {
      const m = [...matched, pick];
      setMatched(m);
      setPick(null);
      if (m.length === q.pairs.length) setTimeout(onDone, 350);
    } else {
      setFlash(r);
      onMistake();
      setTimeout(() => setFlash(null), 500);
    }
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        {q.pairs.map(([l]) => (
          <Choice dark={dark} key={l} label={l} disabled={matched.includes(l)} state={matched.includes(l) ? "right" : pick === l ? "picked" : null} onClick={() => setPick(l)} />
        ))}
      </div>
      <div className="space-y-2">
        {right.map((r) => {
          const done = q.pairs.some(([l, rr]) => rr === r && matched.includes(l));
          return <Choice dark={dark} key={r} label={r} disabled={done} state={done ? "right" : flash === r ? "wrong" : null} onClick={() => tapRight(r)} />;
        })}
      </div>
    </div>
  );
}

function Order({ q, picked, setPicked, locked, dark }) {
  const pool = useMemo(() => shuffle(q.items), [q]);
  return (
    <div>
      <div className={`min-h-[56px] rounded-2xl border-2 border-dashed p-2 flex flex-wrap gap-2 ${dark ? "border-white/15" : "border-black/10"}`}>
        {picked.map((it, i) => (
          <motion.button layout key={it} disabled={locked} onClick={() => setPicked(picked.filter((x) => x !== it))} className="px-3 py-1.5 rounded-xl bg-[#0a84ff] text-white text-[13px] font-semibold">
            {i + 1}. {it}
          </motion.button>
        ))}
        {!picked.length && <span className="self-center px-2 text-[13px] opacity-50">Tap the steps in order…</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool
          .filter((it) => !picked.includes(it))
          .map((it) => (
            <motion.button layout key={it} disabled={locked} whileTap={{ scale: 0.95 }} onClick={() => setPicked([...picked, it])} className={`px-3 py-1.5 rounded-xl ring-1 text-[13px] font-semibold ${dark ? "ring-white/15 hover:bg-white/[0.05]" : "ring-black/10 hover:bg-black/[0.03]"}`}>
              {it}
            </motion.button>
          ))}
      </div>
    </div>
  );
}

/* ------------------------------- lesson player ------------------------------ */
function Lesson({ lesson, onExit, onComplete, dark }) {
  const steps = useMemo(() => [...lesson.cards.map((c) => ({ kind: "card", c })), ...lesson.questions.map((q) => ({ kind: "q", q }))], [lesson]);
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [answer, setAnswer] = useState(null); // index / bool
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null); // "right" | "wrong"
  const [matchDone, setMatchDone] = useState(false);
  const step = steps[i];
  const progress = i / steps.length;

  function loseHeart() {
    setMistakes((m) => m + 1);
    setHearts((h) => h - 1);
  }

  function check() {
    const q = step.q;
    let ok = false;
    if (q.type === "mc") ok = answer === q.answer;
    if (q.type === "tf") ok = answer === q.answer;
    if (q.type === "order") ok = order.join("|") === q.items.join("|");
    if (!ok) loseHeart();
    setResult(ok ? "right" : "wrong");
  }

  function next() {
    if (hearts <= 0) return;
    if (i + 1 >= steps.length) return onComplete(mistakes);
    setI(i + 1);
    setAnswer(null);
    setOrder([]);
    setResult(null);
    setMatchDone(false);
  }

  const canCheck =
    step.kind === "q" &&
    !result &&
    ((step.q.type === "mc" && answer != null) || (step.q.type === "tf" && answer != null) || (step.q.type === "order" && order.length === step.q.items.length));
  const showContinue = step.kind === "card" || result || (step.kind === "q" && step.q.type === "match" && matchDone);

  return (
    <div className={`h-full flex flex-col ${dark ? "bg-[#1c1c1e] text-white" : "bg-white text-[#1d1d1f]"}`}>
      {/* top bar */}
      <div className="shrink-0 flex items-center gap-3 px-5 pt-4">
        <button onClick={onExit} className="text-[20px] opacity-50 hover:opacity-100" aria-label="Exit lesson">
          ✕
        </button>
        <div className={`flex-1 h-3 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-black/[0.07]"}`}>
          <motion.div className="h-full rounded-full" style={{ background: lesson.color }} animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
        </div>
        <div className="flex items-center gap-1 text-[14px] font-bold text-[#ff375f]">
          ❤️ <span className="tabular-nums">{Math.max(0, hearts)}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="max-w-[560px] mx-auto px-5 py-8" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25, ease: EASE }}>
            {hearts <= 0 ? (
              <div className="text-center pt-6">
                <div className="text-[56px]">💔</div>
                <div className="mt-2 text-[22px] font-bold">Out of hearts</div>
                <p className="mt-1 text-[14px] opacity-70">No worries, this stuff is tricky. Read the cards again and give it another go!</p>
                <button onClick={() => onExit("retry")} className="mt-6 px-6 py-2.5 rounded-2xl font-bold text-white" style={{ background: lesson.color }}>
                  Try again
                </button>
              </div>
            ) : step.kind === "card" ? (
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: lesson.color }}>
                  {lesson.emoji} {lesson.title}
                </div>
                <div className={`mt-4 rounded-3xl p-6 text-[17px] leading-relaxed ${dark ? "bg-white/[0.06]" : "bg-[#f5f5f7]"}`}>
                  <Rich text={step.c} />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className={`text-[12px] ${dark ? "text-white/60" : "text-black/50"}`}>
                    Card {i + 1} of {lesson.cards.length}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.1em] opacity-60">
                  {{ mc: "Choose the answer", tf: "True or false?", match: "Match the pairs", order: "Put in order" }[step.q.type]}
                </div>
                <div className="mt-2 text-[20px] font-bold leading-snug">{step.q.q}</div>
                <div className="mt-6 space-y-2.5">
                  {step.q.type === "mc" &&
                    step.q.options.map((o, idx) => (
                      <Choice
                        key={o}
                        label={o}
                        disabled={!!result}
                        state={result ? (idx === step.q.answer ? "right" : idx === answer ? "wrong" : null) : answer === idx ? "picked" : null}
                        onClick={() => setAnswer(idx)}
                      />
                    ))}
                  {step.q.type === "tf" && (
                    <div className="grid grid-cols-2 gap-3">
                      {[true, false].map((v) => (
                        <Choice
                          key={String(v)}
                          label={v ? "✅ True" : "❌ False"}
                          disabled={!!result}
                          state={result ? (v === step.q.answer ? "right" : v === answer ? "wrong" : null) : answer === v ? "picked" : null}
                          onClick={() => setAnswer(v)}
                        />
                      ))}
                    </div>
                  )}
                  {step.q.type === "match" && <Match q={step.q} dark={dark} onDone={() => setMatchDone(true)} onMistake={loseHeart} />}
                  {step.q.type === "order" && <Order q={step.q} dark={dark} picked={order} setPicked={setOrder} locked={!!result} />}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* bottom bar */}
      {hearts > 0 && (
        <div
          className={`shrink-0 border-t px-5 py-4 transition-colors ${
            result === "right" || matchDone ? "bg-[#30d158]/15 border-[#30d158]/30" : result === "wrong" ? "bg-[#ff453a]/12 border-[#ff453a]/30" : dark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="max-w-[560px] mx-auto flex items-center gap-4">
            <div className="flex-1 min-w-0">
              {(result || matchDone) && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`text-[16px] font-bold ${result === "wrong" ? "text-[#ff453a]" : "text-[#1f9d45]"}`}>{result === "wrong" ? "Not quite!" : ["Nice!", "Exactly!", "You got it!", "Great job!"][i % 4]}</div>
                  {step.q?.why && <div className="text-[13px] opacity-80 leading-snug">{step.q.why}</div>}
                </motion.div>
              )}
            </div>
            {showContinue ? (
              <motion.button whileTap={{ scale: 0.96 }} onClick={next} className="shrink-0 px-7 py-3 rounded-2xl font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.18)]" style={{ background: result === "wrong" ? "#ff453a" : lesson.color }}>
                Continue
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.96 }} disabled={!canCheck} onClick={check} className="shrink-0 px-7 py-3 rounded-2xl font-bold text-white disabled:opacity-35 shadow-[0_4px_0_rgba(0,0,0,0.18)]" style={{ background: lesson.color }}>
                Check
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- window ---------------------------------- */
export default function FundQuestWindow({ theme = "light", onOpenWindow, unlockAchievement }) {
  const dark = theme === "dark";
  const [progress, setProgress] = useLocalState("portfolio.fundquest", { done: {}, xp: 0 });
  const [active, setActive] = useState(null); // lesson index
  const [lessonKey, setLessonKey] = useState(0);
  const [celebrate, setCelebrate] = useState(null); // { lesson, stars, xp }
  const [name, setName] = useState("");
  const [showCert, setShowCert] = useState(false);

  const doneCount = Object.keys(progress.done).length;
  const allDone = doneCount === LESSONS.length;
  const nextIdx = LESSONS.findIndex((l) => !progress.done[l.id]);

  function complete(mistakes) {
    const lesson = LESSONS[active];
    const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
    const correct = lesson.questions.length;
    const xp = correct * XP_PER_CORRECT + (mistakes === 0 ? PERFECT_BONUS : 0);
    const first = !progress.done[lesson.id];
    const done = { ...progress.done, [lesson.id]: Math.max(stars, progress.done[lesson.id] ?? 0) };
    setProgress({ done, xp: progress.xp + xp });
    setCelebrate({ lesson, stars, xp });
    setActive(null);
    if (first) unlockAchievement?.("quest_starter", "🏆 Achievement unlocked: Quest Starter", "You finished your first Fund Quest lesson 🎓");
    if (Object.keys(done).length === LESSONS.length) unlockAchievement?.("private_markets_pro", "🏆 Achievement unlocked: Private Markets Pro", "You completed Fund Quest 🏛️");
  }

  if (active != null) {
    return (
      <div className="no-darkwin h-full">
        <Lesson
          key={lessonKey}
          lesson={LESSONS[active]}
          dark={dark}
          onComplete={complete}
          onExit={(why) => {
            if (why === "retry") setLessonKey((k) => k + 1);
            else setActive(null);
          }}
        />
      </div>
    );
  }

  const bg = dark ? "bg-[#1c1c1e] text-white" : "bg-[#fbfaf7] text-[#1d1d1f]";
  const sub = dark ? "text-white/55" : "text-black/50";

  return (
    <div className={`no-darkwin relative h-full overflow-y-auto ${bg}`}>
      {/* header */}
      <div className={`sticky top-0 z-10 flex items-center gap-4 px-5 h-12 border-b backdrop-blur-xl ${dark ? "bg-[#1c1c1e]/90 border-white/10" : "bg-[#fbfaf7]/90 border-black/[0.06]"}`}>
        <div className="font-extrabold text-[16px] tracking-[-0.01em]">🗺️ Fund Quest</div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-[13px] font-bold text-[#ff9f0a]">⚡ {progress.xp} XP</div>
        <div className="flex items-center gap-1 text-[13px] font-bold">
          🎓 {doneCount}/{LESSONS.length}
        </div>
      </div>

      <div className="max-w-[560px] mx-auto px-5 pb-12">
        {/* Marta intro */}
        <div className={`mt-6 rounded-3xl p-4 flex gap-3 ${dark ? "bg-white/[0.06]" : "bg-white ring-1 ring-black/[0.06]"}`}>
          <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
          <div className="text-[14px] leading-snug">
            <b>Hi! I’m Marta.</b> When I joined ROYC, private-markets jargon felt like a whole new language. GP, LP, capital calls, the J-curve… This is the crash course I wish I’d had. 7 tiny lessons, about 10 minutes. Let’s go! 🚀
          </div>
        </div>

        {/* path */}
        <div className="relative mt-8">
          {LESSONS.map((l, idx) => {
            const stars = progress.done[l.id];
            const unlocked = idx === 0 || progress.done[LESSONS[idx - 1].id];
            const isNext = idx === nextIdx;
            const offset = [0, 60, 90, 60, 0, -60, -90][idx % 7];
            return (
              <div key={l.id} className="flex flex-col items-center mb-6" style={{ transform: `translateX(${offset}px)` }}>
                <div className="relative">
                  {isNext && (
                    <motion.div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-xl text-[12px] font-bold text-white" style={{ background: l.color }} animate={{ y: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                      {idx === 0 ? "START" : "NEXT"}
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={unlocked ? { scale: 1.06 } : {}}
                    whileTap={unlocked ? { scale: 0.94 } : {}}
                    disabled={!unlocked}
                    onClick={() => {
                      setLessonKey((k) => k + 1);
                      setActive(idx);
                    }}
                    className="w-[76px] h-[70px] rounded-[50%] flex items-center justify-center text-[30px] disabled:cursor-not-allowed"
                    style={{
                      background: unlocked ? l.color : dark ? "#3a3a3c" : "#e5e5ea",
                      boxShadow: unlocked ? `0 7px 0 ${l.color}99` : `0 7px 0 ${dark ? "#2c2c2e" : "#d1d1d6"}`,
                      filter: unlocked ? "none" : "grayscale(1)",
                      opacity: unlocked ? 1 : 0.6,
                    }}
                    aria-label={`${l.title}${unlocked ? "" : " (locked)"}`}
                  >
                    {unlocked ? l.emoji : "🔒"}
                  </motion.button>
                </div>
                <div className="mt-3 text-[13px] font-bold">{l.title}</div>
                <div className="text-[12px] h-4">{stars ? "⭐".repeat(stars) + "☆".repeat(3 - stars) : <span className={sub}>{unlocked ? `${l.questions.length} questions` : "Locked"}</span>}</div>
              </div>
            );
          })}

          {/* finish */}
          <div className="flex flex-col items-center mt-2">
            <motion.button
              whileHover={allDone ? { scale: 1.05 } : {}}
              disabled={!allDone}
              onClick={() => setShowCert(true)}
              className="w-[92px] h-[92px] rounded-full flex items-center justify-center text-[40px] disabled:opacity-40"
              style={{ background: allDone ? "linear-gradient(135deg,#ffd60a,#ff9f0a)" : dark ? "#3a3a3c" : "#e5e5ea", boxShadow: allDone ? "0 8px 0 #c97a00" : "none" }}
              aria-label="Certificate"
            >
              🏆
            </motion.button>
            <div className="mt-3 text-[13px] font-bold">Certificate</div>
            <div className={`text-[12px] ${sub}`}>{allDone ? "Claim it!" : "Finish all lessons"}</div>
          </div>
        </div>

        <div className={`mt-10 rounded-2xl p-4 text-[13px] leading-snug ${dark ? "bg-white/[0.06]" : "bg-white ring-1 ring-black/[0.06]"}`}>
          📈 Want to see these ideas in action? Open the{" "}
          <button onClick={() => onOpenWindow?.("fundsim")} className="font-semibold text-[#5e5ce6] hover:underline">
            Fund Simulator
          </button>{" "}
          and watch a J-curve form.
        </div>
      </div>

      {/* lesson complete */}
      <AnimatePresence>
        {celebrate && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Confetti />
            <motion.div className={`relative w-[320px] rounded-3xl p-6 text-center ${dark ? "bg-[#2c2c2e]" : "bg-white"}`} initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <div className="text-[44px]">{celebrate.lesson.emoji}</div>
              <div className="mt-1 text-[22px] font-extrabold">Lesson complete!</div>
              <div className="mt-2 text-[30px]">
                {[1, 2, 3].map((s) => (
                  <motion.span key={s} className="inline-block" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + s * 0.15, type: "spring" }}>
                    {s <= celebrate.stars ? "⭐" : "☆"}
                  </motion.span>
                ))}
              </div>
              <div className="mt-2 text-[14px] font-bold text-[#ff9f0a]">+{celebrate.xp} XP</div>
              <button onClick={() => setCelebrate(null)} className="mt-5 w-full py-3 rounded-2xl font-bold text-white" style={{ background: celebrate.lesson.color }}>
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* certificate */}
      <AnimatePresence>
        {showCert && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCert(false)}>
            <Confetti />
            <motion.div
              className="relative w-full max-w-[460px] rounded-3xl p-7 text-center bg-[#fffdf7] text-[#1d1d1f] ring-8 ring-[#ffd60a]/40"
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c97a00]">Certificate of completion</div>
              <div className="mt-3 text-[13px] text-black/50">This certifies that</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className="mt-1 w-full text-center bg-transparent outline-none border-b-2 border-dashed border-black/15 text-[28px] font-extrabold tracking-[-0.02em] placeholder:text-black/20"
                style={{ fontFamily: "Lustria, serif" }}
              />
              <div className="mt-3 text-[13px] text-black/60">has completed</div>
              <div className="text-[20px] font-bold">Fund Quest · Private Markets 101</div>
              <div className="mt-1 text-[13px] text-black/50">
                {LESSONS.length} lessons · {progress.xp} XP
              </div>
              <div className="mt-6 flex items-end justify-between text-left">
                <div>
                  <div className="text-[18px]" style={{ fontFamily: '"Marker Felt", "Chalkboard SE", cursive' }}>
                    Marta Lendínez
                  </div>
                  <div className="text-[10px] text-black/45 border-t border-black/15 pt-0.5">Course author · Design Engineer</div>
                </div>
                <div className="text-[44px]">🏅</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
