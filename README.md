# QuizBuzz - BuzzFeed-Style Quiz Engine for Yelling Ant

A comprehensive JSON-based quiz system with React 18 frontend, Node.js backend, and admin dashboard.

## Project Overview

QuizBuzz is a self-contained hybrid quiz engine designed to integrate seamlessly with the Yelling Ant social media platform. It supports personality quizzes, trivia, points-based scoring, and branching logic - all rendered dynamically from JSON.

## Project Structure

```
quizbuzz-project/
├── frontend/              # React 18 Quiz Renderer + Admin Dashboard
│   ├── src/
│   │   ├── components/   # Quiz components, admin forms
│   │   ├── pages/        # Quiz play, quiz home, admin pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Helper functions
│   │   ├── styles/       # CSS/SCSS (namespaced .ya-quiz)
│   │   └── types/        # TypeScript definitions
│   └── public/           # Static assets
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth, validation, rate limiting
│   │   ├── services/     # Image upload, scoring engine
│   │   └── utils/        # Helpers, validators
│   └── tests/            # API tests
├── shared/               # Shared TypeScript types & schemas
│   ├── schemas/          # JSON schema definitions
│   └── types/            # Shared type definitions
├── docs/                 # Documentation
│   ├── api/              # OpenAPI specs
│   ├── integration/      # Yelling Ant integration guide
│   └── examples/         # Sample quiz JSON files
├── docker/               # Docker configuration
└── scripts/              # Build and deployment scripts
```

## Tech Stack

- **Frontend**: React 18, TypeScript, SCSS/Tailwind CSS
- **Backend**: Node.js 18, Express.js, TypeScript
- **Database**: PostgreSQL with JSONB (or MongoDB)
- **Image Storage**: AWS S3 / Cloudinary
- **Build Tools**: Vite (frontend), tsx (backend)
- **Testing**: Jest, React Testing Library
- **API Documentation**: OpenAPI 3.0

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ or MongoDB 6+
- AWS S3 account or Cloudinary account

### Installation

```bash
# Clone repository
git clone <repo-url>
cd quizbuzz-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Copy `.env.example` files and configure:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Development

```bash
# Start backend (runs on http://localhost:5000)
cd backend
npm run dev

# Start frontend (runs on http://localhost:3000)
cd frontend
npm run dev
```

## Week 1 Deliverables - FOUNDATION

- Project folder structure
- React + Node + TypeScript setup
- Database configuration
- JSON schema definition
- API skeleton (GET /api/quiz, GET /api/quiz/:slug, POST /api/quiz/:slug/submit)
- Image upload pipeline
- OpenAPI specification
- Environment templates
- Yelling Ant integration scaffolding

## API Endpoints

### Quiz Endpoints
- `GET /api/quiz` - List all quizzes
- `GET /api/quiz/:slug` - Fetch quiz by slug
- `POST /api/quiz/:slug/submit` - Submit answers and get result
- `POST /api/quiz` - Create new quiz (admin)
- `PUT /api/quiz/:slug` - Update quiz (admin)
- `DELETE /api/quiz/:slug` - Delete quiz (admin)

### Admin Endpoints
- `GET /api/admin/quiz` - List quizzes with draft status
- `POST /api/admin/upload` - Upload images
- `GET /api/admin/analytics/:slug` - Get quiz analytics

## Quiz Types Supported

1. **Personality Quiz** - Weighted outcomes based on answer choices
2. **Points Quiz** - Numeric scoring with result ranges
3. **Trivia Quiz** - Correct/incorrect answers with scoring
4. **Branching Quiz** - Dynamic question flow based on choices

## Integration with Yelling Ant

All routes are namespaced under `/quiz/*` and `/api/quiz/*`. CSS classes use `.ya-quiz` namespace to prevent conflicts. Colony integration, badge system, and analytics hooks are built-in.

## License

All work product is owned by Yelling Ant.

## Development Timeline

- **Week 1**: Foundation + JSON Schema + API Skeleton
- **Week 2**: Quiz Renderer MVP
- **Week 3**: Admin Editor + Scoring Logic
- **Week 4**: QA + Documentation + Docker

---

Built for Yelling Ant | November 2025
