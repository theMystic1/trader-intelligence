import { NextResponse, NextRequest } from "next/server";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

export function json(data: unknown, init: ResponseInit = {}) {
  return NextResponse.json(data, { headers: CORS_HEADERS, ...init });
}

export function ok<T>(data: T) {
  return json({ ok: true, data }, { status: 200 });
}

export function created<T>(data: T) {
  return json({ ok: true, data }, { status: 201 });
}

export function fail(
  message: string,
  status = 400,
  extra: unknown = undefined,
) {
  return json({ ok: false, error: message, extra }, { status });
}

export function options() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// read search params safely
export function qp(req: NextRequest) {
  const url = new URL(req.url);
  return url.searchParams;
}
