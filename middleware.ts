import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  if (req.url.includes("create-account")) return;
  if (!req.cookies.has("mini-twitter") && !req.url.includes("log-in")) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
