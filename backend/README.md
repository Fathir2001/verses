# Verses Backend API

A Node.js + Express + MongoDB backend for the Verses app - Islamic feelings, Quran verses, and duas API.

## Features

- **Public APIs** for feelings and Quran verses (same format as frontend JSON)
- **Admin authentication** with JWT tokens
- **Admin CRUD** for feelings, suras, and verses
- **Security middleware**: helmet, cors, rate-limiting, mongo-sanitize
- **Input validation** with Zod
- **Central error handling**

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# IMPORTANT: Change JWT_SECRET to a secure random string!
```

### 3. Start MongoDB

If using local MongoDB:

```bash
mongod
```

### 4. Seed Admin User

```bash
# Using environment variables (set ADMIN_EMAIL and ADMIN_PASSWORD in .env)
npm run seed:admin

# Or with CLI arguments
npm run seed:admin -- --email admin@example.com --password yourpassword
```

### 5. Seed Feelings (Optional)

Import existing feelings from the frontend's `data/feelings.json`:

```bash
npm run seed:feelings
```

### 6. Start the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000` by default.

## API Endpoints

### Health Check

```bash
GET /api/health
```

### Authentication

```bash
# Admin Login
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "yourpassword"
}

# Get Current Admin (Protected)
GET /api/auth/admin/me
Authorization: Bearer <token>
```

### Public - Feelings

```bash
# Get all feelings (same format as feelings.json)
GET /api/feelings

# Get feeling by slug
GET /api/feelings/:slug
```

### Public - Quran

```bash
# Get all suras
GET /api/suras

# Get sura by number
GET /api/suras/:suraNumber

# Get verses of a sura
GET /api/suras/:suraNumber/verses

# Get single verse
GET /api/suras/:suraNumber/verses/:verseNumber
```

### Admin - Feelings (Protected)

```bash
# Get all feelings (paginated)
GET /api/admin/feelings?page=1&limit=20

# Get feeling by ID
GET /api/admin/feelings/:id

# Create feeling
POST /api/admin/feelings
Authorization: Bearer <token>
Content-Type: application/json

{
  "slug": "anxiety",
  "title": "Feeling Anxious",
  "emoji": "😰",
  "preview": "Short preview text...",
  "reminder": "Reminder text...",
  "quran": {
    "text": "Quran verse text...",
    "reference": "Qur'an 2:286",
    "suraNumber": 2,
    "verseNumber": 286
  },
  "dua": {
    "arabic": "Arabic text...",
    "transliteration": "Transliteration...",
    "meaning": "Meaning of the dua...",
    "reference": "Reference..."
  },
  "actions": ["Action 1", "Action 2", "Action 3"]
}

# Update feeling
PUT /api/admin/feelings/:id
Authorization: Bearer <token>

# Delete feeling
DELETE /api/admin/feelings/:id
Authorization: Bearer <token>
```

### Admin - Suras (Protected)

```bash
# Get all suras (paginated)
GET /api/admin/suras?page=1&limit=50

# Create sura
POST /api/admin/suras
Authorization: Bearer <token>
Content-Type: application/json

{
  "suraNumber": 1,
  "nameArabic": "الفاتحة",
  "nameEnglish": "The Opening",
  "transliteration": "Al-Fatihah",
  "totalVerses": 7
}

# Update sura
PUT /api/admin/suras/:id
Authorization: Bearer <token>

# Delete sura (also deletes all its verses)
DELETE /api/admin/suras/:id
Authorization: Bearer <token>
```

### Admin - Verses (Protected)

```bash
# Get all verses (paginated, optionally filtered by sura)
GET /api/admin/verses?page=1&limit=50&suraNumber=2

# Get verse by ID
GET /api/admin/verses/:id

# Create verse
POST /api/admin/verses
Authorization: Bearer <token>
Content-Type: application/json

{
  "suraNumber": 2,
  "verseNumber": 286,
  "arabicText": "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا...",
  "translationText": "Allah does not burden a soul beyond that it can bear...",
  "transliteration": "La yukallifullahu nafsan illa wus'aha...",
  "reference": "Qur'an 2:286"
}

# Bulk create verses
POST /api/admin/verses/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "verses": [
    { "suraNumber": 1, "verseNumber": 1, "arabicText": "...", "translationText": "..." },
    { "suraNumber": 1, "verseNumber": 2, "arabicText": "...", "translationText": "..." }
  ]
}

# Update verse
PUT /api/admin/verses/:id
Authorization: Bearer <token>

# Delete verse
DELETE /api/admin/verses/:id
Authorization: Bearer <token>
```

## Example curl Requests

### Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "yourpassword"}'
```

### Get All Feelings (Public)

```bash
curl http://localhost:5000/api/feelings
```

### Get Feeling by Slug (Public)

```bash
curl http://localhost:5000/api/feelings/anxiety
```

### Create Feeling (Admin)

```bash
curl -X POST http://localhost:5000/api/admin/feelings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "slug": "test-feeling",
    "title": "Test Feeling",
    "emoji": "🧪",
    "preview": "This is a test feeling preview.",
    "reminder": "This is the reminder text.",
    "quran": {
      "text": "Test Quran verse text",
      "reference": "Test Reference"
    },
    "dua": {
      "meaning": "Test dua meaning"
    },
    "actions": ["Action 1", "Action 2"]
  }'
```

### Get Current Admin Profile (Protected)

```bash
curl http://localhost:5000/api/auth/admin/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success message",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
```

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js          # Environment configuration
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── Admin.js        # Admin model
│   │   ├── Sura.js         # Sura model
│   │   ├── Verse.js        # Verse model
│   │   └── Feeling.js      # Feeling model
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.feelings.controller.js
│   │   ├── public.feelings.controller.js
│   │   ├── admin.quran.controller.js
│   │   └── public.quran.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.feelings.routes.js
│   │   ├── public.feelings.routes.js
│   │   ├── admin.quran.routes.js
│   │   └── public.quran.routes.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── validate.js     # Request validation
│   │   ├── errorHandler.js # Central error handler
│   │   └── notFound.js     # 404 handler
│   ├── utils/
│   │   ├── apiResponse.js  # Response helpers
│   │   └── validationSchemas.js # Zod schemas
│   ├── scripts/
│   │   ├── seedAdmin.js    # Seed admin user
│   │   └── seedFeelings.js # Import feelings from JSON
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Database Models

### Admin

- `email` (unique, required)
- `passwordHash` (hashed with bcrypt)
- `role` ("admin")
- `createdAt`, `updatedAt`

### Sura

- `suraNumber` (unique, 1-114)
- `nameArabic`
- `nameEnglish`
- `transliteration`
- `totalVerses`

### Verse

- `suraNumber` (1-114)
- `verseNumber`
- `arabicText`
- `translationText`
- `transliteration`
- `reference`
- Unique index on `{ suraNumber, verseNumber }`

### Feeling

- `slug` (unique)
- `title`
- `emoji`
- `preview`
- `reminder`
- `quran` (text, reference, optional suraNumber/verseNumber)
- `dua` (arabic, transliteration, meaning, reference)
- `actions` (array of strings)

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents brute force attacks (100 requests/15 min, 10 login attempts/15 min)
- **Mongo Sanitize**: Prevents NoSQL injection attacks
- **HPP**: Prevents HTTP parameter pollution
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing with salt rounds

## License

MIT
