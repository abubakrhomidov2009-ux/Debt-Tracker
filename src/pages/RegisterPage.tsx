import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { register } from "../api/auth";
import { ApiError } from "../api/client";
import { startSessionAtom } from "../store/auth";
import { Input } from "../components/Field";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/Feedback";

const onboardingSteps = [
  { label: "Add the people you owe or lend to", done: true },
  { label: "Log your first debt", done: true },
  { label: "Settle up when you're square", done: false },
];

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const level = Math.min(score, 4);
  const labels = ["Too short", "Weak", "Okay", "Good", "Strong"];
  return { level, label: pw ? labels[level] : "" };
}

export function RegisterPage() {
  const navigate = useNavigate();
  const startSession = useSetAtom(startSessionAtom);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const confirmTouched = confirm.length > 0;
  const confirmMatches = confirm === password;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({ name, email, password });
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
            Set the record straight,
            <br />
            <span className="text-indigo-400">starting today.</span>
          </h1>
          <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-400">
            A minute of setup buys you an end to "wait, who paid last time?" — for good.
          </p>
        </div>

        {/* Onboarding steps preview card */}
        <div className="relative">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Once you're in
          </span>
          <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-md">
            {onboardingSteps.map((step, i) => (
              <div
                key={step.label}
                className="ledger-row flex items-center gap-3 px-3.5 py-3"
                style={{ animationDelay: `${150 + i * 100}ms` }}
              >
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-500" />
                )}
                <span
                  className={
                    "text-sm font-medium " +
                    (step.done ? "text-slate-400 line-through" : "text-slate-200")
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Registration Form Panel */}
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
              Open a new account — takes a minute.
            </p>
          </div>

          {/* Desktop Heading */}
          <div className="mb-6 hidden text-center lg:block">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Create your account
            </h2>
            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Free, and takes less than a minute.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="ledger-card relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            {/* Gradient Top Bar */}
            <span
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-400"
              aria-hidden
            />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-1">
              <Input
                label="Name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {password && (
                <div className="mt-2.5">
                  <div className="flex h-1.5 gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={
                          "flex-1 rounded-full transition-colors duration-200 " +
                          (i < strength.level
                            ? strength.level <= 1
                              ? "bg-rose-500"
                              : strength.level === 2
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                            : "bg-slate-100 dark:bg-slate-800")
                        }
                      />
                    ))}
                  </div>
                  <span className="mt-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {confirmTouched && (
                <span
                  className={
                    "mt-1.5 block text-xs font-semibold " +
                    (confirmMatches
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400")
                  }
                >
                  {confirmMatches
                    ? "Passwords match"
                    : "Passwords don't match yet"}
                </span>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="mt-2 w-full justify-center shadow-sm"
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="inline-flex items-center gap-0.5 font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Log in
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}