import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  // ── Trade Execution ──
  entryTime: Date,
  exitTime: Date,

  direction: {
    type: String,
    enum: ["buy", "sell"],
  },

  entryPrice: Number,
  exitPrice: Number,

  stopLoss: Number,
  takeProfit: Number,
  backtestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Backtest",
  },

  // ── Outcome ──
  riskReward: Number, // e.g. 2.0 (1:2)
  profitLoss: Number, // absolute
  profitLossPercent: Number, // % of account

  outcome: {
    type: String,
    enum: ["win", "loss", "breakeven"],
  },

  setupType: String,
  session: String,
  notes: String,
});

const BacktestTrade =
  mongoose.models.BacktestTrade || mongoose.model("BacktestTrade", TradeSchema);
export { BacktestTrade };
