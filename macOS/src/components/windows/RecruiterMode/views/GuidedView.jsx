// src/components/windows/RecruiterMode/views/GuidedView.jsx
function ProgressBar({ styles, value }) {
  return (
    <div className={`h-2 w-full rounded-full border ${styles.cardBorder} ${styles.cardBgSoft} overflow-hidden`}>
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: "hsl(var(--accent))", opacity: 0.9 }}
      />
    </div>
  );
}

function Chip({ styles, children }) {
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain}`}>
      {children}
    </span>
  );
}

function SectionLabel({ styles, children }) {
  return <div className={`${styles.textSub} text-[11px] tracking-wide uppercase`}>{children}</div>;
}

function FeaturedCard({ styles, item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.windowId)}
      className={`group w-full text-left rounded-2xl border ${styles.cardBorder} ${styles.softCard} p-4 transition hover:scale-[1.01] active:scale-[0.99]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`${styles.textMain} font-semibold leading-snug`}>{item.title}</div>
        <div className={`shrink-0 text-xs ${styles.textSub} opacity-70 group-hover:opacity-100 transition`} aria-hidden="true">
          ↗
        </div>
      </div>

      {item.subtitle ? <div className={`${styles.textSub} text-sm mt-2 leading-snug`}>{item.subtitle}</div> : null}
      <div className={`${styles.textSub} text-xs mt-3 opacity-80`}>Open</div>
    </button>
  );
}

export default function GuidedView({
  styles,
  stepData,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onOpenWindow,
}) {
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="space-y-5">
      <ProgressBar styles={styles} value={progress} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          {stepData.kicker ? <SectionLabel styles={styles}>{stepData.kicker}</SectionLabel> : null}
          <div className={`${styles.textMain} text-[22px] sm:text-2xl font-semibold leading-tight`}>
            {stepData.title}
          </div>
        </div>

        <div className={`${styles.textSub} text-xs whitespace-nowrap`}>
          {stepIndex + 1} / {totalSteps}
        </div>
      </div>

      {stepData.chips?.length ? (
        <div className="flex flex-wrap gap-2">
          {stepData.chips.map((c) => (
            <Chip key={c} styles={styles}>
              {c}
            </Chip>
          ))}
        </div>
      ) : null}

      {stepData.body?.length ? (
        <div className="space-y-2">
          {stepData.body.map((line, idx) => (
            <div key={idx} className={`${styles.textMain} text-sm leading-relaxed whitespace-pre-wrap`}>
              {line}
            </div>
          ))}
        </div>
      ) : null}

      {stepData.featured?.length ? (
        <div className="space-y-2">
          <SectionLabel styles={styles}>Best signals</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stepData.featured.map((it) => (
              <FeaturedCard key={it.windowId} styles={styles} item={it} onOpen={onOpenWindow} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Minimal controls */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className={`rounded-xl px-3 py-2 text-xs border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenWindow?.("projects")}
            className={`rounded-xl px-3 py-2 text-xs border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
          >
            Open Projects
          </button>

          <button
            type="button"
            onClick={onNext}
            className={`${styles.buttonClass} rounded-xl px-3 py-2 text-xs font-medium`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}