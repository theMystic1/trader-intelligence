// utils/auth.ts

import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";

import { Types } from "mongoose";
import { NextResponse } from "next/server";

export type JwtPayloadWithId = JwtPayload & { id: string };

export const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRESIN ??
  "7d") as SignOptions["expiresIn"];

// ---------- helpers ----------
export const verifyJwt = (token: string, secret: Secret) =>
  new Promise<JwtPayloadWithId>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      if (!decoded || typeof decoded === "string")
        return reject(new Error("Invalid token payload"));
      if (typeof (decoded as any).id !== "string")
        return reject(new Error("Token payload missing id"));
      resolve(decoded as JwtPayloadWithId);
    });
  });

export const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const norm = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

export const getBearerToken = (req: any) => {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const [type, token] = h.split(" ");
  if (type !== "Bearer" || !token) return null;
  // console.log(h);
  return token;
};

export const sendToken = (token: string, user: any) => {
  return NextResponse.json({
    status: "success",
    token,
    data: user,
  });
};
