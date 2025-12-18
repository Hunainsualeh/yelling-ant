# Backend Endpoints Summary — Quizbuzz Project

This file lists only the backend endpoints implemented in the `backend/` folder and a short description of what each does. It is focused exclusively on backend API surface (public + admin + analytics), per your request.

Base endpoints mounted by `backend/src/index.ts`:
- `GET /health` — health check (returns status, timestamp, service name).
- `GET /` — root API info (name, version, endpoints list).
- `GET /api/docs` — Swagger UI for OpenAPI spec (served from `docs/api/openapi.yaml`).

Quiz public API (`/api/quiz` — router: `src/routes/quiz.routes.ts`):
- `GET /api/quiz` — List published quizzes. Query params: `colony`, `tag`, `limit`, `offset`.
- `GET /api/quiz/:slug` — Return full quiz JSON payload for the given slug (only if `status = 'published'`). Also triggers an internal analytics view event.
- `GET /api/quiz/:slug/related` — Return related quizzes based on overlapping `tags` in `quiz_data`. Query param: `limit` (default 5).
- `POST /api/quiz/:slug/submit` — Submit answers for a quiz. Body: `{ answers, userId?, sessionId? }`. Endpoint calculates result (supports `personality`, `points`, `trivia` types), returns outcome, and logs analytics (`quiz_completed`). Rate-limited.

Analytics API (`/api/analytics` — router: `src/routes/analytics.routes.ts`):
- `POST /api/analytics/track` — Track analytics events for quizzes. Body: `{ quiz_slug, event_type, event_data?, user_id?, session_id? }`. Valid `event_type` values defined in controller (e.g., `quiz_view`, `quiz_start`, `quiz_question_answered`, `quiz_completed`, `quiz_share_click`, etc.). Rate-limited. Inserts into `quiz_analytics` table.

Admin API (`/api/admin` — router: `src/routes/admin.routes.ts`) — admin-only operations (authentication/authorization required in production):
- `POST /api/admin/upload` — Upload images for quizzes (multer middleware). Accepts multiple files under `images` field.
- `GET /api/admin/images` — List uploaded images from the `uploads/` directory (development convenience).
- `GET /api/admin/quiz` — List all quizzes (drafts, scheduled, archived). Query params: `status`, `limit`, `offset`.
- `POST /api/admin/quiz` — Create a new quiz (draft). Body: full `quiz_data` JSON; slug autopopulates if missing.
- `PUT /api/admin/quiz/:slug` — Update quiz payload; increments stored `version`.
- `DELETE /api/admin/quiz/:slug` — Soft-delete/archive a quiz (`status = 'archived'`).
- `PATCH /api/admin/quiz/:slug/publish` — Publish/unpublish quiz. Body: `{ publish: true|false }`.
- `POST /api/admin/quiz/:slug/schedule` — Schedule quiz publication. Body: `{ publish_at: ISODate }`.
- `POST /api/admin/quiz/:slug/rollback` — Endpoint stub for rollback (returns message; full rollback requires `quiz_versions` implementation).
- `GET /api/admin/analytics/:slug` — Admin analytics report for a quiz: event counts, completion rate, outcome distribution.

Middleware & behaviors affecting endpoints:
- `validation.middleware.ts` — validates quiz submissions.
- `rateLimit.middleware.ts` — rate-limits submission and analytics endpoints to prevent spam.
- `upload.middleware.ts` — multer-based upload handling for admin upload route.
- `error.middleware.ts` — centralized error handling for consistent JSON error responses.

Database tables used by endpoints:
- `quizzes` — stores all quizzes; `quiz_data` as JSONB; statuses: `draft|published|scheduled|archived`.
- `quiz_analytics` — stores analytics event rows: `quiz_slug`, `event_type`, `event_data` (JSONB), `user_id`, `session_id`, `created_at`.
- `quiz_versions` — version history table schema exists (for future rollback features).

Notes & important details:
- Analytics recording is intentionally non-blocking inside controllers — failures in analytics inserts are logged but do not fail the main request.
- `getRelatedQuizzes` uses Postgres JSON operators to match tags in `quiz_data` for related content.
- Admin endpoints should be protected by authentication/authorization in production (currently routes exist; implement JWT + RBAC middleware if not already present).

If you want, I can now:
- Convert this into a one-page manager summary (English or Urdu).
- Export as PDF or include cURL examples for each endpoint.
- Add example request/response payloads for the key routes (`/api/quiz/:slug`, `/api/quiz/:slug/submit`, `/api/analytics/track`).
