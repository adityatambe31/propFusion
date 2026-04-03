"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided.");
        return;
      }

      try {
        // Call your backend API to verify the email token
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting to sign in...");
          setTimeout(() => router.push("/auth/sign-in"), 2000);
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(data.message || "Failed to verify email. Please try again.");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred during email verification.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verifying Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/sign-in"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Back to Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-block px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Create New Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="flex justify-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verifying Email
            </h1>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
