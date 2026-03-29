"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Tenant {
  id: string;
  name: string;
  leaseType?: string; // e.g., "Apartment 301"
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

export interface PropertyExpenses {
  maintenance: string;
  taxes: string;
  insurance: string;
  utilities: string;
  loanEMI: string;
  managementFees: string;
  other: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  zip?: string;
  type: string; // "Condo", "Apartment", "Townhouse", "Detached House"
  unit: string;
  tenantCount: number;
  tenants: Tenant[];
  area: string;
  leaseDuration: string;
  price: string;
  coordinates: { lat: number; lng: number };
  documents?: Document[];
  parcelNumber?: string;
  zoning?: string;
  structures?: string[];
  amenities?: string[];
  utilities?: string[];
  systems?: string;
  status: string; // "Occupied", "Vacant", "Under Maintenance"
  description?: string;
  // Financial tracking
  purchasePrice?: string;
  purchaseDate?: string;
  currentValue?: string;
  expenses?: PropertyExpenses;
  // Vacancy tracking
  vacantSince?: string;
  daysVacant?: number;
  // Maintenance tracking
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  // Lease tracking
  leaseStartDate?: string;
  leaseEndDate?: string;
  // Property image
  image?: string;
}

interface RealEstateContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updatedProperty: Property) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(
  undefined,
);

export function RealEstateProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Skyline Towers",
      location: "Downtown, Toronto",
      city: "Toronto",
      state: "ON",
      type: "Condo",
      unit: "3 BHK",
      tenantCount: 2,
      tenants: [
        {
          id: "t1",
          name: "Aditya Tambe",
          leaseType: "Apartment 301",
          duration: "1 year",
          docs: ["Lease301.pdf"],
        },
        {
          id: "t2",
          name: "Manpreet Singh",
          leaseType: "Apartment 1002",
          duration: "2 years",
          docs: ["Lease302.pdf"],
        },
      ],
      area: "1500 sq ft",
      leaseDuration: "5 years",
      price: "$3500/month",
      coordinates: { lat: 43.65107, lng: -79.347015 }, // Toronto coordinates
      documents: [],
      status: "Occupied",
      parcelNumber: "TO-123-456",
      zoning: "Residential (R)",
      structures: ["Underground Parking", "Gym"],
      amenities: ["Pool", "Concierge", "Rooftop Terrace"],
      utilities: ["Hydro", "Water"],
      systems: "Central HVAC",
      // Financial data
      purchasePrice: "$850,000",
      purchaseDate: "2022-06-15",
      currentValue: "$920,000",
      expenses: {
        maintenance: "$200/month",
        taxes: "$450/month",
        insurance: "$150/month",
        utilities: "$0/month",
        loanEMI: "$2,800/month",
        managementFees: "$350/month",
        other: "$50/month",
      },
      lastMaintenanceDate: "2025-11-20",
      leaseStartDate: "2024-01-01",
      leaseEndDate: "2029-01-01",
    },
    {
      id: "2",
      name: "Maplewood Suites",
      location: "North York, Toronto",
      city: "Toronto",
      state: "ON",
      type: "Apartment",
      unit: "2 BHK",
      tenantCount: 1,
      tenants: [
        {
          id: "t3",
          name: "Sarah Chen",
          leaseType: "Suite 505",
          duration: "1 year",
          docs: ["Lease505.pdf"],
        },
      ],
      area: "950 sq ft",
      leaseDuration: "2 years",
      price: "$2400/month",
      coordinates: { lat: 43.7615, lng: -79.4111 },
      documents: [],
      status: "Occupied",
      parcelNumber: "TO-456-789",
      zoning: "Residential (R2)",
      structures: ["Parking Lot", "Laundry Room"],
      amenities: ["Balcony", "Storage Locker"],
      utilities: ["Water", "Heat"],
      systems: "Central Boiler",
      purchasePrice: "$520,000",
      purchaseDate: "2021-02-10",
      currentValue: "$585,000",
      expenses: {
        maintenance: "$150/month",
        taxes: "$300/month",
        insurance: "$100/month",
        utilities: "$50/month",
        loanEMI: "$1,900/month",
        managementFees: "$200/month",
        other: "$25/month",
      },
      lastMaintenanceDate: "2025-09-15",
      leaseStartDate: "2024-05-01",
      leaseEndDate: "2026-05-01",
    },
    {
      id: "3",
      name: "Birchwood Row",
      location: "Etobicoke, Toronto",
      city: "Toronto",
      state: "ON",
      type: "Townhouse",
      unit: "Unit 12",
      tenantCount: 0,
      tenants: [],
      area: "1800 sq ft",
      leaseDuration: "3 years",
      price: "$4200/month",
      coordinates: { lat: 43.6205, lng: -79.5132 },
      documents: [],
      status: "Vacant",
      parcelNumber: "ET-789-012",
      zoning: "Residential (RT)",
      structures: ["Attached Garage", "Backyard"],
      amenities: ["Patios", "Private Garden"],
      utilities: ["Gas", "Electricity"],
      systems: "Forced Air",
      purchasePrice: "$1,100,000",
      purchaseDate: "2023-11-20",
      currentValue: "$1,150,000",
      expenses: {
        maintenance: "$300/month",
        taxes: "$600/month",
        insurance: "$200/month",
        utilities: "$250/month",
        loanEMI: "$4,200/month",
        managementFees: "$400/month",
        other: "$100/month",
      },
      vacantSince: "2025-12-01",
      daysVacant: 95,
      lastMaintenanceDate: "2026-01-10",
    },
    {
      id: "4",
      name: "Sunset Villa",
      location: "Oakville, ON",
      city: "Oakville",
      state: "ON",
      type: "Detached House",
      unit: "Main Residence",
      tenantCount: 1,
      tenants: [
        {
          id: "t4",
          name: "Robert Miller",
          leaseType: "Full House",
          duration: "2 years",
        },
      ],
      area: "3200 sq ft",
      leaseDuration: "2 years",
      price: "$6500/month",
      coordinates: { lat: 43.4675, lng: -79.6877 },
      documents: [],
      status: "Occupied",
      parcelNumber: "OK-345-678",
      zoning: "Residential (R1)",
      structures: ["Detached Garage", "Swimming Pool", "Guest House"],
      amenities: ["Chef's Kitchen", "Home Theater", "Wine Cellar"],
      utilities: ["Solar Power", "Septic", "Well Water"],
      systems: "Geothermal HVAC",
      purchasePrice: "$2,800,000",
      purchaseDate: "2024-08-01",
      currentValue: "$3,100,000",
      expenses: {
        maintenance: "$800/month",
        taxes: "$1,200/month",
        insurance: "$400/month",
        utilities: "$100/month",
        loanEMI: "$8,500/month",
        managementFees: "$500/month",
        other: "$200/month",
      },
      lastMaintenanceDate: "2025-12-25",
      leaseStartDate: "2024-09-01",
      leaseEndDate: "2026-09-01",
    },
    {
      id: "5",
      name: "Tech Hub Plaza",
      location: "Liberty Village, Toronto",
      city: "Toronto",
      state: "ON",
      type: "Office",
      unit: "Floors 2-4",
      tenantCount: 3,
      tenants: [
        {
          id: "t5",
          name: "Quantum Softwares",
          leaseType: "Commercial - Floor 2",
          duration: "5 years",
        },
        {
          id: "t6",
          name: "Creative Pulse Agency",
          leaseType: "Commercial - Floor 3",
          duration: "3 years",
        },
      ],
      area: "12,500 sq ft",
      leaseDuration: "5 years",
      price: "$28,000/month",
      coordinates: { lat: 43.6385, lng: -79.4215 },
      documents: [],
      status: "Occupied",
      parcelNumber: "TO-901-234",
      zoning: "Commercial (C1)",
      structures: ["Parking Garage", "Server Room", "Cafeteria"],
      amenities: ["High-speed Fiber", "Conference Rooms", "24/7 Security"],
      utilities: ["Hydro", "Commercial Water", "Gas"],
      systems: "Variable Refrigerant Flow (VRF)",
      purchasePrice: "$12,400,000",
      purchaseDate: "2019-05-12",
      currentValue: "$14,200,000",
      expenses: {
        maintenance: "$2,500/month",
        taxes: "$4,800/month",
        insurance: "$1,200/month",
        utilities: "$3,500/month",
        loanEMI: "$18,000/month",
        managementFees: "$2,200/month",
        other: "$500/month",
      },
      lastMaintenanceDate: "2026-02-15",
      leaseStartDate: "2020-01-01",
      leaseEndDate: "2030-01-01",
    },
    {
      id: "6",
      name: "Lakeside Logistics",
      location: "Mississauga, ON",
      city: "Mississauga",
      state: "ON",
      type: "Industrial",
      unit: "Bay A & B",
      tenantCount: 1,
      tenants: [
        {
          id: "t7",
          name: "Global Freight Inc.",
          leaseType: "Industrial Triple-Net (NNN)",
          duration: "10 years",
        },
      ],
      area: "45,000 sq ft",
      leaseDuration: "10 years",
      price: "$52,000/month",
      coordinates: { lat: 43.589, lng: -79.6441 },
      documents: [],
      status: "Occupied",
      parcelNumber: "MS-567-890",
      zoning: "Industrial (M2)",
      structures: ["Loading Docks", "High-Bay Racking", "Office Mezzanine"],
      amenities: ["Container Parking", "Heavy Power (600V)", "Gated Perimeter"],
      utilities: ["Industrial Gas", "Water"],
      systems: "ESFR Sprinkler System",
      purchasePrice: "$18,500,000",
      purchaseDate: "2020-11-30",
      currentValue: "$22,800,000",
      expenses: {
        maintenance: "$1,000/month",
        taxes: "$0/month", // NNN Lease
        insurance: "$0/month", // NNN Lease
        utilities: "$0/month", // NNN Lease
        loanEMI: "$24,500/month",
        managementFees: "$1,500/month",
        other: "$400/month",
      },
      lastMaintenanceDate: "2025-08-10",
      leaseStartDate: "2021-01-01",
      leaseEndDate: "2031-01-01",
    },
    {
      id: "7",
      name: "Heritage Lofts",
      location: "Distillery District, Toronto",
      city: "Toronto",
      state: "ON",
      type: "Office",
      unit: "Unit 102",
      tenantCount: 0,
      tenants: [],
      area: "4,200 sq ft",
      leaseDuration: "3 years",
      price: "$0/month",
      coordinates: { lat: 43.6503, lng: -79.3596 },
      documents: [],
      status: "Under Maintenance",
      parcelNumber: "TO-234-567",
      zoning: "Commercial (C2)",
      structures: ["Historic Masonry", "Exposed Beams"],
      amenities: ["Shared Entrance", "Brick & Beam Aesthetic"],
      utilities: ["Hydro", "Water"],
      systems: "HVAC Upgrade in Progress",
      purchasePrice: "$3,200,000",
      purchaseDate: "2022-03-20",
      currentValue: "$3,800,000",
      expenses: {
        maintenance: "$4,500/month", // Higher due to overhaul
        taxes: "$1,800/month",
        insurance: "$600/month",
        utilities: "$800/month",
        loanEMI: "$12,000/month",
        managementFees: "$0/month",
        other: "$300/month",
      },
      lastMaintenanceDate: "2026-03-01",
    },
  ]);

  const addProperty = (property: Property) => {
    setProperties((prev) => [...prev, property]);
  };

  const updateProperty = (id: string, updatedProperty: Property) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === id ? updatedProperty : prop)),
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
  };

  const getProperty = (id: string) => {
    return properties.find((prop) => prop.id === id);
  };

  return (
    <RealEstateContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getProperty,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
}

export function useRealEstateContext() {
  const context = useContext(RealEstateContext);
  if (context === undefined) {
    throw new Error(
      "useRealEstateContext must be used within a RealEstateProvider",
    );
  }
  return context;
}
