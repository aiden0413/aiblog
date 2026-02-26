import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SIGNUP_COMPLETE_PATH = "/signup/complete";
const SIGNUP_VERIFIED_COOKIE = "signup_verified";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== SIGNUP_COMPLETE_PATH) {
    return NextResponse.next();
  }

  const verified = request.cookies.get(SIGNUP_VERIFIED_COOKIE)?.value;
  if (verified !== "1") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const res = NextResponse.next();
  res.cookies.set(SIGNUP_VERIFIED_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
  return res;
}

export const config = {
  matcher: ["/signup/complete"],
};
