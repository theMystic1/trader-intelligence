import { NextRequest, NextResponse } from "next/server";
import TradingJournal from "../models/journal.schema";
import APIFeatures from "../lib/api-features";
import { dbConnect } from "../server";

// CREATE JOURNAL
export async function createJournal(req: NextRequest) {
  try {
    const connected = await dbConnect();
    const body = await req.json();

    const journal = await TradingJournal.create({
      ...body,
      userId: (req as any).user._id,
    });

    return NextResponse.json({ success: true, data: journal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

// GET ALL JOURNALS
export async function getJournals(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const connected = await dbConnect();

    const queryString = Object.fromEntries(searchParams.entries());

    const page = Number(queryString.page) || 1;
    const limit = Number(queryString.limit) || 20;
    const skip = (page - 1) * limit;

    // Base query
    const baseQuery = TradingJournal.find({
      userId: (req as any)?.user?._id,
    });

    if (queryString.search) {
      baseQuery.find({
        $or: [
          { pair: { $regex: queryString.search, $options: "i" } },
          { entryCriteria: { $regex: queryString.search, $options: "i" } },
        ],
      });
    }

    // Apply APIFeatures
    const features = new APIFeatures(baseQuery as any, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const journals = await features.query;

    // 🔥 Count total documents (with filters applied)
    const countQuery = TradingJournal.find(features.query.getQuery());
    const total = await countQuery.countDocuments();

    const hasNext = page * limit < total;

    return NextResponse.json(
      {
        success: true,
        data: journals,
        pagination: {
          total,
          curPage: page,
          limit,
          hasNext,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
// GET SINGLE JOURNAL
export async function getSingleJournal(req: NextRequest, id: string) {
  try {
    const journal = await TradingJournal.findById(id);

    if (!journal) {
      return NextResponse.json(
        { success: false, message: "Journal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: journal }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// UPDATE JOURNAL
export async function updateJournal(req: NextRequest, id: string) {
  try {
    const body = await req.json();

    const updated = await TradingJournal.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Journal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

// DELETE JOURNAL
export async function deleteJournal(req: NextRequest, id: string) {
  try {
    const connected = await dbConnect();
    const deleted = await TradingJournal.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Journal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Journal deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export const seedJournal = async (req: NextRequest) => {
  try {
    const connected = await dbConnect();
    const { journals } = await req.json();

    const userId = (req as any)?.user?._id;

    const jns = journals?.map((journal: any) => ({
      ...journal,
      userId,
    }));

    console.log(jns);
    await TradingJournal.insertMany(jns);

    return NextResponse.json(
      { success: true, message: "Journal seeded" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
