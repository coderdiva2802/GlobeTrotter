# GlobeTrotter

An AI-powered personalized travel planning platform.

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Lucide React

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- Zod
- CORS

### Authentication
- Custom JWT Authentication
- bcrypt

### Development Tools
- Nodemon
- ESLint

## Project Structure

```text
GlobeTrotter/
├── client/        # React frontend
├── server/        # Express backend
├── data/          # Cities, countries and activities data
└── docs/          # Project documentation


## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev


Save it.

---

# 7. Check your complete structure

It should roughly look like:

```text
GlobeTrotter/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── lib/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env              ← NOT pushed
│   ├── .env.example      ← pushed
│   ├── package.json
│   ├── package-lock.json
│   └── prisma.config.ts   ← depending on Prisma init location/version
│
├── data/
│   ├── cities/
│   ├── activities/
│   └── countries/
│
├── docs/
├── .gitignore
└── README.md