// src/components/windows/About/components/ActionButton.jsx
export default function ActionButton({ styles, icon, label, onClick, href, download }) {
  const className = `rounded-xl px-4 py-3 text-sm transition flex items-center gap-2 ${styles.btnPrimary}`;

  if (href) {
    return (
      <a href={href} download={download ? "" : undefined} className={className}>
        <span>{icon}</span>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}