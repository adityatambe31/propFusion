# Smart Report Generation - Testing Guide

## Pre-Test Checklist

Before you start testing, ensure everything is installed:

```bash
# 1. Check dependencies
npm list @radix-ui/react-checkbox jspdf lucide-react

# Expected output:
# ✅ @radix-ui/react-checkbox@1.x.x
# ✅ jspdf@2.5.1
# ✅ lucide-react@0.x.x

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000/dashboard/realestate
```

## Test Scenario 1: Real Estate Dashboard Report

### Setup
1. Go to `/dashboard/realestate`
2. Add 3-5 test properties with different details:
   - Property 1: Condo, Occupied, $250,000
   - Property 2: Apartment, Vacant, $150,000
   - Property 3: Detached House, Occupied, $450,000

### Test Steps

**Test 1.1: Open Report Dialog**
```
1. Click "Generate Report" button
   ✅ Dialog opens with 3 tabs
   ✅ Tab 1 "Select Items" is active
   ✅ All 3 properties are visible with checkboxes
   ✅ "0 items selected" badge shows
```

**Test 1.2: Single Property Selection**
```
1. Check checkbox for Property 1
   ✅ Checkbox is marked
   ✅ Badge changes to "1"
   
2. Check checkbox for Property 2
   ✅ Badge changes to "2"
   
3. Check checkbox for Property 3
   ✅ Badge changes to "3"
```

**Test 1.3: Select All / Clear**
```
1. Click "Select All"
   ✅ All checkboxes are checked
   ✅ Badge shows "3"

2. Click "Clear"
   ✅ All checkboxes are unchecked
   ✅ Badge returns to "0"

3. Check one item
   ✅ Badge shows "1"
```

**Test 1.4: Tab Navigation - Locked State**
```
1. With "0 items selected"
   ✅ "Report Type" tab is DISABLED (grayed out)
   ✅ "Generate" tab is DISABLED
   
2. Select 1 property
   ✅ Tabs become ENABLED
   ✅ Can click to navigate
```

**Test 1.5: Report Type Selection**
```
1. Select 2 properties
2. Click "Report Type" tab
   ✅ "Report Type" tab becomes active
   ✅ Shows 3 radio options:
      - 🏠 Real Estate (enabled, 2 items)
      - 🌾 Agricultural Lands (disabled, 0 items)
      - 📊 Combined Portfolio (disabled, 0 items)

3. Select "Real Estate"
   ✅ Radio is selected

4. Choose format
   ✅ PDF is selected by default
   ✅ Can select CSV
```

**Test 1.6: Generate Tab Preview**
```
1. Click "Generate" tab
   ✅ Shows summary with:
      - Report Type: 🏠 Real Estate
      - Format: PDF (or CSV)
      - Items Included: 2 properties
      - Generated: Today's date

2. "Download Report" button is enabled
   ✅ Cursor changes to pointer
```

**Test 1.7: PDF Download**
```
1. Click "Download Report"
   ✅ Loading state shows: "Generating..."
   ✅ PDF file downloads to Downloads folder
   ✅ File name format: report-properties-TIMESTAMP.pdf
   ✅ Dialog closes automatically

2. Open downloaded PDF
   ✅ Title: "Property Portfolio Report"
   ✅ Shows selected 2 properties only
   ✅ Summary shows "2 Properties"
   ✅ Each property has name, location, details
   ✅ Professional formatting with borders
```

**Test 1.8: CSV Download**
```
1. Select properties again
2. Go to "Report Type" tab
3. Select CSV format
4. Go to "Generate" tab
5. Click "Download Report"
   ✅ CSV file downloads: report-properties-TIMESTAMP.csv
6. Open in spreadsheet app (Excel, Google Sheets)
   ✅ Shows columns: Name, Location, City, State, Type, Status, etc.
   ✅ Each property has a row with data
   ✅ Data is comma-separated and properly quoted
```

## Test Scenario 2: Agricultural Dashboard Report

### Setup
1. Go to `/dashboard/agriculture`
2. Add 2-3 test lands with different crops:
   - Land 1: Wheat, 100 acres, $50,000
   - Land 2: Corn, 150 acres, $75,000

### Test Steps

**Test 2.1: Single Land Selection**
```
1. Click "Generate Report"
2. Check both lands
   ✅ Badge shows "2"
3. Tab to "Report Type"
   ✅ Shows 🌾 Agricultural Lands (2 items)
   ✅ Real Estate and Combined are disabled
```

**Test 2.2: Agriculture PDF**
```
1. Generate agricultural report as PDF
   ✅ Title: "Agricultural Land Report"
   ✅ Shows summary with: Lands, Crop types, Total Area, Value
   ✅ Lists each land with crop, area, profit
```

**Test 2.3: Agriculture CSV**
```
1. Generate agricultural report as CSV
   ✅ Shows columns: Name, Location, Crop, Area, Value, etc.
   ✅ Has row for each selected land
```

## Test Scenario 3: Combined Portfolio Report

**Setup**
1. Have 2+ properties and 1+ lands available
2. Open report dialog

**Test 3.1: Combined Report Type**
```
1. Select 2 properties and 1 land
   ✅ Badge shows "3"

2. Tab to "Report Type"
   ✅ Shows all 3 options enabled
   ✅ 📊 Combined Portfolio shows: "3 items selected"

3. Select Combined
   ✅ Can proceed to generate
```

**Test 3.2: Combined Report PDF**
```
1. Generate combined PDF
   ✅ Title: "Portfolio Report (Selected Items)"
   ✅ Shows summary: Real Estate + Agriculture values
   ✅ Real Estate section lists 2 properties
   ✅ Agriculture section lists 1 land
   ✅ Shows combined total value
```

**Test 3.3: Combined Report CSV**
```
1. Generate as CSV
   ✅ Has Real Estate section with headers
   ✅ Has Agricultural Lands section with headers
   ✅ Data properly formatted
```

## Test Scenario 4: Edge Cases

### Test 4.1: No Items Selected

**Before selecting any items:**
```
1. Click on un-enabled "Report Type" tab
   ✅ Cannot click (disabled)

2. Try to use keyboard to reach "Generate"
   ✅ Cannot reach disabled tabs

3. Alert shows: "Select at least one item to generate a report"
```

### Test 4.2: Large Selection (50+ items)

**If you can add many items:**
```
1. Add 30+ properties
2. Select all
3. Generate PDF
   ✅ Takes 3-5 seconds
   ✅ Creates multi-page PDF with all items
   ✅ Still downloads successfully

4. Try with CSV
   ✅ Generates very quickly
   ✅ Large spreadsheet with all data
```

### Test 4.3: Special Characters in Names

**Add properties with special characters:**
```
Property names with:
- Apostrophes: O'Malley's Estate
- Quotes: "The Plaza" Building
- Commas: Smith, Johnson & Co
- Ampersands: A&B Properties

Generate report:
✅ Names display correctly in PDF
✅ CSV properly quotes names with commas
```

### Test 4.4: Currency Formatting

**Check monetary values:**
```
In PDF and CSV:
✅ Shows: $X,XXX.XX format
✅ Large numbers have commas: $1,250,000
✅ Decimals shown correctly: $1,250.50
```

### Test 4.5: Empty/Missing Fields

**Add property with minimal data:**
```
Property with:
- Name only
- No description
- No optional fields

Generate report:
✅ Still works
✅ Blank fields show as empty (not errors)
✅ Data that exists displays correctly
```

## Test Scenario 5: User Experience

### Test 5.1: Dialog Responsiveness

```
1. On mobile (iPhone width)
   ✅ Dialog adapts to screen size
   ✅ Checkboxes are clickable (not too small)
   ✅ Buttons are accessible

2. On tablet
   ✅ Layout looks good
   ✅ Lists scroll smoothly
   
3. On desktop (wide screen)
   ✅ Full dialog displays nicely
   ✅ Not too wide to read
```

### Test 5.2: Keyboard Navigation

```
1. Tab through dialog
   ✅ Checkboxes can be focused
   ✅ Can use Space to check/uncheck
   ✅ Buttons are focusable

2. Use keyboard to navigate tabs
   ✅ Arrow keys work to move between tabs

3. Use keyboard to click buttons
   ✅ Space/Enter activates buttons
```

### Test 5.3: Error Scenarios

```
1. Network error (disconnect before download)
   ✅ Shows: "Failed to generate report. Please try again."
   ✅ Can try again without re-selecting items

2. API error
   ✅ Error message shows in alert
   ✅ Dialog stays open
   ✅ Can close and retry
```

## Test Scenario 6: Multiple Reports

### Test 6.1: Generate Two Different Reports

```
1. Generate report for Properties 1-2
   ✅ Downloads property-report-XXX.pdf

2. Open dialog again
   ✅ Previous selections are cleared
   ✅ Can select different items

3. Generate report for Property 3 only
   ✅ Downloads new file with only Property 3

4. Generate CSV report
   ✅ Downloads properties-XXX.csv
```

### Test 6.2: Verify Downloaded Files

```
Check Downloads folder:
✅ report-properties-1737234567.pdf (PDF files)
✅ report-lands-1737234568.pdf
✅ report-combined-1737234569.pdf
✅ properties-1737234570.csv (CSV files)
✅ Each file has unique UNIX timestamp
✅ No duplicate filenames
```

## Performance Testing

### Test P.1: Report Generation Speed

```
✅ 1-5 items: < 1 second
✅ 10-20 items: 1-2 seconds
✅ 30-50 items: 2-4 seconds
✅ 50-100 items: 5-10 seconds

If slower than expected:
- Check browser console for errors
- Verify API endpoint is responding
- Check network tab for slow requests
```

### Test P.2: Memory Usage

```
1. Generate multiple large reports in succession
   ✅ No page crashes
   ✅ No significant slowdown
   ✅ Browser responsive throughout

2. Generate very large report (100+ items)
   ✅ Page doesn't freeze
   ✅ Can still interact with dialog
```

## Visual Testing

### Test V.1: PDF Appearance

Open downloaded PDF and verify:

```
✅ Title is clear and prominent
✅ Summary box has clean styling
✅ Statistics are easy to read
✅ Item listings are organized
✅ Font sizes are readable (not too small)
✅ Colors are professional
✅ No text overlapping
✅ Page breaks work correctly for long lists
✅ Footer shows company name/date
```

### Test V.2: CSV Appearance

Open in Excel/Google Sheets:

```
✅ Headers are in first row
✅ Data is properly aligned
✅ Numbers are right-aligned
✅ Text doesn't overflow cells
✅ No merged cells or formatting issues
✅ Can sort/filter columns
✅ Can create charts from data
```

## Browser Compatibility Testing

Test on different browsers:

```
✅ Chrome/Chromium - Latest version
✅ Firefox - Latest version  
✅ Safari - Latest version
✅ Edge - Latest version

For each browser:
✅ Dialog opens
✅ Checkboxes work
✅ Download works
✅ No console errors
```

## Dark Mode Testing

If your app has dark mode:

```
✅ Dialog background is dark
✅ Text is readable in dark mode
✅ Buttons are visible
✅ Checkboxes are visible
✅ No contrast issues
```

## Accessibility Testing

```
✅ Screen reader can navigate dialog
✅ Labels are associated with checkboxes
✅ Buttons are labeled clearly
✅ Tab order is logical
✅ Can use keyboard only (no mouse needed)
✅ Focus indicators are visible
✅ Color not the only differentiator
```

## Troubleshooting Tests

If anything fails, check:

### Dialog doesn't open
```
- Check browser console (F12)
- Verify SmartReportDialog is imported
- Check onClick handler is attached to button
- Ensure state is updating
```

### Checkboxes don't work
```
- Check @radix-ui/react-checkbox is installed
- Verify CSS is loaded
- Check console for errors
- Test in different browser
```

### Download doesn't start
```
- Check browser console
- Verify API endpoint is working
- Test with simpler selection (1 item)
- Try different format (CSV then PDF)
- Check network tab for API response
```

### PDF looks wrong
```
- Verify jsPDF is installed (npm list jspdf)
- Check if newer browser required
- Test PDF in different viewer
- Check for console errors
```

### CSV is corrupted
```
- Check if file opens at all
- Try with simpler data (no special chars)
- Open in different application
- Check file size (shouldn't be tiny)
```

## Test Completion Checklist

- [ ] All 6 main test scenarios completed
- [ ] At least one PDF downloaded and reviewed
- [ ] At least one CSV downloaded and reviewed
- [ ] Tested on at least 2 different browsers
- [ ] Tested responsiveness on mobile
- [ ] Tested keyboard navigation
- [ ] Verified no console errors
- [ ] Tested edge cases (empty fields, special chars)
- [ ] Accessibility check passed
- [ ] Performance is acceptable
- [ ] Dark mode looks good (if applicable)

## Performance Benchmarks

Expected performance on modern hardware:

| Scenario | Time | Notes |
|----------|------|-------|
| Open dialog | < 100ms | Instant |
| Select items | < 50ms | Smooth |
| Switch tabs | < 50ms | Instant |
| Generate 5 items PDF | 500-1000ms | Very good |
| Generate 50 items PDF | 2-4 seconds | Good |
| Generate 100 items CSV | 500ms | Very good |
| File download | Instant | Browser dependent |

If performance is worse than expected:
1. Check for console errors
2. Profile in browser DevTools
3. Check network requests
4. Consider pagination for 500+ items

## Sign-Off

Once all tests pass, the feature is ready for production:

- [ ] All tests completed
- [ ] No critical issues found
- [ ] Performance acceptable
- [ ] Users can generate reports
- [ ] Files download correctly
- [ ] UI is responsive and accessible

**Date Tested:** _______________
**Tester Name:** _______________
**Status:** ☐ Ready for Production / ☐ Needs Fixes
