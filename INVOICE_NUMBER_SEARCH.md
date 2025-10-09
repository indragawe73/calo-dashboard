# Invoice Number Search - Feature Update

## ✅ Status: UPDATED

Query parameter untuk search telah diubah dari `search` menjadi `invoiceNumber` untuk lebih spesifik.

## 🔄 Changes Made

### 1. API Parameter Update

**File**: `src/pages/image-list/ImageListPage.jsx`

#### Before:

```javascript
if (searchQuery) {
  apiParams.search = searchQuery; // ❌ Generic 'search'
}
```

#### After:

```javascript
if (searchQuery) {
  apiParams.invoiceNumber = searchQuery; // ✅ Specific 'invoiceNumber'
}
```

### 2. UI Label Update

**File**: `src/pages/image-list/ImageListPage.jsx`

#### Search Input Placeholder:

```jsx
<Input
  placeholder="Search Invoice Number..." // ✅ Clear purpose
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  icon={<Search size={16} />}
/>
```

### 3. Console Log Update

**Before:**

```javascript
console.log("  - Search Query (API):", searchQuery || "None");
```

**After:**

```javascript
console.log("  - Invoice Number (API):", searchQuery || "None");
```

## 📊 API Request Example

### Updated API Call

**Endpoint:**

```
GET http://100.107.61.112:5270/api/reports/images
```

**Query Parameters:**

```javascript
{
  page: 1,
  pageSize: 20,
  total: 20,
  includeDetails: true,
  invoiceNumber: "INV-12345",  // ✅ NEW! (instead of 'search')
  date: "2025-01-15",
  timeOfDay: "Morning"
}
```

**Full URL:**

```
http://100.107.61.112:5270/api/reports/images?page=1&pageSize=20&total=20&includeDetails=true&invoiceNumber=INV-12345&date=2025-01-15&timeOfDay=Morning
```

## 🎯 Benefits

### 1. More Specific

- ✅ Clear that search is for invoice number
- ✅ API backend can optimize query specifically for invoice numbers
- ✅ Better parameter naming convention

### 2. Better UX

- ✅ User knows exactly what to search
- ✅ Placeholder text is descriptive
- ✅ No ambiguity about search scope

### 3. API Consistency

- ✅ Matches backend API specification
- ✅ RESTful parameter naming
- ✅ Self-documenting API calls

## 📋 Updated Filter List

| Filter             | UI Element   | API Parameter      | Type        |
| ------------------ | ------------ | ------------------ | ----------- |
| **Invoice Number** | Search bar   | `invoiceNumber`    | API-side    |
| **Filter Name**    | Filter input | None               | Client-side |
| **Date**           | Date picker  | `date`             | API-side    |
| **Time Period**    | Dropdown     | `timeOfDay`        | API-side    |
| **Pagination**     | Controls     | `page`, `pageSize` | API-side    |

## 🧪 Testing

### Test Invoice Number Search

**Steps:**

1. Open `/dashboard/image-list`
2. Type invoice number in search bar (e.g., "INV-12345")
3. Check browser console

**Expected Console Output:**

```javascript
API Parameters: {
  page: 1,
  pageSize: 50,
  total: 50,
  includeDetails: true,
  invoiceNumber: "INV-12345"  // ✅ Check this parameter
}

=== IMAGE LIST DATA ===
🔍 Active Filters:
  - Invoice Number (API): INV-12345  // ✅ Updated label
  - Filter Name (Client): None
  - Filter Date (API): None
  - Filter Time Period (API): None
========================
```

**Expected Network Request:**

```
GET /api/reports/images?page=1&pageSize=50&total=50&includeDetails=true&invoiceNumber=INV-12345
```

## 🔍 Verification

Check these points:

- [ ] Search bar placeholder shows "Search Invoice Number..."
- [ ] Typing in search bar triggers API call with `invoiceNumber` parameter
- [ ] Console log shows "Invoice Number (API): [value]"
- [ ] Network tab shows `invoiceNumber=...` in query string
- [ ] No more `search` parameter in API calls
- [ ] Results filtered correctly by invoice number

## 📝 Files Changed

| File                                     | Change                                |
| ---------------------------------------- | ------------------------------------- |
| `src/pages/image-list/ImageListPage.jsx` | ✅ Changed `search` → `invoiceNumber` |
| `src/pages/image-list/ImageListPage.jsx` | ✅ Updated console log label          |
| `src/pages/image-list/ImageListPage.jsx` | ✅ Updated placeholder text           |

## 💡 Usage Example

### User Workflow

1. **User enters invoice number**: `INV-2025-001`
2. **API called with**:
   ```
   ?invoiceNumber=INV-2025-001
   ```
3. **API returns**: Images matching that invoice number
4. **User sees**: Filtered results

### Combined with Other Filters

```javascript
// User searches: "INV-2025-001"
// User selects date: "2025-01-15"
// User selects time: "Morning"

// API Call:
GET /api/reports/images?
  invoiceNumber=INV-2025-001&
  date=2025-01-15&
  timeOfDay=Morning&
  page=1&
  pageSize=20&
  total=20&
  includeDetails=true
```

## ✅ Summary

**Query parameter successfully updated!**

- ✅ Parameter changed: `search` → `invoiceNumber`
- ✅ UI placeholder updated for clarity
- ✅ Console logs updated
- ✅ More specific and descriptive
- ✅ Better API documentation
- ✅ No linter errors

**Ready to use! 🚀**
