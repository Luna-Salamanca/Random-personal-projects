// /src/app/api/admin/users/route.js

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';

// Helper function to convert Discord snowflake to timestamp
function getTimestampFromSnowflake(snowflake) {
  const DISCORD_EPOCH = 1420070400000;
  // Convert snowflake to string to handle BigInt
  const binary = BigInt(snowflake).toString(2).padStart(64, '0');
  const timestamp = binary.substring(0, 42);
  // Convert back to number and add Discord epoch
  return Number(BigInt('0b' + timestamp)) + DISCORD_EPOCH;
}

export async function GET(request) {
  // Verify session
  const session = await getIronSession(request, new Response(), sessionOptions);
  if (!session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Fetch all guild members
    const membersResponse = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/members?limit=1000`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    if (!membersResponse.ok) {
      throw new Error('Failed to fetch members');
    }

    // Fetch all roles for reference
    const rolesResponse = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    if (!rolesResponse.ok) {
      throw new Error('Failed to fetch roles');
    }

    const members = await membersResponse.json();
    const roles = await rolesResponse.json();

    // Create roles lookup map
    const rolesMap = roles.reduce((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {});

    // Process and format member data
    const processedMembers = members.map(member => {
      // Safely get creation timestamp
      const creationTimestamp = getTimestampFromSnowflake(member.user.id);
      
      return {
        id: member.user.id,
        username: member.user.username,
        globalName: member.user.global_name,
        avatar: member.user.avatar,
        joinedAt: member.joined_at,
        createdAt: new Date(creationTimestamp).toISOString(),
        roles: member.roles
          .map(roleId => rolesMap[roleId])
          .filter(Boolean)
          .sort((a, b) => b.position - a.position),
        isBot: member.user.bot || false,
      };
    });

    // Sort members by join date (newest first)
    processedMembers.sort((a, b) => 
      new Date(b.joinedAt) - new Date(a.joinedAt)
    );

    return NextResponse.json(processedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return new Response('Failed to fetch members', { status: 500 });
  }
}
