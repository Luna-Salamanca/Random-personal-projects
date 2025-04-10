> ⚠️ **Important Disclaimer**
>
> This document may not reflect the current state of the live codebase and is not officially affiliated with the NAUR project. Some endpoints or behaviors might be outdated or non-functional. Use this as a general reference — not a guarantee.

# Admin Dashboard

> A role-locked dashboard built with Next.js, Tailwind CSS.

## What It Does

- Log in using your Discord account
- Only admins with the right Discord role get access
- View and manage user info and roles
- Get a full overview of your Discord server's roles
- Keep tabs with live system logs
- See who’s banned
- Let users appeal bans through a sleek form

---

## How to Get It Running

### 1. Clone This Repo

### 2. Install Everything

```bash
npm install
```

### 3. Set Your Secrets

Make a `.env.local` file with:

```ini
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
BOT_TOKEN=
GUILD_ID=
REQUIRED_ROLE_ID=
SESSION_SECRET=
BASE_URL=http://localhost:3000
APPEAL_WEBHOOK_URL=
```

Run `/scripts/validate-env.js` to make sure you didn’t miss anything.

### 4. Start It Up

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and log in!

---

## Project Breakdown

```
naurffxiv-website/
├── src/
│   ├── app/         # Pages (admin, login, API, etc.)
│   ├── components/  # Reusable UI bits
│   ├── hooks/       # Custom hooks like useSession()
│   └── lib/         # Discord logic, sessions, logging
├── scripts/         # Setup helpers
├── tests/           # Jest & Testing Library
├── public/          # Static stuff
├── config files     # ESLint, Tailwind, PostCSS, etc.
```

---

## Authentication & Access Control

This project uses Discord OAuth2 for authentication. Access to the Admin Dashboard is protected based on Discord role permissions and ban status.

- If a user is not authenticated, they are redirected to `/denied`.
- If a user is banned, they are redirected to `/banned`.
- Sessions expire after 5 minutes of inactivity.

## Banned Users

If a user is banned from the Discord server (checked via Discord API), they are immediately redirected to `/banned` upon attempting to access protected routes, including the admin dashboard.

The appeal form on the `/banned` page is automatically pre-filled using the user's Discord ID and username, so they can quickly submit their case without typing everything from scratch.

---

## Built With

- [Next.js 13+](https://nextjs.org/docs) – App Router edition
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [iron-session](https://github.com/vvo/iron-session) – secure sessions
- [Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)

---

## Tests & Coverage

:warning: Heads up: The current tests were built for an earlier version of the app and are likely outdated. Expect many to fail or need refactoring.

---

## API Summary

Here’s a quick peek at the main routes:

| Endpoint                  | Method | What It Does                    |
|--------------------------|--------|---------------------------------|
| `/api/auth/login`        | GET    | Kickstarts Discord login        |
| `/api/auth/callback`     | GET    | Finishes login + session setup  |
| `/api/auth/session`      | GET    | Check if you're still logged in |
| `/api/auth/logout`       | GET    | Logs you out                    |
| `/api/auth/check-ban`    | GET    | Checks if user is banned        |
| `/api/admin/users`       | GET    | Shows all guild members         |
| `/api/admin/roles`       | GET    | Shows roles + member counts     |
| `/api/admin/bans`        | GET    | Lists currently banned users    |
| `/api/admin/logs`        | GET    | View structured log events      |
| `/api/appeals/submit`    | POST   | Submit a ban appeal form        |

> Check out the [Full API Reference](./doc/API%20Reference.md)

---

## Deploying

Works great with [Vercel](https://vercel.com), or host it yourself.
Just remember to set your environment variables.

---

## Handy Links

- [Discord Dev Portal](https://discord.com/developers/applications)
- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## License

MIT — Use it freely. Don’t be a jerk.
