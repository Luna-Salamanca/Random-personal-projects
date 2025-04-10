// ---- /src/app/api/auth/session/route.js ----

// Session Validator
// Checks if current session is valid and not expireds

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';
import { SESSION_DURATION } from '@/lib/constants';

export async function GET(request) {
  const session = await getIronSession(request, new Response(), sessionOptions);

  if (!session.user) {
    return NextResponse.json({
      error: 'Unauthorized',
      authenticated: false,
    }, { status: 401 });
  }

  const now = Date.now();
  const createdAt = session.user.createdAt;

  // Check if session expired (fallback server-side check)
  if (createdAt && now - createdAt > SESSION_DURATION * 1000) {
    await session.destroy();
    return NextResponse.json({
      error: 'Session expired',
      authenticated: false,
    }, { status: 401 });
  }

  return NextResponse.json({
    user: session.user,
    authenticated: true,
  });
}

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}