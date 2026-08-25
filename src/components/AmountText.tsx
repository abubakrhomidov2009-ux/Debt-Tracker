import clsx from "clsx";
import type { DebtDirection } from "../types";

interface AmountTextProps {
  amount: number;
  currency: string;
  direction?: DebtDirection;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-4xl",
};

export function AmountText({
  amount,
  currency,
  direction,
  size = "md",
  className,
}: AmountTextProps) {
  const sign = direction === "i_owe_them" ? "−" : direction ? "+" : "";
  const colorClass =
    direction === "they_owe_me"
      ? "text-credit"
      : direction === "i_owe_them"
        ? "text-debit"
        : "text-ink dark:text-ink-dark";

  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span
      className={clsx(
        "tabular-money font-medium",
        sizeClasses[size],
        colorClass,
        className,
      )}
    >
      {sign}
      {formatted}
      {currency ? ` ${currency}` : ""}
    </span>
  );
}