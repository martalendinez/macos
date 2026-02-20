// src/components/windows/About/components/FormFields.jsx
export function Input({ styles, label, placeholder }) {
  return (
    <label className="block">
      <div className={`${styles.textSub} text-xs mb-1`}>{label}</div>
      <input
        placeholder={placeholder}
        className={`w-full rounded-xl px-3 py-2 text-sm outline-none border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
      />
    </label>
  );
}

export function Textarea({ styles, label, placeholder }) {
  return (
    <label className="block">
      <div className={`${styles.textSub} text-xs mb-1`}>{label}</div>
      <textarea
        placeholder={placeholder}
        rows={4}
        className={`w-full rounded-xl px-3 py-2 text-sm outline-none resize-none border ${styles.cardBorder} ${styles.cardBgSoft} ${styles.textMain} ${styles.inputFocus}`}
      />
    </label>
  );
}

export function QuickBtn({ styles, label }) {
  return (
    <button type="button" className={`rounded-xl px-3 py-2 text-sm transition ${styles.btn}`}>
      {label}
    </button>
  );
}