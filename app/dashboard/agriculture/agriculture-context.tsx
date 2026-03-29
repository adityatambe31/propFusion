"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Tenant {
  id: string;
  name: string;
  leaseType?: string;
  duration?: string;
  docs?: string[];
  rentAmount?: string;
  leaseStart?: string;
  leaseEnd?: string;
  paymentStatus?: "current" | "late" | "overdue";
  lastPaymentDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string; // 'lease_agreement' | 'bill' | 'invoice' | 'other'
  file: File | null;
  url?: string; // For future use
}

export interface LandExpenses {
  seeds: string;
  labor: string;
  equipment: string;
  fertilizers: string;
  pesticides: string;
  irrigation: string;
  taxes: string;
  insurance: string;
  other: string;
}

export interface Land {
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  zip?: string;
  crop: string;
  area: string;
  leaseDuration: string;
  profit: string;
  vehicles: string[];
  animals: string[];
  fertilizers: string[];
  tenants: Tenant[];
  coordinates: { lat: number; lng: number };
  parcelNumber?: string;
  zoning?: string;
  irrigation?: string;
  leaseHolderName?: string;
  documents?: Document[];
  // Financial tracking
  purchasePrice?: string;
  purchaseDate?: string;
  currentValue?: string;
  expenses?: LandExpenses;
  revenue?: string; // Annual revenue from crops
  // Yield tracking
  yieldPerAcre?: string;
  expectedYield?: string;
  // Harvest tracking
  lastHarvestDate?: string;
  nextHarvestDate?: string;
  plantingDate?: string;
  // Season
  cropSeason?: string; // "Kharif", "Rabi", "Zaid"
  // Land image
  image?: string;
}

interface AgricultureContextType {
  lands: Land[];
  addLand: (land: Land) => void;
  updateLand: (id: string, updatedLand: Land) => void;
  deleteLand: (id: string) => void;
  getLand: (id: string) => Land | undefined;
}

const AgricultureContext = createContext<AgricultureContextType | undefined>(
  undefined,
);

export function AgricultureProvider({ children }: { children: ReactNode }) {
  const [lands, setLands] = useState<Land[]>([
    {
      id: "1",
      name: "Iowa Golden Plains",
      location: "1245 Harvest Road",
      city: "Ames",
      state: "IA",
      zip: "50010",
      crop: "Cropland",
      area: "850 acres",
      leaseDuration: "3 years",
      profit: "$145,000/year",
      vehicles: ["Silo", "Workshop", "Barn"],
      animals: [],
      fertilizers: ["Urea", "NPK", "DAP"],
      tenants: [],
      coordinates: { lat: 42.0308, lng: -93.6319 },
      parcelNumber: "IA-AMES-101",
      zoning: "Agricultural",
      irrigation: "Center Pivot",
      leaseHolderName: "Miller Ag Group",
      purchasePrice: "$6,500,000",
      purchaseDate: "2018-05-15",
      currentValue: "$7,200,000",
      revenue: "$210,000/year",
      expenses: {
        seeds: "$25,000/year",
        labor: "$15,000/year",
        equipment: "$12,000/year",
        fertilizers: "$8,000/year",
        pesticides: "$3,000/year",
        irrigation: "$4,000/year",
        taxes: "$5,000/year",
        insurance: "$4,000/year",
        other: "$2,000/year",
      },
      yieldPerAcre: "195 bushels",
      cropSeason: "Summer",
      image: "https://images.unsplash.com/photo-1601593768799-76c79c56f726?w=800&q=80",
    },
    {
      id: "2",
      name: "Napa Valley Heights",
      location: "777 Silverado Trail",
      city: "Saint Helena",
      state: "CA",
      zip: "94574",
      crop: "Vineyard",
      area: "45 acres",
      leaseDuration: "Owned",
      profit: "$320,000/year",
      vehicles: ["Workshop", "Shed", "Barn"],
      animals: ["Sheep"],
      fertilizers: ["Organic", "Compost"],
      tenants: [],
      coordinates: { lat: 38.5049, lng: -122.4694 },
      parcelNumber: "CA-NAPA-777",
      zoning: "Agricultural",
      irrigation: "Drip",
      leaseHolderName: "Owner Operated",
      purchasePrice: "$12,000,000",
      purchaseDate: "2015-10-20",
      currentValue: "$15,500,000",
      revenue: "$480,000/year",
      expenses: {
        seeds: "$0/year",
        labor: "$85,000/year",
        equipment: "$25,000/year",
        fertilizers: "$12,000/year",
        pesticides: "$15,000/year",
        irrigation: "$6,000/year",
        taxes: "$22,000/year",
        insurance: "$18,000/year",
        other: "$10,000/year",
      },
      yieldPerAcre: "4.2 tons",
      cropSeason: "Autumn",
      image: "https://images.unsplash.com/photo-1542665093-8b744a4f5d3c?w=800&q=80",
    },
    {
      id: "3",
      name: "Lone Star Cattle Ranch",
      location: "88 Bluebonnet Drive",
      city: "Abilene",
      state: "TX",
      zip: "79601",
      crop: "Pasture",
      area: "3,200 acres",
      leaseDuration: "10 years",
      profit: "$85,000/year",
      vehicles: ["Barn", "Fence", "Garage"],
      animals: ["Cattle", "Horse"],
      fertilizers: ["Manure"],
      tenants: [],
      coordinates: { lat: 32.4487, lng: -99.7331 },
      parcelNumber: "TX-ABI-888",
      zoning: "Rural Agricultural",
      irrigation: "Well",
      leaseHolderName: "West Texas Land & Cattle",
      purchasePrice: "$4,200,000",
      purchaseDate: "2020-01-10",
      currentValue: "$4,800,000",
      revenue: "$130,000/year",
      expenses: {
        seeds: "$5,000/year",
        labor: "$75,000/year",
        equipment: "$30,000/year",
        fertilizers: "$2,000/year",
        pesticides: "$0/year",
        irrigation: "$5,000/year",
        taxes: "$8,000/year",
        insurance: "$12,000/year",
        other: "$4,000/year",
      },
      yieldPerAcre: "1.2 head per acre",
      cropSeason: "Yearly",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80",
    },
    {
      id: "4",
      name: "Cascadia Timberlands",
      location: "Hwy 101 West",
      city: "Olympia",
      state: "WA",
      zip: "98501",
      crop: "Timber",
      area: "12,000 acres",
      leaseDuration: " Owned",
      profit: "$2,200,000/harvest",
      vehicles: ["Workshop"],
      animals: [],
      fertilizers: ["None"],
      tenants: [],
      coordinates: { lat: 47.0379, lng: -122.9007 },
      parcelNumber: "WA-OLY-333",
      zoning: "Forestry",
      irrigation: "Rainfed",
      leaseHolderName: "Evergreen Forestry",
      purchasePrice: "$25,000,000",
      purchaseDate: "2012-08-30",
      currentValue: "$32,000,000",
      revenue: "$0/year (Growth phase)",
      expenses: {
        seeds: "$0/year",
        labor: "$12,000/year",
        equipment: "$5,000/year",
        fertilizers: "$0/year",
        pesticides: "$2,000/year",
        irrigation: "$0/year",
        taxes: "$15,000/year",
        insurance: "$5,000/year",
        other: "$3,000/year",
      },
      yieldPerAcre: "450 mbf",
      cropSeason: "Perennial",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    },
    {
      id: "5",
      name: "Urban Hydro Farm",
      location: "45 Industrial Ave",
      city: "Toronto",
      state: "ON",
      zip: "M5V 1J1",
      crop: "Greenhouse",
      area: "2 acres",
      leaseDuration: "Month-to-Month",
      profit: "$180,000/year",
      vehicles: ["Greenhouse", "Workshop", "Shed"],
      animals: [],
      fertilizers: ["NPK", "Organic"],
      tenants: [],
      coordinates: { lat: 43.6425, lng: -79.3871 },
      parcelNumber: "ON-TOR-45",
      zoning: "Commercial",
      irrigation: "Municipal",
      leaseHolderName: "CityGreens Corp",
      purchasePrice: "$1,500,000",
      purchaseDate: "2023-03-01",
      currentValue: "$1,650,000",
      revenue: "$420,000/year",
      expenses: {
        seeds: "$45,000/year",
        labor: "$110,000/year",
        equipment: "$30,000/year",
        fertilizers: "$25,000/year",
        pesticides: "$5,000/year",
        irrigation: "$18,000/year",
        taxes: "$12,000/year",
        insurance: "$8,000/year",
        other: "$5,000/year",
      },
      yieldPerAcre: "High Intensity",
      cropSeason: "Indoor-Yearly",
      image: "https://images.unsplash.com/photo-1585059895524-72359e061381?w=800&q=80",
    },
  ]);

  const addLand = (land: Land) => {
    setLands((prev) => [...prev, land]);
  };

  const updateLand = (id: string, updatedLand: Land) => {
    setLands((prev) =>
      prev.map((land) => (land.id === id ? updatedLand : land)),
    );
  };

  const deleteLand = (id: string) => {
    setLands((prev) => prev.filter((land) => land.id !== id));
  };

  const getLand = (id: string) => {
    return lands.find((land) => land.id === id);
  };

  return (
    <AgricultureContext.Provider
      value={{ lands, addLand, updateLand, deleteLand, getLand }}
    >
      {children}
    </AgricultureContext.Provider>
  );
}

export function useAgricultureContext() {
  const context = useContext(AgricultureContext);
  if (context === undefined) {
    throw new Error(
      "useAgricultureContext must be used within an AgricultureProvider",
    );
  }
  return context;
}
