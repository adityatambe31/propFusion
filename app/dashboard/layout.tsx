"use client";

import { RealEstateProvider } from "./realestate/real-estate-context";
import { AgricultureProvider } from "./agriculture/agriculture-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RealEstateProvider>
      <AgricultureProvider>{children}</AgricultureProvider>
    </RealEstateProvider>
  );
}
