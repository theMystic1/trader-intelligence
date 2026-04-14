import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Backtest from "../models/backtesting.schema";
import { BacktestTrade } from "../models/backtest-trade.schema";

export async function getBacktestStats(req: NextRequest, id: string) {
  try {
    const userId = (req as any)?.user?._id;
    const backtestId = new mongoose.Types.ObjectId(id);

    const stats = await BacktestTrade.aggregate([
      // ── 1. Match trades ──
      { $match: { backtestId } },

      // ── 2. Join parent backtest ──
      {
        $lookup: {
          from: "backtests",
          localField: "backtestId",
          foreignField: "_id",
          as: "backtest",
        },
      },
      { $unwind: "$backtest" },

      // ── 3. Security filter ──
      {
        $match: {
          "backtest.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      // ── 4. Sort chronologically ──
      { $sort: { entryTime: 1 } },

      // ── 5. Inject derivedPnL per trade BEFORE grouping ──
      // win  → +riskPerTrade * riskReward
      // loss → -riskPerTrade
      // BE   → 0
      {
        $addFields: {
          derivedPnL: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$outcome", "win"] },
                  then: {
                    $multiply: ["$backtest.riskPerTrade", "$riskReward"],
                  },
                },
                {
                  case: { $eq: ["$outcome", "loss"] },
                  then: { $multiply: ["$backtest.riskPerTrade", -1] },
                },
              ],
              default: 0, // breakeven
            },
          },
          riskPerTrade: "$backtest.riskPerTrade",
          initialBalance: "$backtest.initialBalance",
        },
      },

      // ── 6. Group — collect everything ──
      {
        $group: {
          _id: "$backtestId",

          initialBalance: { $first: "$initialBalance" },
          riskPerTrade: { $first: "$riskPerTrade" },
          totalTrades: { $sum: 1 },

          wins: { $sum: { $cond: [{ $eq: ["$outcome", "win"] }, 1, 0] } },
          losses: { $sum: { $cond: [{ $eq: ["$outcome", "loss"] }, 1, 0] } },
          breakevens: {
            $sum: { $cond: [{ $eq: ["$outcome", "breakeven"] }, 1, 0] },
          },

          // Gross profit  = sum of all winning derivedPnL
          grossProfit: {
            $sum: {
              $cond: [{ $eq: ["$outcome", "win"] }, "$derivedPnL", 0],
            },
          },
          // Gross loss = sum of all losing derivedPnL (negative number)
          grossLoss: {
            $sum: {
              $cond: [{ $eq: ["$outcome", "loss"] }, "$derivedPnL", 0],
            },
          },
          // Net profit = grossProfit + grossLoss
          netProfit: { $sum: "$derivedPnL" },

          averageRR: { $avg: "$riskReward" },

          // Per-trade array for equity curve + P&L bars
          tradeSnapshots: {
            $push: {
              id: "$_id",
              entryTime: "$entryTime",
              exitTime: "$exitTime",
              direction: "$direction",
              entryPrice: "$entryPrice",
              exitPrice: "$exitPrice",
              stopLoss: "$stopLoss",
              takeProfit: "$takeProfit",
              riskReward: "$riskReward",
              profitLoss: "$derivedPnL", // ← derived, not raw field
              profitLossPercent: "$profitLossPercent",
              outcome: "$outcome",
              setupType: "$setupType",
              session: "$session",
              notes: "$notes",
            },
          },

          pnlSequence: { $push: "$derivedPnL" }, // for equity curve reduce
        },
      },

      // ── 7. Derived scalar stats ──
      {
        $addFields: {
          winRate: {
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              { $multiply: [{ $divide: ["$wins", "$totalTrades"] }, 100] },
            ],
          },
          profitFactor: {
            $cond: [
              { $eq: ["$grossLoss", 0] },
              0,
              { $divide: ["$grossProfit", { $abs: "$grossLoss" }] },
            ],
          },
          expectancy: {
            // (winRate * avgRR) - lossRate
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              {
                $subtract: [
                  {
                    $multiply: [
                      { $divide: ["$wins", "$totalTrades"] },
                      "$averageRR",
                    ],
                  },
                  { $divide: ["$losses", "$totalTrades"] },
                ],
              },
            ],
          },
          // Total profit formula:  risk * avgRR * totalWins
          totalProfit: {
            $multiply: ["$riskPerTrade", "$averageRR", "$wins"],
          },
        },
      },

      // ── 8. Edge logic ──
      {
        $addFields: {
          hasEdge: {
            $or: [
              {
                $and: [{ $gte: ["$winRate", 50] }, { $gte: ["$averageRR", 2] }],
              },
              {
                $and: [{ $gte: ["$winRate", 40] }, { $gte: ["$averageRR", 3] }],
              },
            ],
          },
          edgeScore: {
            $min: [
              100,
              {
                $add: [
                  { $multiply: ["$winRate", 0.4] },
                  { $multiply: ["$averageRR", 20] },
                  { $multiply: ["$profitFactor", 20] },
                ],
              },
            ],
          },
        },
      },

      // ── 9. Build equity curve via running sum over pnlSequence ──
      // Start point = initialBalance, each step adds derivedPnL for that trade
      {
        $addFields: {
          equityCurveRaw: {
            $reduce: {
              input: "$pnlSequence",
              initialValue: {
                curve: [{ $ifNull: ["$initialBalance", 10000] }],
                running: { $ifNull: ["$initialBalance", 10000] },
              },
              in: {
                curve: {
                  $concatArrays: [
                    "$$value.curve",
                    [{ $add: ["$$value.running", "$$this"] }],
                  ],
                },
                running: { $add: ["$$value.running", "$$this"] },
              },
            },
          },
        },
      },

      // ── 10. Flatten curve, finalBalance, maxDrawdown ──
      {
        $addFields: {
          equityCurve: "$equityCurveRaw.curve",
          finalBalance: { $add: ["$initialBalance", "$netProfit"] },

          maxDrawdown: {
            $let: {
              vars: {
                dd: {
                  $reduce: {
                    input: "$equityCurveRaw.curve",
                    initialValue: { peak: 0, maxDD: 0 },
                    in: {
                      peak: { $max: ["$$value.peak", "$$this"] },
                      maxDD: {
                        $max: [
                          "$$value.maxDD",
                          {
                            $cond: [
                              { $gt: ["$$value.peak", 0] },
                              {
                                $multiply: [
                                  {
                                    $divide: [
                                      {
                                        $subtract: ["$$value.peak", "$$this"],
                                      },
                                      "$$value.peak",
                                    ],
                                  },
                                  100,
                                ],
                              },
                              0,
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
              },
              in: "$$dd.maxDD",
            },
          },
        },
      },

      // ── 11. Equity labels: ["Start", "T1", "T2" …] ──
      {
        $addFields: {
          equityLabels: {
            $map: {
              input: { $range: [0, { $size: "$equityCurve" }] },
              as: "i",
              in: {
                $cond: [
                  { $eq: ["$$i", 0] },
                  "Start",
                  { $concat: ["T", { $toString: "$$i" }] },
                ],
              },
            },
          },
          // rename for clean API response
          trades: "$tradeSnapshots",
        },
      },

      // ── 12. Strip internals ──
      {
        $project: {
          equityCurveRaw: 0,
          pnlSequence: 0,
          tradeSnapshots: 0,
        },
      },
    ]);

    return NextResponse.json(stats[0] || {});
  } catch (error) {
    console.error("Stats calculation failed:", error);
    return NextResponse.json(
      { message: "Stats calculation failed" },
      { status: 500 },
    );
  }
}

export async function createBacktest(req: NextRequest) {
  try {
    const body = await req.json();

    const backtest = await Backtest.create({
      ...body,
      userId: (req as any).user._id,
    });

    return NextResponse.json({
      status: "success",
      data: backtest,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create backtest" },
      { status: 500 },
    );
  }
}

export async function getBacktests(req: NextRequest) {
  try {
    const backtests = await Backtest.find({
      userId: (req as any).user._id,
    })
      .sort({ createdAt: -1 })
      .populate("tradingPlanId")
      .populate("pair")
      .lean();

    return NextResponse.json({
      status: "success",
      data: backtests,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch backtests" },
      { status: 500 },
    );
  }
}

export async function getBacktestById(req: NextRequest, id: string) {
  try {
    const backtest = await Backtest.findById(id)
      .populate("tradingPlanId")
      .populate("pair")
      .lean();

    if (!backtest) {
      return NextResponse.json(
        { message: "Backtest not found" },
        { status: 404 },
      );
    }

    const statsRes = await getBacktestStats(req, id);
    const stats = await statsRes.json();

    return NextResponse.json({
      status: "success",
      data: {
        ...backtest,
        stats,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch backtest" },
      { status: 500 },
    );
  }
}
export async function updateBacktest(req: NextRequest, id: string) {
  try {
    const body = await req.json();

    const backtest = await Backtest.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();

    if (!backtest) {
      return NextResponse.json(
        { message: "Backtest not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: backtest,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update backtest" },
      { status: 500 },
    );
  }
}
export async function deleteBacktest(id: string) {
  try {
    const backtestId = new mongoose.Types.ObjectId(id);

    const backtest = await Backtest.findByIdAndDelete(backtestId).lean();

    if (!backtest) {
      return NextResponse.json(
        { message: "Backtest not found" },
        { status: 404 },
      );
    }

    await BacktestTrade.deleteMany({ backtestId });

    return NextResponse.json({
      status: "success",
      data: backtest,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete backtest" },
      { status: 500 },
    );
  }
}

export async function getOverviewStats(req: NextRequest) {
  try {
    const userId = (req as any)?.user?._id;

    const result = await Backtest.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // populate pair
      {
        $lookup: {
          from: "instruments",
          localField: "pair",
          foreignField: "_id",
          as: "pair",
        },
      },
      {
        $unwind: {
          path: "$pair",
          preserveNullAndEmptyArrays: true,
        },
      },

      // populate trades
      {
        $lookup: {
          from: "backtestTrade",
          localField: "_id",
          foreignField: "backtestId",
          as: "trades",
        },
      },

      // compute stats
      {
        $addFields: {
          totalTrades: { $size: "$trades" },

          wins: {
            $size: {
              $filter: {
                input: "$trades",
                as: "t",
                cond: { $eq: ["$$t.outcome", "win"] },
              },
            },
          },

          avgRR: { $avg: "$trades.riskReward" },
          netProfit: { $sum: "$trades.profitLoss" },
        },
      },

      // derived metrics
      {
        $addFields: {
          hasRuleEdge: {
            $or: [
              {
                $and: [{ $gte: ["$winRate", 50] }, { $gte: ["$averageRR", 2] }],
              },
              {
                $and: [{ $gte: ["$winRate", 40] }, { $gte: ["$averageRR", 3] }],
              },
            ],
          },

          edgeScore: {
            $min: [
              100,
              {
                $add: [
                  { $multiply: ["$winRate", 0.3] },
                  { $multiply: ["$averageRR", 25] },
                  { $multiply: ["$profitFactor", 25] },
                ],
              },
            ],
          },
        },
      },
      // final shape

      {
        $project: {
          _id: 1,
          timeframe: 1,
          startDate: 1,
          endDate: 1,
          status: 1,

          // ✅ full populated object
          pair: 1,

          // ✅ convenience field for UI
          pairName: "$pair.name",

          totalTrades: 1,
          winRate: 1,
          avgRR: 1,
          netProfit: 1,
          hasEdge: 1,
          edgeScore: 1,
        },
      },
    ]);

    return NextResponse.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get overview stats" },
      { status: 500 },
    );
  }
}
