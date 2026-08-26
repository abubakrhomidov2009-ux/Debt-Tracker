import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { login } from "../api/auth";
import { ApiError } from "../api/client";
import { startSessionAtom } from "../store/auth";
import { Input } from "../components/Field";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/Feedback";

const sampleEntries = [
  { name: "Sam", note: "Dinner split", amount: "+$42.00", direction: "credit" as const },
  { name: "Jordan", note: "Concert tickets", amount: "−$120.00", direction: "debit" as const },
  { name: "Priya", note: "Group gift", amount: "+$18.50", direction: "credit" as const },
];

export function LoginPage() {
  const navigate = useNavigate();
  const startSession = useSetAtom(startSessionAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login({ email, password });
      startSession(result);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't reach the server.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Futuristic HUD Grid Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl" />

      {/* Futuristic Ledger Side Panel — Desktop/Laptop only */}
      <div className="relative h-screen hidden w-[48%] max-w-xl shrink-0 flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-slate-900/40 p-12 text-slate-100 backdrop-blur-2xl lg:flex">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 space-y-12">
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-cyan-400/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Ledger<span className="text-cyan-400">.</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 font-mono text-[10px] font-bold text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE
            </div>
          </div>

          {/* Hero Typography */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Debt Matrix</span>
            </div>
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
              Every debt remembered.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                Every favor returned.
              </span>
            </h1>
            <p className="max-w-md text-sm font-medium leading-relaxed text-slate-400">
              One transparent, cryptographically aligned record for capital that moves between friends.
            </p>
          </div>
        </div>

        {/* Live Entries Widget Preview */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Real-time Stream</span>
            <span className="text-cyan-400/80">3 Active Transits</span>
          </div>

          <div className="space-y-2 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-2.5 backdrop-blur-xl shadow-2xl">
            {sampleEntries.map((entry) => (
              <div
                key={entry.name}
                className="group flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-900/40 px-4 py-3 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300 transition-colors group-hover:border-cyan-500/40">
                    {entry.direction === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 transition-colors group-hover:text-cyan-300">
                      {entry.name}
                    </div>
                    <div className="font-mono text-xs text-slate-500">{entry.note}</div>
                  </div>
                </div>
                <span className={clsxAmount(entry.direction)}>
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>

          
        </div>
      </div>

      {/* Main Login Form Panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header Branding */}
          <div className="text-center lg:hidden space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-cyan-400/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white">
              Ledger<span className="text-cyan-400">.</span>
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Zero-friction IOU management
            </p>
          </div>

          {/* Desktop Form Heading */}
          <div className="hidden space-y-1.5 lg:block">
            <h2 className="font-display text-3xl font-black tracking-tight text-white">
              Access Console
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Authenticate your identity to view ledger status.
            </p>
          </div>

          {/* Core Login Card */}
          <form
            onSubmit={handleSubmit}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-700"
          >
            {/* Top Holographic Laser Line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500" />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-1">
              <Input
                label="Email Terminal"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between pb-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Access Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors focus-visible:outline-none"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> HIDE
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> SHOW
                    </>
                  )}
                </button>
              </div>
              <Input
                label=""
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              <label className="flex items-center gap-2.5 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 accent-cyan-500 focus:ring-cyan-500/40"
                />
                Remember Terminal
              </label>
              <Link
                to="/forgot-password"
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot key?
              </Link>
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="mt-2 w-full justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300"
            >
              <Lock className="h-4 w-4" />
              <span>Authenticate</span>
            </Button>
          </form>

          {/* Account Creation Footer */}
          <div className="text-center font-mono text-xs text-slate-500">
            Unregistered entity?{" "}
            <Link
              to="/register"
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Initialize Account
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function clsxAmount(direction: "credit" | "debit") {
  return direction === "credit"
    ? "font-mono text-sm font-bold text-emerald-400"
    : "font-mono text-sm font-bold text-rose-400";
}