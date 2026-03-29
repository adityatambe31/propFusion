import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        // This is called when user signs in and has 2FA enabled
        window.location.href = "/dashboard/account/verify-2fa";
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
