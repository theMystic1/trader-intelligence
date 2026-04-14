import { InstrumentType } from "@/types";
import mongoose, { Schema, Model } from "mongoose";

const instrumentSchema = new Schema<InstrumentType>(
  {
    category: {
      type: String,
      enum: [
        "forex",
        "crypto",
        "stocks",
        "indices",
        "commodities",
        "bonds",
        "etfs",
      ],
      required: true,
      index: true,
    },

    pairName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    base: {
      type: String,
      trim: true,
      uppercase: true,
    },

    quote: {
      type: String,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// prevent duplicates
instrumentSchema.index({ category: 1, pairName: 1 }, { unique: true });

const Instrument: Model<InstrumentType> =
  mongoose.models.Instrument ||
  mongoose.model<InstrumentType>("Instrument", instrumentSchema);

export default Instrument;
