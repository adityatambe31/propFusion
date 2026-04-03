import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 },
      );
    }

    // Use Better Auth's built-in verification
    // This endpoint calls the better-auth session check after verification
    const response = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Email verification failed" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { message: "Email verified successfully", user: data.user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during email verification" },
      { status: 500 },
    );
  }
}
