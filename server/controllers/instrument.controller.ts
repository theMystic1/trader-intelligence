import { NextRequest, NextResponse } from "next/server";
import Instrument from "@/server/models/instrument.schema";
import APIFeatures from "../lib/api-features";
import { ALL_INSTRUMENTS } from "@/lib/pair-seed";
import { handleMongooseError } from "../lib/app-error";

export const getInstruments = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // convert URLSearchParams → object
    const queryString = Object.fromEntries(searchParams.entries());

    // base query
    const baseQuery = Instrument.find();

    // apply APIFeatures
    const features = new APIFeatures(baseQuery as any, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // execute query
    const instruments = await features.query;

    // pagination metadata
    const meta = await features.getPaginationMeta(Instrument as any);

    return Response.json({
      status: "success",
      results: instruments.length,
      meta,
      data: instruments,
    });
  } catch (error: any) {
    return Response.json(
      {
        status: "error",
        message: error?.message || "Failed to fetch instruments",
      },
      { status: 500 },
    );
  }
};

export const seedInstrumentsData = async (req: NextRequest) => {
  try {
    await Instrument.bulkWrite(
      ALL_INSTRUMENTS.map((item) => ({
        updateOne: {
          // ✅ FIXED: only use stable unique keys
          filter: {
            category: item.category,
            pairName: item.pairName,
          },
          update: {
            $set: item,
          },
          upsert: true,
        },
      })),
    );

    return NextResponse.json(
      {
        status: "success",
        message: "Instruments seeded successfully",
        count: ALL_INSTRUMENTS.length,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const formatted = handleMongooseError(error);

    return NextResponse.json(
      {
        status: "error",
        message: formatted,
      },
      { status: 500 },
    );
  }
};
