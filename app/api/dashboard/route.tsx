import { getDashboardData } from "@/server/controllers/dashboard.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

// getDashboardData
export const GET = protect(async (req: NextRequest) => {
  return getDashboardData(req);
});
