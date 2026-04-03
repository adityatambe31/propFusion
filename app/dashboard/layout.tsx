"use client";

import { useEffect, useState } from "react";
import { RealEstateProvider } from "./realestate/real-estate-context";
import { AgricultureProvider } from "./agriculture/agriculture-context";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileHeader } from "@/components/dashboard/MobileHeader";
import { useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/auth/sign-in?callbackURL=/auth/post-signin-redirect");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <RealEstateProvider>
      <AgricultureProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
          {/* Global Sidebar */}
          <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
            
            <main className="flex-1 overflow-y-auto scroll-smooth">
              {children}
            </main>
          </div>
        </div>
      </AgricultureProvider>
    </RealEstateProvider>
  );
}
