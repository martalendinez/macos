// src/components/windows/RecruiterMode/components/WindowFrame.jsx

export default function WindowFrame({ styles, children }) {
  return (
    <div className={`w-full ${styles.pageBg}`}>
      <div className={`rounded-2xl border ${styles.cardBorder} ${styles.cardBg}`}>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}