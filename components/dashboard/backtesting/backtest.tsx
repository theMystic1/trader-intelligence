"use client";

import { MOCK_STATS, MOCK_TRADES } from "@/lib/constants";
import { Direction, Outcome, SortDir, SortKey, Trade } from "@/types";
import { ReactNode, useState } from "react";
import BacktestTable from "./backtest-table";
import useGetInstruments from "@/hooks/usegetInstruments";
import { InstrumentPicker } from "@/components/ui/instruments/instrument-picker";

/* ──────────────────────────────────────────
   Table primitives (your existing components)
────────────────────────────────────────── */

/* ──────────────────────────────────────────
   Mock data (mirrors BacktestSchema + getBacktestStats)
────────────────────────────────────────── */

/* equity curve data */
const EQUITY_CURVE = [10000, 10940, 11640, 11190, 12310, 11960, 13320, 13920];
const EQUITY_LABELS = ["Start", "T1", "T2", "T3", "T4", "T5", "T6", "T7"];

/* ──────────────────────────────────────────
   Micro components
────────────────────────────────────────── */
export function Badge({ outcome }: { outcome: Outcome }) {
  const map: Record<Outcome, string> = {
    win: "bg-green-500/15 text-green-400 border-green-500/30",
    loss: "bg-red-500/15 text-red-400 border-red-500/30",
    breakeven: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${map[outcome]}`}
    >
      {outcome}
    </span>
  );
}

export function DirectionBadge({ dir }: { dir: Direction }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${dir === "buy" ? "bg-blue-500/15 text-blue-400" : "bg-orange-500/15 text-orange-400"}`}
    >
      {dir === "buy" ? "▲" : "▼"} {dir}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#131620] border border-[#1e2a3a] rounded-xl p-4">
      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${accent ? "text-green-400" : "text-white"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ──────────────────────────────────────────
   Equity Curve SVG chart
────────────────────────────────────────── */
function EquityChart() {
  const W = 600,
    H = 180,
    padL = 60,
    padB = 30,
    padT = 16,
    padR = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const minVal = Math.min(...EQUITY_CURVE) * 0.995;
  const maxVal = Math.max(...EQUITY_CURVE) * 1.005;
  const range = maxVal - minVal;

  const px = (i: number) => padL + (i / (EQUITY_CURVE.length - 1)) * innerW;
  const py = (v: number) => padT + innerH - ((v - minVal) / range) * innerH;

  const pathD = EQUITY_CURVE.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`,
  ).join(" ");
  const areaD =
    pathD +
    ` L ${px(EQUITY_CURVE.length - 1)} ${padT + innerH} L ${px(0)} ${padT + innerH} Z`;

  const gridVals = [
    minVal,
    minVal + range * 0.33,
    minVal + range * 0.66,
    maxVal,
  ].map(Math.round);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
      <defs>
        <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={padL}
            y1={py(v)}
            x2={W - padR}
            y2={py(v)}
            stroke="#1e2a3a"
            strokeDasharray="3 4"
          />
          <text
            x={padL - 6}
            y={py(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#4b5563"
          >
            ${(v / 1000).toFixed(1)}k
          </text>
        </g>
      ))}
      {EQUITY_LABELS.map((label, i) => (
        <text
          key={label}
          x={px(i)}
          y={H - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#4b5563"
        >
          {label}
        </text>
      ))}
      <path d={areaD} fill="url(#eq-fill)" />
      <path
        d={pathD}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {EQUITY_CURVE.map((v, i) => (
        <circle
          key={i}
          cx={px(i)}
          cy={py(v)}
          r="3.5"
          fill="#0f1117"
          stroke="#22c55e"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

/* ──────────────────────────────────────────
   Win / Loss / BE donut
────────────────────────────────────────── */
function OutcomeDonut({
  wins,
  losses,
  breakevens,
  total,
}: {
  wins: number;
  losses: number;
  breakevens: number;
  total: number;
}) {
  const r = 54,
    cx = 70,
    cy = 70,
    stroke = 14;
  const circ = 2 * Math.PI * r;
  const wPct = wins / total;
  const lPct = losses / total;
  const bPct = breakevens / total;
  const wDash = circ * wPct;
  const lDash = circ * lPct;
  const bDash = circ * bPct;
  const wOff = 0;
  const lOff = -wDash;
  const bOff = -(wDash + lDash);

  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1e2a3a"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeDasharray={`${wDash} ${circ - wDash}`}
          strokeDashoffset={wOff}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ef4444"
          strokeWidth={stroke}
          strokeDasharray={`${lDash} ${circ - lDash}`}
          strokeDashoffset={lOff}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={stroke}
          strokeDasharray={`${bDash} ${circ - bDash}`}
          strokeDashoffset={bOff}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="white"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
        >
          trades
        </text>
      </svg>
      <div className="flex flex-col gap-2.5">
        {[
          {
            label: "Wins",
            count: wins,
            color: "bg-green-500",
            pct: ((wins / total) * 100).toFixed(1),
          },
          {
            label: "Losses",
            count: losses,
            color: "bg-red-500",
            pct: ((losses / total) * 100).toFixed(1),
          },
          {
            label: "Breakeven",
            count: breakevens,
            color: "bg-yellow-500",
            pct: ((breakevens / total) * 100).toFixed(1),
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`}
            />
            <span className="text-xs text-gray-400 w-20">{item.label}</span>
            <span className="text-xs font-semibold text-white">
              {item.count}
            </span>
            <span className="text-xs text-gray-600">({item.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Edge Score gauge
────────────────────────────────────────── */
function EdgeGauge({ score, hasEdge }: { score: number; hasEdge: boolean }) {
  const r = 48,
    cx = 70,
    cy = 76;
  const circ = Math.PI * r; // half circle
  const filled = (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="90" viewBox="0 0 140 90">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#1e2a3a"
          strokeWidth="13"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill="white"
        >
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="#6b7280">
          EDGE SCORE
        </text>
        <text
          x={cx - r + 2}
          y={cy + 18}
          textAnchor="middle"
          fontSize="9"
          fill="#4b5563"
        >
          0
        </text>
        <text
          x={cx + r - 2}
          y={cy + 18}
          textAnchor="middle"
          fontSize="9"
          fill="#4b5563"
        >
          100
        </text>
      </svg>
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border mt-1 ${
          hasEdge
            ? "bg-green-500/15 text-green-400 border-green-500/30"
            : "bg-red-500/15 text-red-400 border-red-500/30"
        }`}
      >
        {hasEdge ? (
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
        {hasEdge ? "Edge Confirmed" : "No Edge Detected"}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   P&L bar chart (per trade)
────────────────────────────────────────── */
function PnLBars({ trades }: { trades: Trade[] }) {
  const W = 600,
    H = 120,
    padL = 48,
    padB = 20,
    padT = 10,
    padR = 10;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...trades.map((t) => Math.abs(t.profitLoss)));
  const barW = (innerW / trades.length) * 0.6;
  const gap = innerW / trades.length;
  const midY = padT + innerH / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      <line
        x1={padL}
        y1={midY}
        x2={W - padR}
        y2={midY}
        stroke="#1e2a3a"
        strokeWidth="1"
      />
      <text
        x={padL - 6}
        y={padT + 4}
        textAnchor="end"
        fontSize="9"
        fill="#4b5563"
      >
        +${(max / 1000).toFixed(1)}k
      </text>
      <text
        x={padL - 6}
        y={padT + innerH + 4}
        textAnchor="end"
        fontSize="9"
        fill="#4b5563"
      >
        -${(max / 1000).toFixed(1)}k
      </text>
      {trades.map((t, i) => {
        const x = padL + i * gap + (gap - barW) / 2;
        const pct = t.profitLoss / max;
        const h = Math.abs(pct) * (innerH / 2);
        const y = t.profitLoss >= 0 ? midY - h : midY;
        return (
          <rect
            key={t.id}
            x={x}
            y={y}
            width={barW}
            height={Math.max(h, 2)}
            rx="2"
            fill={
              t.outcome === "win"
                ? "#22c55e"
                : t.outcome === "loss"
                  ? "#ef4444"
                  : "#f59e0b"
            }
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
}

/* ──────────────────────────────────────────
   Page
────────────────────────────────────────── */

export default function BacktestPage() {
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterOutcome, setFilterOutcome] = useState<"all" | Outcome>("all");
  const [filterDir, setFilterDir] = useState<"all" | Direction>("all");
  const s = MOCK_STATS;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = MOCK_TRADES.filter(
    (t) => filterOutcome === "all" || t.outcome === filterOutcome,
  )
    .filter((t) => filterDir === "all" || t.direction === filterDir)
    .sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      if (av === undefined || bv === undefined) return 0;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">
                Backtest Results
              </h1>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  s.hasEdge
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                {s.hasEdge ? "Edge Confirmed" : "No Edge"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              EURUSD · 1H · Jan 2024 · $10,000 initial
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${"bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
            >
              Completed
            </span>

            {/*<button className="flex items-center gap-1.5 text-sm text-gray-400 border border-[#1e2a3a] hover:border-[#2a3a50] rounded-lg px-3 py-1.5 transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>*/}
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            label="Net Profit"
            value={`$${s.netProfit.toLocaleString()}`}
            sub={`+${(((s.finalBalance - s.initialBalance) / s.initialBalance) * 100).toFixed(1)}%`}
            accent
          />
          <StatCard
            label="Win Rate"
            value={`${s.winRate.toFixed(1)}%`}
            sub={`${s.wins}W / ${s.losses}L`}
          />
          <StatCard
            label="Profit Factor"
            value={s.profitFactor.toFixed(2)}
            sub="Gross P / Gross L"
          />
          <StatCard label="Avg R:R" value={`${s.avgRR}R`} sub="per trade" />
          <StatCard
            label="Expectancy"
            value={`${s.expectancy.toFixed(2)}R`}
            sub="per trade"
          />
          <StatCard
            label="Max Drawdown"
            value={`${s.maxDrawdown}%`}
            sub="from peak"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          {/* Equity curve */}
          <div className="lg:col-span-7 bg-[#131620] border border-[#1e2a3a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white">Equity Curve</p>
                <p className="text-xs text-gray-500">
                  ${s.initialBalance.toLocaleString()} → $
                  {s.finalBalance.toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-bold text-green-400">
                +${(s.finalBalance - s.initialBalance).toLocaleString()}
              </span>
            </div>
            <EquityChart />
          </div>

          {/* Right column: donut + edge gauge */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-5 flex-1">
              <p className="text-sm font-semibold text-white mb-4">
                Outcome Distribution
              </p>
              <OutcomeDonut
                wins={s.wins}
                losses={s.losses}
                breakevens={s.breakevens}
                total={s.totalTrades}
              />
            </div>
            <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Edge Score
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Win rate ≥ 40% &amp; avg R:R ≥ 3.0
                  <br />
                  required to confirm edge.
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {[
                    {
                      label: "Win Rate",
                      val: `${s.winRate.toFixed(1)}%`,
                      ok: s.winRate >= 40,
                    },
                    { label: "Avg R:R", val: `${s.avgRR}R`, ok: s.avgRR >= 3 },
                    {
                      label: "Profit Factor",
                      val: `${s.profitFactor.toFixed(2)}`,
                      ok: s.profitFactor >= 1.5,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={row.ok ? "text-green-400" : "text-red-400"}
                      >
                        {row.ok ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-gray-300 font-semibold ml-auto">
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <EdgeGauge score={s.edgeScore} hasEdge={s.hasEdge} />
            </div>
          </div>
        </div>

        {/* ── P&L bar chart ── */}
        <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-white mb-1">Trade P&L</p>
          <p className="text-xs text-gray-500 mb-4">
            Per-trade profit and loss
          </p>
          <PnLBars trades={MOCK_TRADES} />
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: "bg-green-500", label: "Win" },
              { color: "bg-red-500", label: "Loss" },
              { color: "bg-yellow-500", label: "Breakeven" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Trades table ── */}
        <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl overflow-hidden">
          {/* Table header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#1e2a3a]">
            <div>
              <p className="text-sm font-semibold text-white">Trade Log</p>
              <p className="text-xs text-gray-500">
                {filtered.length} of {MOCK_TRADES.length} trades
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Outcome filter */}
              <div className="flex items-center gap-0 bg-[#0f1117] border border-[#1e2a3a] rounded-lg overflow-hidden">
                {(["all", "win", "loss", "breakeven"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilterOutcome(opt)}
                    className={`text-xs px-3 py-1.5 font-semibold transition-colors capitalize ${
                      filterOutcome === opt
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {/* Direction filter */}
              <div className="flex items-center gap-0 bg-[#0f1117] border border-[#1e2a3a] rounded-lg overflow-hidden">
                {(["all", "buy", "sell"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilterDir(opt)}
                    className={`text-xs px-3 py-1.5 font-semibold transition-colors capitalize ${
                      filterDir === opt
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <BacktestTable
            sortKey={sortKey}
            sortDir={sortDir}
            filtered={filtered}
            handleSort={handleSort}
          />

          {/* Pagination row */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e2a3a]">
            <span className="text-xs text-gray-600">
              Showing {filtered.length} of {MOCK_TRADES.length} results
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300 border border-[#1e2a3a]"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
