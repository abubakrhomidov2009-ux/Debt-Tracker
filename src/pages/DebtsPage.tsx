import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import clsx from "clsx";
import {
  Plus,
  Calendar,
  ChevronRight,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { listDebts } from "../api/debts";
import { ApiError } from "../api/client";
import type { DebtDirection, DebtStatus } from "../types";
import { debtsAtom } from "../store/data";
import { AmountText } from "../components/AmountText";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Spinner, ErrorBanner } from "../components/Feedback";

const statusFilters: { value: DebtStatus | ""; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
];

const directionFilters: { value: DebtDirection | ""; label: string }[] = [
  { value: "", label: "Both directions" },
  { value: "they_owe_me", label: "They owe me" },
  { value: "i_owe_them", label: "I owe them" },
];

export function DebtsPage() {
  const [debts, setDebts] = useAtom(debtsAtom);
  const [status, setStatus] = useState<DebtStatus | "">("");
  const [direction, setDirection] = useState<DebtDirection | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listDebts({ status: status || undefined, direction: direction || undefined })
      .then((data) => !cancelled && setDebts(data))
      .catch((err) => !cancelled && setError(err instanceof ApiError ? err.message : "Couldn't load debts."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, direction]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Debts
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track borrowed and lent amounts across your contacts.
          </p>
        </div>
        <Link to="/debts/new">
          <Button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
            <Plus className="h-4 w-4" />
            <span>New debt</span>
          </Button>
        </Link>
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-1.5 pl-1 pr-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => {
            const isActive = status === f.value;
            return (
              <button
                key={f.value || "all"}
                onClick={() => setStatus(f.value)}
                className={clsx(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-500"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Direction Pills */}
        <div className="flex flex-wrap gap-1.5">
          {directionFilters.map((f) => {
            const isActive = direction === f.value;
            return (
              <button
                key={f.value || "both"}
                onClick={() => setDirection(f.value)}
                className={clsx(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-500"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorBanner message={error} />
      ) : debts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <EmptyState
            title="No debts match this filter"
            description="Try a different filter, or log a new debt to get started."
            action={
              <Link to="/debts/new">
                <Button className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                  <Plus className="h-4 w-4" />
                  <span>Add a debt</span>
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
          {debts.map((debt) => (
            <Link
              key={debt.id}
              to={`/debts/${debt.id}`}
              className="group flex items-center justify-between p-4 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                {/* Direction Visual Icon */}
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    debt.direction === "they_owe_me"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                  )}
                >
                  {debt.direction === "they_owe_me" ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {debt.description || "No description"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {debt.due_date ? `Due ${new Date(debt.due_date).toLocaleDateString()}` : "No due date"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <AmountText amount={debt.amount} currency={debt.currency} direction={debt.direction} size="sm" />
                <StatusBadge status={debt.status} />
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}