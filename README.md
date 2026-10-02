# COMFORT — Luxury Ladies Fashion & Garments E-Commerce Platform

A production-ready full-stack e-commerce system inspired by high-end Pakistani ladies fashion ateliers. Featuring a deep plum, warm cream, dusty rose, and champagne aesthetic, complete with a customer-facing storefront and a Shopify-style administration console.

---

## 1. Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Cormorant Garamond (editorial serif) & Plus Jakarta Sans (body).
- **Backend:** Express full-stack architecture running `server.ts` with Vite middleware in development and static production serving.
- **Database Engine:** Relational/document persistence model stored with atomic file persistence in `data/comfort_store.json`, pre-seeded with authentic Pakistani luxury garments, variant SKUs, real PKR pricing, customer order histories, verified reviews, and coupons.
- **Logistics & Payments:** Pakistan-friendly checkout with Cash on Delivery (COD), Direct Bank Transfer (Meezan Bank IBAN instructions), Mobile Wallets (JazzCash & Easypaisa), and courier dispatch tracking (TCS Express & Leopards Courier).

---

## 2. Test Credentials

For local development and testing, pre-configured roles and accounts are available:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@comfort.pk` | `ComfortAdmin2026!` | Full store control, inventory adjustment, order status, coupon creation, settings |
| **Customer** | `ayesha.malik@gmail.com` | `password123` | Order history (`COM-2026-001240`), leave reviews, wishlist, addresses |
| **Customer (Karachi)** | `fatima.zahra@hotmail.com` | `password123` | In-transit order (`COM-2026-001245`), tracking |

*Note: In the Admin navigation bar, a role switcher allows switching between **Super Admin, Inventory Manager, Order Manager, and Support Agent** for inspection.*

---

## 3. Implemented Customer Journeys

1. **Top Announcement Bar:** Configurable plum strip with "Free Shipping All Over Pakistan" and "Easy Returns".
2. **Interactive Header & Navigation:**
   - 3-zone contract with brand wordmark `COMFORT — LADIES GARMENTS`.
   - Real-time catalog search bar.
   - Working dropdown menus for **Women, Unstitched, Stitched, Pret Wear, Winter Collection, Sale**.
   - Shopping bag icon with live count badge and slide-out wardrobe drawer.
   - Wishlist heart icon with item counter.
3. **Hero Section:** "Style Meets COMFORT" editorial campaign with South Asian fashion photography and Shop Now CTAs.
4. **Category Cards:** Direct gateways to Unstitched 3-Piece, Stitched Pret, Winter Velvet, and Festive Formals.
5. **Product Catalog & Advanced Filters:**
   - Filter by Category, Fabric (Lawn, Cotton, Chiffon, Velvet, Linen), Price Slider, and Search.
   - Sorting by Newest, Price (Low to High), Price (High to Low), and Rating.
6. **Contiguous Purchase Module (PDP):**
   - High-resolution gallery with thumbnail switcher.
   - Variant selection (Size and Color swatches) with live stock counters.
   - Quantity stepper and instant "Add to Bag" feedback.
   - "Buy It Now" direct-to-checkout flow.
   - Interactive Delivery City Estimator (e.g., Lahore 24h, Karachi/Islamabad 2-3 days).
   - Accordions: Description, Fabric Specs, Size Chart Table, Delivery, and Care Instructions.
   - Customer Reviews with verified buyer badges and a working review submission form.
7. **Shopping Bag Drawer:**
   - Subtotal, quantity steppers, item deletion.
   - Free shipping progress bar (threshold: Rs. 5,000).
   - Working coupon codes: `COMFORT10` (10% off), `WELCOME15` (15% off), `FREESHIP` (Free shipping).
8. **Multi-Step Checkout:**
   - Customer Details $\to$ Pakistan Shipping Address $\to$ Delivery Method $\to$ Payment Mode (COD, Bank Transfer, JazzCash) $\to$ Order Confirmation.
   - Server-side recalculation of order totals preventing frontend price tampering.
   - Order confirmation with unique human-readable order numbers (e.g. `COM-2026-001246`) and printable receipt.
9. **Public Order Tracking:**
   - Look up orders by Order Number + Email or Phone.
   - 6-stage visual timeline (Order Placed $\to$ Verified $\to$ Processing $\to$ Packed $\to$ Dispatched $\to$ Delivered).
   - 7-day Return / Exchange request submission.
10. **Customer Dashboard:** Overview, Order History with status tags, Available Coupons, and Addresses.
11. **Client Concierge:** Working Contact Form and direct WhatsApp floating support button.

---

## 4. Implemented Admin Commerce Features (`/admin`)

1. **Dashboard Overview:** Gross Sales, Total Orders, Delivered Orders, Low Stock Alerts, and recent order stream.
2. **Product Catalog Management:**
   - Full CRUD operations: Create, Edit, and Delete garments.
   - Full attributes: SKU, Category, Subcategory, Collection, Fabric, Retail & Compare Price, Stock, SEO metadata, and multiple variants.
3. **Inventory & Stock Control:**
   - Variant-level stock monitoring with Low Stock and Out of Stock indicators.
   - Stock Adjustment modal with reason logging (Restock, Damage, Manual Count, Order Restock).
   - Full chronological inventory audit logs.
4. **Order Fulfillment:**
   - Search & filter orders by status and city.
   - Advance order stages: Order Placed $\to$ Processing $\to$ Packed $\to$ Shipped $\to$ Delivered $\to$ Cancelled.
   - Automatic inventory restoration if an order is cancelled.
   - Assign Courier Name (TCS / Leopards) and Tracking Number.
   - Printable Packing Slip & Invoice view.
5. **Customer Directory:** Customer list with total orders, lifetime spent, and address information.
6. **Marketing & Promos:**
   - Create and manage promo coupons (Percentage, Fixed Amount, or Free Shipping with minimum order thresholds and usage caps).
7. **Reviews Moderation:** Approve or reject customer reviews before public display.
8. **Return & Exchange Requests:** Review customer return requests and schedule courier pickups.
9. **Store Settings:** Configure announcement bar text, free shipping threshold (Rs. 5,000), courier fees, and WhatsApp support number.
10. **Administrative Audit Trail:** Real-time logging of admin user actions with timestamps and target resources.
11. **CSV Export Center:** Instant download for Orders, Products, and Inventory data.

---

## 5. Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start full-stack server (runs Express + Vite middleware on port 3000)
npm run dev
```

### Production Build
```bash
# Compile client assets
npm run build

# Start production server
npm start
```
