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
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { register } from "../api/auth";
import { ApiError } from "../api/client";
import { startSessionAtom } from "../store/auth";
import { Input } from "../components/Field";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/Feedback";

const onboardingSteps = [
  { label: "Add entities & peers", done: true },
  { label: "Initialize ledger entry", done: true },
  { label: "Automated balance settlement", done: false },
];

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const level = Math.min(score, 4);
  const labels = ["Insufficient", "Weak Key", "Moderate", "Optimal", "Encrypted"];
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
      setError("Access keys do not match.");
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
    <div className="relative flex min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Futuristic HUD Grid Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl" />

      {/* Futuristic Ledger Side Panel — Desktop/Laptop only */}
      <div className="relative hidden w-[48%] max-w-xl shrink-0 flex-col justify-between border-r border-slate-800/80 bg-slate-900/40 p-8 xl:p-12 text-slate-100 backdrop-blur-2xl lg:flex">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 space-y-8 xl:space-y-12">
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
              INITIALIZATION
            </div>
          </div>

          {/* Hero Typography */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Identity Generation</span>
            </div>
            <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-white xl:text-4xl">
              Set the record straight,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                starting today.
              </span>
            </h1>
            <p className="max-w-md text-sm font-medium leading-relaxed text-slate-400">
              Establish your vault record and permanently settle financial tracking across your network.
            </p>
          </div>
        </div>

        {/* Onboarding steps preview card */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Initialization Protocol</span>
            <span className="text-cyan-400/80">3 Core Tasks</span>
          </div>

          <div className="space-y-2 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-2.5 backdrop-blur-xl shadow-2xl">
            {onboardingSteps.map((step) => (
              <div
                key={step.label}
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-900 bg-slate-900/40 px-4 py-3 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/80"
              >
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-600" />
                )}
                <span
                  className={
                    "font-mono text-xs font-medium " +
                    (step.done ? "text-slate-500 line-through" : "text-slate-200")
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* System status pill */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> End-to-End Vault
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-indigo-400" /> Zero Overhead
            </span>
          </div>
        </div>
      </div>

      {/* Main Registration Form Panel */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-5">
          {/* Mobile Header Branding */}
          <div className="text-center lg:hidden space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-cyan-400/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white">
              Ledger<span className="text-cyan-400">.</span>
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Initialize new ledger profile
            </p>
          </div>

          {/* Desktop Form Heading */}
          <div className="hidden space-y-1 lg:block">
            <h2 className="font-display text-2xl font-black tracking-tight text-white xl:text-3xl">
              Create Account
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Generate credentials for system authorization.
            </p>
          </div>

          {/* Core Registration Card */}
          <form
            onSubmit={handleSubmit}
            className="group relative flex flex-col gap-3.5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-700"
          >
            {/* Top Holographic Laser Line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500" />

            {error && <ErrorBanner message={error} />}

            <div className="space-y-1">
              <Input
                label="Full Identity Name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <div className="flex items-center justify-between pb-1">
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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {password && (
                <div className="mt-2 space-y-1">
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
                                : "bg-emerald-400"
                            : "bg-slate-800")
                        }
                      />
                    ))}
                  </div>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm Access Key"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {confirmTouched && (
                <span
                  className={
                    "mt-1 block font-mono text-[10px] font-bold uppercase tracking-wider " +
                    (confirmMatches ? "text-emerald-400" : "text-rose-400")
                  }
                >
                  {confirmMatches ? "Keys match" : "Keys do not match"}
                </span>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="mt-1 w-full justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300"
            >
              <UserPlus className="h-4 w-4" />
              <span>Initialize Profile</span>
            </Button>
          </form>

          {/* Account Login Link Footer */}
          <div className="text-center font-mono text-xs text-slate-500">
            Registered entity?{" "}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Access Console
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}