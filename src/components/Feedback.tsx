export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-debit/30 bg-debit-soft px-4 py-3 text-sm text-debit">
      {message}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </div>
  );
}