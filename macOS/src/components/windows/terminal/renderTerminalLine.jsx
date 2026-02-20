// src/components/windows/terminal/renderTerminalLine.jsx
export default function renderTerminalLine({ line, i, styles }) {
  if (typeof line === "string") {
    return (
      <div key={i} className={line === "" ? "select-none" : ""}>
        {line === "" ? "\u00A0" : line}
      </div>
    );
  }

  const t = line?.type;

  if (t === "prompt") {
    return (
      <div key={i} className="break-words">
        <span className="select-none" style={{ color: "hsl(var(--accent))" }}>
          marta@portfolio ~ %
        </span>
        <span className="select-none"> </span>
        <span>{line.text.replace("marta@portfolio ~ % ", "")}</span>
      </div>
    );
  }

  if (t === "cmd") {
    return (
      <div key={i} className="flex gap-3">
        <span className="w-[92px]" style={{ color: "hsl(var(--accent))" }}>
          {line.cmd}
        </span>
        <span className={styles.textDim}>{line.desc}</span>
      </div>
    );
  }

  if (t === "title") return <div key={i} className="font-semibold">{line.text}</div>;

  if (t === "accent") {
    return (
      <div key={i} style={{ color: "hsl(var(--accent))" }}>
        {line.text}
      </div>
    );
  }

  if (t === "dim") return <div key={i} className={styles.textDim}>{line.text}</div>;

  if (t === "warn") {
    return (
      <div key={i} className={styles.textDim}>
        <span style={{ color: "hsl(var(--accent))" }}>⚠ </span>
        {line.text}
      </div>
    );
  }

  if (t === "error") {
    return (
      <div key={i} className={styles.textDim}>
        <span style={{ color: "hsl(var(--accent))" }}>✕ </span>
        {line.text}
      </div>
    );
  }

  return (
    <div key={i} className={styles.textDim}>
      {String(line?.text ?? "")}
    </div>
  );
}