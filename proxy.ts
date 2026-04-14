import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes, publicRoutes } from "./lib/constants";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some(
    (r) => path === r || path.startsWith(`${r}/`),
  );
  const isPublic = publicRoutes.some(
    (r) => path === r || path.startsWith(`${r}/`),
  );

  // optimistic: cookie presence only
  const token = req.cookies.get(
    process.env.NEXT_PUBLIC_ACCESS_TOKEN || "intelluser",
  )?.value;

  if (isProtected && !token) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isPublic && token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
