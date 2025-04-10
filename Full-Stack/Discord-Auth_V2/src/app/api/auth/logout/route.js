// ---- /src/app/api/auth/logout/route.js ----

// Logout Handler
// Destoys user session and redirects to home

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { writeLog } from '@/lib/logger';

// Handles logout and destroys session
export async function GET(request) {
  // Check if logout was triggered by session expiry
  const { searchParams } = new URL(request.url);
  const expired = searchParams.get('expired') === '1'; 

  // Prepare redirect responsse
  const res = new Response(null, { status: 302 });
  const redirectTo = expired ? '/?expired=1' : '/';
  res.headers.set('Location', redirectTo);

  // Get and destroy session
  const session = await getIronSession(request, res, sessionOptions); // Load session
  writeLog({ event: 'logout', userId: session?.user?.id || 'unknown' }); // Log logout

  session.destroy(); // Destroy session and persist
  await session.save();

  return res;
}
