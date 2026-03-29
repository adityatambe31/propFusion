import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Temporary bypass for auth while building other parts of the site.
  // Set NEXT_PUBLIC_SKIP_AUTH=true (or SKIP_AUTH=true) in .env.local
  // and restart the dev server to disable all auth redirects.
  const skipAuth =
    process.env.NEXT_PUBLIC_SKIP_AUTH === "true" ||
    process.env.SKIP_AUTH === "true";

  if (skipAuth) {
    return NextResponse.next();
  }

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

  // If already signed in, don't allow access to other auth pages (sign-in, sign-up)
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    if (sessionToken?.value) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
