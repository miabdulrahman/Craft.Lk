# CraftLK — Sri Lankan Artisan Crafts & Handmade Marketplace

CraftLK is a full-stack multi-vendor B2C e-commerce marketplace built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It connects traditional Sri Lankan cottage artisans, craft cooperatives, and small businesses with conscious buyers across Sri Lanka and beyond.

Developed for the academic requirements of **CIS 22032: E-Commerce Strategies and Architecture**, Faculty of Technology, South Eastern University of Sri Lanka (SEUSL) by Group 7.

---

## Architecture & System Overview

CraftLK follows a decoupled three-tier web application architecture:

```
┌────────────────────────────────────────────────────────┐
│                     Client (React)                     │
│  Vite • React 19 • Tailwind CSS v4 • Lucide Icons      │
└───────────────────────────┬────────────────────────────┘
                            │ RESTful JSON APIs (Axios)
┌───────────────────────────▼────────────────────────────┐
│                  Server (Express & Node)               │
│  JWT Auth • Zod Validation • Multer • Business Logic   │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼────────────────────────────┐
│                    Database (MongoDB)                  │
│  Users • Shops • Products • Categories • Orders        │
└────────────────────────────────────────────────────────┘
```

---

## Key Features

1. **Artisan Craft Discovery**:
   - Hero banner with traditional Sri Lankan crafts photography.
   - Quick category navigation (Batik, Jewellery, Pottery, Wooden Handicrafts, Woven Products, Decorative Items, Gifts).
   - Dynamic search, price range filter, and sorting (popularity, price low-to-high, price high-to-low, newest).

2. **Artisan Product Detail Showcase**:
   - High-resolution multi-angle image gallery with thumbnail switcher.
   - Breadcrumb navigation and stock availability counters.
   - Heritage trust badges (*Handmade*, *Eco Friendly*, *Local Seller*).
   - Direct artisan workshop information card and related crafts recommendations.

3. **Multi-Vendor Cart & Checkout (Rule 10)**:
   - Cart automatically organizes items by artisan workshop.
   - Multi-vendor checkouts are isolated to one artisan shop per order.
   - Authoritative server-side price recalculation (never trusting frontend totals).
   - Atomic inventory reduction on order acceptance and automatic restoration on cancellation.
   - 3-step checkout flow (Shipping details, Cash on Delivery or Simulated Card Payment, Order Confirmation reference).

4. **Seller / Artisan Dashboard**:
   - Workshop metrics: Total Products, Total Orders, Total Sales (LKR).
   - Visual sales revenue overview chart.
   - Product catalog management (Create, Edit, Delete, Stock Update, Image Upload).
   - Customer order fulfillment management with status transitions (*Pending* → *Confirmed* → *Processing* → *Shipped* → *Delivered* → *Cancelled*).
   - Custom artisan shop branding (Name, bio, contact, village/district, logo, banner).

5. **Administrator Supervision Dashboard**:
   - Real-time platform KPI cards (Total Users, Total Sellers, Total Orders, Total Revenue LKR).
   - Artisan shop registration approvals and rejections with reason feedback.
   - Craft category creation and re-ordering.
   - Product listing moderation (feature or deactivate listings).
   - Marketplace-wide order tracking and user account suspension.

---

## Directory Structure

```
CraftLk/
├── client/                      # React frontend
│   ├── public/
│   │   ├── images/              # Hero banners & product photography
│   │   │   └── products/
│   │   └── logo.svg             # CraftLK artisan vector logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer
│   │   │   ├── product/         # ProductCard, CategoryPill
│   │   │   └── dashboard/       # SellerSidebar, AdminSidebar
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── public/          # HomePage, ShopPage, ProductDetailPage,
│   │   │   │                    # CategoriesPage, ArtisansPage, AboutPage, AuthPage
│   │   │   ├── customer/        # CartPage, CheckoutPage, OrdersPage,
│   │   │   │                    # OrderDetailPage, ProfilePage
│   │   │   ├── seller/          # SellerDashboardPage, SellerProductsPage,
│   │   │   │                    # SellerOrdersPage, SellerShopProfilePage
│   │   │   └── admin/           # AdminDashboardPage, AdminSellersPage,
│   │   │                        # AdminProductsPage, AdminCategoriesPage,
│   │   │                        # AdminOrdersPage, AdminUsersPage
│   │   ├── routes/              # ProtectedRoute role guard
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx              # Application router
│   │   ├── index.css            # Tailwind CSS v4 & theme variables
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/                      # Node.js Express REST API
│   ├── public/
│   │   └── uploads/             # Locally uploaded craft images
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Shop, Product, Category, Order, Admin
│   │   ├── middleware/          # Auth JWT guard, Multer upload, Error handler
│   │   ├── models/              # User, Shop, Product, Category, Order
│   │   ├── routes/              # Express API routers
│   │   ├── utils/               # Seed script and initial data
│   │   ├── validators/          # Zod schema validation
│   │   ├── app.js               # Express application
│   │   └── server.js            # Server entrypoint
│   ├── tests/                   # Vitest automated test suites
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── package.json                 # Monorepo orchestration scripts
└── README.md
```

---

## Database Design & Relationships

The database utilizes 5 core collections in MongoDB:

```
┌──────────────┐          1:1          ┌──────────────┐
│     User     │───────────────────────│     Shop     │
│  (Customer,  │                       │  (Artisan    │
│  Seller,     │                       │  Workshop)   │
│  Admin)      │                       └──────┬───────┘
└──────┬───────┘                              │ 1:N
       │ 1:N                                  │
       │                               ┌──────▼───────┐
       │                               │   Product    │
       │                               │  (Crafts)    │
       │                               └──────▲───────┘
       │                                      │ N:1
       │                               ┌──────┴───────┐
       │                               │   Category   │
       │                               └──────────────┘
       │
┌──────▼───────┐          N:1          ┌──────────────┐
│    Order     │───────────────────────│     Shop     │
│ (Snapshots,  │                       │ (One seller  │
│  Lifecycle)  │                       │  checkout)   │
└──────────────┘                       └──────────────┘
```

---

## Installation & Local Setup

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **npm** (v9.x+)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/craftlk`)

### 1. Install Dependencies
Run from the root repository directory:
```bash
# Install root, server, and client dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables

**Server Configuration (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/craftlk
JWT_SECRET=craftlk_academic_jwt_secret_key_2026_seusl_handicrafts
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_DEFAULT_EMAIL=admin@craftlk.com
ADMIN_DEFAULT_PASSWORD=Admin@CraftLK2026
ADMIN_DEFAULT_NAME=Platform Administrator
```

**Client Configuration (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CraftLK
```

### 3. Seed Database with Realistic Sri Lankan Crafts
Run the seed script to automatically populate categories, sample artisan shops, products, customer accounts, and initial orders:
```bash
npm --prefix server run seed
```

### 4. Run Development Servers
Start backend API:
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

In a separate terminal, start frontend client:
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

---

## Academic Demonstration Accounts

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@craftlk.com` | `Admin@CraftLK2026` | `/admin/dashboard` |
| **Artisan Seller** | `sunfire@example.com` | `Sunfire@2026` | `/seller/dashboard` |
| **Customer** | `customer@craftlk.com` | `Customer@2026` | `/shop`, `/cart`, `/my-orders` |

---

## Automated Test Execution

Automated tests are written with Vitest and Supertest covering:
- Authentication, duplicate email prevention, invalid credentials, and role enforcement.
- Product search, category and price filtering, seller ownership validation.
- Multi-vendor single-seller checkout rules, inventory decrementing, and cancellation stock restoration.

Run tests:
```bash
cd server
npm test
```

Expected output:
```
 ✓ tests/auth.test.js (5 tests)
 ✓ tests/product.test.js (5 tests)
 ✓ tests/order.test.js (5 tests)

Test Files  3 passed (3)
     Tests  15 passed (15)
```

---

## Principal REST API Endpoints

### Authentication & Users
- `POST /api/auth/register` — Register customer or apply as artisan seller
- `POST /api/auth/login` — Authenticate and receive HTTP-only cookie / JWT token
- `POST /api/auth/logout` — Clear session token
- `GET /api/auth/me` — Retrieve active session user and associated shop
- `PATCH /api/auth/me` — Update customer delivery address and contact information

### Shops & Artisans
- `GET /api/shops/public` — Browse verified Sri Lankan artisan workshops
- `GET /api/shops/public/:id` — Get artisan shop details and their listings
- `POST /api/shops/apply` — Submit artisan shop registration for review
- `GET /api/shops/me` — Retrieve seller workshop metrics and sales
- `PATCH /api/shops/me` — Update shop bio, district, city, logo, and banner

### Products
- `GET /api/products` — Discovery endpoint (`search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`)
- `GET /api/products/detail/:id` — Single product details with related items
- `GET /api/products/seller/my-products` — Authenticated seller listings
- `POST /api/products` — Create product listing (Approved seller only)
- `PATCH /api/products/:id` — Update product details (Seller owner only)
- `DELETE /api/products/:id` — Delete product (Seller owner only)

### Orders & Checkout
- `POST /api/orders` — Create order with one-seller-per-checkout check and stock reduction
- `GET /api/orders/my-orders` — Customer purchase history
- `GET /api/orders/:id` — Order tracking and item snapshots
- `PATCH /api/orders/:id/cancel` — Customer order cancellation and stock restoration
- `GET /api/orders/seller/orders` — Incoming orders for seller's shop
- `PATCH /api/orders/seller/orders/:id/status` — Update order fulfillment status

### Administration
- `GET /api/admin/stats` — Platform aggregates (Users, Sellers, Orders, Revenue)
- `GET /api/admin/sellers` — View pending and reviewed seller applications
- `PATCH /api/admin/sellers/:id/approve` — Approve seller shop
- `PATCH /api/admin/sellers/:id/reject` — Reject seller application with reason
- `GET /api/admin/orders` — Marketplace transaction audit
- `PATCH /api/admin/products/:id/moderate` — Feature or hide listings
- `GET /api/admin/users` — User accounts directory and suspension toggle

---

## University Attribution

- **University**: South Eastern University of Sri Lanka (SEUSL)
- **Faculty**: Faculty of Technology
- **Course**: CIS 22032 E-Commerce Strategies and Architecture
- **Supervisor**: Ms. A.F. Masroofa
- **Team**: Group 7 (12 members)
