import { NavLink, Outlet } from "react-router-dom";
import {  useAtomValue, useSetAtom } from "jotai";
import clsx from "clsx";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Folder,
  User,
  LogOut,
  BookOpen,
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
    <div >
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex max-w-7xl">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/50 px-5 py-6 backdrop-blur-md sm:flex dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Ledger
                </span>
                <span className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Keep the balance
                </span>
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              <span className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Menu
              </span>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      clsx(
                        "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 transition-all duration-200 dark:bg-indigo-400",
                            isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          )}
                          aria-hidden
                        />
                        <IconComponent
                          className={clsx(
                            "h-4 w-4 shrink-0 transition-colors duration-200",
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                          )}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
             
              <div className="flex items-center gap-3 rounded-xl px-3.5 py-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-display text-xs font-bold text-indigo-700 ring-2 ring-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-900/40">
                  {initial}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    Signed in as
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user?.name}
                  </div>
                </div>
              </div>

              <button
                onClick={() => endSession()}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-left text-xs font-semibold text-rose-600 transition-colors duration-150 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4 stroke-[2.25]" />
                <span>Log out</span>
              </button>
            </div>
          </aside>

          <main className="min-h-screen flex-1 px-4 pb-28 pt-6 sm:px-8 sm:pb-10">
            <Outlet />
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200/80 bg-white/90 px-2 py-2 shadow-lg backdrop-blur-lg sm:hidden dark:border-slate-800/80 dark:bg-slate-900/90">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    clsx(
                      "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold transition-colors duration-150",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent
                        className={clsx(
                          "h-5 w-5 transition-transform duration-150",
                          isActive && "scale-110 stroke-[2.25]"
                        )}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}