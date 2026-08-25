import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-3xl">Page not found</p>
      <p className="text-sm text-ink-soft">There's no entry for this page in the ledger.</p>
      <Link to="/" className="text-sm font-medium text-wire">
        Back to dashboard
      </Link>
    </div>
  );
}