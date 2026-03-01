export default function ActionButton({ label, styles, onClick, variant = "primary" }) {
  const base =
    "w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99]";
  const primary = `${styles.buttonClass}`;
  const secondary = `border ${styles.cardBorder} ${styles.softCard} ${styles.textMain}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variant === "primary" ? primary : secondary}`}
    >
      {label}
    </button>
  );
}