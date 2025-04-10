# 📘 API Reference — Admin Dashboard

Welcome to the API reference for the NAUR FFXIV Admin Dashboard — a role-locked control panel powered by Discord login and built with Next.js.

This doc gives you a friendly overview of all API endpoints used in the app. Most routes are protected by secure sessions (`iron-session`) and a custom middleware guard unless otherwise noted.

---

## Authentication Routes

### `GET /api/auth/login`
Starts the Discord OAuth2 login flow. You can optionally pass `returnTo` to decide where users go after logging in.

**Example:**
```url
/api/auth/login?returnTo=/admin
```

---

### `GET /api/auth/callback`
Completes the OAuth2 login process:
- Exchanges the code for a Discord token
- Checks if the user has the required role
- Sets a secure session cookie
- Redirects to `returnTo` or `/admin`
- **If the user is banned**, they’re redirected to `/banned` where they’ll see a prefilled appeal form with their Discord info

---

### `GET /api/auth/session`
Returns the current logged-in user (if session is valid). If not, you’ll get a `401 Unauthorized`.

**Response:**
```json
{
  "user": { id, username, createdAt, ... },
  "authenticated": true
}
```

---

### `GET /api/auth/logout`
Logs the user out by clearing the session cookie. You can pass `?expired=1` to customize the UX after timeout.

---

### `GET /api/auth/check-ban?userId=<id>`
Checks if a specific Discord user is banned from the server.

**Response:**
```json
{ "isBanned": true, "reason": "spamming" }
```
Returns `404` if not banned, `200` if they are.

---

## Admin API Routes

> All routes below require a valid session and the right Discord role.

### `GET /api/admin/users`
Returns up to 1,000 members from your server — with avatar, roles, join/create dates, and bot info.

**Status Codes:** `200`, `401`, `500`

---

### `GET /api/admin/roles`
Returns a list of all roles (except `@everyone`), sorted top-down by position.

**Status Codes:** `200`, `401`, `500`

---

### `GET /api/admin/bans`
Returns a list of all banned users. Each item includes user ID, username, avatar, and optional reason.

**Status Codes:** `200`, `401`, `500`

---

### `GET /api/admin/logs`
Returns structured log entries from `logs/activity.log`, newest first.

**Example:**
```json
[
  {
    "event": "login",
    "userId": "123",
    "username": "Alice",
    "timestamp": "..."
  }
]
```

**Error Example:**
```json
{ "error": "Failed to load logs" }
```

**Status Codes:** `200`, `500`

---

## Appeals API

### `POST /api/appeals/submit`
Sends a ban appeal to a Discord webhook.

**Request Body:**
```json
{
  "userId": "123",
  "username": "alice#1234",
  "reason": "spamming memes",
  "appeal": "I’ll behave now"
}
```

- Must match the current session user

**Status Codes:** `200`, `401`, `500`

---

## Notes

- All `/api/admin/**` routes are protected by `authGuard()` middleware
- Session handling is done with `iron-session` and supports expiry
- Logs are written in JSON format to `logs/activity.log`
- API routes expect your `.env.local` to be fully configured
- Admin API rate limiting: **10 requests per minute per IP** → HTTP `429` if exceeded
- If a banned user logs in, they’re redirected to `/banned`, where they can submit an appeal — prefilled with their Discord ID and name

---

## Testing APIs

Tests for all endpoints live in `tests/api/**/*.test.mjs`

> Uses `jest` and `@testing-library/react`.