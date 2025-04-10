// /src/app/api/auth/callback/route.js
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import {
  validateConfig,
  exchangeCodeForToken,
  fetchDiscordUser,
  userHasRoleBot,
} from '@/lib/discord';
import { writeLog } from '@/lib/logger';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function GET(request) {
  try {
    validateConfig();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) return new Response('Missing code', { status: 400 });

    const { access_token } = await exchangeCodeForToken(code);
    const user = await fetchDiscordUser(access_token);

    const cookies = request.cookies.get('returnTo');
    const returnTo = cookies?.value || '/admin';

    const sessionRes = NextResponse.redirect(`${BASE_URL}${returnTo}`);
    sessionRes.cookies.set('returnTo', '', { maxAge: 0 }); // Clear the cookie

    const session = await getIronSession(request, sessionRes, sessionOptions);

    const banCheck = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/bans/${user.id}`,
      {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }
    );

    if (banCheck.ok) {
      session.user = {
        id: user.id,
        username: user.username,
        isBanned: true,
        createdAt: Date.now(),
      };
      await session.save();
      writeLog({ event: 'banned_user_login', userId: user.id, username: user.username });
      return sessionRes;
    }

    const hasRole = await userHasRoleBot(user.id);
    if (!hasRole) {
      writeLog({ event: 'login_denied', userId: user.id });
      return NextResponse.redirect(`${BASE_URL}/denied`);
    }

    session.user = {
      id: user.id,
      username: user.username,
      isBanned: false,
      hasRole: true,
      createdAt: Date.now(),
    };
    await session.save();

    writeLog({ event: 'login', userId: user.id, username: user.username });
    return sessionRes;
  } catch (err) {
    console.error('Auth callback error:', err);
    return new Response(`Auth failed: ${err.message}`, { status: 500 });
  }
}
