import ActionButton from "./ActionButton";

export default function NavButtons({
  styles,
  left,
  right,
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <div>
        {left ? (
          <ActionButton styles={styles} label={left.label} onClick={left.onClick} variant="secondary" />
        ) : (
          <div />
        )}
      </div>
      <div>
        {right ? (
          <ActionButton styles={styles} label={right.label} onClick={right.onClick} variant="primary" />
        ) : null}
      </div>
    </div>
  );
}