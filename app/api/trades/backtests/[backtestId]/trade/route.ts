import {
  deleteTrade,
  logTrade,
  updateTrade,
} from "@/server/controllers/backtest-trade.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await logTrade(req, id.backtestId);
});

export const PATCH = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;
  // console.log(id, context);
  return await updateTrade(req, id.backtestId);
});

export const DELETE = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await deleteTrade(id.backtestId);
});
