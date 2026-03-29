"use client";

import { AuthView } from "@daveyplate/better-auth-ui";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <AuthView view="SIGN_IN" callbackURL="/auth/post-signin-redirect" />
      </div>
    </div>
  );
}
