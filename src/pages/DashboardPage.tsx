import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  PieChart,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Wallet,
} from "lucide-react";
import { getDashboardSummary } from "../api/dashboard";
import { ApiError } from "../api/client";
import { dashboardAtom } from "../store/data";
import { AmountText } from "../components/AmountText";
import { StatusBadge } from "../components/StatusBadge";
import { Spinner, ErrorBanner } from "../components/Feedback";
import { EmptyState } from "../components/EmptyState";

const statMeta = {
  pending: {
    label: "Pending",
    icon: Clock,
    tone: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  partial: {
    label: "Partial",
    icon: PieChart,
    tone: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    tone: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
} as const;

export function DashboardPage() {
  const [summary, setSummary] = useAtom(dashboardAtom);
  const [loading, setLoading] = useState(!summary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDashboardSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load your dashboard.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !summary) return <Spinner label="Adding up the ledger…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!summary) return null;

  const netPositive = summary.outstanding.net_balance >= 0;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-slate-200/60 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{today}</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
      </header>

      {/* Main Ledger Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/60">
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
          {/* They owe me */}
          <div className="group relative p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                They owe me
              </p>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <AmountText
                amount={summary.outstanding.they_owe_me}
                currency=""
                size="xl"
                className="font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          {/* I owe them */}
          <div className="group relative p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="absolute top-0 inset-x-0 h-1 bg-rose-500 rounded-t-2xl sm:rounded-tl-none" />
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <ArrowUpRight className="h-4 w-4 text-rose-500" />
                I owe them
              </p>
              <div className="rounded-full bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <AmountText
                amount={summary.outstanding.i_owe_them}
                currency=""
                size="xl"
                className="font-bold text-rose-600 dark:text-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Net Balance Banner */}
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/40">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net balance
            </p>
            <p
              className={`tabular-money font-display text-3xl font-extrabold tracking-tight ${
                netPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {netPositive ? "+" : "−"}
              {Math.abs(summary.outstanding.net_balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center self-start sm:self-center rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs ${
              netPositive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
            }`}
          >
            {netPositive ? "You're ahead" : "You're behind"}
          </span>
        </div>
      </section>

      {/* Status Counters */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(["pending", "partial", "paid"] as const).map((key) => (
          <StatChip key={key} status={key} value={summary.counts[key]} />
        ))}
      </section>

      {/* Upcoming Due List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Upcoming due
          </h2>
          <Link
            to="/debts"
            className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>View all</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {summary.upcoming_due.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <EmptyState
              title="Nothing due soon"
              description="Debts with a due date will line up here as it approaches."
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {summary.upcoming_due.map((item) => (
              <Link
                key={item.id}
                to={`/debts/${item.id}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-500/50"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400">
                    {item.contact_name.trim()[0]?.toUpperCase() ?? "?"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.contact_name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {item.due_date
                        ? new Date(item.due_date).toLocaleDateString()
                        : "No due date"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <AmountText
                    amount={item.amount}
                    currency={item.currency}
                    direction={item.direction}
                    size="sm"
                  />
                  <StatusBadge status={item.status} />
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatChip({
  status,
  value,
}: {
  status: keyof typeof statMeta;
  value: number;
}) {
  const meta = statMeta[status];
  const Icon = meta.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {meta.label}
        </p>
        <p className="tabular-money font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
      <div className={`rounded-xl p-3 ${meta.bg} ${meta.tone}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}