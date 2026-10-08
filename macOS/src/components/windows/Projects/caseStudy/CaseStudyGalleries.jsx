export function Gallery2({ a, b }) {
  return <div className="mt-10 grid grid-cols-1 @4xl:grid-cols-2 gap-x-6 gap-y-8 items-start">{a}{b}</div>;
}

export function Gallery3({ a, b, c }) {
  return <div className="mt-10 grid grid-cols-1 @2xl:grid-cols-3 gap-x-6 gap-y-8 items-start">{a}{b}{c}</div>;
}
