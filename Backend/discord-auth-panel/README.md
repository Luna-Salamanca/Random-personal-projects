Absolutely, Luna! Here's a rewritten version of your `README.md` that’s **clear, confident, and developer-friendly**—no emoji spam, just good documentation with a touch of human voice and polish:

---

# Discord Role-Gated Auth Panel

A secure, extensible Express.js panel for authenticating Discord users and gating access based on server roles. Built for moderation dashboards, internal tools, and gated resources where identity and permissions matter.

---

Awesome — here's an additional section you can drop into your `README.md` under the project intro or near the bottom:

---

## Discord API Usage

This project interacts directly with the [Discord REST API](https://discord.com/developers/docs/intro) — no third-party wrapper libraries like `discord.js` are used.

All authentication and permission logic is custom-built, including:

- **OAuth2 token exchange**  
  - `POST /oauth2/token`  
  - `GET /users/@me`
- **Role validation via bot token**  
  - `GET /guilds/:guild_id/members/:user_id`
  - `GET /guilds/:guild_id/roles`

All API calls are made via `axios`. Role-based access and session logic are handled server-side using custom middleware and Express sessions.

---

## Key Features

- **Discord OAuth2 login** with session-based authentication
- **Role-based access control** to protected routes like `/admin`, `/settings`, and `/logs`
- **Secure session handling** with HTTP-only cookies and optional HTTPS
- **EJS templating** with layout support
- **Dynamic role display**, including hoverable role IDs
- **Environment validation** on startup
- **Full test suite** with coverage reporting

---


## Project Structure

```
project-root/
├── index.js              # Entry point
├── .env                  # Environment config
├── views/                # EJS templates
├── routes/               # Express route handlers
├── services/             # Discord API wrappers
├── constants/            # Config defaults
├── middleware/           # Auth/session logic
├── tests/                # Unit + integration tests
├── utils/                # Shared helpers
├── scripts/              # CLI tools
└── package.json
```

---

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Create a `.env` file**

```env
CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
REDIRECT_URI=http://localhost:3000/callback
SERVER_ID=your_discord_server_id
REQUIRED_ROLES=123456789012345678,987654321098765432
SESSION_SECRET=your_secure_session_secret
BOT_TOKEN=your_discord_bot_token
```

You can generate a secure session secret with:

```bash
npm run env:generate
```

3. **Run the server**

```bash
npm start
```

---

## Environment Validation

Ensure your `.env` is complete before launching:

```bash
npm run env:validate
```

This checks for the following required variables:

- `CLIENT_ID`
- `CLIENT_SECRET`
- `REDIRECT_URI`
- `SERVER_ID`
- `REQUIRED_ROLES` (optional — falls back to defaults)
- `SESSION_SECRET`
- `BOT_TOKEN`

---

## Testing

Run the full test suite with:

```bash
npm test
```

Or check code coverage:

```bash
npm run test:coverage
```

Tests cover middleware, routing logic, role validation, and audit logging.

---

## Session Flow (Behind the Scenes)

Here’s what happens when a user logs in:

1. **User hits `/login`**  
   → Redirected to Discord OAuth  
2. **Discord returns `code` → `/callback`**  
   → App exchanges for tokens, fetches user + roles  
   → Saves session in `req.session`  
3. **Protected routes** (`/admin`, `/settings`)  
   → Validate session + role  
4. **User logs out**  
   → Session destroyed, cookie cleared

Session cookies are secure and HTTP-only by default:

```js
cookie: {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax"
}
```

---

## Discord Bot Requirements

Your bot must be added with the following **OAuth2 scopes**:

```
identify
guilds
guilds.members.read
bot
```

**Recommended bot permissions**:

- View Members
- (Optional) Manage Roles – only if you're assigning roles from the app

---

## FAQ

### What does `REQUIRED_ROLES` do?

It defines which users can access restricted routes. Set this to a comma-separated list of numeric Discord role IDs:

```env
REQUIRED_ROLES=123456789012345678,987654321098765432
```

These are compared directly to the user’s role list from your server.

### How do I generate a secure `SESSION_SECRET`?

You can use Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or simply:

```bash
npm run env:generate
```

---

## Maintenance Scripts

Clean up coverage or log files:

```bash
npm run clean
```

---

## Dashboard Overview

| Route       | Description                           |
|-------------|---------------------------------------|
| `/`         | Public welcome view                   |
| `/login`    | Starts the Discord OAuth flow         |
| `/callback` | Handles OAuth2 return                 |
| `/admin`    | Protected panel view (requires role)  |
| `/settings` | Displays user roles from the guild    |
| `/logout`   | Logs the user out + clears session    |
| `/logs`     | Audit log access (role gated)         |

---

## Credits

Built with:

- **Express.js**
- **Discord OAuth2 & REST APIs**
- **EJS + express-ejs-layouts**
- **Jest + Supertest** (for automated testing)

---

Let me know if you'd like a version tailored for GitHub Pages or if you're planning to containerize/deploy this next — happy to help with CI/CD, Heroku, or Docker support!