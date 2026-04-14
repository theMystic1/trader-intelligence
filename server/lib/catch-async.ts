import { NextRequest, NextResponse } from "next/server";

export const catchAsync = (
  fn: (req: any, res: any, next: any) => Promise<any> | any,
) => {
  return (req: any, res: any, next: any): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
