import { NextRequest, NextResponse } from "next/server";
import TradingPlan from "../models/trade-plan.schema";

export const createTradingPlan = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const user = (req as any).user;

    const plan = await TradingPlan.create({
      ...body,
      userId: user._id,
    });

    return NextResponse.json({
      status: "success",
      data: plan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
};

export const getTradingPlans = async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const plans = await TradingPlan.find({
      userId: user._id,
    }).populate("pairs");

    return NextResponse.json({
      status: "success",
      results: plans.length,
      data: plans,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
};

export const getTradingPlanById = async (req: NextRequest, id: string) => {
  try {
    const user = (req as any).user;

    const plan = await TradingPlan.findById(id).populate("pairs");

    if (!plan) {
      return NextResponse.json(
        { status: "error", message: "Trading plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: plan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
};

export const updateTradingPlan = async (req: NextRequest, id: string) => {
  try {
    const user = (req as any).user;
    const body = await req.json();

    const updated = await TradingPlan.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "Trading plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
};

export const deleteTradingPlan = async (req: NextRequest, id: string) => {
  try {
    const user = (req as any).user;

    const deleted = await TradingPlan.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deleted) {
      return NextResponse.json(
        { status: "error", message: "Trading plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Trading plan deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
};
