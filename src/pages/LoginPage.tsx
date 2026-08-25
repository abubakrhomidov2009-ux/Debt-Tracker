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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ledger-card { animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .ledger-row { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* Ledger sheet side panel — desktop/laptop only */}
      <div className="relative hidden w-[45%] max-w-lg shrink-0 flex-col justify-between overflow-hidden bg-slate-900 px-10 py-12 text-slate-100 shadow-2xl lg:flex dark:bg-slate-950">
        {/* Subtle background ruling effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 32px)",
          }}
          aria-hidden
        />

        {/* Ambient background accent glow */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Ledger
            </span>
          </div>

          <h1 className="mt-14 font-display text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
            Every debt remembered.
            <br />
            <span className="text-indigo-400">Every favor returned.</span>
          </h1>
          <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-400">
            One shared record for the money that moves between friends —
            no more guessing who covered what.
          </p>
        </div>

        {/* Sample ledger entries preview card */}
        <div className="relative">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Recent entries
          </span>
          <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-md">
            {sampleEntries.map((entry, i) => (
              <div
                key={entry.name}
                className="ledger-row flex items-center justify-between px-3.5 py-3"
                style={{ animationDelay: `${150 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                    {entry.direction === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{entry.name}</div>
                    <div className="text-xs text-slate-400">{entry.note}</div>
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
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Header Branding */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Ledger
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Keep every IOU in one place.
            </p>
          </div>

          {/* Desktop Heading */}
          <div className="mb-6 hidden text-center lg:block">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Log in to see where things stand.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="ledger-card relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            {/* Gradient Top Line */}
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-400" aria-hidden />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-1">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between pb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Show
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

            <div className="flex items-center justify-between pt-1 text-xs font-medium">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/40 dark:border-slate-700"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={submitting} className="mt-2 w-full justify-center shadow-sm">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            New here?{" "}
            <Link to="/register" className="inline-flex items-center gap-0.5 font-bold text-indigo-600 hover:underline dark:text-indigo-400">
              Create an account
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function clsxAmount(direction: "credit" | "debit") {
  return direction === "credit"
    ? "font-display text-sm font-semibold text-emerald-400"
    : "font-display text-sm font-semibold text-slate-300";
}