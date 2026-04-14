import {
  deleteBacktest,
  getBacktestById,
  updateBacktest,
} from "@/server/controllers/backtest.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const GET = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await getBacktestById(req, id?.backtestId);
});

export const PATCH = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await updateBacktest(req, id.backtestId);
});

export const DELETE = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await deleteBacktest(id.backtestId);
});
