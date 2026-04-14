import { TIMEFRAMES, TRADER_TYPES } from "@/lib/constants";
import { TradingPlanType } from "@/types";
import mongoose, { Schema, Model } from "mongoose";

const timeframesSchema = new Schema(
  {
    htf: [
      {
        type: String,
        enum: TIMEFRAMES,
        required: true,
      },
    ],
    mtf: [
      {
        type: String,
        enum: TIMEFRAMES,
        required: true,
      },
    ],
    ltf: [
      {
        type: String,
        enum: TIMEFRAMES,
        required: true,
      },
    ],
  },
  { _id: false },
);

const strategySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Strategy name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    indicators: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const riskManagementSchema = new Schema(
  {
    riskPerTrade: {
      type: Number,
      required: true,
      min: [0.1, "Risk per trade must be at least 0.1%"],
      max: [10, "Risk per trade cannot exceed 10%"],
    },
    minimumRiskReward: {
      type: String,
      required: true,
      match: [/^\d+:\d+$/, "Must be in format like 1:2"],
    },
    maxTradePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDailyLoss: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const tradingPlanSchema = new Schema<TradingPlanType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Trading plan name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },

    description: {
      type: String,
      trim: true,
    },

    pairs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Instrument",
      },
    ],

    timeframes: {
      type: timeframesSchema,
      required: true,
    },

    strategy: {
      type: strategySchema,
      required: true,
    },

    tradingRules: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    riskManagement: {
      type: riskManagementSchema,
      required: true,
    },

    tradeManagement: [
      {
        type: String,
        trim: true,
      },
    ],
    traderType: {
      type: String,
      enum: TRADER_TYPES,
      required: true,
      default: "day trader",
    },
  },
  {
    timestamps: true,
  },
);

tradingPlanSchema.index({ userId: 1, name: 1 }, { unique: true });

tradingPlanSchema.index({ userId: 1 });

const TradingPlan: Model<TradingPlanType> =
  mongoose.models.TradingPlan ||
  mongoose.model<TradingPlanType>("TradingPlan", tradingPlanSchema);

export default TradingPlan;
