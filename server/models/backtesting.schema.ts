// models/Backtest.ts
import mongoose from "mongoose";

const BacktestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tradingPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TradingPlan",
      required: true,
    },

    pair: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Instrument",
    },

    timeframe: {
      type: String,
      required: true, // 5m, 1H
    },

    startDate: Date,
    endDate: Date,

    initialBalance: {
      type: Number,
      required: true,
    },

    riskPerTrade: {
      type: Number,
      required: true, // snapshot from plan
    },

    status: {
      type: String,
      enum: ["running", "completed"],
      default: "running",
    },
  },
  { timestamps: true },
);

const Backtest =
  mongoose.models.Backtest || mongoose.model("Backtest", BacktestSchema);

export default Backtest;

/*
AGGREGATE DATA
totalTrades: Number,
wins: Number,
losses: Number,
breakeven: Number,
winRate: Number,
netProfit: Number,
grossProfit: Number,
grossLoss: Number,
profitFactor: Number,
expectancy: Number,
maxDrawdown: Number,
averageRR: Number,
finalBalance: Number,
// ── EDGE VERDICT ──
hasEdge: {
  type: Boolean,
  default: false,
},
edgeScore: Number, // 0–100 (your secret sauce)
*/
