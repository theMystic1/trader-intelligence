import {
  getInstruments,
  seedInstrumentsData,
} from "@/server/controllers/instrument.controller";
import { protect } from "@/server/controllers/users.controller";
import { NextRequest } from "next/server";

export const POST = protect(async (req: NextRequest) => {
  return seedInstrumentsData(req);
});

export const GET = protect(async (req: NextRequest) => {
  return getInstruments(req);
});
