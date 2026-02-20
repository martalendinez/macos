// src/components/windows/About/components/PhotoLocation.jsx
export default function PhotoLocation({ styles, text = "Niagara Falls, CA" }) {
  return (
    <div className="absolute left-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition duration-200">
      <div className="relative group/location">
        <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs shadow-xl backdrop-blur-md ${styles.cardBg} border ${styles.cardBorder}`}>
          <span className={styles.textMain}>↗</span>
          <span className={`${styles.textMain} font-medium`}>{text}</span>
        </div>

        <div
          className={`pointer-events-none absolute left-0 -top-11 opacity-0 group-hover/location:opacity-100 transition duration-150 rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-md ${styles.cardBg} border ${styles.cardBorder} ${styles.textMain}`}
        >
          {text}
          <div
            className={`absolute left-4 -bottom-1 h-2 w-2 rotate-45 ${styles.cardBg} border-b ${styles.cardBorder} border-r ${styles.cardBorder}`}
          />
        </div>
      </div>
    </div>
  );
}