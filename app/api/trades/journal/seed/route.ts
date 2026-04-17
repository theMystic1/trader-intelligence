import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";
import { seedJournal } from "@/server/controllers/journal.controller";

export const POST = protect(async (req: NextRequest) => {
  return seedJournal(req);
});
