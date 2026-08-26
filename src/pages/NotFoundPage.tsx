import { Link } from "react-router-dom";
import { ArrowLeft, BookX } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center text-slate-100">
      <div className="absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      
      <div className="flex max-w-md flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
        
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/80 shadow-inner">
          <BookX className="h-10 w-10 text-indigo-400 transition-transform duration-300 hover:scale-110" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
          </span>
        </div>

        <p className="font-display text-4xl font-extrabold tracking-tight text-white">
          Page not found
        </p>
        
        <p className="mt-3 text-sm text-slate-400">
          There's no entry for this page in the ledger.
        </p>

        <Link 
          to="/" 
          className="group mt-8 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}