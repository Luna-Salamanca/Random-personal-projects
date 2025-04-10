// ---- /src/app/page.js ----
'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const expired = searchParams.get('expired');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 bg-gradient-radial from-blue-50 via-white to-purple-100">
      {expired && (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg border border-red-300">
          Your session expired. Please log in again.
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-4">Welcome to NAUR FFXIV Auth</h1>
      <p className="text-lg text-muted mb-6 max-w-xl">
        Secure your access using Discord login and role-based permissions.
      </p>
      <a href="/api/auth/login" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
        Login with Discord
      </a>
    </div>
  );
}
