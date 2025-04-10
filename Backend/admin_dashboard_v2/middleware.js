// ---- /middleware.js ----

// Next.js Middleware
// Handles route protection and authentication checking

import { authGuard } from '@/lib/authGuard';
import { NextResponse } from 'next/server';

export async function middleware(req){
  const blocked = await authGuard(req); // Check if route should be blocked
  return blocked || NextResponse.next(); } // Either return the blocked response or continue to next middleware

  // Configure which routes this middleware
  export const config = { 
  matcher: [
    '/admin',               // Admin Dashboard
    '/admin/:path*',        // ALL admin sub-routes 
    '/api/admin',           // Admin API base
    '/api/admin/:path*'     // ALL admin API routes
  ],};