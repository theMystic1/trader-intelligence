import {
  createJournal,
  getJournals,
} from "@/server/controllers/journal.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest) => {
  return createJournal(req);
});

export const GET = protect(async (req: NextRequest) => {
  return getJournals(req);
});
