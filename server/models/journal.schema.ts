import { TradingJournalype } from "@/types";
import mongoose, { Schema, Model } from "mongoose";

const journalSchema = new Schema<TradingJournalype>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    date: { type: Date, required: [true, "Trade date is required"] },
    pair: {
      type: String,
      required: [true, "Trading pair is required"],
    },
    type: {
      type: String,
      enum: ["LONG", "SHORT"],
    },
    entryCriteria: {
      type: String,
      required: [true, "Trade entry criteria is required"],
    },
    entryConfirmation: {
      type: String,
      required: [true, "Trade entry confirmation is required"],
    },
    session: {
      type: String,
      enum: ["NY", "London", "Asian"],
      required: [true, "Session for entry confirmation is required"],
    },
    exitTime: {
      type: String,
      required: [true, "Session for exit is required"],
    },
    tradeOutcome: {
      type: String,
      enum: ["TP", "SL", "BE"],
      required: [true, "Trade outcome is required"],
    },
    tradeManagement: {
      type: String,
      required: [true, "Trade management is required"],
    },
    riskReward: {
      type: String,
      required: [true, "Kindly enter your risk reward ratio"],
    },
    mistakes: {
      type: [String],
      default: [],
    },
    rightDeeds: {
      type: [String],
      default: [],
    },
    feelings: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const TradingJournal: Model<TradingJournalype> =
  mongoose.models.TradingJournal ||
  mongoose.model<TradingJournalype>("TradingJournal", journalSchema);

export default TradingJournal;
