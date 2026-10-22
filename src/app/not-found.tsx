import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white/25 backdrop-blur rounded-4xl p-8 md:p-12 border border-slate-200 text-center space-y-6 relative overflow-hidden">
        <div className="flex flex-col items-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 pr-6 py-2 rounded-full bg-white/25 text-xs font-medium text-slate-800">
            <AlertCircleIcon
              size={16}
              className="text-rose-600 animate-pulse"
            />
            Error 404 Status
          </div>
          <h1 className="text-4xl sm:text-5xl text-slate-800 leading-tight font-medium">
            Lost in connection?
            <br />
            <span className="text-primary">Page not found.</span>
          </h1>
          <p className="text-slate-700 text-base max-w-md mx-auto leading-relaxed">
            The resource path you are looking for might have been moved,
            deleted, or does not exist. Please check your web link and try
            again.
          </p>
        </div>
        <div className="pt-4 border-t border-white/30 text-sm text-slate-600">
          <div className="w-full bg-white/50 rounded-2xl px-5 py-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="block text-xs text-slate-500 uppercase font-mono">
                Terminal Context
              </span>
              <span className="text-slate-900 font-mono text-xs break-all">
                404:REQUEST_UNRESOLVED
              </span>
            </div>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all duration-150 ease-in-out text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="text-xs text-slate-500 pt-2">
          Secure network tunnel active
        </div>
      </div>
    </div>
  );
}
