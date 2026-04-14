import { getOverviewStats } from "@/server/controllers/backtest.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const GET = protect(async (req: NextRequest) => {
  return getOverviewStats(req);
});
