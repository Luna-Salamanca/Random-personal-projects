// ---- /src/app/admin/page.js ----
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';
import { CHECK_INTERVAL } from '@/lib/constants';

export default function AdminDashboard() {
  const { user, loading, expiresIn } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.isBanned)) {
      router.push(user?.isBanned ? '/banned' : '/denied');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!expiresIn) return;
    setTimeLeft(expiresIn);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - CHECK_INTERVAL;
        if (next <= 0) {
          clearInterval(interval);
          router.push('/api/auth/logout?expired=1');
          return 0;
        }
        return next;
      });
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [expiresIn, router]);

  if (loading || !user || user.isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl mb-1">Admin Dashboard</h1>
      <p className="text-gray-600 mb-2">
        Welcome, <span className="font-semibold">{user.username}</span>
      </p>
      <p className="text-sm text-orange-500 mb-6">
        Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <a href="/admin/users" className="card">
          <h2 className="text-lg mb-1">Manage Users</h2>
          <p className="text-sm text-gray-500">View role-gated Discord users</p>
        </a>
        <a href="/admin/roles" className="card">
          <h2 className="text-lg mb-1">Manage Roles</h2>
          <p className="text-sm text-gray-500">Assign roles in your Discord server</p>
        </a>
        <a href="/admin/logs" className="card">
          <h2 className="text-lg mb-1">System Logs</h2>
          <p className="text-sm text-gray-500">Track login attempts and actions</p>
        </a>
        <a href="/api/auth/logout" className="card">
          <h2 className="text-lg mb-1">Logout</h2>
          <p className="text-sm text-gray-500">Sign out of your admin session</p>
        </a>
      </div>
    </div>
  );
}