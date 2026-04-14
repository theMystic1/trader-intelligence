import {
  deleteTradingPlan,
  getTradingPlanById,
  updateTradingPlan,
} from "@/server/controllers/trade-plan.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const GET = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await getTradingPlanById(req, id?.planId);
});

export const PATCH = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await updateTradingPlan(req, id.planId);
});

export const DELETE = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await deleteTradingPlan(req, id.planId);
});
