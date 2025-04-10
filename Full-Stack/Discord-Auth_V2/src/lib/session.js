// ---- /src/lib/session.js ----

import { SESSION_DURATION } from './constants';

// iron-session c onfig shared across API routes
export const sessionOptions = {
  cookieName: 'naur_auth', // Cookie name used for the session
  password: process.env.SESSION_SECRET, // Secret used to encrypt session, stored in .env.local
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
    sameSite: 'lax', // Prevent CSRF ?
    httpOnly: true, // Client can't access the cookie via JS
    path: '/',
    maxAge: SESSION_DURATION, // 5 minutes max duration
  },
};