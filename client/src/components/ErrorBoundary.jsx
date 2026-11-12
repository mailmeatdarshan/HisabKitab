import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ErrorBoundary() {
    const error = useRouteError();
    console.error("ErrorBoundary caught:", error);

    let errorMessage = "An unexpected error occurred.";
    if (typeof error === "string") {
        errorMessage = error;
    } else if (error?.statusText) {
        errorMessage = `${error.status || ""} ${error.statusText}`.trim();
    } else if (error?.message) {
        errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
        errorMessage = error.message || error.explanation || JSON.stringify(error);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#121214] text-slate-900 dark:text-zinc-100 font-sans">
            <div className="max-w-md w-full bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-zinc-800 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                <h1 className="text-xl font-extrabold tracking-tight mb-2">
                    Something went wrong
                </h1>

                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6 leading-relaxed">
                    {errorMessage}
                </p>

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reload App</span>
                    </button>

                    <Link
                        to="/app"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#00C58D] hover:bg-[#00b07e] text-white font-semibold text-xs shadow-md shadow-[#00C58D]/25 transition flex items-center justify-center gap-2 cursor-pointer text-center"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
