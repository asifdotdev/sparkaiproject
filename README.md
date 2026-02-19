# SparkAI - On-Demand Service Application

A full-stack on-demand service platform (similar to Urban Company / TaskRabbit) where **customers** browse and book services, **providers** accept and fulfill jobs, and **admins** manage the entire platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, TypeScript, Express, Sequelize ORM, MySQL 8, JWT Auth, Zod Validation |
| **Mobile App** | React Native, Expo (Expo Router), TypeScript, React Query, Zustand |
| **Admin Panel** | Next.js 15 (App Router), TypeScript, Tailwind CSS, React Query, Recharts |
| **Shared** | TypeScript types, constants, Zod validation schemas (npm workspace package) |
| **Database** | MySQL 8.0 via Docker Compose |

## Project Structure

```
sparkaiproject/
├── package.json              # npm workspaces root
├── docker-compose.yml        # MySQL container
├── database/
│   └── schema.sql            # Raw SQL schema (reference)
├── packages/
│   ├── shared/               # @sparkai/shared - types, constants, validation
│   │   └── src/
│   │       ├── types/        # IUser, IBooking, IService, IPayment, etc.
│   │       ├── constants/    # Roles, booking statuses, payment statuses
│   │       └── validation/   # Zod schemas for all entities
│   ├── backend/              # @sparkai/backend - Express REST API
│   │   └── src/
│   │       ├── config/       # Environment & database config
│   │       ├── db/models/    # 9 Sequelize models with associations
│   │       ├── db/seeders/   # Seed data (roles, users, categories, services)
│   │       ├── middleware/    # Auth, role guard, validation, error handler
│   │       ├── services/     # Business logic layer
│   │       ├── controllers/  # Request handlers
│   │       ├── routes/       # Route definitions
│   │       └── utils/        # JWT, password, pagination, API response helpers
│   ├── mobile-app/           # @sparkai/mobile-app - Expo React Native
│   │   └── src/
│   │       ├── app/          # Expo Router file-based routes
│   │       ├── components/   # UI components (Button, Input, Card, Badge, Avatar)
│   │       ├── services/     # API service modules (Axios)
│   │       ├── store/        # Zustand auth store
│   │       └── theme/        # Colors, typography, spacing
│   └── admin-panel/          # @sparkai/admin-panel - Next.js dashboard
│       └── src/
│           ├── app/          # App Router pages (dashboard, login)
│           ├── components/   # Layout (Sidebar), shared components
│           └── lib/          # API client, providers
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** & **Docker Compose** (for MySQL)
- **Expo CLI** (`npx expo`) for mobile app

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd sparkaiproject
npm install
```

### 2. Start MySQL Database

```bash
docker-compose up -d
```

This starts a MySQL 8.0 container on port **3306** with:
- Database: `sparkai_db`
- User: `sparkai` / Password: `sparkai123`
- Root password: `rootpassword`

### 3. Configure Environment

The backend `.env` file is pre-configured for local development. If needed, update it:

```bash
# packages/backend/.env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sparkai_db
DB_USER=sparkai
DB_PASS=sparkai123
JWT_SECRET=sparkai-jwt-secret-key-2024
JWT_REFRESH_SECRET=sparkai-refresh-secret-key-2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 4. Build Shared Package

```bash
npm run shared:build
```

### 5. Start Backend & Seed Data

```bash
# Start the API server (auto-creates tables via Sequelize sync)
npm run backend:dev

# In another terminal, seed sample data
npm run backend:seed
```

The backend runs on **http://localhost:5000**.

### 6. Start Mobile App

```bash
npm run mobile:start
```

This opens Expo DevTools. Scan the QR code with Expo Go or run on a simulator.

> **Note**: Update the API base URL in `packages/mobile-app/src/services/api.ts` to your machine's IP if testing on a physical device (e.g., `http://192.168.x.x:5000/api/v1`).

### 7. Start Admin Panel

```bash
npm run admin:dev
```

The admin panel runs on **http://localhost:3001**.

> **Note**: Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` in `packages/admin-panel/.env.local` if the default doesn't work.

## Sample Credentials

After running the seeder, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@sparkai.com | password123 |
| **Customer** | john@example.com | password123 |
| **Customer** | jane@example.com | password123 |
| **Provider** | mike@example.com | password123 |
| **Provider** | sarah@example.com | password123 |

## Database Schema

9 tables with full relational integrity:

```
roles ─────────┐
               ↓
users ─────────┤──→ provider_profiles ──→ provider_services ←── services ←── categories
               │              ↓                                    ↓
               ├──→ bookings ←─────────────────────────────────────┘
               │       ↓
               ├──→ reviews
               │       ↓
               └──→ payments
```

| Table | Description |
|-------|------------|
| `roles` | user, provider, admin |
| `users` | All users with role assignment, email, phone, location |
| `categories` | Service categories (Cleaning, Plumbing, Electrical, etc.) |
| `services` | Individual services with price & duration |
| `provider_profiles` | Provider-specific data (bio, rating, availability) |
| `provider_services` | Junction: which providers offer which services |
| `bookings` | Service bookings with status lifecycle |
| `reviews` | Customer reviews (1-5 stars) for completed bookings |
| `payments` | Payment transactions linked to bookings |

The raw SQL schema is available at `database/schema.sql`.

## API Documentation

**Base URL**: `http://localhost:5000/api/v1`

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | - | Register new user/provider |
| POST | `/auth/login` | - | Login, returns JWT tokens |
| POST | `/auth/refresh-token` | - | Refresh access token |
| GET | `/auth/me` | Bearer | Get current user profile |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | - | List all active categories |
| GET | `/categories/:id` | - | Get category with its services |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Soft-delete category |

### Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/services` | - | List services (filter by category) |
| GET | `/services/search` | - | Search services by name |
| GET | `/services/:id` | - | Get service details with providers |
| POST | `/services` | Admin | Create service |
| PUT | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Soft-delete service |

### User Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | Bearer | Get own profile |
| PUT | `/users/profile` | Bearer | Update profile |
| PUT | `/users/avatar` | Bearer | Upload avatar (multipart) |
| PUT | `/users/password` | Bearer | Change password |

### Providers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/providers` | - | List all available providers |
| GET | `/providers/:id` | - | Get provider profile |
| PUT | `/providers/profile` | Provider | Update own profile |
| PUT | `/providers/availability` | Provider | Toggle availability |
| GET | `/providers/me/services` | Provider | Get my offered services |
| POST | `/providers/me/services` | Provider | Add service to offerings |
| DELETE | `/providers/me/services/:serviceId` | Provider | Remove service |
| GET | `/providers/me/dashboard` | Provider | Get dashboard stats |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | User | Create booking |
| GET | `/bookings` | User/Provider | List bookings (role-filtered) |
| GET | `/bookings/:id` | User/Provider | Get booking details |
| PUT | `/bookings/:id/accept` | Provider | Accept booking |
| PUT | `/bookings/:id/reject` | Provider | Reject booking |
| PUT | `/bookings/:id/start` | Provider | Start service |
| PUT | `/bookings/:id/complete` | Provider | Mark completed |
| PUT | `/bookings/:id/cancel` | User/Provider | Cancel booking |

**Booking Status Flow**: `pending` -> `accepted` -> `in_progress` -> `completed`

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | User | Submit review (completed bookings only) |
| GET | `/reviews/booking/:bookingId` | Bearer | Get review for a booking |
| GET | `/reviews/provider/:providerId` | - | Get all reviews for a provider |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/initiate` | User | Initiate payment for booking |
| GET | `/payments/booking/:bookingId` | Bearer | Get payment for a booking |
| GET | `/payments/:id` | Bearer | Get payment by ID |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Dashboard KPIs & stats |
| GET | `/admin/users` | Admin | List all users (search, filter, paginate) |
| GET | `/admin/users/:id` | Admin | Get user details |
| PUT | `/admin/users/:id` | Admin | Update user (activate/deactivate) |
| GET | `/admin/providers` | Admin | List all providers |
| PUT | `/admin/providers/:id/verify` | Admin | Verify/unverify provider |
| GET | `/admin/bookings` | Admin | List all bookings |
| PUT | `/admin/bookings/:id/assign` | Admin | Assign provider to booking |
| GET | `/admin/payments` | Admin | List all payments |
| GET | `/admin/reviews` | Admin | List all reviews |
| DELETE | `/admin/reviews/:id` | Admin | Delete review (moderation) |

## Key Features

### For Customers (Mobile App)
- Browse service categories and individual services
- Search services by name
- View provider profiles, ratings, and reviews
- Book services with date/time scheduling and address
- Track booking status in real-time
- Rate and review completed services
- Manage profile and booking history

### For Service Providers (Mobile App)
- Provider dashboard with job stats and earnings
- Accept or reject incoming booking requests
- Start and complete service jobs
- Manage offered services and availability
- View ratings and customer reviews

### For Admins (Web Panel)
- Dashboard with KPI cards (users, providers, bookings, revenue)
- Charts: bookings by status (pie), platform overview (bar)
- User management (search, filter, activate/deactivate)
- Provider management and verification
- Categories & services CRUD
- Booking monitoring with status filters
- Review moderation
- Payment transaction history

## Architecture Highlights

- **Monorepo**: npm workspaces share code via `@sparkai/shared` package
- **Type Safety**: End-to-end TypeScript across all packages
- **Validation**: Zod schemas shared between frontend and backend
- **Auth**: JWT with access + refresh token pattern
- **Role-Based Access**: Middleware enforces user/provider/admin permissions
- **Booking State Machine**: Status transitions enforced server-side
- **Rating System**: Provider ratings auto-calculated from review averages
- **Pagination**: Consistent offset-based pagination across all list endpoints
- **Error Handling**: Centralized API error classes with proper HTTP status codes

## Scripts Reference

```bash
npm run shared:build     # Build shared types package
npm run backend:dev      # Start backend with hot reload (nodemon)
npm run backend:build    # Compile backend TypeScript
npm run backend:seed     # Seed database with sample data
npm run mobile:start     # Start Expo dev server
npm run admin:dev        # Start Next.js admin panel (port 3001)
npm run admin:build      # Build admin panel for production
```
