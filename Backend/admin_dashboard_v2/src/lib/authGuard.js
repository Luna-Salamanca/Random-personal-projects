// ---- /src/lib/authGuard.js ----

// Authentication Guard Middleware
// Protects routes and implements rate limiting (To test ?)

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { userHasRoleBot } from '@/lib/discord';
import { writeLog } from '@/lib/logger';
import { NextResponse } from 'next/server';

// In-memory rate limiter storage
const RATE_LIMIT = new Map();

// Protects routes like /admin and /api/admin/*
export async function authGuard(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Get client IP with fallbacks (if available?)
  const ip = req.headers.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.ip || 
             req.connection?.removeAddress || 
             '127.0.0.1'

  // Check if routes needs protection
  const shouldProtect =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/');

  if (!shouldProtect) return null; // allow public route

  // Rate-limiting logic
  const now = Date.now();
  const history = RATE_LIMIT.get(ip) || [];
  const recent = history.filter(ts => now - ts < 60_000);
  recent.push(now);
  RATE_LIMIT.set(ip, recent);

  // Max 10 requests per minute per IP 
  if (recent.length > 10) {
    writeLog({ event: 'rate_limited', path: pathname, ip });
    return new Response('Too many attempts', { status: 429 });
  }

  if (session?.user?.isBanned) {
    writeLog({
      event: 'banned_user_blocked',
      path: pathname,
      ip,
      userId: session?.user?.id,
    });
  
    return pathname.startsWith('/api/')
      ? new Response('Forbidden: Banned user', { status: 403 })
      : NextResponse.redirect(new URL('/banned', req.url));
  }
  // Validate session + role
  const session = await getIronSession(req, new Response(), sessionOptions);
  const isAuthed = session?.user && await userHasRoleBot(session.user.id);

  if (!isAuthed) {
    writeLog({
      event: 'access_denied',
      path: pathname,
      ip,
      userId: session?.user?.id || null,
    });
    
    

    // Return 401 for API routes, redirect to /denied for pages
    // (since we don't want to expose the session cookie)
    return pathname.startsWith('/api/')
      ? new Response('Unauthorized', { status: 401 })
      : NextResponse.redirect(new URL('/denied', req.url));
  }
  

  return null; // allow request to continue
}
