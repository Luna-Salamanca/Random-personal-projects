'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';

export default function Header() {
  const router = useRouter();
  const { user } = useSession();

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-purple-500 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a
          href="/"
          className="text-xl px-3 py-1.5 font-bold rounded-md text-white hover:bg-white/10 transition-colors"
        >
          NAUR
        </a>
        <div className="flex gap-6 items-center text-sm">
          <a
            href="/admin"
            className="text-sm px-3 py-1.5 rounded-md font-bold text-white hover:bg-white/10 transition-colors"
          >
            Admin Panel
          </a>
          {user && (
              <button
    onClick={() => (window.location.href = '/api/auth/logout')}
    className="text-sm px-3 py-1.5 rounded-md font-bold text-red-100 hover:text-red-300 hover:bg-white/10 transition-colors"
  >
    Logout
  </button>

          )}
        </div>
      </div>
    </header>
  );
}
