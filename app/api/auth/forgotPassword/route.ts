import { forgotPassword } from "@/server/controllers/users.controller";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  return forgotPassword(req);
};
