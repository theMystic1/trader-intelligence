import {
  getSingleJournal,
  updateJournal,
  deleteJournal,
} from "@/server/controllers/journal.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const GET = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  // console.log(id, context);
  return await getSingleJournal(req, id?.journalId);
});

export const PATCH = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await updateJournal(req, id?.journalId);
});

export const DELETE = protect(async (req: NextRequest, context: any) => {
  const id = await context.params;

  return await deleteJournal(req, id?.journalId);
});
