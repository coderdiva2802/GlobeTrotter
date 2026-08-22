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
