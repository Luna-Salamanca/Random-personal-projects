// /src/lib/discord.js

// Discord API integration
// Handles OAuth flow and bot interaction

const DISCORD_API = 'https://discord.com/api/v10';

// Load environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const REQUIRED_ROLE_ID = process.env.REQUIRED_ROLE_ID;
const GUILD_ID = process.env.GUILD_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Exchanges OAuth code for access token
export async function exchangeCodeForToken(code) {
  try {
    console.log('Attempting token exchange with code:', code);
    console.log('Using redirect URI:', DISCORD_REDIRECT_URI);

    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: DISCORD_REDIRECT_URI,
    });

    const res = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Token exchange failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData
      });
      throw new Error(`Token exchange failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Token exchange successful');
    return data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

// Fetches discord user profile
export async function fetchDiscordUser(token) {
  try {
    const res = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Failed to fetch user:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData
      });
      throw new Error('Failed to fetch user');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching Discord user:', error);
    throw error;
  }
}

// Checks if user has required role using bot token
export async function userHasRoleBot(userId) {
  try {
    console.log('Checking roles for user:', userId);
    
    const res = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/members/${userId}`, {
      headers: { 
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error('Error checking roles:', {
        status: res.status,
        statusText: res.statusText,
        userId: userId
      });
      return false;
    }

    const member = await res.json();
    const hasRole = member.roles.includes(REQUIRED_ROLE_ID);
    console.log('Role check result:', {
      userId: userId,
      hasRole: hasRole,
      userRoles: member.roles
    });

    return hasRole;
  } catch (error) {
    console.error('Error checking user roles:', error);
    return false;
  }
}

// Utility function to validate environment variables
export function validateConfig() {
  const required = {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI,
    REQUIRED_ROLE_ID,
    GUILD_ID,
    BOT_TOKEN
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
