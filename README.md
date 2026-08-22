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

Open `.env` and set your `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/globetrotter_db?schema=public"

PORT=5000
CLIENT_URL="http://localhost:5173"

JWT_ACCESS_SECRET="your_secure_access_secret_key"
JWT_REFRESH_SECRET="your_secure_refresh_secret_key"
```

> **Note:** Replace `<USER>` and `<PASSWORD>` with your actual PostgreSQL username and password (e.g., `postgres:password`).

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

> **Alternative (for rapid prototyping without migration files):**
> ```bash
> npx prisma db push
> ```

---

### 7. Generate Prisma Client
Generate the TypeScript/JavaScript Prisma Client tailored to your schema:

```bash
npx prisma generate
```

---

### 8. Verify Database Connection
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

### 9. (Optional) Prisma Studio
To visually browse, inspect, and edit your database tables and records:

```bash
npx prisma studio
```

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

### Backend

```bash
cd server
npm run dev
```
The server will start at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```
The client will start at `http://localhost:5173`.