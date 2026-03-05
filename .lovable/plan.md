

## Plan: Add Advanced Demo Features to Admin Panel

### New Admin Pages (demo/mock data only)

1. **Loyalty Program** (`/admin/loyalty`) -- Manage customer loyalty points, tiers (Bronze/Silver/Gold/Platinum), redemption history. Shows mock member list with points, tier progress bars, and reward catalog.

2. **Inventory Management** (`/admin/inventory`) -- Track product stock levels with low-stock alerts, reorder points, supplier info. Includes a mock stock table with status badges (In Stock / Low / Out of Stock).

3. **Staff Scheduling** (`/admin/staff`) -- Weekly calendar grid showing staff shifts and appointments. Mock staff list with availability toggles and hours summary.

4. **Promotions & Coupons** (`/admin/promotions`) -- Create/manage discount codes, flash sales, bundle deals. Mock table of active/expired coupons with usage stats.

5. **Customer CRM** (`/admin/customers`) -- Customer profiles with visit history, spending totals, notes, and tags. Mock customer list with search/filter.

6. **Reports & Export** (`/admin/reports`) -- Generate downloadable PDF/CSV reports for revenue, bookings, and inventory. Demo buttons that trigger toast confirmations.

### Changes Required

- **6 new page files** in `src/pages/admin/` with static demo data and interactive UI (filters, toggles, mock CRUD)
- **`AdminLayout.tsx`** -- Add 6 new nav items with appropriate Lucide icons (Heart, BoxesIcon, UserCog, Percent, Contact, FileDown)
- **`App.tsx`** -- Add 6 new lazy-loaded routes under the `/admin` parent route

### Design Approach
- All pages use existing UI components (Card, Badge, Button, Table, Switch, Input)
- Mock data hardcoded in each component -- no backend needed
- Consistent styling with existing admin pages (same font classes, color scheme, layout patterns)
- Interactive elements (add/edit/delete) work with local state and show toast feedback

