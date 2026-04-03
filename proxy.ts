import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Allow access to 2FA verification page without full session
  if (request.nextUrl.pathname === "/dashboard/account/verify-2fa") {
    return NextResponse.next();
  }

  // Allow access to reset password and forgot password pages even if logged in
  if (
    request.nextUrl.pathname === "/auth/reset-password" ||
    request.nextUrl.pathname === "/auth/forgot-password"
  ) {
    return NextResponse.next();
  }

  // If trying to access dashboard without session token, redirect to sign-in
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!sessionToken?.value) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
