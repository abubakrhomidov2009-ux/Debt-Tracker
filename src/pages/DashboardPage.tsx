import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import {
  Clock,
  PieChart,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Radio,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShieldCheck,
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
    bg: "bg-amber-500/10 border-amber-500/30",
    glow: "shadow-amber-500/10",
  },
  partial: {
    label: "Partial",
    icon: PieChart,
    tone: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    glow: "shadow-cyan-500/10",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    tone: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    glow: "shadow-emerald-500/10",
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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate percentage weight for the custom HUD visual balance bar
  const totalVolume =
    (summary.outstanding.they_owe_me || 0) + (summary.outstanding.i_owe_them || 0);
  const oweMeRatio = totalVolume > 0 ? (summary.outstanding.they_owe_me / totalVolume) * 100 : 50;

  return (
    <div className="relative min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-8 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background HUD Matrix Grid Effect */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-10">
        {/* Top Control Header */}
        <header className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80 p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400/90">
                  Live Telemetry
                </span>
                <span className="text-slate-700">•</span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{today}</span>
                </div>
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                Command Bridge
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Sync Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Central Core Ledger HUD */}
        <section className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Capital Flow Balance</span>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                netPositive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-400"
              }`}
            >
              {netPositive ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>SURPLUS</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>DEFICIT</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Incoming Flow */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ArrowDownLeft className="h-4 w-4" />
                <span>Receivables (They Owe Me)</span>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 backdrop-blur-md">
                <AmountText
                  amount={summary.outstanding.they_owe_me}
                  currency=""
                  size="xl"
                  className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400"
                />
              </div>
            </div>

            {/* Net Balance Center Ring/Stat */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 text-center rounded-2xl border border-slate-800 bg-slate-950/80">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
                Net Position
              </span>
              <p
                className={`tabular-money mt-2 font-display text-4xl sm:text-5xl font-black tracking-tight ${
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

            {/* Outgoing Flow */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-end gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                <span>Payables (I Owe Them)</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 text-right backdrop-blur-md">
                <AmountText
                  amount={summary.outstanding.i_owe_them}
                  currency=""
                  size="xl"
                  className="font-display text-3xl sm:text-4xl font-extrabold text-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Holographic Balance Bar */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Assets ({oweMeRatio.toFixed(0)}%)</span>
              <span>Liabilities ({(100 - oweMeRatio).toFixed(0)}%)</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(Math.max(oweMeRatio, 5), 95)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Status Counters */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["pending", "partial", "paid"] as const).map((key) => (
            <StatChip key={key} status={key} value={summary.counts[key]} />
          ))}
        </section>

        {/* REDESIGNED: High-Tech Settlement Timeline Section */}
        <section className="space-y-6">
          {/* Timeline Section Header */}
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Activity className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-black tracking-tight text-white">
                    Upcoming Due
                  </h2>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                    {summary.upcoming_due.length} QUEUED
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Real-time maturity sequence & settlement priority
                </p>
              </div>
            </div>

            <Link
              to="/debts"
              className="group inline-flex items-center gap-2 self-start sm:self-auto rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <span>Full Ledger</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Timeline Items Stream */}
          {summary.upcoming_due.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center backdrop-blur-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-500">
                <ShieldCheck className="h-6 w-6 text-emerald-400/80" />
              </div>
              <EmptyState
                title="All Clear on Horizon"
                description="No upcoming maturities detected. Debts with due dates will populate here automatically."
              />
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Glowing vertical connector line for desktop timeline feel */}
              <div className="absolute top-6 bottom-6 left-6 hidden w-0.5 bg-gradient-to-b from-cyan-500/50 via-slate-800 to-transparent lg:block" />

              {summary.upcoming_due.map((item, idx) => {
                const dueDateObj = item.due_date ? new Date(item.due_date) : null;
                const isImminent =
                  dueDateObj &&
                  (dueDateObj.getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 7;

                return (
                  <Link
                    key={item.id}
                    to={`/debts/${item.id}`}
                    className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-950/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Left Holographic Accent Bar on Hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Contact & Date Telemetry */}
                    <div className="flex items-center gap-4">
                      {/* Sequence Number Badge */}
                      <span className="hidden font-mono text-xs font-bold text-slate-600 transition-colors group-hover:text-cyan-400 lg:block">
                        0{idx + 1}
                      </span>

                      {/* Avatar Node */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800 to-slate-950 font-display text-base font-bold text-cyan-300 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-500/50">
                        {item.contact_name.trim()[0]?.toUpperCase() ?? "?"}
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 bg-slate-800 text-[9px]">
                          {item.direction === "they_owe_me" ? (
                            <ArrowDownLeft className="h-2.5 w-2.5 text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="h-2.5 w-2.5 text-rose-400" />
                          )}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white transition-colors group-hover:text-cyan-300">
                            {item.contact_name}
                          </p>
                          {isImminent && (
                            <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400">
                              <AlertCircle className="h-3 w-3" />
                              DUE SOON
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          <span>
                            {dueDateObj
                              ? dueDateObj.toLocaleDateString(undefined, {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Unscheduled"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Data & Status Pill */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-800/60 pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                      <div className="text-right">
                        <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Maturity Amount
                        </span>
                        <AmountText
                          amount={item.amount}
                          currency={item.currency}
                          direction={item.direction}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 transition-all duration-300 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
    <div
      className={`group relative overflow-hidden rounded-2xl border ${meta.bg} p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${meta.glow}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            {meta.label}
          </span>
          <p className="tabular-money font-display text-4xl font-black tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-2xl border p-3.5 ${meta.bg} ${meta.tone}`}>
          <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
}