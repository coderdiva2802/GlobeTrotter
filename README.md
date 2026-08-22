# GlobeTrotter 🌍✈️

An AI-powered, personalized travel planning and community platform built with React, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## 🚀 Features

- **Robust JWT Authentication**: Secure register, login, refresh token rotation, avatar file uploads, and password reset flows.
- **Curated Holiday Packages & Custom Trip Builder**: Instant package setup (Golden Triangle, Kerala, Goa, Dubai, Bali, Japan) with verified inclusions and customizable multi-city stops.
- **Global Multi-Currency Engine**: Live currency switching and price conversions supporting `INR (₹)`, `USD ($)`, `EUR (€)`, `GBP (£)`, `AED (AED)`, and `JPY (¥)` across all views.
- **Interactive Day-Wise Itinerary & Budget Optimization**: Live budget utilization progress, over-budget highlighting, non-destructive editing, and shareable public links.
- **Dynamic Destination Image Pipeline**: Automatic destination-matching cover images and Pexels media caching in PostgreSQL.
- **Community Forum & Discussion Hub**: Support for community discussion threads (`CommunityPost`), category tagging (`CommunityCategory`), user replies (`CommunityReply`), and thread likes (`CommunityPostLike`).
- **Trips Management & Filtering**: Search, group by status/destination/year, sort by budget/date/name, and delete customized trips.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Context API:** `AuthContext` (User authentication), `CurrencyContext` (Global multi-currency conversion)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **ORM:** Prisma v7 (`prisma.config.ts` configuration)
- **Database:** PostgreSQL (with `@prisma/adapter-pg` driver adapter)
- **Validation:** Zod
- **Image Upload:** Multer
- **Security:** Custom JWT Authentication & bcrypt

---

## 📁 Project Structure

```text
GlobeTrotter/
├── client/              # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute, AuthLayout, LoginForm, RegisterForm
│   │   │   ├── common/      # Badge, FloatingPlanButton
│   │   │   ├── home/        # HeroBanner, SearchFilterBar, RegionalSelections, PreviousTrips, TripCard
│   │   │   ├── itinerary/   # DayWiseItineraryView, BudgetSummaryBar, DayItineraryCard, ShareTripModal
│   │   │   ├── layout/      # Navbar (with Currency Selector & Profile Menu)
│   │   │   ├── modals/      # RegionDetailsModal, TripDetailsModal
│   │   │   └── wizard/      # CreateTripWizard, Step1TripBasics, Step2ItineraryBuilder, StopCard, ActivitySearchModal, HolidayPackageCard
│   │   ├── context/         # AuthContext, CurrencyContext, useAuth
│   │   ├── pages/           # LoginPage, RegisterPage
│   │   ├── services/        # Axios API service & mockData
│   │   ├── App.jsx          # Main application dashboard & router
│   │   ├── App.css          # Design system & responsive styles
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/              # Express backend
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma database schema with Community models
│   │   ├── seed.js             # User accounts seeder
│   │   ├── seed-cities.js      # World cities & Pexels images seeder
│   │   └── migrations/         # SQL migration history
│   ├── src/
│   │   ├── config/             # Environment configurations
│   │   ├── controllers/        # Auth, Destination, and Trip controllers
│   │   ├── middleware/         # Auth, Upload, Validation, Error middlewares
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Business services (Auth, GeoCities, Pexels)
│   │   ├── utils/              # Crypto & JWT utilities
│   │   ├── validators/         # Zod schemas
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables (local, git-ignored)
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── prisma.config.ts        # Prisma 7 config
│
├── docs/                # API contract documentation
└── README.md
```

---

## ⚙️ Environment Configuration (`server/.env`)

Before running the server, create a `.env` file inside the `server/` directory using the template below:

### `server/.env.example`

```env
# PostgreSQL Database Connection URI
DATABASE_URL="postgresql://postgres:password@localhost:5432/globetrotter_db?schema=public"

# Express Server Port
PORT=5000

# Client Application Base URL (for CORS)
CLIENT_URL="http://localhost:5173"

# JWT Secret Keys
JWT_ACCESS_SECRET="replace_with_a_secure_access_secret_key"
JWT_REFRESH_SECRET="replace_with_a_secure_refresh_secret_key"

# Pexels API Key for Live Travel Image Pipeline
PEXELS_API_KEY="your_pexels_api_key_here"
```

> **🔑 Obtaining a Pexels API Key**:
> 1. Sign up for a free account at [Pexels API Portal](https://www.pexels.com/api/).
> 2. Generate an API Key and paste it into `PEXELS_API_KEY` in `server/.env`.

---

## 📖 Complete Step-by-Step Setup Guide

Follow these exact steps to clone, configure, migrate, seed, and run the GlobeTrotter application.

### Step 1: Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Installed and running locally (or hosted via Neon/Supabase)

---

### Step 2: Create the PostgreSQL Database
Open your PostgreSQL terminal (`psql`) or pgAdmin and run:

```sql
CREATE DATABASE globetrotter_db;
```

---

### Step 3: Configure Server Environment Variables
Navigate to the `server/` folder and copy `.env.example` to `.env`:

```bash
cd server

# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Open `.env` and fill in your database credentials and `PEXELS_API_KEY`.

---

### Step 4: Install Server Dependencies
Inside `server/`:

```bash
npm install
```

---

### Step 5: Run Database Migrations / Sync Schema
Apply the Prisma schema to create all required database tables, indexes, enums, and community relations:

```bash
# Push schema directly to database:
npx prisma db push

# Or run migration history:
npx prisma migrate dev
```

---

### Step 6: Generate Prisma Client
Generate the Prisma Client instance tailored to the database schema:

```bash
npx prisma generate
```

---

### Step 7: Execute Database Seeders

Run both seeding scripts to populate test accounts, world cities, and Pexels cover images into PostgreSQL.

#### 7a. Seed Test User Accounts
```bash
npm run seed
```
*Expected Output:*
```text
🌱 Starting database seed for GlobeTrotter auth testing...

✅ Seeded account: traveler@globetrotter.com (USER)
✅ Seeded account: admin@globetrotter.com (ADMIN)
✅ Seeded account: adventurer@globetrotter.com (USER)

🎉 Database seeding completed successfully!
```

#### 7b. Seed World Cities & Pexels Cover Images
```bash
npm run seed:cities
```
*Expected Output:*
```text
🏙️ Seeding cities and fetching Pexels images...

✅ City: Paris, France -> Cover Image: https://images.pexels.com/photos/...
✅ City: Tokyo, Japan -> Cover Image: https://images.pexels.com/photos/...
✅ City: New York City, United States -> Cover Image: https://images.pexels.com/photos/...
✅ City: Sydney, Australia -> Cover Image: https://images.pexels.com/photos/...

🎉 Cities and Pexels images seeded successfully!
```

---

### Step 8: Verify Database Connection
Run the database connectivity verification script:

```bash
node test-db.js
```
*Expected Output:*
```text
✅ Database connected successfully!
Connected database: [ { current_database: 'globetrotter_db' } ]
```

---

## 🔑 Pre-Configured Testing Accounts

After running `npm run seed`, you can log into the frontend using any of these test credentials:

| Role | Email | Password | Name | Default Currency & Style |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Traveler** | `traveler@globetrotter.com` | `Traveler123!` | Aliza Saiyed | `INR` / Relaxed |
| **Admin User** | `admin@globetrotter.com` | `AdminSecret123!` | System Admin | `USD` / Cultural |
| **Backpacker** | `adventurer@globetrotter.com` | `Explore123!` | Liam Vance | `EUR` / Adventurous |

---

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd server
npm run dev
```
The Express server will start at `http://localhost:5000`.

### 2. Start the Frontend Client

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```
The React Vite app will start at `http://localhost:5173`.

---

## 📡 API Architecture Overview

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | No | Register account with optional avatar image upload |
| `/api/v1/auth/login` | `POST` | No | Authenticate user credentials & issue JWT tokens |
| `/api/v1/auth/refresh` | `POST` | No | Rotate refresh token and issue new access token |
| `/api/v1/auth/me` | `GET` | **Yes** | Fetch profile & preferences of authenticated user |
| `/api/v1/auth/logout` | `POST` | **Yes** | Revoke refresh token session |
| `/api/v1/auth/forgot-password` | `POST` | No | Request password reset token |
| `/api/v1/auth/reset-password` | `POST` | No | Reset user password using token |
| `/api/v1/destinations/regions` | `GET` | No | Fetch continent regional selections + Pexels covers |
| `/api/v1/destinations/cities/search` | `GET` | No | Search destinations & city autocomplete |
| `/api/v1/trips/user` | `GET` | **Yes** | Fetch authenticated user's planned & completed trips |
| `/api/v1/trips` | `POST` | **Yes** | Create a new trip with destination stops & budget |
| `/api/v1/trips/:id` | `DELETE` | **Yes** | Delete a planned or completed trip |
| `/api/v1/trips/:id/share` | `POST` | **Yes** | Generate a public shareable trip link |

---

## 📊 Database Schema Overview

| Domain | Models / Tables | Description |
| :--- | :--- | :--- |
| **Authentication & Users** | `User`, `UserPreference`, `Interest`, `UserInterest`, `RefreshToken`, `PasswordResetToken` | User accounts, preferences, travel styles, and secure session management |
| **Destinations & Media** | `Country`, `City`, `Image`, `CityImage`, `SavedDestination` | Geographical data, Pexels media caching, and saved user destinations |
| **Activities & Categories** | `Activity`, `ActivityCategory`, `ActivityCategoryOnActivity`, `ActivityImage` | Things to do, pricing, ratings, and categorized activity media |
| **Trips & Itineraries** | `Trip`, `TripStop`, `TripTransport`, `ItineraryItem` | Multi-city trips, dates, transportation modes, and day-by-day itineraries |
| **Expenses & Sharing** | `Expense`, `TripShare` | Budget and expense tracking across stops/items, shareable trip links |
| **Community & Discussions** | `CommunityPost`, `CommunityReply`, `CommunityPostLike`, `CommunityCategory` *(Enum)* | Discussion forums, categorized threads, user comments, and thread likes |
| **AI & Recommendations** | `RecommendationInteraction`, `TripGeneration` | Interaction history and AI trip generation prompts/snapshots |