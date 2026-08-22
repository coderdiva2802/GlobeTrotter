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

### 2.5 Trip Creation (Plan a Trip Wizard)

#### `GET /api/destinations/autocomplete`
Searches for cities and destinations for the "Destination / first stop" dropdown in the trip wizard.

- **Query Parameters:**
  - `q` *(string, required)*: Partial city or country name (e.g. `"Par"` for Paris, `"Tok"` for Tokyo).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "cityId": 12,
      "cityName": "Paris",
      "countryName": "France",
      "displayName": "Paris, France",
      "region": "Île-de-France",
      "coverImageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
    },
    {
      "cityId": 14,
      "cityName": "Rome",
      "countryName": "Italy",
      "displayName": "Rome, Italy",
      "region": "Lazio",
      "coverImageUrl": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
    }
  ]
}
```

#### `POST /api/trips`
Creates a trip from Step 1 of the Trip Creation Wizard.

- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (Step 1 Payload)**:
```json
{
  "name": "Europe Summer Adventure",
  "firstDestination": "Paris, France",
  "firstCityId": 12,
  "startDate": "2025-06-10T00:00:00.000Z",
  "endDate": "2025-06-20T00:00:00.000Z",
  "description": "Family sightseeing trip visiting museums, historical landmarks, and French culinary tours.",
  "isDraft": false,
  "visibility": "PRIVATE"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": 105,
    "name": "Europe Summer Adventure",
    "startDate": "2025-06-10T00:00:00.000Z",
    "endDate": "2025-06-20T00:00:00.000Z",
    "formattedDates": "Jun 10 - Jun 20, 2025",
    "travelerCount": 2,
    "status": "UPCOMING",
    "createdAt": "2025-01-20T10:00:00.000Z"
  }
}
```

#### `PUT /api/trips/:id/stops`
Saves or updates multi-stop itineraries from Step 2 of the Trip Wizard ("Build your itinerary").

- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (Step 2 Multi-Stop Payload)**:
```json
{
  "stops": [
    {
      "order": 1,
      "cityName": "Paris",
      "cityId": 1,
      "startDate": "2025-06-10T00:00:00.000Z",
      "endDate": "2025-06-13T00:00:00.000Z",
      "formattedDates": "10 Jun - 13 Jun",
      "budget": 40000,
      "currency": "INR",
      "notes": "Museums, cafés and city highlights"
    },
    {
      "order": 2,
      "cityName": "Amsterdam",
      "cityId": 12,
      "startDate": "2025-06-13T00:00:00.000Z",
      "endDate": "2025-06-16T00:00:00.000Z",
      "formattedDates": "13 Jun - 16 Jun",
      "budget": 35000,
      "currency": "INR",
      "notes": "Canals, culture and local food"
    },
    {
      "order": 3,
      "cityName": "Berlin",
      "cityId": 13,
      "startDate": "2025-06-16T00:00:00.000Z",
      "endDate": "2025-06-20T00:00:00.000Z",
      "formattedDates": "16 Jun - 20 Jun",
      "budget": 45000,
      "currency": "INR",
      "notes": "History, architecture and nightlife"
    }
  ]
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "tripId": 105,
    "totalBudget": 120000,
    "currency": "INR",
    "stopsCount": 3,
    "stops": [
      { "id": 1, "order": 1, "cityName": "Paris", "budget": 40000, "notes": "Museums, cafés and city highlights" },
      { "id": 2, "order": 2, "cityName": "Amsterdam", "budget": 35000, "notes": "Canals, culture and local food" },
      { "id": 3, "order": 3, "cityName": "Berlin", "budget": 45000, "notes": "History, architecture and nightlife" }
    ]
  }
}
```

#### `GET /api/trips/:id/itinerary`
Fetches the complete day-wise itinerary, time-slotted activities, and budget summary for a trip.

- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 105,
      "name": "abc",
      "status": "UPCOMING",
      "locationSummary": "xyz",
      "startDate": "2026-08-31T00:00:00.000Z",
      "endDate": "2026-09-05T00:00:00.000Z",
      "formattedDates": "2026-08-31 - 2026-09-05",
      "coverImageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
    },
    "budgetSummary": {
      "totalBudget": 120000,
      "totalBudgetFormatted": "₹1,20,000",
      "plannedExpenses": 96500,
      "plannedExpensesFormatted": "₹96,500",
      "remainingBudget": 23500,
      "remainingBudgetFormatted": "₹23,500",
      "currency": "INR"
    },
    "days": [
      {
        "dayNumber": 1,
        "dayLabel": "Day 1",
        "dateFormatted": "June 10",
        "cityName": "Paris",
        "locationHeader": "Paris • June 10",
        "items": [
          { "id": 1, "time": "09:00 AM", "activityName": "Eiffel Tower", "expense": 2500, "expenseFormatted": "₹2,500" },
          { "id": 2, "time": "01:00 PM", "activityName": "Lunch at Le Marais", "expense": 1800, "expenseFormatted": "₹1,800" },
          { "id": 3, "time": "05:30 PM", "activityName": "Seine River Cruise", "expense": 3000, "expenseFormatted": "₹3,000" }
        ]
      },
      {
        "dayNumber": 2,
        "dayLabel": "Day 2",
        "dateFormatted": "June 11",
        "cityName": "Paris",
        "locationHeader": "Paris • June 11",
        "items": [
          { "id": 4, "time": "10:00 AM", "activityName": "Louvre Museum", "expense": 2000, "expenseFormatted": "₹2,000" },
          { "id": 5, "time": "03:00 PM", "activityName": "Montmartre Walk", "expense": 0, "expenseFormatted": "Free" },
          { "id": 6, "time": "08:00 PM", "activityName": "Dinner Experience", "expense": 2500, "expenseFormatted": "₹2,500" }
        ]
      }
    ]
  }
}
```

#### `POST /api/trips/:id/share`
Generates a secure public share token for the itinerary.

- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "shareToken": "gt_share_9f8d2b1a",
    "shareUrl": "http://localhost:5174/share/gt_share_9f8d2b1a",
    "isActive": true,
    "viewCount": 0
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
