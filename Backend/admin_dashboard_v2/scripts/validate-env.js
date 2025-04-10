// scripts/validate-env.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const requiredVars = [
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_REDIRECT_URI',
  'BOT_TOKEN',
  'GUILD_ID',
  'REQUIRED_ROLE_ID',
  'SESSION_SECRET',
  'BASE_URL',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach((key) => console.error(`- ${key}`));
  console.error('\nCreate or update your .env.local file before starting the server.');
  process.exit(1);
}

console.log('✅ All required environment variables are set.');
