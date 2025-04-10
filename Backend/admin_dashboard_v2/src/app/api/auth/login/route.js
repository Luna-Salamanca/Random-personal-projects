// /src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/banned';

  // Store return URL in cookie
  const response = NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      process.env.DISCORD_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify`
  );

  // Set cookie with return URL
  response.cookies.set('returnTo', returnTo, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return response;
}