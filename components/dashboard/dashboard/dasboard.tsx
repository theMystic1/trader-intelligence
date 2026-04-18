"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardData } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import AdminDashboardSkeleton from "@/app/loading";

/* ──────────────────────────────────────────
   Mock — replace with: const data = await getDashboardData()
────────────────────────────────────────── */

/* ──────────────────────────────────────────
   Utils
────────────────────────────────────────── */
function cn(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
const POSITIVE = new Set([
  "Confident",
  "Patient",
  "Calm",
  "Disciplined",
  "Focused",
]);

function OutcomePill({ o }: { o?: string }) {
  const key = o?.trim().toUpperCase();

  const map: Record<string, string> = {
    TP: "bg-green-500/15 text-green-400 border-green-500/25",
    SL: "bg-red-500/15 text-red-400 border-red-500/25",
    BE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  };

  const labelMap: Record<string, string> = {
    TP: "Take Profit",
    SL: "Stop Loss",
    BE: "Breakeven",
  };

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider",
        map[key ?? ""] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20",
      )}
    >
      {labelMap[key ?? ""] ?? key ?? "Unknown"}
    </span>
  );
}

function TypePill({ t }: { t: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold",
        t === "LONG" ? "text-blue-400" : "text-orange-400",
      )}
    >
      {t === "LONG" ? "▲" : "▼"} {t}
    </span>
  );
}

/* ──────────────────────────────────────────
   KPI Card
────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-4 flex flex-col gap-3  overflow-hidden group hover:border-[#2a3a52] transition-all duration-200">
      {" "}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1 truncate">
            {label}
          </p>
          <p
            className={cn(
              "text-2xl font-bold leading-none",
              accent ?? "text-white",
            )}
          >
            {value}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#0f1117] border border-[#1e2a3a] flex items-center justify-center text-gray-500 flex-shrink-0">
          {icon}
        </div>
      </div>
      {sub && <p className="text-[11px] text-gray-600 leading-none">{sub}</p>}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59,130,246,0.04), transparent)",
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────
   Performance Curve
────────────────────────────────────────── */
function PerformanceCurve({ data }: { data: DashboardData["journalCurve"] }) {
  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        No trade data yet
      </div>
    );
  const W = 700,
    H = 180,
    padL = 36,
    padB = 26,
    padT = 10,
    padR = 10;
  const iW = W - padL - padR,
    iH = H - padT - padB;
  const vals = data.map((d) => d.cumulative);
  const minV = Math.min(...vals),
    maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const px = (i: number) => padL + (i / Math.max(data.length - 1, 1)) * iW;
  const py = (v: number) => padT + iH - ((v - minV) / range) * iH;
  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(d.cumulative)}`)
    .join(" ");
  const areaD =
    pathD + ` L ${px(data.length - 1)} ${padT + iH} L ${px(0)} ${padT + iH} Z`;
  const every = Math.ceil(data.length / 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {[minV, Math.round(minV + range / 2), maxV].map((v) => (
        <g key={v}>
          <line
            x1={padL}
            y1={py(v)}
            x2={W - padR}
            y2={py(v)}
            stroke="#1e2a3a"
            strokeDasharray="3 5"
          />
          <text
            x={padL - 5}
            y={py(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#374151"
          >
            {v}
          </text>
        </g>
      ))}
      {data.map(
        (d, i) =>
          i % every === 0 && (
            <text
              key={i}
              x={px(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#374151"
            >
              {d.date}
            </text>
          ),
      )}
      <path d={areaD} fill="url(#cg)" />
      <path
        d={pathD}
        fill="none"
        stroke="url(#lg)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={px(i)}
          cy={py(d.cumulative)}
          r="3"
          fill={d.tp ? "#22c55e" : d.sl ? "#ef4444" : "#f59e0b"}
          stroke="#0f1117"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/* ──────────────────────────────────────────
   Donut
────────────────────────────────────────── */
function OutcomeDonut({ data }: { data: DashboardData["outcomeBreakdown"] }) {
  // const { tp, sl, be, total } = data;
  if (!data?.total)
    return (
      <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
        No data
      </div>
    );
  const r = 52,
    cx = 64,
    cy = 64,
    sw = 13,
    circ = 2 * Math.PI * r;
  const tpD = (data.tp / data.total) * circ,
    slD = (data.sl / data.total) * circ,
    beD = (data.be / data.total) * circ;
  return (
    <div className="flex items-center gap-5">
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className="flex-shrink-0"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1e2a3a"
          strokeWidth={sw}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={sw}
          strokeDasharray={`${tpD} ${circ - tpD}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ef4444"
          strokeWidth={sw}
          strokeDasharray={`${slD} ${circ - slD}`}
          strokeDashoffset={-tpD}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={sw}
          strokeDasharray={`${beD} ${circ - beD}`}
          strokeDashoffset={-(tpD + slD)}
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
          {data.winRate}%
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="9"
          fill="#6b7280"
        >
          WIN RATE
        </text>
      </svg>
      <div className="flex flex-col gap-2.5 flex-1">
        {[
          {
            label: "Take Profit",
            count: data?.tp,
            pct: ((data?.tp / data?.total) * 100).toFixed(0),
            dot: "bg-emerald-500",
          },
          {
            label: "Stop Loss",
            count: data?.sl,
            pct: ((data?.sl / data?.total) * 100).toFixed(0),
            dot: "bg-red-500",
          },
          {
            label: "Breakeven",
            count: data?.be,
            pct: ((data?.be / data?.total) * 100).toFixed(0),
            dot: "bg-amber-500",
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className={cn("w-2 h-2 rounded-full flex-shrink-0", item.dot)}
            />
            <span className="text-xs text-gray-500 flex-1">{item.label}</span>
            <span className="text-xs font-bold text-white">{item.count}</span>
            <span className="text-[10px] text-gray-600 w-7 text-right">
              {item.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Session bars
────────────────────────────────────────── */
function SessionBars({ data }: { data: DashboardData["sessionPerformance"] }) {
  const maxTotal = data
    ?.map((d) => d.total)
    ?.reduce((a, b) => Math.max(a, b), 1);
  return (
    <div className="flex flex-col gap-4">
      {data?.map((s) => (
        <div key={s.session}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-300">
              {s.session}
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-emerald-400 font-bold">{s.tp}W</span>
              <span className="text-red-400">{s.sl}L</span>
              <span className="text-amber-400">{s.be}BE</span>
              <span className="text-blue-400 font-bold ml-1">{s.winRate}%</span>
            </div>
          </div>
          <div className="h-2 bg-[#0f1117] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(s.tp / maxTotal) * 100}%` }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${(s.sl / maxTotal) * 100}%` }}
            />
            <div
              className="h-full bg-amber-500"
              style={{ width: `${(s.be / maxTotal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Pair leaderboard
────────────────────────────────────────── */
function PairLeaderboard({ data }: { data: DashboardData["pairLeaderboard"] }) {
  const max = data?.map((p) => p.winRate)?.reduce((a, b) => Math.max(a, b), 1);
  return (
    <div className="flex flex-col gap-3">
      {data?.map((p, i) => (
        <div key={p.pair} className="flex items-center gap-3">
          <span className="w-4 text-[10px] text-gray-600 font-bold text-right flex-shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-200">{p.pair}</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-gray-500">{p.total} trades</span>
                <span className="text-blue-400 font-semibold">
                  RR {p.avgRR}
                </span>
                <span
                  className={cn(
                    "font-bold",
                    p.winRate >= 50 ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {p.winRate}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-[#0f1117] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  p.winRate >= 50 ? "bg-emerald-500" : "bg-red-500",
                )}
                style={{ width: `${(p.winRate / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Streaks
────────────────────────────────────────── */
function StreakCard({ streaks }: { streaks: DashboardData["streaks"] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        {
          label: "Win Streak",
          value: streaks?.currentWinStreak,
          icon: "🔥",
          color: "text-emerald-400",
        },
        {
          label: "Best Streak",
          value: streaks?.bestWinStreak,
          icon: "🏆",
          color: "text-amber-400",
        },
        {
          label: "Loss Streak",
          value: streaks?.currentLossStreak,
          icon: streaks?.currentLossStreak > 2 ? "⚠️" : "—",
          color:
            streaks?.currentLossStreak > 2 ? "text-red-400" : "text-gray-500",
        },
      ]?.map((s) => (
        <div
          key={s.label}
          className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-2 py-3 text-center"
        >
          <div className="text-base mb-1">{s.icon}</div>
          <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
          <div className="text-[9px] text-gray-600 mt-0.5 leading-tight">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Recent trades
────────────────────────────────────────── */
function RecentTrades({ data }: { data: DashboardData["recentJournals"] }) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-[#0f1117]">
            {["Date", "Pair", "Type", "Session", "R:R", "Outcome", "Mood"].map(
              (h) => (
                <th
                  key={h}
                  className="text-[10px] font-semibold text-gray-600 px-4 py-2.5 text-left uppercase tracking-wider border-b border-[#1e2a3a] first:pl-5"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map((j, i) => (
            <tr
              key={j._id}
              className={cn(
                "border-b border-[#1a2030] hover:bg-[#0f1621] transition-colors",
                i % 2 !== 0 ? "bg-[#0f1117]/30" : "",
              )}
            >
              <td className="px-4 py-3 text-[11px] text-gray-500 pl-5">
                {j.date}
              </td>
              <td className="px-4 py-3 text-xs font-bold text-gray-200">
                {j.pair}
              </td>
              <td className="px-4 py-3">
                <TypePill t={j.type} />
              </td>
              <td className="px-4 py-3 text-[11px] text-gray-500">
                {j.session}
              </td>
              <td className="px-4 py-3 text-xs font-semibold text-blue-400">
                {j.riskReward}
              </td>
              <td className="px-4 py-3">
                <OutcomePill o={j.tradeOutcome} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {j.feelings.slice(0, 2).map((f) => (
                    <span
                      key={f}
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                        POSITIVE.has(f)
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-400",
                      )}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ──────────────────────────────────────────
   Section wrapper
────────────────────────────────────────── */
function Section({
  title,
  sub,
  action,
  children,
  className,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-[#131620] border border-[#1e2a3a] rounded-2xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a3a]">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Empty state
────────────────────────────────────────── */
function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-white mb-1">
        Your dashboard awaits
      </h2>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        Log trades to unlock charts, win rate, streaks, session analysis, and AI
        insights.
      </p>
      <p className="mb-6 text-blue-500 font-bold italic text-sm">
        But first create a winning plan, to guide your trades and maximize your
        returns.
      </p>
      <Link
        href="/trading-plan/new"
        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        Create trading plan →
      </Link>
    </div>
  );
}

/* ──────────────────────────────────────────
   Page
────────────────────────────────────────── */
export default function Dashboard() {
  // const [data] = useState(MOCK);
  // Production:
  const { dasdata, error, isLoading } = useDashboard();
  // if (error) return  ;

  if (isLoading) return <AdminDashboardSkeleton />;
  const isEmpty = dasdata?.data.overview.totalJournals === 0;
  if (isEmpty) return <EmptyDashboard />;

  const {
    overview,
    journalCurve,
    outcomeBreakdown,
    sessionPerformance,
    pairLeaderboard,
    recentJournals,
    backtestSummary,
    streaks,
    planCount,
  } = dasdata?.data;

  // console.log(dasdata);

  return (
    <div className="px-4 sm:px-6 pb-10 space-y-4 z-0">
      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 z-0">
        <KpiCard
          label="Total Trades"
          value={overview?.totalJournals}
          sub="journal entries"
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16" />
              <rect x="8" y="10" width="12" height="12" rx="2" />
            </svg>
          }
        />
        <KpiCard
          label="Win Rate"
          value={`${overview?.winRate}%`}
          sub={`${overview?.totalTP}W · ${overview?.totalSL}L · ${overview?.totalBE}BE`}
          accent={overview?.winRate >= 50 ? "text-emerald-400" : "text-red-400"}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <KpiCard
          label="Avg R:R"
          value={`${overview?.avgRR}R`}
          sub="average per trade"
          accent="text-blue-400"
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <KpiCard
          label="Best Pair"
          value={overview?.bestPair}
          sub="most wins"
          accent="text-amber-400"
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
        <KpiCard
          label="Backtests"
          value={backtestSummary?.total}
          sub={`${backtestSummary?.running} running · ${backtestSummary?.completed} done`}
          accent="text-purple-400"
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
          }
        />
        <KpiCard
          label="Trading Plans"
          value={planCount}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          }
        />
      </div>

      {/* ── Row 2: Curve + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Section
          className="lg:col-span-8"
          title="Performance Curve"
          sub="Cumulative win/loss progression across your journal"
          action={
            <Link
              href="/journal"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </Link>
          }
        >
          <PerformanceCurve data={journalCurve} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e2a3a]">
            {[
              { color: "bg-emerald-500", label: "Take Profit" },
              { color: "bg-red-500", label: "Stop Loss" },
              { color: "bg-amber-500", label: "Breakeven" },
            ].map((l) => (
              <div
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <div
                  className={cn("w-2 h-2 rounded-full flex-shrink-0", l.color)}
                />
                {l.label}
              </div>
            ))}
          </div>
        </Section>

        <Section
          className="lg:col-span-4"
          title="Outcome Breakdown"
          sub="All journal entries"
        >
          <OutcomeDonut data={outcomeBreakdown} />
          <div className="mt-4 pt-4 border-t border-[#1e2a3a]">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">
              Streaks
            </p>
            <StreakCard streaks={streaks} />
          </div>
        </Section>
      </div>

      {/* ── Row 3: Session + Pairs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Section
          className="lg:col-span-5"
          title="Session Performance"
          sub="Win rate by session"
        >
          <SessionBars data={sessionPerformance} />
        </Section>

        <Section
          className="lg:col-span-7"
          title="Pair Leaderboard"
          sub="Top pairs ranked by win rate"
          action={
            <div className="flex gap-3 text-[10px] text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                ≥50%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                &lt;50%
              </span>
            </div>
          }
        >
          <PairLeaderboard data={pairLeaderboard} />
        </Section>
      </div>

      {/* ── Row 4: Backtest summary ── */}
      <Section
        title="Backtest Overview"
        sub="Aggregated across all backtests"
        action={
          <Link
            href="/backtesting"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manage →
          </Link>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Total",
              value: backtestSummary?.total,
              color: "text-white",
            },
            {
              label: "Running",
              value: backtestSummary?.running,
              color: "text-blue-400",
            },
            {
              label: "Completed",
              value: backtestSummary?.completed,
              color: "text-emerald-400",
            },
            {
              label: "BT Trades",
              value: backtestSummary?.totalTrades,
              color: "text-purple-400",
            },
            {
              label: "BT Win Rate",
              value: `${backtestSummary?.avgWinRate}%`,
              color:
                backtestSummary?.avgWinRate >= 50
                  ? "text-emerald-400"
                  : "text-red-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-3"
            >
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Row 5: Recent trades ── */}
      <Section
        title="Recent Journal Entries"
        sub="Last 5 logged trades"
        action={
          <Link
            href="/journal"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        }
      >
        {recentJournals?.length === 0 ? (
          <p className="text-center text-sm text-gray-600 py-6">
            No trades logged yet.
          </p>
        ) : (
          <RecentTrades data={recentJournals} />
        )}
      </Section>
    </div>
  );
}
