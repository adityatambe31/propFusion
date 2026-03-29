"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";

export default function PostSignInRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth/sign-in");
      return;
    }

    // Block unverified users
    if (!session.user.emailVerified) {
      router.replace("/auth/verify-email");
      return;
    }

    // Key is scoped to user ID so stale flags from other accounts never interfere
    const onboarded = localStorage.getItem(`onboarded_${session.user.id}`);
    if (onboarded === "true") {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding/select-portfolio");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Redirecting...
    </div>
  );
}
