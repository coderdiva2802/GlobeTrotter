# 🌐 GlobeTrotter REST API Contract & Specification

**Version:** `1.0.0`  
**Base URL:** `http://localhost:5000/api` (Production: `https://api.globetrotter.com/api`)  
**Format:** `JSON`  
**Authentication:** HTTP Bearer Token (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)

---

## 1. Global Standards & Conventions

### 1.1 Response Formats

#### Success Response Envelope (`2xx`)
```json
{
  "success": true,
  "data": { ... } || [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### Error Response Envelope (`4xx`, `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested trip was not found.",
    "details": []
  }
}
```

### 1.2 Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Validation error or invalid payload.
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: User does not have access to this resource.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Server-side exception.

---

## 2. API Endpoints

---

### 2.1 User Profile & Authentication

#### `GET /api/users/me`
Fetches the currently authenticated user profile for the navigation bar and user sessions.

- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "role": "USER",
    "profileImageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    "preference": {
      "language": "en",
      "preferredCurrency": "USD",
      "budgetLevel": "MEDIUM",
      "travelStyle": "ADVENTUROUS"
    },
    "createdAt": "2024-01-15T08:30:00.000Z"
  }
}
```

---

### 2.2 Regional Selections & Destinations

#### `GET /api/destinations/regions`
Fetches curated top regional selections for the home dashboard.

- **Query Parameters:**
  - `featured` *(optional, boolean)*: Filter for highlighted regions only (default: `true`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "europe",
      "name": "Europe",
      "destinationCount": 50,
      "destinationCountLabel": "50+ Destinations",
      "coverImageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      "popularCities": ["Paris", "Rome", "Barcelona", "Amsterdam"]
    },
    {
      "id": "asia",
      "name": "Asia",
      "destinationCount": 60,
      "destinationCountLabel": "60+ Destinations",
      "coverImageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      "popularCities": ["Tokyo", "Kyoto", "Bangkok", "Singapore"]
    },
    {
      "id": "north-america",
      "name": "North America",
      "destinationCount": 40,
      "destinationCountLabel": "40+ Destinations",
      "coverImageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "popularCities": ["New York", "San Francisco", "Vancouver", "Mexico City"]
    },
    {
      "id": "south-america",
      "name": "South America",
      "destinationCount": 30,
      "destinationCountLabel": "30+ Destinations",
      "coverImageUrl": "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
      "popularCities": ["Rio de Janeiro", "Buenos Aires", "Cusco", "Lima"]
    },
    {
      "id": "africa",
      "name": "Africa",
      "destinationCount": 25,
      "destinationCountLabel": "25+ Destinations",
      "coverImageUrl": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      "popularCities": ["Cape Town", "Marrakech", "Cairo", "Nairobi"]
    }
  ]
}
```

---

### 2.3 User Trips (Dashboard & History)

#### `GET /api/trips/user`
Fetches trips created by the authenticated user, categorized by status (Completed / Upcoming / Ongoing).

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` *(optional, string)*: `'all'` | `'completed'` | `'upcoming'` | `'ongoing'` (default: `'all'`)
  - `limit` *(optional, integer)*: Maximum number of trips to return (e.g., `10`)
  - `sort` *(optional, string)*: `'startDate:desc'` | `'startDate:asc'` (default: `'startDate:desc'`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "Greek Island Escape",
      "description": "Sun-soaked days exploring Cycladic architecture, beaches, and Aegean cuisine.",
      "startDate": "2024-05-10T00:00:00.000Z",
      "endDate": "2024-05-18T00:00:00.000Z",
      "formattedDates": "May 10 - May 18, 2024",
      "travelerCount": 2,
      "travelerLabel": "2 Travelers",
      "status": "COMPLETED",
      "statusLabel": "Completed",
      "coverImageUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      "locationSummary": "Santorini, Greece",
      "stops": [
        {
          "id": 1,
          "order": 1,
          "cityName": "Santorini",
          "countryName": "Greece"
        }
      ]
    },
    {
      "id": 102,
      "name": "Maldives Getaway",
      "description": "Luxurious overwater villa relaxation and coral reef snorkeling.",
      "startDate": "2024-02-20T00:00:00.000Z",
      "endDate": "2024-02-28T00:00:00.000Z",
      "formattedDates": "Feb 20 - Feb 28, 2024",
      "travelerCount": 2,
      "travelerLabel": "2 Travelers",
      "status": "COMPLETED",
      "statusLabel": "Completed",
      "coverImageUrl": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
      "locationSummary": "Maldives",
      "stops": [
        {
          "id": 2,
          "order": 1,
          "cityName": "Malé",
          "countryName": "Maldives"
        }
      ]
    },
    {
      "id": 103,
      "name": "Japan Adventure",
      "description": "A journey through Tokyo neon, Kyoto heritage temples, and Osaka street food.",
      "startDate": "2024-11-10T00:00:00.000Z",
      "endDate": "2024-11-28T00:00:00.000Z",
      "formattedDates": "Nov 10 - Nov 28, 2024",
      "travelerCount": 2,
      "travelerLabel": "2 Travelers",
      "status": "UPCOMING",
      "statusLabel": "Upcoming",
      "coverImageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      "locationSummary": "Tokyo, Kyoto, Osaka",
      "stops": [
        { "id": 3, "order": 1, "cityName": "Tokyo", "countryName": "Japan" },
        { "id": 4, "order": 2, "cityName": "Kyoto", "countryName": "Japan" },
        { "id": 5, "order": 3, "cityName": "Osaka", "countryName": "Japan" }
      ]
    }
  ]
}
```

---

### 2.4 Search & Filters

#### `GET /api/search`
Unified search endpoint for destinations, trips, and experiences with filtering, grouping, and sorting.

- **Query Parameters:**
  - `q` *(optional, string)*: Search keywords (e.g., `"Japan"`, `"Santorini"`, `"Beach"`).
  - `type` *(optional, string)*: `'all'` | `'destinations'` | `'trips'` | `'experiences'` (default: `'all'`).
  - `groupBy` *(optional, string)*: `'region'` | `'country'` | `'category'` | `'none'`.
  - `sortBy` *(optional, string)*: `'popularity'` | `'rating'` | `'price_low'` | `'price_high'` | `'date'`.
  - `continent` *(optional, string)*: e.g. `'Europe'`, `'Asia'`, `'North America'`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": 1,
        "name": "Tokyo",
        "country": "Japan",
        "continent": "Asia",
        "popularityScore": 9.8,
        "imageUrl": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
      }
    ],
    "trips": [],
    "activities": []
  }
}
```

---

### 2.5 Trip Creation (Plan a Trip)

#### `POST /api/trips`
Creates a new travel plan.

- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "European Summer Odyssey",
  "description": "10-day tour across France and Italy",
  "startDate": "2025-06-15T00:00:00.000Z",
  "endDate": "2025-06-25T00:00:00.000Z",
  "travelerCount": 2,
  "budget": 3500.00,
  "currency": "USD",
  "visibility": "PRIVATE",
  "cityIds": [12, 18]
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": 104,
    "name": "European Summer Odyssey",
    "startDate": "2025-06-15T00:00:00.000Z",
    "endDate": "2025-06-25T00:00:00.000Z",
    "travelerCount": 2,
    "status": "UPCOMING",
    "createdAt": "2025-01-20T10:00:00.000Z"
  }
}
```

---

### 2.6 Community Trips

#### `GET /api/community/trips`
Fetches public shared trips curated from community travelers.

- **Query Parameters:**
  - `page` *(optional, default 1)*
  - `limit` *(optional, default 10)*
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 201,
      "name": "Backpacking Southeast Asia",
      "authorName": "Elena Rostova",
      "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "durationDays": 21,
      "locationSummary": "Vietnam, Cambodia, Thailand",
      "coverImageUrl": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
      "likesCount": 342
    }
  ]
}
```
