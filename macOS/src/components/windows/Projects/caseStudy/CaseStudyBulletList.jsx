export default function CaseStudyBulletList({ items }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {(items ?? []).map((x) => (
        <li key={x} className="flex gap-3">
          <span className="mt-[0.7em] w-1.5 h-1.5 rounded-full shrink-0 bg-[hsl(var(--accent))]" aria-hidden="true" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
