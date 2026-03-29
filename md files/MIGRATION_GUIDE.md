# Migration Guide: Context → Database Hooks

## Overview
This guide helps you migrate from in-memory React context to persistent MongoDB + hooks.

---

## 🔄 Real Estate Migration

### Before (Old Context)
```typescript
// app/dashboard/realestate/page.tsx
"use client";
import { useContext } from "react";
import { RealEstateContext } from "./real-estate-context";

export function RealEstatePage() {
  const { properties, addProperty, updateProperty, deleteProperty } = useContext(RealEstateContext);
  
  // Data is lost on page refresh ❌
}
```

### After (New Hooks)
```typescript
// app/dashboard/realestate/page.tsx
"use client";
import { useProperties } from "@/lib/hooks";

export function RealEstatePage() {
  const { properties, addProperty, updateProperty, deleteProperty, loading } = useProperties();
  
  if (loading) return <Skeleton />;
  
  // Data persists across page refreshes ✅
}
```

### Migration Checklist
- [ ] Import `useProperties` from `@/lib/hooks`
- [ ] Remove `useContext(RealEstateContext)` 
- [ ] Remove `RealEstateProvider` wrapper (optional, can leave in place)
- [ ] Add loading state handling
- [ ] Test add/edit/delete operations
- [ ] Verify data persists on page refresh

---

## 🌾 Agriculture Migration

### Before (Old Context)
```typescript
// app/dashboard/agriculture/page.tsx
"use client";
import { useContext } from "react";
import { AgricultureContext } from "./agriculture-context";

export function AgriculturePage() {
  const { lands, addLand, updateLand, deleteLand } = useContext(AgricultureContext);
  
  // Data is lost on page refresh ❌
}
```

### After (New Hooks)
```typescript
// app/dashboard/agriculture/page.tsx
"use client";
import { useLands } from "@/lib/hooks";

export function AgriculturePage() {
  const { lands, addLand, updateLand, deleteLand, loading, error } = useLands();
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorAlert error={error} />;
  
  // Data persists across page refreshes ✅
}
```

### Migration Checklist
- [ ] Import `useLands` from `@/lib/hooks`
- [ ] Remove `useContext(AgricultureContext)`
- [ ] Remove `AgricultureProvider` wrapper (optional)
- [ ] Add loading & error state handling
- [ ] Test all operations
- [ ] Verify persistence

---

## 💻 Component-Level Changes

### Before: Adding a Property
```typescript
const handleAddProperty = () => {
  const newProperty = {
    id: "1",
    name: "New Property",
    location: "Address",
    // ... other fields
  };
  addProperty(newProperty); // Immediate, no await
  // Data lost on refresh ❌
};
```

### After: Adding a Property
```typescript
const handleAddProperty = async () => {
  try {
    const newProperty = await addProperty({
      name: "New Property",
      location: "Address",
      // ... other fields (no id needed)
    });
    toast.success("Property created!");
    // Data persisted in MongoDB ✅
  } catch (error) {
    toast.error("Failed to create property");
  }
};
```

### Key Differences
| Aspect | Context | Hooks |
|--------|---------|-------|
| Async | No (local) | Yes (API calls) |
| Error handling | Manual | Built-in |
| Loading state | Manual | Included |
| Persistence | No ❌ | Yes ✅ |
| ID generation | You provide | Auto-generated |

---

## 🔧 Function Signatures

### Properties
```typescript
// Add property
const newProp = await addProperty({
  name: string,
  location: string,
  city?: string,
  state?: string,
  type: string,
  tenants: Tenant[],
  // ... all Property fields except id, userId, createdAt, updatedAt
});

// Update property
const updated = await updateProperty(propertyId, {
  status?: string,
  price?: string,
  tenants?: Tenant[],
  // ... any subset of fields
});

// Delete property
await deleteProperty(propertyId);
```

### Lands
```typescript
// Add land
const newLand = await addLand({
  name: string,
  location: string,
  crop: string,
  area: string,
  // ... all Land fields except id, userId, createdAt, updatedAt
});

// Update land
const updated = await updateLand(landId, {
  crop?: string,
  profit?: string,
  expenses?: LandExpenses,
  // ... any subset of fields
});

// Delete land
await deleteLand(landId);
```

---

## 📊 API Responses

### Properties List
```typescript
GET /api/properties
→ { properties: Property[] }
```

### Create Property
```typescript
POST /api/properties
Body: { name, location, type, ... }
→ { property: Property }
```

### Update Property
```typescript
PUT /api/properties/:id
Body: { status, price, ... }
→ { property: Property }
```

### Delete Property
```typescript
DELETE /api/properties/:id
→ { success: true }
```

### Same for `/api/lands/...`

---

## 🚨 Common Pitfalls

### ❌ Don't: Forget to await
```typescript
// WRONG - no await
addProperty(newProp);
console.log(properties.length); // Still 0!

// CORRECT - with await
const newProp = await addProperty({ ... });
console.log(properties.length); // Now 1
```

### ❌ Don't: Ignore loading state
```typescript
// WRONG - no loading handling
const { properties } = useProperties();
return <PropertyList items={properties} />; // Flashes empty list

// CORRECT - handle loading
const { properties, loading } = useProperties();
if (loading) return <Skeleton />;
return <PropertyList items={properties} />;
```

### ❌ Don't: Provide ID when creating
```typescript
// WRONG - ID is auto-generated
const newProp = await addProperty({
  id: "my-id", // ❌ Remove this!
  name: "Property",
  ...
});

// CORRECT - no ID field
const newProp = await addProperty({
  name: "Property",
  ...
});
```

### ❌ Don't: Mix old and new approaches
```typescript
// WRONG - mixing both
const contextData = useContext(RealEstateContext);
const hookData = useProperties();
// Confusion and data inconsistency!

// CORRECT - use only hooks
const { properties } = useProperties();
```

---

## ✅ Migration Steps

### Phase 1: Setup (1-2 hours)
1. Ensure `.env.local` has `MONGODB_URI`
2. Run `npm install` (no new deps needed, just checking)
3. Database will auto-initialize on first API call

### Phase 2: Test Endpoints (30 mins)
1. Use Postman/curl to test each endpoint
2. Verify create/read/update/delete work
3. Check data appears in MongoDB

### Phase 3: Update Components (2-4 hours)
1. Start with one page (e.g., real estate dashboard)
2. Replace context with hooks
3. Add loading/error states
4. Test thoroughly
5. Repeat for other pages

### Phase 4: Verify & Deploy (1 hour)
1. Test all CRUD operations in UI
2. Refresh page - data should persist ✅
3. Clear browser cache - data still there ✅
4. Deploy with confidence!

---

## 🔍 Verification Checklist

After migration, verify:

- [ ] Adding new property/land works
- [ ] Data persists after page refresh ✅
- [ ] Editing updates in real-time
- [ ] Deleting removes immediately
- [ ] Loading states appear briefly
- [ ] Error messages display on failures
- [ ] No console errors
- [ ] MongoDB shows new documents
- [ ] Each user only sees their own data
- [ ] Statistics endpoint works

---

## 🆘 If Something Goes Wrong

### "Property not found" error
```
→ Check userId matches authenticated user
→ Verify property ID is correct
→ Check MongoDB has the document
```

### "Failed to create property"
```
→ Check required fields (name, location)
→ Verify MONGODB_URI in .env
→ Check network request in DevTools
```

### Data disappeared after refresh
```
→ Ensure you're using useProperties/useLands (not old context)
→ Check MongoDB connection
→ Verify MONGODB_URI credentials
```

### Hooks not subscribed to changes
```
→ useProperties() auto-fetches on mount
→ Changes are optimistic (reflected immediately)
→ If data still stale, call refreshProperties() manually
```

---

## 📞 Support Resources

1. **IMPLEMENTATION_SUMMARY.md** - Detailed technical docs
2. **QUICK_START.md** - Code examples
3. **API Routes** - Self-documented in `/app/api/properties` and `/app/api/lands`
4. **TypeScript Types** - Check `lib/db/types.ts` for all field definitions

---

**Good luck with your migration! 🚀**
