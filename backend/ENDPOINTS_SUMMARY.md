# Backend Endpoints Summary — Quizbuzz Project

## Introduction

This document is the canonical introduction to the Quizbuzz backend. It explains the purpose of the service, the main API surface, and where the implementation lives in the repository. Use this as the starting point for development, debugging, and integration with the frontend.

The backend implements a lightweight quiz engine (publish/draft workflow, result calculation for multiple quiz types, analytics/event tracking, image/uploads, admin tooling, and small infra helpers) intended for local development and production deployments.

## Overview — What we've implemented so far

- Core HTTP server with Express and TypeScript, OpenAPI/Swagger UI at `/api/docs`.
- Quiz public endpoints (list, fetch by slug, related quizzes, submit answers with result calculation).
- Admin endpoints for creating/updating/publishing/scheduling quizzes, previewing drafts, and managing uploads.
- Analytics event ingestion and simple analytics endpoints for admins.
- Image upload pipeline (Sharp-based processing, alt-text enforcement) and share-card generation.
- Branching/feedback scaffolding and badges subsystem (DB + endpoints for awarding badges).
- Background scheduler worker (auto-publish) and Docker Compose for local Postgres + Redis when desired.

**Key files**
- [backend/src/index.ts](backend/src/index.ts)
- [backend/src/config/database.ts](backend/src/config/database.ts)
- [backend/src/routes/quiz.routes.ts](backend/src/routes/quiz.routes.ts)
- [backend/src/routes/admin.routes.ts](backend/src/routes/admin.routes.ts)
- [backend/src/routes/analytics.routes.ts](backend/src/routes/analytics.routes.ts)
- [backend/src/controllers/quiz.controller.ts](backend/src/controllers/quiz.controller.ts)
- [backend/src/controllers/admin.controller.ts](backend/src/controllers/admin.controller.ts)
- [backend/src/controllers/analytics.controller.ts](backend/src/controllers/analytics.controller.ts)
- [backend/src/controllers/upload.controller.ts](backend/src/controllers/upload.controller.ts)
- [backend/src/middleware/validation.middleware.ts](backend/src/middleware/validation.middleware.ts)
- [backend/src/middleware/rateLimit.middleware.ts](backend/src/middleware/rateLimit.middleware.ts)
- [backend/src/middleware/upload.middleware.ts](backend/src/middleware/upload.middleware.ts)
- [backend/src/middleware/error.middleware.ts](backend/src/middleware/error.middleware.ts)
- [docs/api/openapi.yaml](docs/api/openapi.yaml)

## Base endpoints (mounted in `backend/src/index.ts`)
- GET /health — health check (status, timestamp, service name)
- GET / — root API info with available endpoints
- GET /api/docs — Swagger UI (OpenAPI spec at `docs/api/openapi.yaml`)

## Public Quiz API (`/api/quiz`)
- GET /api/quiz — List published quizzes. Query: `colony`, `tag`, `limit`, `offset`. (Handler: [getQuizList](backend/src/controllers/quiz.controller.ts))
- GET /api/quiz/:slug — Return full quiz JSON for the slug (published only). Triggers an analytics view event. (Handler: [getQuizBySlug](backend/src/controllers/quiz.controller.ts))
- GET /api/quiz/:slug/related — Return related quizzes by overlapping `tags`. Query: `limit`. (Handler: [getRelatedQuizzes](backend/src/controllers/quiz.controller.ts))
- POST /api/quiz/:slug/submit — Submit answers and calculate result (supports `personality`, `points`, `trivia`). Body: `{ answers, userId?, sessionId? }`. Middleware: `rateLimiter`, `validateQuizSubmission`. (Handler: [submitQuiz](backend/src/controllers/quiz.controller.ts))

## Analytics API (`/api/analytics`)
- POST /api/analytics/track — Track analytics events. Body: `{ quiz_slug, event_type, event_data?, user_id?, session_id? }`. Middleware: `rateLimiter`. (Handler: [trackEvent](backend/src/controllers/analytics.controller.ts))

## Admin API (`/api/admin`)
- POST /api/admin/upload — Upload images (multer memory storage + `upload` middleware). Files under field `images`. (Handler: [uploadImage](backend/src/controllers/upload.controller.ts))
- GET /api/admin/images — List uploaded images from `uploads/` (dev convenience). (Handler: [getImageList](backend/src/controllers/admin.controller.ts))
- GET /api/admin/quiz — List all quizzes (including drafts). Query: `status`, `limit`, `offset`. (Handler: [getAdminQuizList](backend/src/controllers/admin.controller.ts))
- POST /api/admin/quiz — Create a new quiz (draft). (Handler: [createQuiz](backend/src/controllers/admin.controller.ts))
- PUT /api/admin/quiz/:slug — Update quiz; increments `version`. (Handler: [updateQuiz](backend/src/controllers/admin.controller.ts))
	- Note: Both create and update now validate payloads against a server-side JSON schema using Joi (`src/middleware/quizValidation.middleware.ts`).
- DELETE /api/admin/quiz/:slug — Soft-delete/archive quiz. (Handler: [deleteQuiz](backend/src/controllers/admin.controller.ts))
- PATCH /api/admin/quiz/:slug/publish — Publish/unpublish quiz. Body: `{ publish: true|false }`. (Handler: [publishQuiz](backend/src/controllers/admin.controller.ts))
- POST /api/admin/quiz/:slug/schedule — Schedule publication. Body: `{ publish_at: ISODate }`. (Handler: [scheduleQuiz](backend/src/controllers/admin.controller.ts))
- POST /api/admin/quiz/:slug/rollback — Rollback stub (full rollback needs `quiz_versions` history). (Handler: [rollbackQuiz](backend/src/controllers/admin.controller.ts))
 - GET /api/admin/quiz/:slug/preview — Return draft or published quiz JSON for previewing in admin UI. Query `device=mobile|desktop`. (Handler: [getQuizPreview](backend/src/controllers/admin.controller.ts))
- GET /api/admin/analytics/:slug — Admin analytics: event counts, completion rate, outcome distribution. (Handler: [getQuizAnalytics](backend/src/controllers/admin.controller.ts))

## Sharing / Social
- GET /api/share/:slug/card — Generates a share card image (PNG) for a quiz result and returns a CDN/upload URL. Minimal generator implemented using `sharp` and saves to `uploads/`. (Handler: [generateShareCard](backend/src/controllers/share.controller.ts))

## Badges
- POST /api/user/badges — Assign a badge to a user. Body: `{ user_id, badge_key, awarded_by? }`. (Handler: [assignBadge](backend/src/controllers/user.controller.ts))
- GET /api/user/:id/badges — Get badges awarded to a user. (Handler: [getUserBadges](backend/src/controllers/user.controller.ts))

## Branching & Feedback
- POST /api/admin/quiz/:slug/branching — Save branching mappings for a quiz. Body: `{ mappings: [{question_id, answer_id, next_question_id}] }` (Handler: [upsertBranching](backend/src/controllers/branching.controller.ts))
- GET /api/quiz/:slug/feedback?question_id=Q1&answer_id=A1 — Returns `next_question_id` based on branching mappings (and can be used to compute per-answer correctness). (Handler: [getNextQuestionForAnswer](backend/src/controllers/branching.controller.ts))

## Image upload requirements
- Uploads now require `alt_texts` JSON array in the request body matching uploaded files order when using the admin upload endpoint. Middleware: `requireAltText` in `src/middleware/upload.middleware.ts` — upload controller will attach `alt_text` to returned file metadata.

## Notes on engine behavior
- GET /api/quiz/:slug supports server-side shuffling of options for questions with `shuffle_options: true` when called with query `?shuffle=true`.
- Submit flow (`POST /api/quiz/:slug/submit`) now emits `quiz_start`, `question_answer` events per answered question, `quiz_completed`, and `result_view`. Response includes per-question feedback for trivia mode.

## Background jobs & infra
- Scheduler worker: `src/workers/scheduler.worker.ts` — checks `quizzes` for `status = 'scheduled'` and `published_at <= now` and auto-publishes; runs every 5 minutes when started (`npm run start-scheduler` or run the file directly).
- `docker-compose.yml` added at project root for local dev: brings up Postgres (5432 -> host 5434), Redis (6379), and the backend service. Use `docker compose up` from `backend/` to run the stack.

## Sponsorship
- POST /api/admin/quiz/:slug/sponsor — Store sponsorship details in `quiz_data.sponsorship` (sponsor_name, sponsor_logo, cta_text, cta_url, utm_campaign, active). (Handler: [configureSponsorship](backend/src/controllers/admin.controller.ts))

## Middleware & behaviors
- validation.middleware.ts — validates quiz submission payloads.
- rateLimit.middleware.ts — rate limits endpoints to avoid spam/abuse.
- upload.middleware.ts — multer memory storage + file filtering and limits.
- error.middleware.ts — global error handler returning JSON errors.
- App-level middleware in `index.ts`: helmet, cors, morgan, compression, express.json/urlencoded.

## Database (Postgres)
- Database pool and query helper: [backend/src/config/database.ts](backend/src/config/database.ts)
- Tables created/used: `quizzes` (quiz_data JSONB), `quiz_analytics` (events), `quiz_versions` (schema ready for history/rollback).
- Queries use Postgres JSON operators (GIN index on `quiz_data`) to filter by tags and other JSON fields.

## Summary

- This document introduces the Quizbuzz backend and provides an overview of implemented features (quiz endpoints, admin tooling, analytics, uploads, branching, badges, and background scheduler).
- Key source files are listed above for quick navigation when editing or debugging.
- The API is implemented to be resilient in local development (Redis optional, Docker compose available) and to support the main Milestone-3 engine behaviors needed by the frontend.
- For next steps: run database migrations (`backend/scripts/run_migrations.js`), start local infra via `docker compose up` (or set `DISABLE_REDIS=true`), then run `npm run dev` to test endpoints.

If you want, I can also update the OpenAPI spec to reflect the new endpoints and add example request/response payloads.




