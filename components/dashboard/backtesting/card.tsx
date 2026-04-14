function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600">{label}</p>
      <p className="text-xs text-white font-semibold">{value}</p>
    </div>
  );
}

export function BacktestCard({
  bt,
  onClick,
}: {
  bt: any;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#131620] border rounded-2xl p-4 cursor-pointer transition-all hover:border-blue-500/40 ${
        bt.hasEdge
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-red-500 border-[#1e2a3a]"
      }`}
    >
      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {bt.pair?.name || "PAIR"} · {bt.timeframe}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(bt.startDate).toLocaleDateString()} →{" "}
            {new Date(bt.endDate).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`text-[10px] px-2 py-1 rounded-md border ${
            bt.status === "completed"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}
        >
          {bt.status}
        </span>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Metric label="Win Rate" value={`${bt.winRate?.toFixed(1)}%`} />
        <Metric label="Avg RR" value={`${bt.avgRR?.toFixed(2)}`} />
        <Metric label="Profit" value={`$${bt.netProfit?.toLocaleString()}`} />
        <Metric label="Trades" value={bt.totalTrades} />
      </div>

      {/* ── EDGE STATUS ── */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full border ${
            bt.hasEdge
              ? "bg-green-500/15 text-green-400 border-green-500/30"
              : "bg-red-500/15 text-red-400 border-red-500/30"
          }`}
        >
          {bt.hasEdge ? "Edge Confirmed" : "No Edge"}
        </span>

        <span className="text-xs text-gray-500">
          Score:{" "}
          <span className="text-white font-semibold">{bt.edgeScore || 0}</span>
        </span>
      </div>
    </div>
  );
}
