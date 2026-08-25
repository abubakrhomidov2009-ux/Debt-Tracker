import clsx from "clsx";
import type { DebtStatus } from "../types";

const config: Record<DebtStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-stamp text-stamp",
  },
  partial: {
    label: "Partial",
    className: "border-wire text-wire",
  },
  paid: {
    label: "Paid",
    className: "border-credit text-credit",
  },
};

export function StatusBadge({ status }: { status: DebtStatus }) {
  const { label, className } = config[status];
  return <span className={clsx("stamp", className)}>{label}</span>;
}