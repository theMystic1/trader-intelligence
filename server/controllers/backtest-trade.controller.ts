import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { BacktestTrade } from "../models/backtest-trade.schema";
import Backtest from "../models/backtesting.schema";

export async function logTrade(req: Request) {
  try {
    const body = await req.json();

    const {
      backtestId,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      direction,
    } = body;

    // 🔒 Validate backtest exists
    const backtest = await Backtest.findById(backtestId);
    if (!backtest) {
      return NextResponse.json(
        { message: "Backtest not found" },
        { status: 404 },
      );
    }

    // 🧠 AUTO-CALCULATIONS (IMPORTANT)
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);

    const riskReward = reward / risk;

    const profitLoss =
      direction === "buy" ? exitPrice - entryPrice : entryPrice - exitPrice;

    let outcome: "win" | "loss" | "breakeven" = "breakeven";

    if (profitLoss > 0) outcome = "win";
    if (profitLoss < 0) outcome = "loss";

    const trade = await BacktestTrade.create({
      ...body,
      backtestId: new mongoose.Types.ObjectId(backtestId),

      riskReward,
      profitLoss,
      outcome,
    });

    return NextResponse.json({
      status: "success",
      data: trade,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to log trade" },
      { status: 500 },
    );
  }
}

export async function logTradesBulk(req: Request) {
  try {
    const { trades, backtestId } = await req.json();

    const backtest = await Backtest.findById(backtestId);
    if (!backtest) {
      return NextResponse.json(
        { message: "Backtest not found" },
        { status: 404 },
      );
    }

    const enrichedTrades = trades.map((t: any) => {
      const risk = Math.abs(t.entryPrice - t.stopLoss);
      const reward = Math.abs(t.takeProfit - t.entryPrice);

      const riskReward = reward / risk;

      const profitLoss =
        t.direction === "buy"
          ? t.exitPrice - t.entryPrice
          : t.entryPrice - t.exitPrice;

      let outcome = "breakeven";
      if (profitLoss > 0) outcome = "win";
      if (profitLoss < 0) outcome = "loss";

      return {
        ...t,
        backtestId,
        riskReward,
        profitLoss,
        outcome,
      };
    });

    await BacktestTrade.insertMany(enrichedTrades);

    return NextResponse.json({
      status: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Bulk insert failed" },
      { status: 500 },
    );
  }
}
export async function getBacktestTrades(id: string) {
  try {
    const trades = await BacktestTrade.find({
      backtestId: id,
    })
      .sort({ entryTime: 1 })
      .lean();

    return NextResponse.json({
      status: "success",
      data: trades,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch trades" },
      { status: 500 },
    );
  }
}

export async function updateTrade(req: Request, tradeId: string) {
  try {
    const body = await req.json();

    const trade = await BacktestTrade.findByIdAndUpdate(tradeId, body, {
      new: true,
    }).lean();

    if (!trade) {
      return NextResponse.json({ message: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: trade,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update trade" },
      { status: 500 },
    );
  }
}

export async function deleteTrade(tradeId: string) {
  try {
    const trade = await BacktestTrade.findByIdAndDelete(tradeId);

    if (!trade) {
      return NextResponse.json({ message: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete trade" },
      { status: 500 },
    );
  }
}
