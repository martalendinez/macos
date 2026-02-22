// src/components/windows/Settings/components/PortfolioInfoSection.jsx
import { getTokens } from "../../../../ui/themeTokens";

export default function PortfolioInfoSection({ uiTheme = "glass", glassContrast = "light" }) {
  const { isMac, textMain, textSub, textStrong, softCard, divider, pillClass } =
    getTokens(uiTheme, glassContrast);

  const sectionTitle = isMac
    ? "text-sm font-semibold text-black/70"
    : "text-sm font-semibold text-white/70";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className={`text-2xl font-semibold ${textStrong}`}>About This Portfolio</h1>
        <p className={`${textSub} text-sm`}>
          Built as an interactive window-based system — not just a static website.
        </p>
      </div>

      {/* Tech stack */}
      <div className={`p-5 rounded-2xl border ${softCard}`}>
        <div className={sectionTitle}>Tech stack</div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className={pillClass}>React</span>
          <span className={pillClass}>Vite</span>
          <span className={pillClass}>Tailwind CSS</span>
          <span className={pillClass}>Framer Motion</span>
        </div>

        <p className={`${textMain} text-sm mt-4`}>
          Component-based UI built in React. Styling uses Tailwind plus theme tokens for consistent
          macOS/glass and light/dark behavior. Animations are powered by Framer Motion.
        </p>
      </div>

      {/* Inspiration */}
      <div className={`p-5 rounded-2xl border ${softCard}`}>
        <div className={sectionTitle}>Inspiration</div>
        <p className={`${textMain} text-sm mt-3`}>
          Inspired by macOS window systems, glassmorphism, and playful desktop-like navigation.
        </p>
      </div>

      {/* Deployment */}
      <div className={`p-5 rounded-2xl border ${softCard}`}>
        <div className={sectionTitle}>Deployment</div>
        <p className={`${textMain} text-sm mt-3`}>
          Production builds via Vite and deployed as a static app (e.g., Vercel/Netlify). Sharing
          uses Web Share when available and falls back to clipboard copy.
        </p>

        <div className={`h-px my-4 ${divider}`} />

        <p className={`${textSub} text-xs`}>
          Add your live URL + repo link here for extra credibility.
        </p>
      </div>
    </div>
  );
}