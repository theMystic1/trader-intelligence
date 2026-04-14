import { signup } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest, res: Response, next: any) => {
  return signup(req, res, next);
};
