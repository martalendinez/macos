import { motion } from "framer-motion";
import useProjectStyles from "./ui/useProjectStyles";

export default function BehindTheButtonWindow({ uiTheme = "glass" }) {
  // Use the same style system as projects so it stays consistent
  const styles = useProjectStyles(uiTheme, "projects");

  const sectionTitle = styles.isMac ? "text-black/80" : "text-white/90";

  return (
    <div className={`h-full w-full ${styles.isMac ? "bg-transparent" : ""}`}>
      <div className="h-full overflow-y-auto p-6">
        <motion.div
          className={`rounded-2xl p-6 shadow-sm ${styles.cardClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={`text-2xl font-semibold ${styles.textMain}`}>Behind the Button</div>
              <div className={`mt-1 text-sm ${styles.textSub}`}>
                A platform that teaches privacy and consent through interactive, realistic mini-scenarios.
              </div>

              <div className={`mt-3 text-xs ${styles.textSub}`}>
                <span className="font-semibold" style={{ color: "hsl(var(--accent))" }}>
                  WIP
                </span>{" "}
                — This is a draft concept / to-do project.
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 grid grid-cols-1 @4xl:grid-cols-2 gap-4">
            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>Target users</div>
              <ul className={`mt-2 space-y-2 text-sm ${styles.textMain}`}>
                <li className="flex gap-2">
                  <span className={`${styles.textSub}`}>•</span>
                  <span>High school students (15–19) who use apps daily but lack a mental model of data flows.</span>
                </li>
              </ul>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>Core promise</div>
              <div className={`mt-2 text-sm ${styles.textMain}`}>
                “Clicking buttons is not neutral. Learn what you are agreeing to, in 2 minutes.”
              </div>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass} @4xl:col-span-2`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>
                The learning experience (modern, not like school)
              </div>
              <ul className={`mt-2 space-y-2 text-sm ${styles.textMain}`}>
                <li className="flex gap-2">
                  <span className={`${styles.textSub}`}>•</span>
                  <span>Micro-lessons (2–4 min each): cookies banner, app permissions, sign-in, etc.</span>
                </li>
                <li className="flex gap-2">
                  <span className={`${styles.textSub}`}>•</span>
                  <span>Interactive “what just happened?” playback after each click:</span>
                </li>
                <li className={`ml-5 ${styles.textSub} text-sm`}>
                  – what data was requested<br />
                  – who gets it (first party vs third party)<br />
                  – what it’s used for (ads, analytics, personalization)<br />
                  – what choices exist (and where they’re hidden)
                </li>
                <li className="flex gap-2">
                  <span className={`${styles.textSub}`}>•</span>
                  <span>
                    “Translate to plain language” policy viewer: highlight a sentence → rewrite + why it matters + risk level
                    (low/medium/high) with reasoning.
                  </span>
                </li>
              </ul>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>6 lesson modules (MVP)</div>
              <ul className={`mt-2 space-y-2 text-sm ${styles.textMain}`}>
                {[
                  "Cookies 101: “Accept all” vs “Manage” vs “Reject”",
                  "Permissions: location, contacts, photos, microphone — necessary vs extra?",
                  "Tracking: “Allow app to track” and what “tracking” means",
                  "Single Sign-On: “Continue with Google/Apple” and what gets shared",
                  "Data rights: download data, delete account, “delete” vs “deactivate”",
                  "Dark patterns: confusing toggles, guilt copy, forced consent",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className={`${styles.textSub}`}>•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>Signature interactions</div>
              <ul className={`mt-2 space-y-2 text-sm ${styles.textMain}`}>
                {[
                  "Data X-ray mode: hover/tap reveals invisible data collection layers on a UI",
                  "Receipt after every click: a “consent receipt” listing what you agreed to",
                  "Choice coach: fastest privacy-respecting path without shaming the user",
                  "Before/after simulation: how the feed changes when tracking is on vs off",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className={`${styles.textSub}`}>•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>Prototype scope</div>
              <div className={`mt-2 text-sm ${styles.textMain}`}>
                Clickable prototype (~12–18 screens): home lesson cards → simulated app screen → decision point →
                replay/data map → plain-language policy viewer → quick quiz/reflection → progress profile (non-judgy).
              </div>
            </div>

            <div className={`rounded-2xl p-5 ${styles.cardClass}`}>
              <div className={`text-sm font-semibold ${sectionTitle}`}>Research plan</div>
              <ul className={`mt-2 space-y-2 text-sm ${styles.textMain}`}>
                {[
                  "5 short interviews: “What do you think cookies are?”",
                  "5 usability tests with the prototype: can they explain what happened after clicking?",
                  "Success metrics: comprehension, confidence (self-rated), choice quality (find “manage settings” without help).",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className={`${styles.textSub}`}>•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="h-6" />
      </div>
    </div>
  );
}