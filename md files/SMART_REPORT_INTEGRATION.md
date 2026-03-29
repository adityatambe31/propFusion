# Smart Report Generation Integration Guide

## Overview
The Smart Report Generation system allows users to select specific properties and lands and generate customized PDF or CSV reports containing only those selected items.

## Features
- ✅ **Multi-select** interface with checkboxes for properties and lands
- ✅ **Real-time selection tracking** showing total items selected
- ✅ **Multiple report types**: Real Estate only, Agricultural Lands only, or Combined Portfolio
- ✅ **Multiple export formats**: PDF (beautifully formatted) or CSV (spreadsheet-compatible)
- ✅ **Tab-based UI** for smooth workflow: Select Items → Choose Type → Generate
- ✅ **Type-specific reports** with relevant data fields for each portfolio type
- ✅ **User authorization** checks to ensure users only export their own data

## Components Created

### 1. SmartReportDialog Component
**File:** `components/dashboard/SmartReportDialog.tsx`
- Main UI component for the report generation workflow
- Three tabs: "Select Items", "Report Type", "Generate"
- Shows real-time count of selected items
- Displays available report options based on selections

**Usage:**
```tsx
import { SmartReportDialog } from "@/components/dashboard";
import { useState } from "react";

export default function MyDashboard({ properties, lands }) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  return (
    <>
      <button onClick={() => setReportDialogOpen(true)}>
        Generate Report
      </button>
      
      <SmartReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        properties={properties}
        lands={lands}
      />
    </>
  );
}
```

### 2. useReportSelection Hook
**File:** `lib/hooks/useReportSelection.ts`
- Manages selection state for properties and lands
- Provides methods: `toggleProperty`, `toggleLand`, `selectAll`, `clear`
- Tracks `totalSelected` and `hasSelection`

**Usage:**
```tsx
const {
  selectedPropertyIds,
  selectedLandIds,
  toggleProperty,
  toggleLand,
  clearAll,
  totalSelected,
} = useReportSelection();
```

### 3. PDF Generator (Selected Items)
**File:** `lib/export/selected-pdf-generator.ts`
- Generates beautifully formatted PDF reports for selected items only
- Three functions:
  - `generateSelectedPropertiesReportPDF()` - Real estate focused
  - `generateSelectedLandsReportPDF()` - Agriculture focused
  - `generateSelectedCombinedReportPDF()` - Portfolio overview

**Features:**
- Summary statistics (occupancy, value, crop diversity)
- Detailed item listings with key metrics
- Professional formatting with company branding
- Multi-page support for large selections

### 4. API Endpoint
**File:** `app/api/export/selected/route.ts`
- POST endpoint at `/api/export/selected`
- Accepts request body:
```json
{
  "type": "properties|lands|combined",
  "format": "pdf|csv",
  "ids": {
    "properties": ["id1", "id2"],
    "lands": ["id3", "id4"]
  }
}
```

**Returns:**
- PDF: Binary PDF file for download
- CSV: Text CSV file for download

## Integration Steps

### Step 1: Install Dependencies
```bash
npm install @radix-ui/react-checkbox
```

### Step 2: Add to Your Dashboard Page
```tsx
import { SmartReportDialog } from "@/components/dashboard";
import { useState } from "react";

export default function RealEstateDashboard({ properties, lands }) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  return (
    <>
      {/* Existing UI */}
      <button 
        onClick={() => setReportDialogOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        📊 Generate Report
      </button>

      {/* New Report Dialog */}
      <SmartReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        properties={properties}
        lands={lands}
      />
    </>
  );
}
```

### Step 3: Data Format Requirements

**Property Data Structure:**
```typescript
{
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  type: string;
  status: "Occupied" | "Vacant" | "Under Maintenance";
  price?: string;
  currentValue?: string;
  purchasePrice?: string;
  tenantCount?: number;
  area?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  description?: string;
  // ... other property fields
}
```

**Land Data Structure:**
```typescript
{
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  crop: string;
  area: string;
  currentValue?: string;
  purchasePrice?: string;
  revenue?: string;
  profit?: string;
  yieldPerAcre?: string;
  cropSeason?: string;
  plantingDate?: string;
  nextHarvestDate?: string;
  // ... other land fields
}
```

## Usage Examples

### Example 1: Basic Implementation (Real Estate Only)
```tsx
export default function RealEstatePage() {
  const { properties } = useRealEstateContext();
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowReportDialog(true)}>
        Generate Report
      </Button>
      
      <SmartReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        properties={properties}
        lands={[]}
      />
    </div>
  );
}
```

### Example 2: Combined Portfolio Report
```tsx
export default function DashboardOverview() {
  const { properties } = useRealEstateContext();
  const { lands } = useAgricultureContext();
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowReportDialog(true)}>
        📊 Export Portfolio Report
      </Button>
      
      <SmartReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        properties={properties}
        lands={lands}
      />
    </div>
  );
}
```

## Report Types and What They Include

### Real Estate Report (PDF)
```
Property Portfolio Report
├─ Summary Statistics
│  ├─ Total Properties
│  ├─ Occupied vs Vacant
│  └─ Combined Portfolio Value
├─ Property Details (for each selected)
│  ├─ Name & Location
│  ├─ Type & Status
│  ├─ Tenant Info
│  ├─ Pricing
│  └─ Description
```

### Agricultural Report (PDF)
```
Agricultural Land Report
├─ Summary Statistics
│  ├─ Total Lands
│  ├─ Crop Diversity
│  ├─ Total Area
│  └─ Combined Land Value
├─ Land Details (for each selected)
│  ├─ Name & Location
│  ├─ Crop Type & Area
│  ├─ Profitability
│  ├─ Seasons & Yields
│  └─ Current Value
```

### Combined Portfolio Report (PDF)
```
Portfolio Report (Selected Items)
├─ Portfolio Summary
│  ├─ Real Estate: N properties
│  ├─ Agriculture: N lands
│  └─ Combined Value
├─ Real Estate Properties Section
│  └─ Quick summaries (name, location, value)
├─ Agricultural Lands Section
│  └─ Quick summaries (name, crop, value)
```

### CSV Reports
All report types generate CSV with:
- **Real Estate CSV**: Name, Location, Type, Status, Value, Tenant Count (and more)
- **Agriculture CSV**: Name, Location, Crop, Area, Value, Yield Info (and more)
- **Combined CSV**: Separated sections for properties and lands

## API Response Handling

The SmartReportDialog component automatically handles:
1. **Selection management** - Tracks which items user selected
2. **Report generation** - POSTs to `/api/export/selected` with selections
3. **Format conversion** - Generates PDF or CSV based on user choice
4. **File download** - Automatically triggers browser download with filename
5. **Error handling** - Shows user-friendly error messages

## User Workflow

1. **Select Items Tab**
   - User sees all available properties and lands
   - Checks boxes to select items for the report
   - Can "Select All" or "Clear" per category
   - Badge shows total items selected (e.g., "5" items)

2. **Report Type Tab**
   - Shows 3 report options based on what's selected:
     - 🏠 Real Estate (only if properties selected)
     - 🌾 Agricultural Lands (only if lands selected)
     - 📊 Combined Portfolio (if both selected)
   - User chooses PDF or CSV format
   - Preview shows what will be included

3. **Generate Tab**
   - Summary shows report details (type, format, item count)
   - User clicks "Download Report"
   - Browser downloads file with timestamp in filename
   - Dialog closes automatically

## Customization

### Change Report Title
```tsx
// In selected-pdf-generator.ts
export function generateSelectedPropertiesReportPDF(
  properties: Property[],
  options: ReportOptions = {},
): Buffer {
  const {
    title = "My Custom Report Title", // Change here
    includeFooter = true
  } = options;
  // ...
}
```

### Add Company Branding
```tsx
// In selected-pdf-generator.ts
doc.setDrawColor(50, 120, 220); // Your company color
doc.setFillColor(240, 245, 255);

// Add logo if needed
// const logoUrl = "/your-logo.png";
```

### Modify CSV Fields
```tsx
// In app/api/export/selected/route.ts
function generatePropertiesCSV(properties: any[]): string {
  const headers = [
    "Name",
    "Location",
    // Add or remove headers here
    "City State",
    "Custom Field",
  ];
}
```

## Troubleshooting

### Issue: "Checkbox not found" error
**Solution:** Install @radix-ui/react-checkbox
```bash
npm install @radix-ui/react-checkbox
```

### Issue: Dialog doesn't show selected items
**Solution:** Ensure properties/lands data is passed correctly and has `id` field
```tsx
// ❌ Wrong - missing id
const properties = [{ name: "House 1" }];

// ✅ Correct
const properties = [{ id: "1", name: "House 1" }];
```

### Issue: Download not working
**Solution:** Check browser console for errors and ensure API endpoint is accessible
```bash
# Test endpoint
curl -X POST http://localhost:3000/api/export/selected \
  -H "Content-Type: application/json" \
  -d '{"type":"properties","format":"pdf","ids":{"properties":["1"],"lands":[]}}'
```

## Performance Considerations

- **Large selections:** Reports with 100+ items may take a few seconds
- **PDF generation:** jsPDF generates in-memory, suitable for up to 500+ items
- **CSV generation:** Very fast, suitable for 1000+ items
- **Client-side:** All processing happens client-side after API returns data

## Security

✅ **Built-in security features:**
- User authentication check on API endpoint
- User-scoped data queries (users can only see their own items)
- Input validation for report types and formats
- XSS protection via proper data handling

## Next Steps

1. ✅ Install dependencies
2. ✅ Add SmartReportDialog to your dashboard pages
3. ✅ Ensure data structures match Property/Land interfaces
4. ✅ Test report generation with sample data
5. ✅ Customize report titles and branding as needed
6. ✅ Consider scheduling reports for non-interactive use

## File Reference

- **Components:**
  - `components/dashboard/SmartReportDialog.tsx` - Main UI
  - `components/ui/checkbox.tsx` - Checkbox component

- **Hooks:**
  - `lib/hooks/useReportSelection.ts` - Selection management

- **Utilities:**
  - `lib/export/selected-pdf-generator.ts` - PDF generation
  - `app/api/export/selected/route.ts` - API endpoint

- **Dependencies:**
  - `@radix-ui/react-checkbox` - Checkbox UI primitive
  - `jspdf` - PDF generation (already installed)
  - `lucide-react` - Icons (already installed)
