# DecodeLabs Full Stack Development — Project 2: Backend API Development
> **Industrial Training Kit | Batch 2026**  
> **Author:** Akm73 | **Track:** Full Stack Web Development  
> **Status:** Production-Ready & Strictly PDF Compliant

---

## 1. Project Title
**DecodeLabs Core RESTful Backend API Service**

---

## 2. Project Objective
The primary objective of this project is to architect, develop, validate, and document a robust, production-grade backend REST API that handles application business logic with strict adherence to the **DecodeLabs Full Stack Development Industrial Training Kit (Project 2)** specification.

### Mandatory Deliverables Achieved:
1. **API Endpoints:** Complete implementation of `GET`, `POST`, `PUT`, and `DELETE` methods.
2. **Input & Response Handling:** High-throughput JSON parsing and standardized, predictable server responses.
3. **Dual-Tier Validation:** Syntactic (structural/type/format) and Semantic (business logic/uniqueness/state) validation.
4. **Reliable Server Logic:** Clean separation of concerns across Routes, Controllers, Services, Middleware, and In-Memory Data Store.
5. **REST API Conventions:** Pure noun-based resource naming (`/api/users`), stateless design, and standard HTTP verb semantics.
6. **Predictable Error Handling:** Centralized error middleware handling operational errors, malformed JSON, and unexpected server exceptions.
7. **Client Communication:** Strictly JSON data exchange with unified response envelopes.
8. **HTTP Status Codes:** Practical demonstration of `200`, `201`, `204`, `400`, `401`, `403`, `404`, `429`, and `500`.
9. **Security & Resilience:** AuthN vs AuthZ separation, rate limiting, payload protection, and crash-proof server lifecycle.

---

## 3. Technologies Used
- **Runtime Environment:** [Node.js](https://nodejs.org/) (v24.18.0 LTS compatible)
- **Web Application Framework:** [Express.js](https://expressjs.com/) (v4.21.2)
- **Cross-Origin Resource Sharing:** [CORS](https://www.npmjs.com/package/cors) (v2.8.5)
- **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv) (v16.4.7)
- **Rate Limiting & DoS Protection:** [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) (v7.5.0)
- **Automated Test Harness:** Built-in Automated Runner (`tests/api.test.js`) leveraging Node Native Fetch & HTTP

---

## 4. Backend Architecture
The backend is structured according to the **Separation of Concerns (SoC)** principle, ensuring modularity, maintainability, and clean testability without introducing premature database or microservice complexity.

```
full stack p2/
├── .env                       # Active environment configuration
├── .env.example               # Reference environment variables template
├── .gitignore                 # Version control exclusion rules
├── package.json               # Project manifest, dependencies, scripts
├── README.md                  # Comprehensive architectural & API documentation
├── src/
│   ├── app.js                 # Express application initialization & middleware pipeline
│   ├── server.js              # Server lifecycle, port binding & graceful shutdown
│   ├── config/
│   │   └── config.js          # Centralized configuration with defaults
│   ├── controllers/
│   │   ├── healthController.js # Health metrics & status code demo handler
│   │   └── userController.js   # HTTP transport logic for user resources
│   ├── data/
│   │   └── userStore.js       # In-memory persistence layer with seed data
│   ├── middleware/
│   │   ├── authMiddleware.js  # AuthN (401) & AuthZ (403) security middleware
│   │   ├── errorHandler.js    # Centralized JSON error interceptor
│   │   ├── rateLimiter.js     # Rate limiting middleware (429 DoS protection)
│   │   ├── requestLogger.js   # Real-time request duration & diagnostic logger
│   │   └── validateUser.js    # Syntactic validation & ID sanitization
│   ├── routes/
│   │   ├── healthRoutes.js    # Health & status code showcase endpoints
│   │   ├── index.js           # Master route aggregator (/api)
│   │   ├── securityRoutes.js  # Dedicated AuthN/AuthZ & rate limit test routes
│   │   └── userRoutes.js      # RESTful resource endpoints (/api/users)
│   ├── services/
│   │   └── userService.js     # Semantic validation & core business logic
│   └── utils/
│       ├── apiResponse.js     # Standardized JSON response envelope builders
│       └── appError.js        # Custom operational application error class
└── tests/
    └── api.test.js            # End-to-end automated API verification test suite
```

### Architectural Layer Flow
```
[Client Request]
       │
       ▼
[app.js: CORS -> Payload Size Limit -> Request Logger -> Global Rate Limiter]
       │
       ▼
[routes/: Modular Endpoint Matching]
       │
       ▼
[middleware/: Syntactic Validation / AuthN (401) / AuthZ (403)]
       │
       ▼
[controllers/: HTTP Request Unpacking & Status Mapping]
       │
       ▼
[services/: Business Rules & Semantic Validation (Uniqueness, Conflicts)]
       │
       ▼
[data/: In-Memory Data Store (userStore)]
       │
       ▼
[utils/apiResponse.js: Uniform JSON Response Envelope]
       │
       ▼
[Client Response (200 / 201 / 204)]
       │
       └─── (If Exception Thrown) ──► [errorHandler.js: Safe JSON Error (400 / 401 / 403 / 404 / 429 / 500)]
```

---

## 5. Installation Instructions

### Prerequisites
- Node.js (version 18.x, 20.x, or 24.x recommended)
- npm (version 9.x or higher)

### Steps
1. Navigate to the project root directory:
   ```bash
   cd "full stack p2"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 6. Environment Configuration
The project utilizes `dotenv` for configuration. An active `.env` file is pre-configured for instant execution.

### Configuration Reference (`.env.example`):
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_KEY=decodelabs-secret-key-2026
ADMIN_KEY=admin-super-secret-key-2026
```

---

## 7. How to Start the Server

### Production / Standard Mode:
```bash
npm start
```

### Development Watch Mode:
```bash
npm run dev
```

### Server Startup Output:
```text
====================================================
  DecodeLabs Full Stack Project 2 - Backend API    
  Environment : development                 
  Server Port : 5000                    
  API Base URL: http://localhost:5000/api 
====================================================
```

---

## 8. API Endpoint Documentation

| HTTP Method | Endpoint URI | Access Level | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Root welcome message & route directory | `200 OK` |
| **GET** | `/api` | Public | Primary API root directory & endpoint catalog | `200 OK` |
| **GET** | `/api/health` | Public | System uptime, health metrics & memory diagnostics | `200 OK` |
| **GET** | `/api/users` | Public | Retrieve all users (supports `?role=`, `?status=`, `?search=`) | `200 OK` |
| **GET** | `/api/users/:id` | Public | Retrieve single user by ID | `200 OK` / `404` |
| **POST** | `/api/users` | Public | Create a new user record | `201 Created` / `400` |
| **PUT** | `/api/users/:id` | Public | Update an existing user record | `200 OK` / `400` / `404` |
| **DELETE** | `/api/users/:id` | Public | Delete user (add `?noContent=true` for 204) | `200 OK` / `204` / `404` |
| **GET** | `/api/security/protected-user` | AuthN | Protected route verifying authentication | `200 OK` / `401` |
| **GET** | `/api/security/protected-admin` | AuthN+AuthZ | Protected route requiring `admin` role | `200 OK` / `401` / `403` |
| **GET** | `/api/security/rate-limit-test` | Rate-Limited | Quota test route (triggers 429 after 5 hits/30s) | `200 OK` / `429` |
| **GET** | `/api/demo/status/:code` | Pedagogical | Direct demonstration of required status codes | Matches `:code` |

---

## 9. HTTP Methods Overview

- **`GET`**: Safe and idempotent retrieval of resources. Modifies zero server resources.
- **`POST`**: Non-idempotent creation of new resources. Generates new IDs and timestamps.
- **`PUT`**: Idempotent update or replacement of existing resources identified by URI.
- **`DELETE`**: Idempotent removal of specified resources from the persistence layer.

---

## 10. Request Examples

### A. GET All Users
```bash
curl -X GET "http://localhost:5000/api/users"
```

### B. GET Single User by ID
```bash
curl -X GET "http://localhost:5000/api/users/1"
```

### C. POST Create New User (Valid)
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kavita Iyer",
    "email": "kavita.iyer@example.com",
    "role": "user",
    "status": "active"
  }'
```

### D. POST Create User (Syntactic Validation Failure — Missing Email)
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid User"
  }'
```

### E. POST Create User (Semantic Validation Failure — Duplicate Email)
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Aarav",
    "email": "aarav.sharma@example.com"
  }'
```

### F. PUT Update User
```bash
curl -X PUT "http://localhost:5000/api/users/2" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diya Patel Updated",
    "status": "inactive"
  }'
```

### G. DELETE User
```bash
curl -X DELETE "http://localhost:5000/api/users/3"
```

### H. Test Authentication (AuthN - 401 Unauthorized)
```bash
curl -X GET "http://localhost:5000/api/security/protected-user"
```

### I. Test Authorization (AuthZ - 403 Forbidden with User Key)
```bash
curl -X GET "http://localhost:5000/api/security/protected-admin" \
  -H "x-api-key: decodelabs-secret-key-2026"
```

### J. Test Authorization (200 OK with Admin Key)
```bash
curl -X GET "http://localhost:5000/api/security/protected-admin" \
  -H "x-api-key: admin-super-secret-key-2026"
```

---

## 11. Response Examples

### A. Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-11-08T03:57:33.686Z",
    "updatedAt": "2026-11-08T03:57:33.686Z"
  }
}
```

### B. Created Response (`201 Created`)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Kavita Iyer",
    "email": "kavita.iyer@example.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-11-08T03:57:33.787Z",
    "updatedAt": "2026-11-08T03:57:33.787Z"
  }
}
```

### C. Syntactic Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Syntactic validation failed",
  "error": "Field \"email\" is required."
}
```

### D. Semantic Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "message": "A user with email 'aarav.sharma@example.com' already exists. Email must be unique.",
  "error": "A user with email 'aarav.sharma@example.com' already exists. Email must be unique."
}
```

### E. Authentication Failure (`401 Unauthorized`)
```json
{
  "success": false,
  "message": "Authentication credentials are missing. Please provide x-api-key or Bearer token.",
  "error": "Authentication credentials are missing. Please provide x-api-key or Bearer token."
}
```

### F. Authorization Failure (`403 Forbidden`)
```json
{
  "success": false,
  "message": "Forbidden: Access denied. Role 'user' lacks permission for this action. Required role: admin.",
  "error": "Forbidden: Access denied. Role 'user' lacks permission for this action. Required role: admin."
}
```

### G. Resource Not Found (`404 Not Found`)
```json
{
  "success": false,
  "message": "User with ID 99999 not found.",
  "error": "User with ID 99999 not found."
}
```

### H. Rate Limit Exceeded (`429 Too Many Requests`)
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": "Demonstration rate limit exceeded (max 5 requests per 30 seconds). HTTP status 429 demonstrated."
}
```

### I. Internal Server Error (`500 Internal Server Error`)
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Simulated unhandled internal server error for HTTP 500 demonstration."
}
```

---

## 12. Validation Rules

Validation follows the golden engineering maxim: **"Never trust the client."**

### Level A: Syntactic Validation (Structural & Type Checks)
- **Content Type Check:** Rejects requests with non-JSON format or malformed syntax.
- **Payload Sanitization:** Rejects non-whitelisted attributes (`Allowed: name, email, role, status`).
- **Required Fields:** Ensures mandatory keys (`name`, `email`) exist on resource creation.
- **Type Checking:** Ensures `name` is a String, `email` is a String, and `id` parameter is an integer.
- **Pattern Matching:**
  - `name`: Regex `^[a-zA-Z\s'-]{2,50}$` (2–50 characters, letters/spaces only).
  - `email`: RFC 5322 standard regex format.
  - `role`: Enum check restricted to `['admin', 'user', 'manager']`.
  - `status`: Enum check restricted to `['active', 'inactive']`.

### Level B: Semantic Validation (Business Logic & State Checks)
- **Uniqueness Check:** Enforces email uniqueness across all users; rejects duplicates with descriptive errors.
- **Referential Integrity:** Verifies resource existence prior to `GET`, `PUT`, or `DELETE`.
- **Conflict Prevention:** During `PUT` operations, ensures modified email is not currently claimed by another user ID.
- **Root Protection Rule:** Forbids deleting or demoting the root administrator account (`ID: 1`).

---

## 13. HTTP Status Codes Implementation

The backend implements and demonstrates all mandatory status codes specified in the DecodeLabs Project 2 curriculum:

| Code | Standard Meaning | How & Where Demonstrated in Project |
| :--- | :--- | :--- |
| **`200 OK`** | Standard successful response | `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` |
| **`201 Created`** | New resource successfully created | `POST /api/users` (returns generated ID and timestamps) |
| **`204 No Content`** | Action completed, no response body | `DELETE /api/users/:id?noContent=true`, `GET /api/demo/status/204` |
| **`400 Bad Request`** | Syntactic or semantic validation error | Missing fields, invalid types, duplicate email, malformed JSON |
| **`401 Unauthorized`** | Missing or invalid authentication (AuthN) | `GET /api/security/protected-user` without credentials |
| **`403 Forbidden`** | Authenticated caller lacks authorization (AuthZ) | `GET /api/security/protected-admin` with standard user credentials |
| **`404 Not Found`** | Resource or endpoint does not exist | `GET /api/users/99999`, undefined routes (`/api/unknown`) |
| **`405 Method Not Allowed`** | Unsupported HTTP verb on valid route | `PATCH /api/users` (returns `Allow: GET, POST`) |
| **`413 Payload Too Large`** | Request payload exceeds body size ceiling | `POST /api/users` with body > 10KB |
| **`429 Too Many Requests`** | Client exceeded request rate limit | `GET /api/security/rate-limit-test` (exceeding 5 requests in 30s) |
| **`500 Internal Server Error`** | Unhandled server-side exception | `GET /api/demo/status/500`, intercepted by centralized error handler |

---

## 14. Error-Handling Explanation
Error handling is **centralized** in `src/middleware/errorHandler.js` and adheres to four architectural pillars:

1. **Uniform Error Structure:** All errors return `{ "success": false, "message": "...", "error": "..." }`.
2. **Operational vs Programming Errors:** Distinguishes anticipated client errors (`AppError`) from unexpected server bugs.
3. **Information Disclosure Prevention:** In production environments (`NODE_ENV=production`), internal stack traces and server internals are completely stripped to prevent security reconnaissance.
4. **Resilience & Process Stability:** Unexpected promise rejections and uncaught exceptions are trapped at the process level (`process.on('uncaughtException')`), preventing process crashes and ensuring graceful degradation.

---

## 15. Testing Instructions

### Automated End-to-End Test Suite
The project includes a comprehensive, automated test suite that launches a live server instance, verifies all 19 test cases, and outputs a diagnostic scorecard:

```bash
npm test
```

### Verification Suite Results:
```text
========================================================================
   DECODELABS PROJECT 2 - SENIOR QA LIVE INTEGRATION TEST SUITE
========================================================================

[QA SERVER INITIALIZED] Base URL: http://127.0.0.1:63129

[✅ PASS] [GET Requests] #1 GET /api/health - Retrieve server health diagnostics (Expected: 200, Actual: 200)
[✅ PASS] [GET Requests] #2 GET /api/users - Retrieve all seeded users collection (Expected: 200, Actual: 200)
[✅ PASS] [GET Requests] #3 GET /api/users/1 - Retrieve single user by valid ID (Expected: 200, Actual: 200)
[✅ PASS] [POST Requests] #4 POST /api/users - Create user with valid attributes (Expected: 201, Actual: 201)
[✅ PASS] [PUT Requests] #5 PUT /api/users/4 - Update existing user attributes (Expected: 200, Actual: 200)
[✅ PASS] [DELETE Requests] #6 DELETE /api/users/4 - Delete existing user resource (Expected: 200, Actual: 200)
[✅ PASS] [DELETE Verification] #6.1 GET /api/users/4 - Confirm deleted resource returns 404 (Expected: 404, Actual: 404)
[✅ PASS] [Missing Fields] #7 POST /api/users - Reject creation when required "email" is missing (Expected: 400, Actual: 400)
[✅ PASS] [Missing Fields] #8 POST /api/users - Reject creation when required "name" is missing (Expected: 400, Actual: 400)
[✅ PASS] [Invalid Data Types] #9 POST /api/users - Reject non-string name attribute (Expected: 400, Actual: 400)
[✅ PASS] [Invalid Data Types] #10 GET /api/users/not-an-integer-id - Reject alphanumeric ID parameter in URL (Expected: 400, Actual: 400)
[✅ PASS] [Malformed JSON] #11 POST /api/users - Catch syntax error and return clean JSON 400 (Expected: 400, Actual: 400)
[✅ PASS] [Duplicate Records] #12 POST /api/users - Enforce email uniqueness constraint (Expected: 400, Actual: 400)
[✅ PASS] [Nonexistent IDs] #13 GET /api/users/88888 - Return 404 on GET nonexistent user (Expected: 404, Actual: 404)
[✅ PASS] [Nonexistent IDs] #14 PUT /api/users/88888 - Return 404 on PUT nonexistent user (Expected: 404, Actual: 404)
[✅ PASS] [Nonexistent IDs] #15 DELETE /api/users/88888 - Return 404 on DELETE nonexistent user (Expected: 404, Actual: 404)
[✅ PASS] [Unauthorized Access] #16 GET /api/security/protected-user - Reject request lacking authentication header (Expected: 401, Actual: 401)
[✅ PASS] [Unauthorized Access] #17 GET /api/security/protected-user - Reject request with invalid API key (Expected: 401, Actual: 401)
[✅ PASS] [Forbidden Access] #18 GET /api/security/protected-admin - Reject authenticated user lacking admin role (Expected: 403, Actual: 403)
[✅ PASS] [Authorized Access] #19 GET /api/security/protected-admin - Permit verified admin role (Expected: 200, Actual: 200)
[✅ PASS] [Unsupported Methods] #20 PATCH /api/users - Return 405 with Allow header for unsupported method (Expected: 405, Actual: 405)
[✅ PASS] [Unsupported Methods] #21 DELETE /api/users - Disallow deleting entire collection directly (Expected: 405, Actual: 405)
[✅ PASS] [Undefined Routes] #22 GET /api/unmapped-endpoint-path - Catch undefined URL with JSON 404 envelope (Expected: 404, Actual: 404)
[✅ PASS] [Server Errors] #23 GET /api/demo/status/500 - Handle unhandled exception safely without leaking stack trace (Expected: 500, Actual: 500)
[✅ PASS] [Resilience & Quota] #24 GET /api/security/rate-limit-test - Trigger 429 after exceeding quota ceiling (Expected: 429, Actual: 429)
[✅ PASS] [Status Codes] #25 GET /api/demo/status/204 - Demonstrate 204 with empty response body (Expected: 204, Actual: 204)
[✅ PASS] [Security Headers] #26 GET /api/health - Verify nosniff, X-Frame-Options DENY, and X-Powered-By disabled (Expected: 200, Actual: 200)
[✅ PASS] [Security Audit] #27 GET /api/users?search=a&search=b - Handle duplicate query array parameters safely without 500 crash (Expected: 200, Actual: 200)
[✅ PASS] [Security Audit] #28 GET /api/health - Confirm server platform & runtime version banner are withheld (Expected: 200, Actual: 200)
[✅ PASS] [Security Audit] #29 POST /api/users - Enforce 10kb request body size limit (413 Payload Too Large) (Expected: 413, Actual: 413)
[✅ PASS] [Security Audit] #30 POST /api/users - Reject email exceeding RFC 5321 maximum 254 length ceiling (Expected: 400, Actual: 400)

========================================================================
   QA EXECUTION SUMMARY: 31 / 31 TESTS PASSED
   🎉 QA CERTIFICATION: 100% SUITE PASS. ZERO DEFECTS DETECTED.
========================================================================
```

---

## 16. Future Architectural Scaling Concepts (Industry Notes)

While this assignment focuses on clean monolithic RESTful architecture with an in-memory data store, enterprise-scale backend systems typically introduce:

1. **API Gateway Pattern:**
   - Central entry point that handles edge routing, SSL termination, global rate limiting, and centralized JWT token verification before requests hit downstream services.
2. **Persistent Database Integration:**
   - Migration from in-memory stores to relational databases (PostgreSQL/MySQL with Prisma/Sequelize ORM) or document stores (MongoDB with Mongoose) with connection pooling and ACID transactional guarantees.
3. **Microservices Decomposition:**
   - Decoupling monolithic domains (e.g., User Management, Billing, Notifications) into independently deployable micro-services communicating via gRPC or asynchronous event brokers (Apache Kafka / RabbitMQ).
4. **Distributed Caching:**
   - Employing Redis or Memcached clusters to cache read-heavy endpoints (`GET /api/users`), sub-millisecond response latency, and distributed rate limiting across cluster instances.
5. **Circuit Breakers & Failure Isolation:**
   - Implementing pattern libraries (e.g., Cockatiel / Opossum) to isolate failing third-party integrations and avoid cascading outages across services.

---

## Conclusion
This implementation delivers a fully functional, verified, and strictly compliant backend REST API that meets all pedagogical, architectural, and quality benchmarks set forth by **DecodeLabs Full Stack Development Industrial Training Kit (Project 2)**.
