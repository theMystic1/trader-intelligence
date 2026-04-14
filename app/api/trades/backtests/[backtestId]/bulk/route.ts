import { logTradesBulk } from "@/server/controllers/backtest-trade.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await logTradesBulk(req, id.backtestId);
});
