import { signIn } from "@/server/controllers/users.controller";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse, next: any) => {
  return signIn(req);
};
