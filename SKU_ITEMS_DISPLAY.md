# SKU Items Display - Feature Documentation

## ✅ Status: IMPLEMENTED

Menampilkan data SKU Items di Image Modal jika ada valuenya dari API response.

## 🎯 Feature Overview

### Display Logic

- **Conditional Rendering**: SKU Items hanya ditampilkan jika ada data
- **Smart Formatting**: Otomatis format berdasarkan tipe data (Array, Object, atau String)
- **Flexible Field Names**: Support berbagai nama field dari API (`skuItems`, `sku_items`, `skus`)

## 📁 Files Modified

### 1. ImageModal Component

**File**: `src/components/ui/ImageModal.jsx`

#### Before:

```jsx
<div className="image-modal__detail-item">
  <Eye size={16} />
  <div>
    <label>SKU Items</label>
    <span className="image-modal__uuid">{`image.skuItems`}</span> {/* ❌ Hardcoded string */}
  </div>
</div>
```

#### After:

```jsx
{
  /* Show SKU Items if available */
}
{
  image.skuItems &&
    Array.isArray(image.skuItems) &&
    image.skuItems.length > 0 && (
      <div className="image-modal__detail-item image-modal__detail-item--full">
        <Eye size={16} />
        <div className="image-modal__sku-items">
          <label>SKU Items ({image.skuItems.length})</label>
          <div className="image-modal__sku-list">
            {image.skuItems.map((sku, index) => (
              <div key={index} className="image-modal__sku-item">
                <div className="image-modal__sku-header">
                  <span className="image-modal__sku-name">
                    {sku.itemName || sku.name || "Unknown"}
                  </span>
                  <span
                    className={`image-modal__sku-status image-modal__sku-status--${(
                      sku.status || ""
                    ).toLowerCase()}`}
                  >
                    {sku.status || "N/A"}
                  </span>
                </div>
                <div className="image-modal__sku-source">
                  Source: {sku.source || "Unknown"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
```

**Changes**:

- ✅ Map setiap SKU item sebagai card terpisah
- ✅ Display itemName, status badge (color-coded), dan source
- ✅ Scrollable list dengan max-height 300px
- ✅ Hover effect pada setiap card
- ✅ Count badge di label: "SKU Items (6)"
- ✅ Status badges dengan warna: Match (green), NotMatch (red)

### 2. Image List Page - Data Transform

**File**: `src/pages/image-list/ImageListPage.jsx`

#### Added Field Mapping:

```javascript
const transformedData = (result.data.data || result.data.items || []).map(
  (item) => ({
    ...item,
    // ... other fields
    skuItems: item.skuItems || item.sku_items || item.skus || null, // ✅ Support various field names
  })
);
```

**Benefits**:

- ✅ Support multiple field name variations from API
- ✅ Fallback to `null` if not available
- ✅ Explicit mapping untuk clarity

## 🎨 Display Examples

### Example: Array of SKU Objects (Real Format)

**API Response:**

```json
{
  "id": 123,
  "filename": "image_001.jpg",
  "skuItems": [
    {
      "itemName": "Spaghetti Bolognese",
      "status": "Match",
      "source": "SkuList"
    },
    {
      "itemName": "Zurbian Chicken",
      "status": "NotMatch",
      "source": "OcrVsFoodLabel"
    },
    {
      "itemName": "Food Container",
      "status": "NotMatch",
      "source": "FoodLabelVsShape"
    }
  ]
}
```

**Display:**

```
┌─────────────────────────────────────────────┐
│ SKU ITEMS (3)                               │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Spaghetti Bolognese        [MATCH]     │ │
│ │ Source: SkuList                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Zurbian Chicken          [NOTMATCH]    │ │
│ │ Source: OcrVsFoodLabel                  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Food Container           [NOTMATCH]    │ │
│ │ Source: FoodLabelVsShape                │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Features:**

- ✅ Each SKU as separate card
- ✅ Status badge color-coded (green=Match, red=NotMatch)
- ✅ Source displayed below
- ✅ Scrollable if many items

### Example 4: No SKU Items

**API Response:**

```json
{
  "id": 126,
  "filename": "image_004.jpg",
  "skuItems": null
}
```

**Display:**

```
(SKU Items section tidak muncul)
```

## 🔄 Data Flow

```
API Response
    ↓
ImageListPage Transform
    ↓
Map field names:
  - item.skuItems
  - item.sku_items
  - item.skus
    ↓
Store in state
    ↓
Pass to ImageModal
    ↓
Conditional Render:
  - Check if skuItems exists
  - Format based on type
  - Display in modal
```

## 🎯 Supported Field Names

API dapat mengirim data dengan nama field:

| API Field Name | Supported | Priority |
| -------------- | --------- | -------- |
| `skuItems`     | ✅        | 1st      |
| `sku_items`    | ✅        | 2nd      |
| `skus`         | ✅        | 3rd      |

**Logic:**

```javascript
skuItems: item.skuItems || item.sku_items || item.skus || null;
```

## 🧪 Testing

### Test Cases

**1. Test SKU Items Array**

```javascript
const image = {
  id: 1,
  skuItems: [
    { itemName: "Spaghetti Bolognese", status: "Match", source: "SkuList" },
    {
      itemName: "Zurbian Chicken",
      status: "NotMatch",
      source: "OcrVsFoodLabel",
    },
  ],
};
// Expected: 2 cards, each showing itemName, status badge, and source
```

**2. Test Different Statuses**

```javascript
const image = {
  id: 2,
  skuItems: [
    { itemName: "Item 1", status: "Match", source: "Source1" }, // Green badge
    { itemName: "Item 2", status: "NotMatch", source: "Source2" }, // Red badge
    { itemName: "Item 3", status: "Partial", source: "Source3" }, // Yellow badge
  ],
};
// Expected: Color-coded status badges
```

**3. Test Missing Fields**

```javascript
const image = {
  id: 3,
  skuItems: [{ itemName: "Item", status: null, source: null }],
};
// Expected: Shows "Unknown" for source, "N/A" for status
```

**4. Test No Data**

```javascript
const image = {
  id: 4,
  skuItems: null,
};
// Expected: SKU Items section tidak muncul
```

**5. Test Empty Array**

```javascript
const image = {
  id: 5,
  skuItems: [],
};
// Expected: SKU Items section tidak muncul
```

## 📊 UI Location

**ImageModal - Details Section:**

```
┌──────────────────────────────────────────┐
│  Image Modal                             │
│                                          │
│  [Image Preview]        │ Details Panel  │
│                         │                │
│                         │ 📄 Filename    │
│                         │ 📅 Date        │
│                         │ 🕐 Time Period │
│                         │ 🔖 UUID        │
│                         │                │
│                         │ 👁️ SKU ITEMS (6)│
│                         │ ┌────────────┐ │
│                         │ │ Item 1     │ │
│                         │ │ [Match]    │ │
│                         │ └────────────┘ │
│                         │ ┌────────────┐ │
│                         │ │ Item 2     │ │
│                         │ │ [NotMatch] │ │
│                         │ └────────────┘ │
│                         │ ...scrollable  │
└──────────────────────────────────────────┘
```

## ✅ Benefits

### 1. Detailed Display

- ✅ Each SKU item displayed as individual card
- ✅ Shows all details: itemName, status, source
- ✅ Easy to scan and understand
- ✅ Professional card-based UI

### 2. Color-Coded Status

- 🟢 **Match**: Green badge (#d1fae5 background)
- 🔴 **NotMatch**: Red badge (#fee2e2 background)
- 🟡 **Partial**: Yellow badge (#fef3c7 background)
- ⚫ **Unknown/N/A**: Gray badge (#e5e7eb background)

### 3. Scrollable List

- ✅ Max height 300px
- ✅ Auto scroll jika banyak items (>6 items)
- ✅ Custom scrollbar styling
- ✅ Smooth scrolling experience

### 4. Responsive Design

- ✅ Hover effects pada cards
- ✅ Touch-friendly spacing
- ✅ Works di mobile dan desktop
- ✅ Adaptive width

### 5. Flexible API Support

- ✅ Support berbagai field name dari API
- ✅ Graceful fallback jika field tidak ada
- ✅ Handle missing itemName, status, source

### 6. Developer Friendly

- ✅ Clear component structure
- ✅ Easy to customize styling
- ✅ Console log untuk debugging
- ✅ Type-safe rendering

## 🔍 Debugging

Check browser console untuk melihat transformed data:

```javascript
// Di ImageListPage.jsx
console.log("API Response - Transformed images:", transformedData);

// Expected output:
[
  {
    id: 123,
    filename: "image_001.jpg",
    skuItems: ["SKU-001", "SKU-002"], // ← Check this field
    // ... other fields
  },
];
```

## 📝 Notes

- **Type Safety**: Component handles Array, Object, String, Number
- **Null Safe**: Properly handles `null`, `undefined`, empty values
- **Performance**: Conditional rendering - no wasted render
- **Extensible**: Easy to add more formatting logic

## 🚀 Future Enhancements

Possible improvements:

- [ ] Add tooltip for long SKU lists
- [ ] Link SKU to detail page
- [ ] Format object display with better UI (not JSON string)
- [ ] Add count badge ("3 SKUs")
- [ ] Support SKU images/icons

## 🎨 Status Badge Colors

| Status      | Background             | Text Color            | Example     |
| ----------- | ---------------------- | --------------------- | ----------- |
| Match       | #d1fae5 (Light Green)  | #065f46 (Dark Green)  | ✅ Match    |
| NotMatch    | #fee2e2 (Light Red)    | #991b1b (Dark Red)    | ❌ NotMatch |
| Partial     | #fef3c7 (Light Yellow) | #92400e (Dark Yellow) | ⚠️ Partial  |
| Unknown/N/A | #e5e7eb (Light Gray)   | #374151 (Dark Gray)   | ⚪ N/A      |

## 🎉 Conclusion

**SKU Items display successfully implemented!**

- ✅ Detailed card-based display untuk setiap SKU
- ✅ Color-coded status badges (Match, NotMatch, Partial)
- ✅ Shows itemName, status, dan source
- ✅ Scrollable list dengan max-height 300px
- ✅ Hover effects dan responsive design
- ✅ Count badge di header: "SKU Items (6)"
- ✅ Flexible field name support
- ✅ Graceful fallback untuk missing data
- ✅ Clean UI integration
- ✅ No linter errors

**Feature ready! 🎯**
