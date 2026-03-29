# Quick Reference Guide - Using New Features

## 🏠 Persistent Properties (Real Estate)

### In Component
```typescript
"use client";
import { useProperties } from "@/lib/hooks";

export function MyPropertiesPage() {
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map(prop => (
        <div key={prop.id}>
          <h3>{prop.name}</h3>
          <p>{prop.location}</p>
          <p>Status: {prop.status}</p>
          <button onClick={() => updateProperty(prop.id, { status: "Vacant" })}>
            Mark Vacant
          </button>
          <button onClick={() => deleteProperty(prop.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### API Endpoints
```bash
# Get all properties
GET /api/properties

# Create property
POST /api/properties
Body: { name, location, type, city, state, zip, ... }

# Get single property
GET /api/properties/:id

# Update property
PUT /api/properties/:id
Body: { status, price, tenants, ... }

# Delete property
DELETE /api/properties/:id

# Get statistics
GET /api/properties/stats
Response: { totalProperties, occupiedCount, vacantCount, totalValue }
```

---

## 🌾 Persistent Lands (Agriculture)

### In Component
```typescript
"use client";
import { useLands } from "@/lib/hooks";

export function MyLandsPage() {
  const { lands, loading, error, addLand, updateLand, deleteLand, refreshLands } = useLands();

  return (
    <div>
      {lands.map(land => (
        <div key={land.id}>
          <h3>{land.name} - {land.crop}</h3>
          <p>{land.area} in {land.location}</p>
        </div>
      ))}
    </div>
  );
}
```

### API Endpoints
```bash
# Get all lands
GET /api/lands

# Create land
POST /api/lands
Body: { name, location, crop, area, city, state, zip, ... }

# Get single land
GET /api/lands/:id

# Update land
PUT /api/lands/:id
Body: { crop, profit, expenses, ... }

# Delete land
DELETE /api/lands/:id

# Get statistics
GET /api/lands/stats
Response: { totalLands, totalArea, cropsCount, totalValue }
```

---

## 🔐 Input Sanitization

### Use in API Routes
```typescript
import { sanitizeHtml, escapeHtml, isValidUrl } from "@/lib/sanitization";

// Remove HTML tags (for storage)
const safeName = sanitizeHtml(userInput);

// Escape for HTML rendering
const display = escapeHtml(userInput);

// Validate URLs
if (!isValidUrl(imageUrl)) {
  throw new Error("Invalid URL");
}
```

---

## 📄 PDF Parsing with Anthropic

### Automatic Selection
The system automatically:
1. Uses **Anthropic API** if `ANTHROPIC_API_KEY` is set (handles any format)
2. Falls back to **regex parser** if key is missing (North American formats)

### Configuration
Add to `.env.local`:
```env
ANTHROPIC_API_KEY=your_key_here
```

### Usage
```typescript
// Already integrated in POST /api/parse-pdf
// Just upload a PDF file - the route handles everything
const formData = new FormData();
formData.append("file", pdfFile);
const response = await fetch("/api/parse-pdf", {
  method: "POST",
  body: formData
});
```

---

## 🛡️ Security Headers

### Automatic Protection (no code needed)
All responses now include:
- **Content-Security-Policy** - Prevents XSS injection
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **X-XSS-Protection** - Browser XSS filter
- **Referrer-Policy** - Controls referrer leakage

### Testing CSP
```bash
# In browser DevTools, go to Network tab
# Check response headers for Content-Security-Policy
```

---

## 📚 Database Connection

### Automatic (no setup needed)
- MongoDB connection pools automatically
- Collections created on first use
- Indexes created automatically
- Session-based user isolation

### Manual Testing
```bash
# Connect to MongoDB directly
mongosh "mongodb+srv://user:password@cluster.mongodb.net/propfusion"

# List collections
show collections

# View a property
db.properties.find({ userId: "user-id" }).pretty()
```

---

## ✅ Checklist Before Going Live

- [ ] Generate new Better Auth secret
- [ ] Reset MongoDB password
- [ ] Revoke old Resend API key
- [ ] Add new credentials to `.env.local`
- [ ] Run `npm install` (for Anthropic SDK)
- [ ] Test each API endpoint
- [ ] Migrate old context components to hooks
- [ ] Test database persistence (add/edit/delete)
- [ ] Verify CSP headers in browser
- [ ] Remove exposed credentials from git history

---

## 🐛 Troubleshooting

### "Anthropic API failed"
- Check `ANTHROPIC_API_KEY` is set
- Verify API key is valid
- Falls back to regex automatically

### "Property not found" on GET/:id
- Verify user owns the property (userId check)
- Check property ID is correct
- Properties are user-scoped for security

### Data disappears on refresh
- Use new hooks: `useProperties()` or `useLands()`
- Don't rely on React context anymore
- Hooks auto-fetch on mount

### CSP violations in console
- Check DevTools console for blocked resources
- Review CSP header for allowed origins
- Update `next.config.ts` if needed

---

**For detailed implementation, see `IMPLEMENTATION_SUMMARY.md`**
