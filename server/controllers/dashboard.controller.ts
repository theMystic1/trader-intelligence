"use server";

import { NextRequest, NextResponse } from "next/server";
import TradingPlan from "../models/trade-plan.schema";
import mongoose from "mongoose";
import TradingJournal from "../models/journal.schema";
import Backtest from "../models/backtesting.schema";
import { BacktestTrade } from "../models/backtest-trade.schema";
import {
  BacktestSummary,
  DashboardData,
  JournalCurvePoint,
  OutcomeBreakdown,
  OverviewStats,
  PairStat,
  RecentJournal,
  SessionPerf,
  StreakData,
} from "../../types";
import { dbConnect } from "../server";

/* ──────────────────────────────────────────
   Main dashboard loader
────────────────────────────────────────── */
export async function getDashboardData(req: NextRequest) {
  const userId = (req as any)?.user._id;

  try {
    const connected = await dbConnect();
    const [
      overview,
      journalCurve,
      outcomeBreakdown,
      sessionPerformance,
      pairLeaderboard,
      recentJournals,
      backtestSummary,
      streaks,
      planCount,
    ] = await Promise.all([
      getOverviewStats(userId),
      getJournalCurve(userId),
      getOutcomeBreakdown(userId),
      getSessionPerformance(userId),
      getPairLeaderboard(userId),
      getRecentJournals(userId),
      getBacktestSummary(userId),
      getStreaks(userId),
      TradingPlan.countDocuments({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview,
        journalCurve,
        outcomeBreakdown,
        sessionPerformance,
        pairLeaderboard,
        recentJournals,
        backtestSummary,
        streaks,
        planCount,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    // return { error: message };
    return NextResponse.json(
      { success: false, message: message },
      { status: 400 },
    );
  }
}

/* ──────────────────────────────────────────
   Overview stats
────────────────────────────────────────── */
async function getOverviewStats(
  userId: mongoose.Types.ObjectId,
): Promise<OverviewStats> {
  const connected = await dbConnect();
  const [agg, backtestStats, backtestTradeCount] = await Promise.all([
    TradingJournal.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          tp: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "TP"] }, 1, 0] } },
          sl: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "SL"] }, 1, 0] } },
          be: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "BE"] }, 1, 0] } },
        },
      },
    ]),
    Backtest.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          active: { $sum: { $cond: [{ $eq: ["$status", "running"] }, 1, 0] } },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]),
    BacktestTrade.countDocuments({
      backtestId: {
        $in: await Backtest.distinct("_id", { userId }),
      },
    }),
    // best pair
    TradingJournal.aggregate([
      { $match: { userId, tradeOutcome: "TP" } },
      { $group: { _id: "$pair", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
  ]);

  const [bestPairAgg] = await TradingJournal.aggregate([
    { $match: { userId, tradeOutcome: "TP" } },
    { $group: { _id: "$pair", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  // avgRR from journals that have numeric-parseable riskReward like "1:2"
  const rrAgg = await TradingJournal.aggregate([
    { $match: { userId } },
    {
      $addFields: {
        rrNum: {
          $toDouble: {
            $arrayElemAt: [{ $split: ["$riskReward", ":"] }, 1],
          },
        },
      },
    },
    { $group: { _id: null, avgRR: { $avg: "$rrNum" } } },
  ]);

  const stats = agg[0] ?? { total: 0, tp: 0, sl: 0, be: 0 };
  const bStats = backtestStats[0] ?? { active: 0, completed: 0 };

  return {
    totalJournals: stats.total,
    winRate:
      stats.total > 0
        ? parseFloat(((stats.tp / stats.total) * 100).toFixed(1))
        : 0,
    totalTP: stats.tp,
    totalSL: stats.sl,
    totalBE: stats.be,
    avgRR: rrAgg[0]?.avgRR ? parseFloat(rrAgg[0].avgRR.toFixed(2)) : 0,
    bestPair: bestPairAgg?._id ?? "—",
    activeBacktests: bStats.active,
    completedBacktests: bStats.completed,
    totalBacktestTrades: backtestTradeCount,
  };
}

/* ──────────────────────────────────────────
   Journal performance curve (last 30 entries)
────────────────────────────────────────── */
async function getJournalCurve(userId: string): Promise<JournalCurvePoint[]> {
  const connected = await dbConnect();
  const journals = await TradingJournal.find({ userId })
    .sort({ date: 1 })
    .limit(60)
    .select("date tradeOutcome")
    .lean();

  let cumulative = 0;
  return journals.map((j) => {
    if (j.tradeOutcome === "TP") cumulative++;
    else if (j.tradeOutcome === "SL") cumulative--;
    return {
      date: new Date(j.date as Date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      cumulative,
      tp: j.tradeOutcome === "TP" ? 1 : 0,
      sl: j.tradeOutcome === "SL" ? 1 : 0,
      be: j.tradeOutcome === "BE" ? 1 : 0,
    };
  });
}

/* ──────────────────────────────────────────
   Outcome breakdown
────────────────────────────────────────── */
async function getOutcomeBreakdown(
  userId: mongoose.Types.ObjectId,
): Promise<OutcomeBreakdown> {
  const connected = await dbConnect();
  const [res] = await TradingJournal.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        tp: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "TP"] }, 1, 0] } },
        sl: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "SL"] }, 1, 0] } },
        be: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "BE"] }, 1, 0] } },
      },
    },
  ]);
  if (!res) return { tp: 0, sl: 0, be: 0, total: 0, winRate: 0 };
  return {
    ...res,
    winRate: parseFloat(((res.tp / res.total) * 100).toFixed(1)),
  };
}

/* ──────────────────────────────────────────
   Session performance
────────────────────────────────────────── */
async function getSessionPerformance(
  userId: mongoose.Types.ObjectId,
): Promise<SessionPerf[]> {
  const connected = await dbConnect();
  const res = await TradingJournal.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$session",
        total: { $sum: 1 },
        tp: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "TP"] }, 1, 0] } },
        sl: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "SL"] }, 1, 0] } },
        be: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "BE"] }, 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
  ]);
  return res.map((r) => ({
    session: r._id,
    total: r.total,
    tp: r.tp,
    sl: r.sl,
    be: r.be,
    winRate: parseFloat(((r.tp / r.total) * 100).toFixed(1)),
  }));
}

/* ──────────────────────────────────────────
   Pair leaderboard (top 6 by trades)
────────────────────────────────────────── */
async function getPairLeaderboard(
  userId: mongoose.Types.ObjectId,
): Promise<PairStat[]> {
  const connected = await dbConnect();
  const res = await TradingJournal.aggregate([
    { $match: { userId } },
    {
      $addFields: {
        rrNum: {
          $toDouble: {
            $arrayElemAt: [{ $split: ["$riskReward", ":"] }, 1],
          },
        },
      },
    },
    {
      $group: {
        _id: "$pair",
        total: { $sum: 1 },
        tp: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "TP"] }, 1, 0] } },
        sl: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "SL"] }, 1, 0] } },
        be: { $sum: { $cond: [{ $eq: ["$tradeOutcome", "BE"] }, 1, 0] } },
        avgRR: { $avg: "$rrNum" },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 6 },
  ]);
  return res.map((r) => ({
    pair: r._id,
    total: r.total,
    tp: r.tp,
    sl: r.sl,
    winRate: parseFloat(((r.tp / r.total) * 100).toFixed(1)),
    avgRR: r.avgRR ? r.avgRR.toFixed(2) : "—",
  }));
}

/* ──────────────────────────────────────────
   Recent journals
────────────────────────────────────────── */
async function getRecentJournals(userId: string): Promise<RecentJournal[]> {
  const connected = await dbConnect();
  const journals = await TradingJournal.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("date pair type tradeOutcome session riskReward feelings")
    .lean();

  return journals.map((j) => ({
    _id: j._id.toString(),
    date: new Date(j.date as Date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    pair: j.pair as string,
    type: j.type as string,
    tradeOutcome: j.tradeOutcome as string,
    session: j.session as string,
    riskReward: j.riskReward as string,
    feelings: j.feelings as string[],
  }));
}

/* ──────────────────────────────────────────
   Backtest summary
────────────────────────────────────────── */
async function getBacktestSummary(
  userId: mongoose.Types.ObjectId,
): Promise<BacktestSummary> {
  const connected = await dbConnect();
  const backtestIds = await Backtest.distinct("_id", { userId });

  const [bAgg, tradeAgg] = await Promise.all([
    Backtest.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          running: { $sum: { $cond: [{ $eq: ["$status", "running"] }, 1, 0] } },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]),
    BacktestTrade.aggregate([
      { $match: { backtestId: { $in: backtestIds } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          wins: { $sum: { $cond: [{ $eq: ["$outcome", "win"] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const b = bAgg[0] ?? { total: 0, running: 0, completed: 0 };
  const t = tradeAgg[0] ?? { total: 0, wins: 0 };

  return {
    total: b.total,
    running: b.running,
    completed: b.completed,
    avgWinRate:
      t.total > 0 ? parseFloat(((t.wins / t.total) * 100).toFixed(1)) : 0,
    totalTrades: t.total,
  };
}

/* ──────────────────────────────────────────
   Win/Loss streaks
────────────────────────────────────────── */
async function getStreaks(userId: string): Promise<StreakData> {
  const connected = await dbConnect();
  const journals = await TradingJournal.find({ userId })
    .sort({ date: -1 })
    .select("tradeOutcome")
    .lean();

  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let bestWinStreak = 0;
  let tempBest = 0;
  let counting = true;

  for (const j of journals) {
    const isWin = j.tradeOutcome === "TP";
    const isLoss = j.tradeOutcome === "SL";

    if (counting) {
      if (isWin) currentWinStreak++;
      else if (isLoss) {
        counting = false;
      }
    }
    if (counting && isWin === false) {
      if (isLoss) currentLossStreak++;
    }
    // best win streak (ascending pass below)
  }

  // best win streak — ascending
  const asc = [...journals].reverse();
  let temp = 0;
  for (const j of asc) {
    if (j.tradeOutcome === "TP") {
      temp++;
      if (temp > bestWinStreak) bestWinStreak = temp;
    } else temp = 0;
  }

  // recalc current loss streak
  let cls = 0;
  for (const j of journals) {
    if (j.tradeOutcome === "SL") cls++;
    else break;
  }

  return {
    currentWinStreak,
    bestWinStreak,
    currentLossStreak: cls,
  };
}
