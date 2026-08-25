import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  Check,
  CheckCircle2,
  LogOut,
  Mail,
  ShieldAlert,
  User as UserIcon,
  BookOpen,
} from "lucide-react";
import { getMe, updateMe } from "../api/users";
import { ApiError } from "../api/client";
import { endSessionAtom, userAtom } from "../store/auth";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Input } from "../components/Field";
import { ErrorBanner } from "../components/Feedback";

export function ProfilePage() {
  const [user, setUser] = useAtom(userAtom);
  const endSession = useSetAtom(endSessionAtom);

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then((fresh) => {
        setUser(fresh);
        setName(fresh.name);
      })
      .catch(() => {
        // Keep the cached user from localStorage if the refetch fails.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateMe({ name });
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't save your changes."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  const nameChanged = name.trim() !== user.name;

  return (
    <div className="mx-auto flex max-w-xl flex-col">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .p-card { animation: fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .p-saved { animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-t-3xl bg-slate-900 px-8 pb-16 pt-9 text-slate-100 shadow-xl dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 24px)",
          }}
          aria-hidden
        />

        {/* Subtle Decorative Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 dark:bg-indigo-500">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Profile
          </span>
        </div>

        <h1 className="relative mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {user.name}
        </h1>
        <p className="relative mt-1 text-sm font-medium text-slate-400">
          {user.email}
        </p>
      </div>

      {/* Avatar Overlapping Banner */}
      <div className="relative px-8">
        <Avatar
          name={user.name}
          className="absolute -top-12 h-24 w-24 rounded-3xl border-4 border-slate-50 text-3xl font-bold shadow-lg ring-1 ring-slate-900/5 dark:border-slate-900 dark:ring-white/10"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6 px-4 pb-12 pt-16 sm:px-8">
        {/* Account Details Form */}
        <form
          onSubmit={handleSubmit}
          className="p-card relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Account Details
              </h2>
            </div>
            {saved && (
              <span className="p-saved flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                Saved
              </span>
            )}
          </div>

          {error && <ErrorBanner message={error} />}

          <div className="space-y-4">
            <Input
              label="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={user.email}
              disabled
              hint="Email addresses are managed globally and cannot be changed here."
            />
          </div>

          <Button
            type="submit"
            loading={saving}
            disabled={!nameChanged}
            className="mt-2 w-full justify-center shadow-sm"
          >
            Save changes
          </Button>
        </form>

        {/* Session / Security Settings */}
        <div
          className="p-card flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
          style={{ animationDelay: "80ms" }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Session
              </h2>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Logging out will clear your session on this browser.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => endSession()}
            className="shrink-0 justify-center gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}