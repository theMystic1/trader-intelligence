import { getBacktestStats } from "@/server/controllers/backtest.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const GET = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await getBacktestStats(req, id?.backtestId);
});
