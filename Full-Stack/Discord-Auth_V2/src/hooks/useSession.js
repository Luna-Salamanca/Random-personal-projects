// ---- /src/hooks/useSession.js ---
'use client';
import { useEffect, useState } from 'react';
import { SESSION_DURATION } from '@/lib/constants'; // Import duration

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) throw new Error('unauthorized');

        const data = await res.json();
        setUser(data.user);

        // Calculate remaining time in milliseconds
        if (data.user?.createdAt) {
          const createdAt = new Date(data.user.createdAt).getTime();
          const now = Date.now();
          const remaining = SESSION_DURATION * 1000 - (now - createdAt);
          setExpiresIn(Math.max(0, remaining)); // Prevent negatives
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading, expiresIn };
}