// src/hooks/useAdminAccess.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSession from './useSession';

export default function useAdminAccess() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push('/denied');
    else if (user.isBanned) router.push('/banned');
  }, [user, loading, router]);

  return { user, loading };
}
