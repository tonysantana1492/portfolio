const SKELETON_KEYS = [
  "line-1",
  "line-2",
  "line-3",
  "line-4",
  "line-5",
  "line-6",
  "line-7",
  "line-8",
  "line-9",
  "line-10",
  "line-11",
  "line-12",
  "line-13",
];

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div className="screen-line-before screen-line-after">
        <div className="before:-left-[100vw] before:-z-1 h-8 before:absolute before:h-full before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56" />
      </div>

      <div className="mt-6">
        <div className="screen-line-after mb-4 h-10 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="mb-6 space-y-2">
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-11/12 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-5/6 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="space-y-2 pl-2">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="space-y-3">
        {SKELETON_KEYS.slice(0, 10).map((key) => (
          <div
            key={key}
            className="h-4 w-full animate-pulse rounded bg-muted"
          />
        ))}
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
      </div>

      <div className="screen-line-before mt-6 h-4 w-full" />
    </div>
  );
}
