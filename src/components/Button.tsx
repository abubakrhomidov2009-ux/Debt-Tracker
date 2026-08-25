import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-wire text-white hover:bg-wire/90 disabled:bg-wire/50",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-ink/40 dark:text-ink-dark dark:border-ink-dark/20 dark:hover:border-ink-dark/40",
  ghost:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-ink/5 dark:hover:text-ink-dark dark:hover:bg-ink-dark/5",
  danger: "bg-debit text-white hover:bg-debit/90 disabled:bg-debit/50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, className, children, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed",
          variantClasses[variant],
          className,
        )}
        {...rest}
      >
        {loading && (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";