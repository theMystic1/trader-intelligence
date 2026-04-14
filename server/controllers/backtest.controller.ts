import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Backtest from "../models/backtesting.schema";
import { BacktestTrade } from "../models/backtest-trade.schema";

export async function getBacktestStats(req: NextRequest, id: string) {
  try {
    const userId = (req as any)?.user?._id;
    const backtestId = new mongoose.Types.ObjectId(id);

    const stats = await BacktestTrade.aggregate([
      // 1. match trades for this backtest only
      {
        $match: {
          backtestId,
        },
      },

      // 2. join backtest to enforce ownership
      {
        $lookup: {
          from: "backtests",
          localField: "backtestId",
          foreignField: "_id",
          as: "backtest",
        },
      },

      { $unwind: "$backtest" },

      // 3. SECURITY FILTER (VERY IMPORTANT)
      {
        $match: {
          "backtest.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      // 4. aggregation
      {
        $group: {
          _id: "$backtestId",

          totalTrades: { $sum: 1 },

          wins: {
            $sum: { $cond: [{ $eq: ["$outcome", "win"] }, 1, 0] },
          },

          losses: {
            $sum: { $cond: [{ $eq: ["$outcome", "loss"] }, 1, 0] },
          },

          breakeven: {
            $sum: { $cond: [{ $eq: ["$outcome", "breakeven"] }, 1, 0] },
          },

          grossProfit: {
            $sum: {
              $cond: [{ $gt: ["$profitLoss", 0] }, "$profitLoss", 0],
            },
          },

          grossLoss: {
            $sum: {
              $cond: [{ $lt: ["$profitLoss", 0] }, "$profitLoss", 0],
            },
          },

          netProfit: { $sum: "$profitLoss" },

          averageRR: { $avg: "$riskReward" },
        },
      },

      // 5. derived metrics
      {
        $addFields: {
          winRate: {
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              { $multiply: [{ $divide: ["$wins", "$totalTrades"] }, 100] },
            ],
          },

          lossRate: {
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              { $multiply: [{ $divide: ["$losses", "$totalTrades"] }, 100] },
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
        },
      },

      // 6. edge logic
      {
        $addFields: {
          hasEdge: {
            $and: [
              { $gte: ["$winRate", 40] },
              { $gte: ["$averageRR", 3] },
              { $gt: ["$profitFactor", 1] },
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
    ]);

    return NextResponse.json(stats[0] || {});
  } catch (error) {
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
    const backtest = await Backtest.findById(id).lean();

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
          winRate: {
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              { $multiply: [{ $divide: ["$wins", "$totalTrades"] }, 100] },
            ],
          },

          hasEdge: {
            $and: [{ $gte: ["$winRate", 40] }, { $gte: ["$avgRR", 3] }],
          },

          edgeScore: {
            $min: [
              100,
              {
                $add: [
                  { $multiply: ["$winRate", 0.4] },
                  { $multiply: ["$avgRR", 20] },
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
