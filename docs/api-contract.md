# GlobeTrotter Backend API Contract 🌐✈️

This document specifies the REST API contract for authentication, user profiles, and session management in GlobeTrotter.

---

## 1. Base Configuration

- **Base URL:** `http://localhost:5000/api/v1` (or `https://api.globetrotter.com/v1`)
- **Content-Type:** `application/json` (or `multipart/form-data` for file uploads)
- **Authentication Scheme:** `Bearer <JWT_ACCESS_TOKEN>` in `Authorization` header

---

## 2. Standard Response Format

### Success Response (`2xx`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response (`4xx`, `5xx`)
```json
{
  "success": false,
  "message": "Human readable error description",
  "errors": [
    {
      "field": "email",
      "message": "Email address is already in use"
    }
  ]
}
```

---

## 3. Authentication Endpoints

### 3.1 User Registration
- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user account with profile details and optional avatar upload.
- **Request Headers:**
  - `Content-Type: application/json` OR `Content-Type: multipart/form-data`

#### Request Payload
```json
{
  "firstName": "Aliza",
  "lastName": "Saiyed",
  "email": "you@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+91 9876543210",
  "city": "Mumbai",
  "country": "India",
  "bio": "Passionate travel blogger exploring hidden gems and local culinary adventures.",
  "profileImageUrl": "https://example.com/avatars/aliza.jpg"
}
```
*(If `multipart/form-data`, `avatar` file can be sent under field name `avatar` or `photo`)*

#### Validation Rules
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `firstName` | `string` | **Yes** | Min 2, max 50 chars, trimmed |
| `lastName` | `string` | No | Max 50 chars |
| `email` | `string` | **Yes** | Valid email format, lowercase, unique |
| `password` | `string` | **Yes** | Min 8 chars, at least 1 number, 1 special char |
| `phoneNumber` | `string` | No | Valid E.164 or country-formatted phone number |
| `city` | `string` | No | Max 100 chars |
| `country` | `string` | No | Max 100 chars |
| `bio` | `string` | No | Max 500 chars |
| `avatar` | `file` / `url` | No | JPG/PNG/WEBP, max size 5MB |

#### Responses
- **`201 Created`**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Aliza",
      "lastName": "Saiyed",
      "email": "you@example.com",
      "phoneNumber": "+91 9876543210",
      "city": "Mumbai",
      "country": "India",
      "bio": "Passionate travel blogger exploring hidden gems and local culinary adventures.",
      "role": "USER",
      "profileImageUrl": "https://example.com/uploads/avatars/1_aliza.webp",
      "createdAt": "2026-08-22T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
}
```
- **`400 Bad Request`** — Validation failed (e.g. invalid email format, weak password)
- **`409 Conflict`** — Email address is already registered

---

### 3.2 User Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates user via email and password, issuing access & refresh tokens.
- **Request Headers:**
  - `Content-Type: application/json`

#### Request Payload
```json
{
  "email": "you@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Aliza",
      "lastName": "Saiyed",
      "email": "you@example.com",
      "phoneNumber": "+91 9876543210",
      "city": "Mumbai",
      "country": "India",
      "bio": "Passionate travel blogger...",
      "role": "USER",
      "profileImageUrl": "https://example.com/uploads/avatars/1_aliza.webp"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
}
```
- **`401 Unauthorized`** — Invalid email or password
- **`400 Bad Request`** — Missing email or password

---

### 3.3 Refresh Token Rotation
- **Endpoint:** `POST /auth/refresh`
- **Description:** Obtains a new access token using a valid refresh token.
- **Request Headers:**
  - `Content-Type: application/json`

#### Request Payload
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
- **`401 Unauthorized`** — Expired or revoked refresh token

---

### 3.4 Current User Profile (`Me`)
- **Endpoint:** `GET /auth/me`
- **Description:** Returns the profile of the currently authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <accessToken>`

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Aliza",
      "lastName": "Saiyed",
      "email": "you@example.com",
      "phoneNumber": "+91 9876543210",
      "city": "Mumbai",
      "country": "India",
      "bio": "Passionate travel blogger...",
      "role": "USER",
      "profileImageUrl": "https://example.com/uploads/avatars/1_aliza.webp",
      "preference": {
        "language": "en",
        "preferredCurrency": "INR",
        "budgetLevel": "MEDIUM",
        "travelStyle": "RELAXED"
      }
    }
  }
}
```
- **`401 Unauthorized`** — Missing or invalid token

---

### 3.5 User Logout
- **Endpoint:** `POST /auth/logout`
- **Description:** Revokes the active refresh token session.
- **Request Headers:**
  - `Authorization: Bearer <accessToken>`
- **Request Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```
- **Responses:**
  - **`200 OK`**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### 3.6 Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Triggers a password reset token & email to the user.
- **Request Payload:**
```json
{
  "email": "you@example.com"
}
```
- **Responses:**
  - **`200 OK`**
  ```json
  {
    "success": true,
    "message": "If an account with that email exists, a password reset link has been sent."
  }
  ```

---

### 3.7 Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Description:** Sets a new password given a valid reset token.
- **Request Payload:**
```json
{
  "token": "reset_token_hash_here",
  "newPassword": "NewSecurePassword123!"
}
```
- **Responses:**
  - **`200 OK`**
  ```json
  {
    "success": true,
    "message": "Password has been reset successfully. Please log in with your new password."
  }
  ```

---

## 4. User Profile & Statistics Endpoints

### 4.1 Get User Profile & Travel Statistics
- **Endpoint:** `GET /users/profile`
- **Description:** Retrieves the active user's profile information, travel stats, preplanned trips, and previous trips.
- **Request Headers:**
  - `Authorization: Bearer <accessToken>`

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Aarohi",
      "lastName": "Sharma",
      "email": "aarohi.sharma@example.com",
      "phoneNumber": "+91 9876543210",
      "city": "Mumbai",
      "country": "India",
      "bio": "Passionate travel blogger exploring hidden gems and local culinary adventures.",
      "role": "USER",
      "profileImageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "stats": {
        "tripsPlanned": 12,
        "placesExplored": 18,
        "photosCaptured": 234,
        "countriesVisited": 6
      }
    },
    "preplannedTrips": [
      {
        "id": 101,
        "name": "Maldives Getaway",
        "destination": "Maldives",
        "startDate": "2024-05-20T00:00:00.000Z",
        "endDate": "2024-05-27T00:00:00.000Z",
        "formattedDates": "May 20 - May 27, 2024",
        "badge": "In 12 days",
        "badgeVariant": "warning",
        "coverImageUrl": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 102,
        "name": "Swiss Adventure",
        "destination": "Switzerland",
        "startDate": "2024-06-15T00:00:00.000Z",
        "endDate": "2024-06-22T00:00:00.000Z",
        "formattedDates": "Jun 15 - Jun 22, 2024",
        "badge": "In 1 month",
        "badgeVariant": "success",
        "coverImageUrl": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 103,
        "name": "Japan Tour",
        "destination": "Tokyo, Kyoto, Osaka",
        "startDate": "2024-08-10T00:00:00.000Z",
        "endDate": "2024-08-20T00:00:00.000Z",
        "formattedDates": "Aug 10 - Aug 20, 2024",
        "badge": "In 2 months",
        "badgeVariant": "success",
        "coverImageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
      }
    ],
    "previousTrips": [
      {
        "id": 201,
        "name": "Greek Island Escape",
        "destination": "Santorini, Greece",
        "startDate": "2024-04-10T00:00:00.000Z",
        "endDate": "2024-04-18T00:00:00.000Z",
        "formattedDates": "Apr 10 - Apr 18, 2024",
        "badge": "Completed",
        "badgeVariant": "neutral",
        "coverImageUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 202,
        "name": "Turkey Explorer",
        "destination": "Istanbul, Cappadocia",
        "startDate": "2024-02-05T00:00:00.000Z",
        "endDate": "2024-02-13T00:00:00.000Z",
        "formattedDates": "Feb 5 - Feb 13, 2024",
        "badge": "Completed",
        "badgeVariant": "neutral",
        "coverImageUrl": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 203,
        "name": "Dubai Experience",
        "destination": "Dubai, UAE",
        "startDate": "2023-12-20T00:00:00.000Z",
        "endDate": "2023-12-27T00:00:00.000Z",
        "formattedDates": "Dec 20 - Dec 27, 2023",
        "badge": "Completed",
        "badgeVariant": "neutral",
        "coverImageUrl": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
}
```

---

### 4.2 Update User Profile
- **Endpoint:** `PUT /users/profile`
- **Description:** Updates the profile attributes of the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`

#### Request Payload
```json
{
  "firstName": "Aarohi",
  "lastName": "Sharma",
  "phoneNumber": "+91 9876543210",
  "city": "Mumbai",
  "country": "India",
  "bio": "Passionate travel blogger exploring hidden gems and local culinary adventures.",
  "profileImageUrl": "https://example.com/uploads/avatars/aarohi.webp"
}
```

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Aarohi",
      "lastName": "Sharma",
      "email": "aarohi.sharma@example.com",
      "phoneNumber": "+91 9876543210",
      "city": "Mumbai",
      "country": "India",
      "bio": "Passionate travel blogger...",
      "profileImageUrl": "https://example.com/uploads/avatars/aarohi.webp"
    }
  }
}
```
- **`400 Bad Request`** — Validation failed
- **`401 Unauthorized`** — Missing or expired token

---

## 5. Activity Search & Discovery Endpoints

### 5.1 Search Activities
- **Endpoint:** `GET /activities/search`
- **Description:** Search and filter activities, tours, and trek experiences across destinations.
- **Query Parameters:**
  - `q` (string, optional): Search keyword (matches activity name, description, city, or country).
  - `groupBy` (string, optional): Grouping mode (`none`, `location`, `price`, `difficulty`).
  - `filter` (string, optional): Category filter (`all`, `best-price`, `top-rated`, `lowest-price`, `best-seller`, `new`).
  - `sortBy` (string, optional): Sort criteria (`default`, `rating`, `price-low`, `price-high`, `duration`).
  - `minPrice` (number, optional): Minimum price in INR.
  - `maxPrice` (number, optional): Maximum price in INR.
  - `cityId` (number, optional): Filter by specific destination city ID.

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "query": "hi",
    "activities": [
      {
        "id": 301,
        "name": "Manali Escape",
        "destination": "Manali, Himachal Pradesh",
        "cityId": 12,
        "description": "Mountain views, cafes and a relaxed Himalayan getaway with flexible stays.",
        "durationDays": 4,
        "durationLabel": "4 Days",
        "difficulty": "Easy",
        "maxGroupSize": 12,
        "groupSizeLabel": "Max 12",
        "rating": 4.8,
        "reviewCount": 412,
        "price": 8499,
        "currency": "INR",
        "formattedPrice": "₹8,499",
        "badge": "Best Price",
        "badgeVariant": "blue",
        "coverImageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 302,
        "name": "Paris Highlights",
        "destination": "Paris, France",
        "cityId": 4,
        "description": "A compact European city break covering classic sights, food and neighborhoods.",
        "durationDays": 5,
        "durationLabel": "5 Days",
        "difficulty": "Easy",
        "maxGroupSize": 10,
        "groupSizeLabel": "Max 10",
        "rating": 4.8,
        "reviewCount": 603,
        "price": 49999,
        "currency": "INR",
        "formattedPrice": "₹49,999",
        "badge": "Top Rated",
        "badgeVariant": "coral",
        "coverImageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 303,
        "name": "Triund Trek",
        "destination": "Dharamshala, Himachal Pradesh",
        "cityId": 14,
        "description": "A short trek offering stunning Dhauladhar views and a simple mountain-camp experience.",
        "durationDays": 2,
        "durationLabel": "2 Days",
        "difficulty": "Easy",
        "maxGroupSize": 15,
        "groupSizeLabel": "Max 15",
        "rating": 4.6,
        "reviewCount": 128,
        "price": 1499,
        "currency": "INR",
        "formattedPrice": "₹1,499",
        "badge": "Lowest Price",
        "badgeVariant": "teal",
        "coverImageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 304,
        "name": "Hampta Pass Trek",
        "destination": "Manali, Himachal Pradesh",
        "cityId": 12,
        "description": "Experience the dramatic change from lush valleys to high-altitude barren landscapes.",
        "durationDays": 5,
        "durationLabel": "5 Days",
        "difficulty": "Moderate",
        "maxGroupSize": 12,
        "groupSizeLabel": "Max 12",
        "rating": 4.8,
        "reviewCount": 256,
        "price": 6999,
        "currency": "INR",
        "formattedPrice": "₹6,999",
        "badge": "Best Seller",
        "badgeVariant": "green",
        "coverImageUrl": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": 305,
        "name": "Kheerganga Trek",
        "destination": "Kullu, Himachal Pradesh",
        "cityId": 16,
        "description": "A scenic trek to natural hot springs in the Parvati Valley.",
        "durationDays": 3,
        "durationLabel": "3 Days",
        "difficulty": "Moderate",
        "maxGroupSize": 10,
        "groupSizeLabel": "Max 10",
        "rating": 4.5,
        "reviewCount": 98,
        "price": 2399,
        "currency": "INR",
        "formattedPrice": "₹2,399",
        "badge": "New",
        "badgeVariant": "purple",
        "coverImageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
}
```

---

### 5.2 Get Activity Details
- **Endpoint:** `GET /activities/:id`
- **Description:** Returns full itinerary breakdown, inclusions, exclusions, and guide details for an activity.
- **Responses:**
  - **`200 OK`**
  - **`404 Not Found`**

---

## 6. Trips Calendar View Endpoints

### 6.1 Get Monthly Trip Events
- **Endpoint:** `GET /trips/calendar`
- **Description:** Returns all trip events and date ranges for a given month/year to render the calendar view.
- **Query Parameters:**
  - `month` (string, optional, default: current month): Format `YYYY-MM` (e.g. `2024-01`).
  - `category` (string, optional): Filter by event category (`all`, `upcoming`, `planned`, `in-progress`, `getaways`, `adventures`).

#### Responses
- **`200 OK`**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "monthLabel": "January 2024",
    "totalEvents": 6,
    "events": [
      {
        "id": 501,
        "tripId": 101,
        "title": "Paris Trip",
        "date": "2024-01-10",
        "startDate": "2024-01-10",
        "endDate": "2024-01-14",
        "category": "upcoming",
        "categoryLabel": "Upcoming Trips",
        "color": "#3b82f6",
        "badgeBg": "#eff6ff",
        "badgeText": "#1d4ed8",
        "icon": "plane",
        "destination": "Paris, France"
      },
      {
        "id": 502,
        "tripId": 102,
        "title": "Saris 10",
        "date": "2024-01-16",
        "startDate": "2024-01-16",
        "endDate": "2024-01-20",
        "category": "planned",
        "categoryLabel": "Planned",
        "color": "#22c55e",
        "badgeBg": "#f0fdf4",
        "badgeText": "#15803d",
        "icon": "tent",
        "destination": "Sar Pass, Himachal Pradesh"
      },
      {
        "id": 503,
        "tripId": 103,
        "title": "15 - 22",
        "date": "2024-01-17",
        "startDate": "2024-01-15",
        "endDate": "2024-01-22",
        "category": "in-progress",
        "categoryLabel": "In Progress",
        "color": "#eab308",
        "badgeBg": "#fefce8",
        "badgeText": "#a16207",
        "icon": "calendar",
        "destination": "Goa Coastal Break"
      },
      {
        "id": 504,
        "tripId": 104,
        "title": "NYC Getaway",
        "date": "2024-01-19",
        "startDate": "2024-01-19",
        "endDate": "2024-01-24",
        "category": "getaways",
        "categoryLabel": "Getaways",
        "color": "#a855f7",
        "badgeBg": "#faf5ff",
        "badgeText": "#7e22ce",
        "icon": "building",
        "destination": "New York, USA"
      },
      {
        "id": 505,
        "tripId": 105,
        "title": "Japan Adventure",
        "date": "2024-01-21",
        "startDate": "2024-01-21",
        "endDate": "2024-01-28",
        "category": "adventures",
        "categoryLabel": "Adventures",
        "color": "#f97316",
        "badgeBg": "#fff7ed",
        "badgeText": "#c2410c",
        "icon": "shrine",
        "destination": "Tokyo & Kyoto, Japan"
      },
      {
        "id": 506,
        "tripId": 106,
        "title": "NYC Getaway",
        "date": "2024-01-29",
        "startDate": "2024-01-29",
        "endDate": "2024-02-03",
        "category": "getaways",
        "categoryLabel": "Getaways",
        "color": "#a855f7",
        "badgeBg": "#faf5ff",
        "badgeText": "#7e22ce",
        "icon": "building",
        "destination": "New York, USA"
      }
    ]
  }
}
```



