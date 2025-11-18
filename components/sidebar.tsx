import { Map as MapIcon } from "lucide-react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed lg:relative z-20 h-full w-full sm:w-96 bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-6 border-b border-slate-700 bg-linear-to-r from-cyan-900/20 to-purple-900/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GTA SA</h1>
              <p className="text-xs text-cyan-400">Navigator</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Advanced navigation system for San Andreas
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
    </div>
  );
}
