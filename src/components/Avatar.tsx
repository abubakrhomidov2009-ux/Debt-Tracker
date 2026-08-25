import clsx from "clsx";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

// Deterministic pastel-ish tint per name so the same contact always gets
// the same avatar color across the app.
const tints = [
  "bg-wire-soft text-wire",
  "bg-credit-soft text-credit",
  "bg-debit-soft text-debit",
  "bg-stamp-soft text-stamp",
];

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % tints.length;
  return tints[hash];
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-medium",
        tintFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}