# Quick Integration Example: Real Estate Dashboard

This file shows exactly how to integrate the SmartReportDialog into your Real Estate Dashboard.

## Step 1: Update Imports

In `/app/dashboard/realestate/page.tsx`, add these imports at the top:

```tsx
// Add these to your existing imports
import { SmartReportDialog } from "@/components/dashboard";
import { FileText } from "lucide-react";  // For the report icon
```

## Step 2: Add State for Dialog

In the component, after existing state declarations, add:

```tsx
export default function RealEstateDashboard() {
  // ... existing state ...
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  // ... rest of component ...
}
```

## Step 3: Add Report Button

Find this section in the JSX (around line 404):

```tsx
<div className="flex flex-wrap gap-4 mb-6">
  <Button
    onClick={() => setShowMap(false)}
    variant={!showMap ? "default" : "outline"}
  >
    Properties
  </Button>
  <Button
    onClick={() => setShowMap(true)}
    variant={showMap ? "default" : "outline"}
  >
    Map View
  </Button>
  <Button
    onClick={() => {
      resetForm();
      setShowAddModal(true);
    }}
    variant="outline"
  >
    + Add Property
  </Button>
</div>
```

**Add this new button:**

```tsx
<div className="flex flex-wrap gap-4 mb-6">
  <Button
    onClick={() => setShowMap(false)}
    variant={!showMap ? "default" : "outline"}
  >
    Properties
  </Button>
  <Button
    onClick={() => setShowMap(true)}
    variant={showMap ? "default" : "outline"}
  >
    Map View
  </Button>
  
  {/* NEW: Report Generation Button */}
  <Button
    onClick={() => setShowReportDialog(true)}
    variant="outline"
    className="gap-2"
  >
    <FileText className="w-4 h-4" />
    Generate Report
  </Button>
  
  <Button
    onClick={() => {
      resetForm();
      setShowAddModal(true);
    }}
    variant="outline"
  >
    + Add Property
  </Button>
</div>
```

## Step 4: Add Dialog Component

At the end of the component's JSX (before the closing `</main>` tag), add:

```tsx
{/* Report Generation Dialog */}
<SmartReportDialog
  open={showReportDialog}
  onOpenChange={setShowReportDialog}
  properties={properties}
  lands={[]}  // No lands in real estate dashboard
/>
```

## Full Example Section

Here's what the complete updated section looks like:

```tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SmartReportDialog } from "@/components/dashboard";  // ADD THIS
import { FileText } from "lucide-react";  // ADD THIS
// ... other imports ...

export default function RealEstateDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, addProperty, updateProperty, deleteProperty } =
    useRealEstateContext();
  const [showMap, setShowMap] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);  // ADD THIS
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  // ... rest of existing state and logic ...

  return (
    <div className="flex min-h-screen">
      <Sidebar type="real-estate" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          Real Estate Dashboard
        </h1>
        
        {/* Button Bar - UPDATED */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={() => setShowMap(false)}
            variant={!showMap ? "default" : "outline"}
          >
            Properties
          </Button>
          <Button
            onClick={() => setShowMap(true)}
            variant={showMap ? "default" : "outline"}
          >
            Map View
          </Button>
          
          {/* NEW: Report Generation Button */}
          <Button
            onClick={() => setShowReportDialog(true)}
            variant="outline"
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          
          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            variant="outline"
          >
            + Add Property
          </Button>
        </div>

        {/* ... rest of existing UI ... */}
        
        {/* NEW: Report Generation Dialog - ADD AT THE END */}
        <SmartReportDialog
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
          properties={properties}
          lands={[]}
        />
      </main>
    </div>
  );
}
```

## For Agriculture Dashboard

Similarly, for `/app/dashboard/agriculture/page.tsx`:

```tsx
// Imports
import { SmartReportDialog } from "@/components/dashboard";
import { FileText } from "lucide-react";

// State
const [showReportDialog, setShowReportDialog] = useState(false);

// Button
<Button
  onClick={() => setShowReportDialog(true)}
  variant="outline"
  className="gap-2"
>
  <FileText className="w-4 h-4" />
  Generate Report
</Button>

// Dialog
<SmartReportDialog
  open={showReportDialog}
  onOpenChange={setShowReportDialog}
  properties={[]}  // No properties in agriculture dashboard
  lands={lands}
/>
```

## For Combined Dashboard

For a dashboard that shows both real estate and agriculture:

```tsx
// Imports
import {
  useRealEstateContext,
  Property,
} from "@/app/dashboard/realestate/real-estate-context";
import {
  useAgricultureContext,
  Land,
} from "@/app/dashboard/agriculture/agriculture-context";
import { SmartReportDialog } from "@/components/dashboard";

export default function DashboardOverview() {
  const { properties } = useRealEstateContext();
  const { lands } = useAgricultureContext();
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <>
      {/* Existing UI */}
      <Button
        onClick={() => setShowReportDialog(true)}
        className="gap-2"
      >
        <FileText className="w-4 h-4" />
        Export Full Portfolio
      </Button>

      {/* Dialog - Shows all items from both portfolios */}
      <SmartReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        properties={properties}
        lands={lands}
      />
    </>
  );
}
```

## Testing Your Integration

1. **Check for errors:**
   ```
   - Run `npm run dev`
   - Open browser console (F12)
   - Check for any red error messages
   ```

2. **Test report generation:**
   - Add some properties
   - Click "Generate Report" button
   - Select a property
   - Click next
   - Choose PDF format
   - Click "Download Report"
   - Verify PDF downloads

3. **Test multiple selections:**
   - Add 3-5 properties
   - Select multiple properties (not all)
   - Select "Real Estate" report type
   - Generate PDF
   - Verify only selected properties appear

4. **Test CSV format:**
   - Repeat above but select CSV format
   - Verify CSV opens in spreadsheet app
   - Check that data is properly formatted

## Styling Customization

The report button uses the standard Button component styling. You can customize it:

```tsx
// Highlight style
<Button
  onClick={() => setShowReportDialog(true)}
  className="bg-blue-600 hover:bg-blue-700 gap-2"
>
  <FileText className="w-4 h-4" />
  Generate Report
</Button>

// Smaller style
<Button
  onClick={() => setShowReportDialog(true)}
  size="sm"
  variant="outline"
  className="gap-2"
>
  <FileText className="w-4 h-4" />
  Report
</Button>

// With icon only
<Button
  onClick={() => setShowReportDialog(true)}
  size="icon"
  title="Generate Report"
>
  <FileText className="w-4 h-4" />
</Button>
```

## Troubleshooting Integration

### Problem: "Cannot find module 'SmartReportDialog'"
**Solution:** Make sure you exported it from `components/dashboard/index.ts`
```bash
# Verify in components/dashboard/index.ts
export { SmartReportDialog } from "./SmartReportDialog";
```

### Problem: Checkbox styling looks off
**Solution:** Ensure Tailwind CSS is properly configured and @radix-ui/react-checkbox is installed
```bash
npm install @radix-ui/react-checkbox
npm run dev  # Restart dev server
```

### Problem: "Cannot read properties of undefined (reading 'id')"
**Solution:** Ensure properties have an `id` field:
```tsx
// Properties must have id field
properties.map(p => ({
  id: p.id || crypto.randomUUID(),  // Add if missing
  ...p
}))
```

## Performance Tips

- If you have 100+ properties/lands, consider pagination
- The dialog shows all items, so very large lists may scroll a lot
- Consider adding a "favorites" feature to pre-select common items

## Next: Advanced Features

Once basic integration works, consider adding:
- Pre-select "starred" or "favorite" items
- Save report templates
- Email reports directly
- Schedule regular reports
- Filter items before opening dialog
