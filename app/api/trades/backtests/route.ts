import {
  createBacktest,
  getBacktests,
} from "@/server/controllers/backtest.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest) => {
  return createBacktest(req);
});

export const GET = protect(async (req: NextRequest) => {
  return getBacktests(req);
});
