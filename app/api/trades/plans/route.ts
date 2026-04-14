import {
  createTradingPlan,
  getTradingPlans,
} from "@/server/controllers/trade-plan.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest) => {
  return createTradingPlan(req);
});

export const GET = protect(async (req: NextRequest) => {
  return getTradingPlans(req);
});
