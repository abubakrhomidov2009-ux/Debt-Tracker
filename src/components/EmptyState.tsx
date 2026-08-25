import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/15 px-6 py-14 text-center dark:border-ink-dark/15">
      <p className="font-display text-lg text-ink dark:text-ink-dark">{title}</p>
      <p className="max-w-xs text-sm text-ink-soft">{description}</p>
      {action}
    </div>
  );
}