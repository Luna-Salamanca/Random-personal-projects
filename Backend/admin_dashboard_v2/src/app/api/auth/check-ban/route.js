import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response('User ID required', { status: 400 });
  }

  try {
    // Check if user is banned
    const response = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/bans/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    // If response is 404, user is not banned
    if (response.status === 404) {
      return NextResponse.json({ isBanned: false });
    }

    // If response is 200, user is banned
    if (response.ok) {
      const banData = await response.json();
      return NextResponse.json({ 
        isBanned: true, 
        reason: banData.reason 
      });
    }

    throw new Error('Failed to check ban status');
  } catch (error) {
    console.error('Error checking ban status:', error);
    return new Response('Failed to check ban status', { status: 500 });
  }
}
