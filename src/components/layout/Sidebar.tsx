export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B1020] p-6">

      <h1 className="text-2xl font-bold tracking-tight">
        AEGILUX
      </h1>

      <p className="text-sm text-slate-400 mt-1">
        Defensive Platform
      </p>

      <nav className="mt-10 space-y-3">

        <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          IP Analysis
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          JWT Analyzer
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
          Monitoring
        </button>

      </nav>
    </aside>
  );
}