"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BacktestOverviewTable from "./overview-table";
import BacktestModal from "./modals/backtest-modal";
import {
  useBacktests,
  useBacktestStats,
  useOverviewStats,
} from "@/hooks/useBacktests";
import AdminDashboardSkeleton from "@/app/loading";
import { formatDate } from "@/lib/helpers";

/* ──────────────────────────────────────────
   DUMMY DATA (matches your schema output)
────────────────────────────────────────── */

const MOCK_BACKTESTS = [
  {
    _id: "1",
    pair: { name: "EURUSD" },
    timeframe: "1H",
    startDate: "2024-01-01",
    endDate: "2024-01-30",
    status: "completed",

    totalTrades: 48,
    winRate: 42.5,
    avgRR: 3.2,
    netProfit: 2300,
    hasEdge: true,
    edgeScore: 72,
  },
  {
    _id: "2",
    pair: { name: "GBPJPY" },
    timeframe: "15M",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    status: "completed",

    totalTrades: 36,
    winRate: 33.2,
    avgRR: 2.1,
    netProfit: -800,
    hasEdge: false,
    edgeScore: 38,
  },
  {
    _id: "3",
    pair: { name: "XAUUSD" },
    timeframe: "5M",
    startDate: "2024-03-01",
    endDate: "2024-03-10",
    status: "running",

    totalTrades: 20,
    winRate: 50.0,
    avgRR: 2.8,
    netProfit: 900,
    hasEdge: false,
    edgeScore: 55,
  },
];

/* ──────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────── */

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600">{label}</p>
      <p className="text-xs text-white font-semibold">{value}</p>
    </div>
  );
}

function BacktestCard({ bt, onClick }: { bt: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#131620] border rounded-2xl p-4 cursor-pointer transition-all hover:border-blue-500/40 ${
        bt.hasEdge
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-red-500 border-[#1e2a3a]"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {bt.pair.pairName} · {bt.timeframe}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(new Date(bt.startDate))} →{" "}
            {formatDate(new Date(bt.endDate))}
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

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Metric label="Win Rate" value={`${bt.winRate}%`} />
        <Metric label="Avg RR" value={`${bt.avgRR ?? 0}`} />
        <Metric label="Profit" value={`$${bt.netProfit}`} />
        <Metric label="Trades" value={bt.totalTrades} />
      </div>

      {/* EDGE */}
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
          <span className="text-white font-semibold">{bt.edgeScore}</span>
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   PAGE
────────────────────────────────────────── */

export default function BacktestsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "edge" | "no-edge">("all");

  const { backtests, isLoadingBacktests, refetchBacktests } = useBacktests();
  const { overviewStats, isLoadingOverviewStats, refetchOverviewStats } =
    useOverviewStats();

  let data = [...MOCK_BACKTESTS];

  /* FILTER */
  data = data.filter((bt) => {
    if (filter === "edge") return bt.hasEdge;
    if (filter === "no-edge") return !bt.hasEdge;
    return true;
  });

  /* SORT (SMART DEFAULT) */
  data.sort((a, b) => {
    if (a.hasEdge !== b.hasEdge) return b.hasEdge ? 1 : -1;
    if (a.edgeScore !== b.edgeScore) return b.edgeScore - a.edgeScore;
    return b.netProfit - a.netProfit;
  });

  if (isLoadingBacktests || isLoadingOverviewStats)
    return <AdminDashboardSkeleton />;

  const backtestData = backtests?.data ?? backtests;

  console.log(overviewStats);
  return (
    <div className="min-h-screen bg-[#0f1117] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Backtests</h1>
            <p className="text-sm text-gray-500">
              Evaluate your strategies across markets
            </p>
          </div>
          <BacktestModal
            type="new"
            onRefetch={async () => {
              await refetchBacktests();
              await refetchOverviewStats();
            }}
          />
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 mb-6">
          {["all", "edge", "no-edge"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-[#1e2a3a] text-gray-400 hover:text-white"
              }`}
            >
              {f === "edge" ? "Edge Only" : f === "no-edge" ? "No Edge" : "All"}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewStats?.data.map((bt: any) => (
            <BacktestCard
              key={bt._id}
              bt={bt}
              onClick={() => router.push(`/backtests/${bt._id}`)}
            />
          ))}
        </div>

        {/* EMPTY */}
        {backtestData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No backtests found.
          </div>
        ) : (
          <div className="mt-10">
            <BacktestOverviewTable backtestData={backtestData} />
          </div>
        )}
      </div>
    </div>
  );
}
