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

        {/* Accent chips */}
<div className="flex flex-wrap gap-2 mt-3">
  {["React", "Vite", "Tailwind CSS", "Framer Motion"].map((t) => (
    <span
      key={t}
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        "ring-1 ring-inset",
        // accent
        "bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] ring-[hsl(var(--accent)/0.22)]",
        // a tiny bit of depth for glass
        uiTheme === "glass" ? "backdrop-blur-md shadow-sm" : "",
      ].join(" ")}
    >
      {t}
    </span>
  ))}
</div>

        <p className={`${textMain} text-sm mt-4`}>
          Component-based UI built in React. Styling uses Tailwind plus theme tokens for consistent
          macOS/glass and light/dark behavior. Animations are powered by Framer Motion.
        </p>
      </div>

    {/* Inspiration */}
<div className={`p-5 rounded-2xl border ${softCard}`}>
  <div className={sectionTitle}>Inspiration</div>

  <div className={`${textMain} text-sm mt-3 space-y-3`}>
    <p>
      Before defining my own visual language, I explored several portfolios to understand how other designers communicate their identity. These three stood out the most:
    </p>

    <ul className="list-disc pl-5 space-y-2">
      <li>
        <span className="font-medium">Dustin Breet</span> — One of my biggest inspirations was Dustin Breet, who created a full Windows‑style portfolio filled with apps, videos, and interactive windows.  
        <br />
        <span className="text-xs opacity-80">Link: https://dustinbrett.com</span>
      </li>

      <li>
        <span className="font-medium">You Zhang</span> — I was also inspired by You Zhang, who built a macOS‑style portfolio with beautifully crafted motion design. Their attention to transitions and interaction flow had a huge influence on how I approached movement in my own work.  
        <br />
        <span className="text-xs opacity-80">https://atom63.io</span>
      </li>

      <li>
        <span className="font-medium">Aakash Sharma</span> — Another designer who really inspired me took the macOS concept even further by recreating an entire desktop filled with functional mini‑apps — things like a VS Code window, a Spotify player, and other playful system elements. 
        <br />
        <span className="text-xs opacity-80">https://aakash-sharma.vercel.app</span>
      </li>
    </ul>
  </div>
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
      {/* Version & roadmap */}
<div className={`p-5 rounded-2xl border ${softCard}`}>
  <div className="flex items-center justify-between">
    <div className={sectionTitle}>Version</div>

    {/* Accent version badge */}
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        "ring-1 ring-inset",
        "bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] ring-[hsl(var(--accent)/0.25)]",
      ].join(" ")}
    >
      v1.0
    </span>
  </div>

  <p className={`${textSub} text-xs mt-2`}>
    Last updated: February 2026
  </p>

  <div className={`h-px my-4 ${divider}`} />

  <div className="space-y-2">
    <div className={sectionTitle}>What’s next</div>

    <ul className={`${textMain} text-sm space-y-2 list-disc pl-5`}>
      <li>Write later</li>
      <li>Write later</li>
      <li>Write later</li>
    </ul>
  </div>
</div>
    </div>
  );
}