// ---- /src/app/api/admin/users/route.js ----

// Admin user API Route
// Handles fetching Discord users with access

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Verify session
  const session = await getIronSession(request, new Response(), sessionOptions);
  if (!session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Fetch roles from Discord using bot token
    const response = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/roles`, 
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    const roles = await response.json();
    
    // Filter out @everyone role and sort by position
    const filteredRoles = roles
      .filter(role => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position);

    return NextResponse.json(filteredRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return new Response('Failed to fetch roles', { status: 500 });
  }
}
