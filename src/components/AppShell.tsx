import { NavLink, Outlet } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import clsx from "clsx";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Folder,
  User,
  LogOut,
  BookOpen,
  Sparkles,
  Command,
} from "lucide-react";
import { userAtom, endSessionAtom } from "../store/auth";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/debts", label: "Debts", icon: Receipt },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/folders", label: "Folders", icon: Folder },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell() {
  const user = useAtomValue(userAtom);
  const endSession = useSetAtom(endSessionAtom);

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-t from-emerald-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-[1600px] p-3 sm:p-6 lg:p-8">
        {/* Floating Futuristic Sidebar */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col justify-between rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-2xl sm:flex">
          <div className="space-y-8">
            {/* Holographic Brand Tag */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-base font-black tracking-wider text-white">
                    LEDGER
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80">
                    Control Center
                  </span>
                </div>
              </div>
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>

            {/* Navigation Block */}
            <nav className="space-y-1.5">
              <div className="mb-3 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Navigation</span>
                <Command className="h-3 w-3" />
              </div>

              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      clsx(
                        "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white shadow-lg border border-indigo-500/30"
                          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={clsx(
                            "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                            isActive
                              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/40"
                              : "bg-slate-800/60 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="tracking-wide">{item.label}</span>

                        {isActive && (
                          <span className="absolute right-3 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Action Bar */}
          <div className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="flex items-center gap-3 p-1">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 font-display text-sm font-bold text-slate-950 shadow-md">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Active Session
                </div>
                <div className="truncate text-xs font-bold text-slate-200">
                  {user?.name}
                </div>
              </div>
            </div>

            <button
              onClick={() => endSession()}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold tracking-wide text-rose-400 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-300 active:scale-95"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="min-h-[calc(100vh-3rem)] flex-1 px-2 pb-28 pt-2 sm:px-6 sm:pb-8 sm:pt-0">
          <Outlet />
        </main>

        {/* Mobile Futuristic Bottom Navigation Bar */}
        <nav className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl sm:hidden">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold tracking-wider transition-all duration-300",
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20"
                          : "bg-transparent"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}