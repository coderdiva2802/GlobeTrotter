# GlobeTrotter 🌍✈️

An AI-powered personalized travel planning platform.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express
- **ORM:** Prisma v7
- **Database:** PostgreSQL (with `@prisma/adapter-pg` driver adapter)
- **Validation:** Zod
- **Security:** Custom JWT Authentication & bcrypt

---

## 📁 Project Structure

```text
GlobeTrotter/
├── client/              # React frontend (Vite)
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/              # Express backend
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma database schema
│   │   └── migrations/         # SQL migration history
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.js       # Prisma client instance & PostgreSQL adapter
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables (local, git-ignored)
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   ├── prisma.config.ts        # Prisma 7 config
│   └── test-db.js              # Database connection test script
│
├── data/                # Data assets (cities, countries, activities)
├── docs/                # Project documentation
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄️ Database Setup Guide (PostgreSQL + Prisma)

Follow these exact steps to set up the database matching the repository's Prisma schema.

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **PostgreSQL** installed and running (locally or hosted via Neon, Supabase, etc.)

---

### 2. Create the PostgreSQL Database
Open PostgreSQL terminal (`psql`) or pgAdmin and create a new database:

```sql
CREATE DATABASE globetrotter_db;
```

---

### 3. Configure Server Environment Variables
Navigate to the `server/` directory:

```bash
cd server
```

Copy `.env.example` to `.env`:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Open `.env` and set your `DATABASE_URL`, JWT secrets, and `PEXELS_API_KEY`:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/globetrotter_db?schema=public"

PORT=5000
CLIENT_URL="http://localhost:5173"

JWT_ACCESS_SECRET="your_secure_access_secret_key"
JWT_REFRESH_SECRET="your_secure_refresh_secret_key"

PEXELS_API_KEY="your_pexels_api_key_here"
```

> **Note:** Replace `<USER>` and `<PASSWORD>` with your actual PostgreSQL username and password (e.g., `postgres:password`). Get a free `PEXELS_API_KEY` from [Pexels API Portal](https://www.pexels.com/api/) to enable dynamic destination photo fetching.

---

### 4. Install Server Dependencies
Ensure all backend packages are installed:

```bash
npm install
```

---

### 5. Validate the Prisma Schema
Validate that [prisma/schema.prisma](server/prisma/schema.prisma) is syntax- and relation-valid:

```bash
npx prisma validate
```

---

### 6. Run Database Migrations
Apply all migrations to create the tables, indexes, and enums in your PostgreSQL database:

```bash
npx prisma migrate dev --name initial_schema
```

---

### 7. Generate Prisma Client
Generate the TypeScript/JavaScript Prisma Client tailored to your schema:

```bash
npx prisma generate
```

---

### 8. Seed Database with Accounts & World Destinations
Populate your database with pre-configured test user accounts, world cities, and Pexels travel images:

```bash
# Inside server/ directory:
npm run seed                    # Seeds test user accounts
npm run seed:cities             # Seeds world destinations & fetches Pexels images into PostgreSQL
```

---

### 9. Verify Database Connection
Run the included database test script:

```bash
node test-db.js
```

You should see:
```text
✅ Database connected successfully!
Connected database: [ { current_database: 'globetrotter_db' } ]
```

---

### 10. (Optional) Prisma Studio
To visually browse, inspect, and edit your database tables and records:

```bash
npx prisma studio
```

---

## 🔑 Authentication Testing Accounts

The database seed script initializes the following pre-configured test user accounts:

| Role | Email | Password | Name | Default Currency & Style |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Traveler** | `traveler@globetrotter.com` | `Traveler123!` | Aliza Saiyed | `INR` / Relaxed |
| **Admin User** | `admin@globetrotter.com` | `AdminSecret123!` | System Admin | `USD` / Cultural |
| **Backpacker** | `adventurer@globetrotter.com` | `Explore123!` | Liam Vance | `EUR` / Adventurous |

---

## 📊 Database Schema Overview

The database schema is structured into the following core domains:

| Domain | Models / Tables | Description |
| :--- | :--- | :--- |
| **Authentication & Users** | `User`, `UserPreference`, `Interest`, `UserInterest`, `RefreshToken`, `PasswordResetToken` | User accounts, preferences, travel styles, and secure session management |
| **Destinations & Media** | `Country`, `City`, `Image`, `CityImage`, `SavedDestination` | Geographical data, rich media, and saved user destinations |
| **Activities & Categories** | `Activity`, `ActivityCategory`, `ActivityCategoryOnActivity`, `ActivityImage` | Things to do, pricing, ratings, and categorized activity media |
| **Trips & Itineraries** | `Trip`, `TripStop`, `TripTransport`, `ItineraryItem` | Multi-city trips, dates, transportation modes, and day-by-day itineraries |
| **Expenses & Sharing** | `Expense`, `TripShare` | Budget and expense tracking across stops/items, shareable trip links |
| **AI & Recommendations** | `RecommendationInteraction`, `TripGeneration` | Interaction history and AI trip generation prompts/snapshots |

---

## 🚀 Running the Application

### 1. Start Backend Server

```bash
cd server
npm install
npm run seed    # (Optional) Populates test accounts
npm run dev
```
The backend server starts at `http://localhost:5000`.

### 2. Start Frontend Application

```bash
cd client
npm install
npm run dev
```
The frontend client starts at `http://localhost:5173`.