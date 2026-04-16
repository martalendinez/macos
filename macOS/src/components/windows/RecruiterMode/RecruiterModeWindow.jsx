import { useMemo, useState } from "react";
import { getTokens } from "../../../ui/themeTokens";
import WindowFrame from "./components/WindowFrame";
import Hero from "../../../imgs/avatar/model1.jpeg";
import PhotoLocation from "../About/components/PhotoLocation";


const EMAIL = "casandra.lendinez@outlook.com";
const HERO_IMG = Hero;

/* ---------------------- */
/* Accent Chip */
/* ---------------------- */
function Chip({ children }) {
  return (
    <span
      className={[
        "text-[11px] px-2.5 py-1 rounded-full border",
        "text-[hsl(var(--accent))]",
        "border-[hsl(var(--accent)/0.35)]",
        "bg-[hsl(var(--accent)/0.10)]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/* ---------------------- */
function SectionTitle({ styles, children }) {
  return <div className={`${styles.textMain} text-sm font-semibold`}>{children}</div>;
}

/* ---------------------- */
/* Project Card */
/* ---------------------- */
function ProjectCard({ styles, title, subtitle, bullets = [], badge, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "group w-full h-full text-left rounded-2xl p-5 transition",
        "hover:scale-[1.01] active:scale-[0.99]",
        "flex flex-col",
        styles.cardBorder,
        styles.softCard,
      ].join(" ")}
    >
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start min-h-[120px]">
        <div className="min-w-0">
          <div className={`${styles.textMain} font-semibold leading-snug`}>
            {title}
          </div>

          {badge && (
            <div className="mt-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain}`}
              >
                {badge}
              </span>
            </div>
          )}

          {subtitle && (
            <div className={`${styles.textSub} text-sm mt-3 leading-snug`}>
              {subtitle}
            </div>
          )}
        </div>

        <div
          className={`text-xs ${styles.textSub} opacity-70 group-hover:opacity-100 transition pt-1`}
          aria-hidden="true"
        >
          ↗
        </div>
      </div>

      {bullets.length > 0 ? (
        <ul className="mt-4 space-y-1.5 flex-1">
          {bullets.map((b, i) => (
            <li key={i} className={`${styles.textMain} text-sm leading-relaxed`}>
              <span className={`${styles.textSub}`}>• </span>
              {b}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}
    </button>
  );
}

/* ---------------------- */
/* Buttons */
/* ---------------------- */
function SmallButton({ styles, label, onClick, variant = "secondary" }) {
  const base =
    "rounded-xl px-3 py-2 text-xs font-medium transition active:scale-[0.99]";
  const accentHover =
    "hover:ring-1 hover:ring-[hsl(var(--accent)/0.45)] hover:bg-[hsl(var(--accent)/0.08)]";

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${styles.buttonClass} ${base} ${accentHover}`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus} ${accentHover}`}
    >
      {label}
    </button>
  );
}

/* ---------------------- */
/* Main Component */
/* ---------------------- */
export default function RecruiterModeWindow({
  uiTheme = "glass",
  glassContrast = "light",
  onOpenWindow,
}) {
  const t = getTokens(uiTheme, glassContrast);

  const styles = useMemo(() => {
    const isMac = t.isMac;
    return {
      textMain: t.textMain,
      textSub: t.textSub,
      pageBg: isMac ? "bg-transparent" : "",
      cardBg: t.pageCard,
      softCard: t.softCard,
      cardBorder: t.cardBorder,
      cardBgSoft: t.cardBgSoft,
      inputFocus: t.inputFocus,
      buttonClass: t.buttonClass,
    };
  }, [t, glassContrast]);

  const [copied, setCopied] = useState(false);

  function openWindowSafe(id) {
    if (!id) return;
    onOpenWindow?.(id);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <WindowFrame styles={styles}>
      {/* ---------------- TWO-COLUMN LAYOUT ---------------- */}
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        
        {/* LEFT COLUMN (VERTICAL CONTENT) */}
        <div className="flex flex-col gap-8">
          
          {/* TEXT BLOCK */}
          <div className="space-y-3">
            <div className={`${styles.textSub} text-[11px] tracking-wide uppercase`}>
              UX Engineer • Stockholm • KTH
            </div>

            <div className={`${styles.textMain} text-4xl font-semibold leading-tight`}>
              Marta Lendínez
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Chip>UX Engineer</Chip>
              <Chip>Research → UI</Chip>
              <Chip>React</Chip>
              <Chip>Design Systems</Chip>
            </div>
          </div>

          {/* PROJECTS (VERTICAL STACK) */}
          <div className="space-y-3">
            <SectionTitle styles={styles}>Highlighted work</SectionTitle>

            {/* SHORTENED PROJECT CARD 2 */}
            <ProjectCard
              styles={styles}
              badge="Graduation Internship"
              title="AI platform for employer‑branding analysis"
              subtitle="Turned manual branding audits into a scalable, automated analysis platform."
              onOpen={() => openWindowSafe("employerBrandingCaseStudy")}
            />

            {/* SHORTENED PROJECT CARD 1 */}
            <ProjectCard
              styles={styles}
              badge="Personal Project"
              title="Group Dining Coordination Platform)"
              subtitle=" A web-based platform that helps groups coordinate restaurant outings by aligning
              availability, dietary needs, and preferences."
              onOpen={() => openWindowSafe("groupDiningCaseStudy")}
            />

            
          </div>


       
        </div>

   {/* RIGHT COLUMN — IMAGE */}
<div className="flex justify-end">
  <div className="group relative w-full max-w-[420px] rounded-2xl overflow-hidden">
    <img
      src={HERO_IMG}
      alt="Portrait"
      className="w-full h-[520px] object-cover"
    />

    {/* White hover tag with arrow — same as OverviewTab */}
    <PhotoLocation styles={styles} text="Valencia, ES" />
  </div>
</div>

      </div>
    </WindowFrame>
  );
}
