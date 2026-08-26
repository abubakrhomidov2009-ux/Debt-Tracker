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
  TrendingUp,
  TrendingDown,
  Sparkles,
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
    tone: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-500/20",
  },
  partial: {
    label: "Partial",
    icon: PieChart,
    tone: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-500/20",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    tone: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-500/20",
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
    <div className="relative min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-8">
      {/* Background Glow Overlay */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-full -translate-x-1/2 bg-gradient-to-b from-indigo-500/10 via-slate-900/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{today}</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm sm:self-auto">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ledger Overview</span>
          </div>
        </header>

        {/* Main Ledger Section - Split Card Layout */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* They Owe Me Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ArrowDownLeft className="h-4 w-4" />
                They owe me
              </span>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <AmountText
                amount={summary.outstanding.they_owe_me}
                currency=""
                size="xl"
                className="font-display text-3xl font-bold text-emerald-400"
              />
            </div>
          </div>

          {/* I Owe Them Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-950/30">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                <ArrowUpRight className="h-4 w-4" />
                I owe them
              </span>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-400 transition-transform duration-300 group-hover:scale-110">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <AmountText
                amount={summary.outstanding.i_owe_them}
                currency=""
                size="xl"
                className="font-display text-3xl font-bold text-rose-400"
              />
            </div>
          </div>

          {/* Net Balance Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Net balance
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                  netPositive
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                }`}
              >
                {netPositive ? (
                  <>
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Ahead</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>Behind</span>
                  </>
                )}
              </span>
            </div>
            <div className="mt-4">
              <p
                className={`tabular-money font-display text-4xl font-black tracking-tight ${
                  netPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {netPositive ? "+" : "−"}
                {Math.abs(summary.outstanding.net_balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Status Counters */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["pending", "partial", "paid"] as const).map((key) => (
            <StatChip key={key} status={key} value={summary.counts[key]} />
          ))}
        </section>

        {/* Upcoming Due Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-white">
              Upcoming due
            </h2>
            <Link
              to="/debts"
              className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 transition-colors hover:text-indigo-300"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {summary.upcoming_due.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-8 text-center backdrop-blur-sm">
              <EmptyState
                title="Nothing due soon"
                description="Debts with a due date will line up here as it approaches."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {summary.upcoming_due.map((item) => (
                <Link
                  key={item.id}
                  to={`/debts/${item.id}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-md backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800 font-bold text-indigo-400 shadow-inner transition-colors group-hover:border-indigo-500/50 group-hover:bg-indigo-950/50">
                      {item.contact_name.trim()[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div>
                      <p className="font-semibold text-white transition-colors group-hover:text-indigo-300">
                        {item.contact_name}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
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
                    <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
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
    <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/70">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {meta.label}
        </p>
        <p className="tabular-money font-display text-3xl font-extrabold text-white">
          {value}
        </p>
      </div>
      <div className={`rounded-xl border p-3 ${meta.bg} ${meta.tone}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}