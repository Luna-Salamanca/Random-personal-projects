import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getIronSession(request, new Response(), sessionOptions);
  if (!session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Fetch banned users from Discord
    const response = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/bans`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch bans');
    }

    const bans = await response.json();
    return NextResponse.json(bans);
  } catch (error) {
    console.error('Error fetching bans:', error);
    return new Response('Failed to fetch bans', { status: 500 });
  }
}
