'use client';
import React, { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';

export default function AdminBansPage() {
  const { user, loading } = useSession();
  const [bans, setBans] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    fetch('/api/admin/bans')
      .then(res => res.json())
      .then(data => {
        setBans(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [user]);

  const filteredBans = bans.filter(ban => 
    ban.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ban.user.id.includes(searchTerm) ||
    (ban.reason && ban.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ban List</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username, ID, or reason..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading bans...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div className="grid gap-4">
          {filteredBans.map(ban => (
            <div 
              key={ban.user.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    {ban.user.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {ban.user.id}
                  </p>
                  {ban.reason && (
                    <p className="mt-2 text-red-600">
                      Reason: {ban.reason}
                    </p>
                  )}
                </div>
                <img
                  src={ban.user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${ban.user.id}/${ban.user.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/0.png`
                  }
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
