// src/components/windows/Projects/caseStudy/KallosVisuals.jsx
// Kallos case-study visuals:
//   KallosWhiteboard – early sketches as a whiteboard session (marker strokes + sticky notes)
//   KallosSystem     – the PrideCom-based design system as a live board (palette, type, buttons, score, levels)
//   PasswordRules    – the sign-up validation rules from website/auth.py, as a live component
//   EncryptionCode   – website/encryption.py, verbatim
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const K = {
  orange: "#f07837",
  graphite: "#474747",
  indigo: "#5355a0",
  teal: "#00769e",
  green: "#008858",
  yellow: "#f1c40f",
  red: "#ee5555",
};
const POP = "Poppins, system-ui, sans-serif";
const MARKER = '"Permanent Marker", "Marker Felt", "Comic Sans MS", cursive';

function useFonts() {
  useEffect(() => {
    const id = "kallos-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* ---------------- whiteboard ---------------- */
const INK = "#2b2b33";
const Mk = ({ d, c = INK, w = 3.4 }) => <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
const Tx = ({ x, y, s = 20, c = INK, children, r = 0 }) => (
  <text x={x} y={y} fontFamily={MARKER} fontSize={s} fill={c} transform={r ? `rotate(${r} ${x} ${y})` : undefined}>
    {children}
  </text>
);
function Sticky({ x, y, r = 0, fill = "#ffe680", lines }) {
  return (
    <g transform={`rotate(${r} ${x + 80} ${y + 50})`}>
      <rect x={x + 4} y={y + 6} width="160" height="104" fill="rgba(0,0,0,0.12)" />
      <rect x={x} y={y} width="160" height="104" fill={fill} />
      {lines.map((l, i) => (
        <Tx key={i} x={x + 12} y={y + 32 + i * 26} s={i === 0 ? 19 : 16}>
          {l}
        </Tx>
      ))}
    </g>
  );
}

export function KallosWhiteboard({ theme }) {
  useFonts();
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(160deg,#fdfdfd,#f1f2f4)", boxShadow: "inset 0 0 0 10px #d9dbe0, inset 0 0 0 11px #c4c6cc, 0 24px 50px -28px rgba(0,0,0,0.45)" }}>
        <svg viewBox="0 0 1000 560" className="relative block w-full h-auto" role="img" aria-label="Whiteboard sketches of the Kallos dashboard flow">
          <defs>
            <filter id="k-marker">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="2.6" />
            </filter>
          </defs>
          {/* faint erased marks */}
          <g opacity="0.07" filter="url(#k-marker)">
            <Mk d="M620 90 q 80 -30 160 10" w="18" />
            <Mk d="M80 470 q 120 20 220 -10" w="14" />
          </g>

          <Tx x={44} y={62} s={34}>
            Kallos — whiteboard
          </Tx>
          <g filter="url(#k-marker)">
            <Mk d="M44 76 q 150 10 300 -4" c={K.orange} w={4} />

            {/* 1 sign up */}
            <Mk d="M44 120 h 230 v 170 h -230 z" />
            <Tx x={58} y={146} s={18}>
              sign up
            </Tx>
            <Mk d="M60 170 h 196 M60 200 h 196 M60 230 h 196" w={2.2} c="#7a7a85" />
            <Mk d="M60 252 h 90 v 24 h -90 z" c={K.orange} />
            <Tx x={160} y={272} s={14} c="#7a7a85">
              company, role…
            </Tx>

            {/* 2 surveys */}
            <Mk d="M330 120 h 230 v 170 h -230 z" />
            <Tx x={344} y={146} s={18}>
              my surveys
            </Tx>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Mk d={`M348 ${170 + i * 36} h 22 v 22 h -22 z`} w={2.4} />
                {i < 2 && <Mk d={`M352 ${181 + i * 36} l 5 6 l 10 -12`} c={K.green} w={3} />}
                <Mk d={`M382 ${181 + i * 36} h ${150 - i * 30}`} w={2.2} c="#7a7a85" />
              </g>
            ))}
            <Tx x={346} y={280} s={14} c="#7a7a85">
              + upload KPIs manually
            </Tx>

            {/* 3 dashboard */}
            <Mk d="M616 120 h 340 v 260 h -340 z" />
            <Tx x={630} y={146} s={18}>
              dashboard
            </Tx>
            <Tx x={640} y={226} s={60} c={K.orange}>
              27
            </Tx>
            <Tx x={712} y={226} s={26}>
              /100
            </Tx>
            {/* radar */}
            <Mk d="M880 180 l 50 34 l -20 60 h -60 l -20 -60 z" w={2} c="#9a9aa5" />
            <Mk d="M880 196 l 34 26 l -14 40 h -36 l -18 -46 z" c={K.orange} w={3} />
            <Mk d="M636 300 h 300 M636 330 h 220 M636 360 h 260" w={2.2} c="#7a7a85" />

            {/* arrows */}
            <Mk d="M278 200 q 26 -18 48 0 l -10 -8 m 10 8 l -12 4" />
            <Mk d="M564 200 q 26 -18 48 0 l -10 -8 m 10 8 l -12 4" />
            <Mk d="M786 384 q 0 46 -60 70 l 8 -12 m -8 12 l 14 2" />

            {/* 4 recommendations */}
            <Mk d="M420 420 h 300 v 110 h -300 z" />
            <Tx x={434} y={446} s={18}>
              recommendations
            </Tx>
            {["Level 1", "Level 2", "Level 3"].map((l, i) => (
              <g key={l}>
                <Mk d={`M${438 + i * 92} 470 h 80 v 30 h -80 z`} c={i === 0 ? K.orange : INK} w={2.4} />
                <Tx x={448 + i * 92} y={491} s={15}>
                  {l}
                </Tx>
              </g>
            ))}
          </g>

          <Sticky x={60} y={370} r={-4} lines={["one score,", "never a black box", "→ show breakdown"]} />
          <Sticky x={230} y={404} r={3} fill="#ffc9a8" lines={["no survey?", "let them type", "the KPI ✓"]} />
          <Sticky x={790} y={430} r={-3} fill="#c9ecd9" lines={["advice by", "maturity level", "(HR words!)"]} />
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: K.orange }} />
        Whiteboard session: the four steps from sign-up to recommendations, and the notes that became key decisions.
      </figcaption>
    </figure>
  );
}

/* ---------------- design system ---------------- */
function Card({ children, className = "", style, i = 0 }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[20px] p-5 @2xl:p-6 ${className}`}
      style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 16px 36px -24px rgba(120,60,20,0.35)", fontFamily: POP, color: K.graphite, ...style }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
const Lbl = ({ children, color = "rgba(71,71,71,0.5)" }) => (
  <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
    {children}
  </div>
);
const tints = (hex) => [1, 0.75, 0.5, 0.25].map((a) => `color-mix(in srgb, ${hex} ${a * 100}%, white)`);

const LEVELS = [
  { n: 1, t: "Create an employee value proposition (EVP) and articulate it with creativity, storytelling and your own visual identity." },
  { n: 2, t: "Identify the pillars of your company’s EVP: the reasons people choose to work for you." },
  { n: 3, t: "Turn the EVP into a storytelling narrative that connects, and give it a unique image." },
];

export function KallosSystem() {
  useFonts();
  const [lvl, setLvl] = useState(1);
  const [copied, setCopied] = useState(null);
  const groups = [
    ["Primary", [["Orange", K.orange], ["Graphite", K.graphite]]],
    ["Secondary", [["Indigo", K.indigo], ["Teal", K.teal], ["Green", K.green], ["Yellow", K.yellow]]],
    ["States", [["Restrictive", K.red], ["Approved", K.green]]],
  ];
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-6 gap-3 @2xl:gap-4">
      {/* brand */}
      <Card className="@3xl:col-span-4 min-h-[220px]" style={{ background: K.orange, color: "#fff" }} i={0}>
        <span className="absolute -right-10 -top-12 w-48 h-48 rounded-full bg-white/15" />
        <Lbl color="rgba(255,255,255,0.8)">Brand · built on PrideCom’s identity</Lbl>
        <div className="mt-4 font-extrabold tracking-[-0.03em] leading-[0.98]" style={{ fontSize: "clamp(28px, 4.2cqw, 42px)" }}>
          Kallos.
          <br />
          <span className="text-white/90">Your expert in employer branding.</span>
        </div>
      </Card>

      {/* type */}
      <Card className="@3xl:col-span-2" i={1}>
        <Lbl>Typography · Poppins</Lbl>
        <div className="mt-3 text-[54px] leading-none font-bold">Aa</div>
        <div className="mt-4 space-y-1.5">
          <div className="text-[20px] font-bold">H1 · Title</div>
          <div className="text-[15px] font-semibold">H2 · Subtitle</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide">H3 · Section</div>
          <div className="text-[12px]">P · Paragraph</div>
        </div>
        <div className="mt-3 text-[10.5px] text-black/45">Desktop and mobile scales defined; mobile wasn’t built in the 4-month scope.</div>
      </Card>

      {/* palette */}
      <Card className="@3xl:col-span-6" i={2}>
        <Lbl>Colour · click a swatch to copy</Lbl>
        <div className="mt-4 grid grid-cols-1 @3xl:grid-cols-[1fr_2fr_1fr] gap-6">
          {groups.map(([g, cols]) => (
            <div key={g}>
              <div className="text-[12px] font-semibold" style={{ color: K.orange }}>
                {g}
              </div>
              <div className="mt-2 flex gap-2">
                {cols.map(([n, c]) => (
                  <button
                    key={g + n}
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(c).catch(() => {});
                      setCopied(g + n);
                      clearTimeout(window.__kT);
                      window.__kT = setTimeout(() => setCopied(null), 1200);
                    }}
                    className="group/sw flex-1 min-w-0 text-left"
                    title={`Copy ${c}`}
                  >
                    <div className="relative h-14 rounded-[10px] transition-transform group-hover/sw:-translate-y-1" style={{ background: c }}>
                      {copied === g + n && <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-bold text-white">Copied ✓</span>}
                    </div>
                    <div className="mt-1 flex gap-[2px]">
                      {tints(c).map((t, k) => (
                        <span key={k} className="flex-1 h-2 rounded-[2px]" style={{ background: t }} />
                      ))}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold truncate">{n}</div>
                    <div className="text-[10px] tabular-nums text-black/40">{c}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* buttons */}
      <Card className="@3xl:col-span-3" i={3}>
        <Lbl>CTAs & inputs · with interaction states</Lbl>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11.5px] font-medium">
          {["Default", "Hover", "Disabled"].map((s, i) => (
            <div key={s} className="space-y-2">
              <div className="text-[10px] text-black/40">{s}</div>
              <div className="py-2 rounded-[6px] text-center text-white" style={{ background: i === 2 ? "#c9c9c9" : K.orange, opacity: i === 1 ? 0.8 : 1, boxShadow: i < 2 ? "0 3px 8px -2px rgba(240,120,55,0.5)" : "none" }}>
                Sign up
              </div>
              <div className="py-2 rounded-[6px] text-center" style={{ color: i === 2 ? "#bbb" : K.graphite, boxShadow: `inset 0 0 0 1px ${i === 1 ? K.orange : i === 2 ? "#ddd" : "#999"}` }}>
                Log in
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-9 rounded-[6px] px-3 flex items-center text-[12px] text-black/40" style={{ boxShadow: "inset 0 0 0 1px #bdbdbd" }}>
          Form field
        </div>
      </Card>

      {/* recommendations */}
      <Card className="@3xl:col-span-3" i={4}>
        <Lbl>Recommendation card · try the levels</Lbl>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-[52px] font-extrabold leading-none" style={{ color: K.orange }}>
            27
          </span>
          <span className="text-[22px] font-bold pb-1">/100</span>
        </div>
        <div className="mt-3 flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.n}
              type="button"
              onClick={() => setLvl(l.n)}
              className="px-3 py-1 rounded-[5px] text-[11.5px] font-semibold transition"
              style={lvl === l.n ? { background: K.orange, color: "#fff" } : { color: K.orange, boxShadow: `inset 0 0 0 1px ${K.orange}` }}
            >
              Level {l.n}
            </button>
          ))}
        </div>
        <motion.p key={lvl} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-[12.5px] leading-relaxed min-h-[54px]">
          <b style={{ color: K.orange }}>{lvl}.</b> {LEVELS[lvl - 1].t}
        </motion.p>
      </Card>
    </div>
  );
}

/* ---------------- code ---------------- */
function CodeCard({ file, children }) {
  return (
    <figure className="min-w-0 rounded-[16px] overflow-hidden" style={{ background: "#1c1a19", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -26px rgba(0,0,0,0.6)" }}>
      <div className="h-9 px-3 flex items-center gap-1.5 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/50 font-mono">{file}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[11.5px] leading-[1.75] font-mono text-[#e8e2dc]">{children}</pre>
    </figure>
  );
}
const kw = (s) => <span style={{ color: "#ff9e64" }}>{s}</span>;
const fn = (s) => <span style={{ color: "#7dcfff" }}>{s}</span>;
const st = (s) => <span style={{ color: "#c3e88d" }}>{s}</span>;
const cm = (s) => <span style={{ color: "rgba(255,255,255,0.35)" }}>{s}</span>;

const RULES = [
  { label: "At least 7 characters", test: (p) => p.length >= 7 },
  { label: "1 capital letter", test: (p) => /[A-Z]/.test(p) },
  { label: "1 number", test: (p) => /\d/.test(p) },
  { label: "Ends with a special character", test: (p) => /[!@#$%^&*()_+={}[\]:;"'|<,>.?/~`]$/.test(p) },
];

/** The sign-up password rules from website/auth.py, rebuilt as live feedback. */
export function PasswordRules() {
  useFonts();
  const [pw, setPw] = useState("Kallos2024");
  const okAll = RULES.every((r) => r.test(pw));
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1fr_1.2fr] gap-5 items-stretch">
      <div className="rounded-[16px] p-5 bg-white" style={{ fontFamily: POP, color: K.graphite, boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 16px 34px -22px rgba(120,60,20,0.35)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">Sign up · try a password</div>
        <label className="mt-3 block text-[12px] font-semibold">Password</label>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-1 w-full h-10 rounded-[6px] px-3 text-[14px] outline-none"
          style={{ boxShadow: `inset 0 0 0 1.5px ${okAll ? K.green : K.orange}` }}
          aria-label="Try a password"
        />
        <ul className="mt-4 space-y-1.5 text-[12.5px]">
          {RULES.map((r) => {
            const ok = r.test(pw);
            return (
              <li key={r.label} className="flex items-center gap-2" style={{ color: ok ? K.green : "#9a9a9a" }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white" style={{ background: ok ? K.green : "#cfcfcf" }}>
                  {ok ? "✓" : "·"}
                </span>
                {r.label}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 py-2 rounded-[6px] text-center text-[13px] font-semibold text-white transition" style={{ background: okAll ? K.orange : "#c9c9c9" }}>
          Sign up
        </div>
      </div>
      <CodeCard file="website/auth.py · sign-up checks (excerpt)">
        {kw("elif")} password1 != password2:{"\n    "}
        {fn("flash")}({st("'Passwords don\\'t match'")}, category={st("'error'")}){"\n"}
        {kw("elif")} {fn("len")}(password1) &lt; {st("7")}:{"\n    "}
        {fn("flash")}({st("'Passwords must be at least 7 characters'")}, ...){"\n"}
        {kw("elif not any")}(char.{fn("isupper")}() {kw("for")} char {kw("in")} password1):{"\n    "}
        {fn("flash")}({st("'Password must contain at least 1 capital letter'")}, ...){"\n"}
        {kw("elif not any")}(char.{fn("isdigit")}() {kw("for")} char {kw("in")} password1):{"\n    "}
        {fn("flash")}({st("'Password must contain at least 1 digit'")}, ...){"\n"}
        {kw("elif not")} re.{fn("search")}({st("r'[!@#$%^&*()_+=...]$'")}, password1):{"\n    "}
        {fn("flash")}({st("'Password must contain at least 1 special character'")}, ...)
      </CodeCard>
    </div>
  );
}

export function EncryptionCode() {
  return (
    <CodeCard file="website/encryption.py">
      {kw("import")} nacl.secret{"\n"}
      {kw("import")} nacl.utils{"\n"}
      {kw("from")} nacl.encoding {kw("import")} Base64Encoder{"\n"}
      {cm("# Encryption methods")}
      {"\n\n"}
      {kw("def")} {fn("encrypt")}(message, key):{"\n    "}
      box = nacl.secret.{fn("SecretBox")}(key){"\n    "}
      encrypted = box.{fn("encrypt")}(message.{fn("encode")}(), encoder=Base64Encoder){"\n    "}
      {kw("return")} encrypted.{fn("decode")}({st("'utf-8'")}){"\n\n"}
      {kw("def")} {fn("decrypt")}(encrypted_message, key):{"\n    "}
      box = nacl.secret.{fn("SecretBox")}(key){"\n    "}
      decrypted = box.{fn("decrypt")}(encrypted_message.{fn("encode")}(), encoder=Base64Encoder){"\n    "}
      {kw("return")} decrypted.{fn("decode")}({st("'utf-8'")}){"\n\n"}
      {kw("def")} {fn("generate_key")}():{"\n    "}
      {kw("return")} nacl.utils.{fn("random")}(nacl.secret.SecretBox.KEY_SIZE)
    </CodeCard>
  );
}

/* ---------------- watercolour + pencil sketches ---------------- */
const GRAPHITE = "#4a4a52";
const HANDW = '"Reenie Beanie", "Bradley Hand", cursive';

function useSketchFont() {
  useEffect(() => {
    const id = "reenie-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap";
    document.head.appendChild(l);
  }, []);
}

/** Pencil line drawn twice with slight offsets, like a real sketch. */
const Pc = ({ d, w = 1.6, o = 0.85 }) => (
  <g fill="none" stroke={GRAPHITE} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} strokeWidth={w} opacity={o} />
    <path d={d} strokeWidth={w * 0.6} opacity={o * 0.5} transform="translate(1.2 0.8)" />
  </g>
);
const Hw = ({ x, y, s = 22, c = GRAPHITE, children, r = 0 }) => (
  <text x={x} y={y} fontFamily={HANDW} fontSize={s} fill={c} transform={r ? `rotate(${r} ${x} ${y})` : undefined}>
    {children}
  </text>
);
const Wash = ({ d, c = K.orange, o = 0.35 }) => <path d={d} fill={c} opacity={o} filter="url(#wc)" />;

export function KallosSketchbook({ theme }) {
  useSketchFont();
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[6px]" style={{ background: "#f7f1e6", boxShadow: "0 1px 0 #e7dcc8, 0 24px 50px -28px rgba(80,50,20,0.5)" }}>
        {/* paper fibres */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.3 0 0 0 0.25 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />
        {/* spiral binding */}
        <div className="absolute left-0 right-0 top-0 h-5 flex justify-around px-6">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="w-2.5 h-5 rounded-b-full" style={{ background: "linear-gradient(90deg,#8d8d93,#d9d9de,#8d8d93)" }} />
          ))}
        </div>
        <svg viewBox="0 0 1000 560" className="relative block w-full h-auto" role="img" aria-label="Pencil and watercolour sketches of Kallos screens">
          <defs>
            <filter id="wc" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="8" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="14" result="d" />
              <feGaussianBlur in="d" stdDeviation="1.4" />
            </filter>
            <filter id="pencil">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" />
              <feDisplacementMap in="SourceGraphic" scale="1.6" />
            </filter>
          </defs>

          <Hw x={50} y={70} s={44}>
            kallos — screen ideas
          </Hw>
          <Hw x={560} y={70} s={24} c="#9a8f80">
            feb 2024 · after the expert interviews
          </Hw>

          <g filter="url(#pencil)">
            {/* page 1: landing */}
            <Wash d="M60 120 h 270 v 60 h -270 z" c={K.orange} o={0.28} />
            <Pc d="M50 110 h 290 v 400 h -290 z" />
            <Hw x={70} y={160} s={30}>
              KALLOS.
            </Hw>
            <Hw x={70} y={190} s={20}>
              your expert in employer branding
            </Hw>
            <Pc d="M140 210 h 90 v 26 h -90 z" />
            <Hw x={158} y={229} s={18}>
              sign up
            </Hw>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Pc d={`M${66 + i * 92} 270 h 78 v 100 h -78 z`} w={1.3} />
                <Pc d={`M${74 + i * 92} 300 h 56 M${74 + i * 92} 316 h 40`} w={1} o={0.6} />
              </g>
            ))}
            <Hw x={66} y={400} s={18} c="#7a7066">
              analysis · solutions · benchmark
            </Hw>
            <Pc d="M66 430 h 258 M66 450 h 200" w={1} o={0.5} />

            {/* page 2: dashboard */}
            <Wash d="M420 200 l 70 -40 l 60 40 l -20 70 h -80 z" c={K.orange} o={0.32} />
            <Wash d="M640 300 h 220 v 120 h -220 z" c={K.teal} o={0.18} />
            <Pc d="M370 110 h 290 v 400 h -290 z" />
            <Pc d="M370 110 v 400 M420 110 v 400" w={1} o={0.4} />
            <Hw x={436} y={146} s={26}>
              dashboard
            </Hw>
            <Pc d="M490 165 l 60 42 l -24 72 h -72 l -24 -72 z" w={1.2} o={0.6} />
            <Pc d="M490 185 l 44 36 l -16 50 h -56 l -18 -54 z" />
            <Hw x={436} y={320} s={18} c="#7a7066">
              radar = perception
            </Hw>
            {[0, 1, 2, 3].map((i) => (
              <Pc key={i} d={`M${440 + i * 50} 470 v ${-40 - i * 18} h 30 v ${40 + i * 18}`} w={1.3} />
            ))}
            <Hw x={436} y={498} s={18} c="#7a7066">
              bars = recruitment channels
            </Hw>
            {[0, 1, 2, 3, 4].map((i) => (
              <Pc key={i} d={`M378 ${170 + i * 32} h 34`} w={1} o={0.5} />
            ))}

            {/* page 3: recommendations */}
            <Pc d="M690 110 h 280 v 400 h -280 z" />
            <Hw x={712} y={146} s={26}>
              recommendations
            </Hw>
            <Hw x={712} y={240} s={86} c={K.orange}>
              27
            </Hw>
            <Hw x={800} y={240} s={34}>
              /100
            </Hw>
            <Hw x={712} y={272} s={17} c="#7a7066">
              how is it calculated? ↓ show it!
            </Hw>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <Pc d={`M712 ${300 + i * 56} h 80 v 34 h -80 z`} w={1.3} />
                <Hw x={724} y={324 + i * 56} s={20}>
                  level {i + 1}
                </Hw>
                <Pc d={`M808 ${312 + i * 56} h 140 M808 ${326 + i * 56} h 100`} w={1} o={0.55} />
              </g>
            ))}
          </g>

          {/* margin notes */}
          <Hw x={360} y={545} s={22} c={K.orange} r={-1.5}>
            ← recommendations FIRST, metrics second
          </Hw>
          <Wash d="M700 470 h 250 v 30 h -250 z" c={K.yellow} o={0.45} />
          <Hw x={708} y={494} s={21}>
            advice in HR words, not AI words
          </Hw>
        </svg>
      </div>
      <figcaption className={`mt-3 flex gap-2 text-[13px] leading-snug ${theme.textSub}`}>
        <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: K.orange }} />
        Sketchbook pages: landing, dashboard and recommendations, in pencil with watercolour washes.
      </figcaption>
    </figure>
  );
}

/* ---------------- double diamond ---------------- */
const DD = [
  { phase: "Discover", c: K.orange, items: ["5 expert interviews", "Competitor analysis", "Desk research: branding, dashboards, privacy"] },
  { phase: "Define", c: K.indigo, items: ["Persona & empathy map", "6 product goals", "Requirements from research"] },
  { phase: "Develop", c: K.teal, items: ["Design flowchart & IA", "Lo-fi → hi-fi", "Design system & Flask build"] },
  { phase: "Deliver", c: K.green, items: ["2 testing rounds, 11 people", "Iterations", "Containerised prototype"] },
];

export function DoubleDiamond({ theme }) {
  return (
    <div>
      <svg viewBox="0 0 800 150" className="w-full h-auto" aria-hidden="true">
        {[0, 1].map((d) => (
          <g key={d} transform={`translate(${d * 400} 0)`}>
            <path d="M10 75 L200 10 L390 75 L200 140 Z" fill="none" stroke={theme.isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)"} strokeWidth="1.5" />
            <path d="M10 75 L200 10 L200 140 Z" fill={DD[d * 2].c} opacity="0.14" />
            <path d="M200 10 L390 75 L200 140 Z" fill={DD[d * 2 + 1].c} opacity="0.14" />
          </g>
        ))}
        {DD.map((p, i) => (
          <text key={p.phase} x={105 + i * 195} y="82" textAnchor="middle" fontFamily={POP} fontWeight="700" fontSize="17" fill={p.c}>
            {p.phase}
          </text>
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-2 @3xl:grid-cols-4 gap-4">
        {DD.map((p) => (
          <ul key={p.phase} className="space-y-1.5 text-[13.5px]">
            {p.items.map((it) => (
              <li key={it} className={`flex gap-2 ${theme.textBody}`}>
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.c }} />
                {it}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ---------------- survey upload (edge cases from the flowchart) ---------------- */
const FILES = [
  { name: "enps_q1_2024.csv", size: "1.2 MB", ok: true },
  { name: "candidate_survey.xlsx", size: "14.8 MB", err: "File exceeds the 10 MB limit." },
  { name: "retention_notes.pages", size: "0.4 MB", err: "Unsupported file format. Use .csv or .xlsx." },
];

export function UploadCard() {
  useFonts();
  const [state, setState] = useState({ file: null, status: "empty" });
  const pick = (f) => setState({ file: f, status: f.ok ? "done" : "error" });
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[1.1fr_1fr] gap-5 items-stretch">
      <div className="rounded-[16px] p-5 bg-white" style={{ fontFamily: POP, color: K.graphite, boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 16px 34px -22px rgba(120,60,20,0.35)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold">eNPS Survey</span>
          <span className="text-[10.5px] text-black/45">Max. file supported 10MB</span>
        </div>
        <div
          className="mt-3 h-24 rounded-[10px] flex flex-col items-center justify-center text-center text-[12px] transition-colors"
          style={{
            background: state.status === "error" ? "#fdeeee" : state.status === "done" ? "#e8f5ef" : "#fafafa",
            boxShadow: `inset 0 0 0 1.5px ${state.status === "error" ? K.red : state.status === "done" ? K.green : "#d6d6d6"}`,
            border: "none",
          }}
        >
          {state.status === "empty" && <span className="text-black/45">Drop a survey file, or try one of the examples →</span>}
          {state.file && (
            <>
              <span className="font-semibold">{state.file.name}</span>
              <span className="text-[11px] text-black/45">{state.file.size}</span>
              <span className="mt-1 font-semibold" style={{ color: state.status === "error" ? K.red : K.green }}>
                {state.status === "error" ? state.file.err : "✓ Uploaded. Added to your dashboard."}
              </span>
            </>
          )}
        </div>
        <div className="mt-3 flex gap-2 text-[12px] font-medium">
          <span className="px-3 py-1.5 rounded-[6px] text-white" style={{ background: K.orange }}>
            Upload
          </span>
          <span className="px-3 py-1.5 rounded-[6px]" style={{ boxShadow: "inset 0 0 0 1px #999", opacity: state.status === "done" ? 1 : 0.4 }}>
            Change
          </span>
          <button type="button" onClick={() => setState({ file: null, status: "empty" })} className="px-3 py-1.5 rounded-[6px]" style={{ color: K.red, boxShadow: `inset 0 0 0 1px ${K.red}`, opacity: state.file ? 1 : 0.4 }}>
            Delete
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60">Try a file</div>
        {FILES.map((f) => (
          <button
            key={f.name}
            type="button"
            onClick={() => pick(f)}
            className="flex items-center justify-between gap-3 rounded-[10px] px-4 py-2.5 text-left text-[13px] transition hover:-translate-y-0.5"
            style={{ background: "rgba(127,127,127,0.1)", boxShadow: state.file?.name === f.name ? `inset 0 0 0 1.5px ${K.orange}` : "none" }}
          >
            <span className="font-mono truncate">{f.name}</span>
            <span className="text-[11px] opacity-60 shrink-0">{f.size}</span>
          </button>
        ))}
        <p className="mt-1 text-[12px] opacity-60 leading-snug">Every branch from the design flowchart (file too big, wrong format, success, delete with confirmation) has a designed state.</p>
      </div>
    </div>
  );
}
