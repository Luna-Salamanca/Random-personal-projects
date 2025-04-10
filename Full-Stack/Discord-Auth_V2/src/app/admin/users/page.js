// ---- /src/app/admin/users/page.js ----

// Diplay list of Discord users

'use client';
import React, { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';

export default function AdminUsersPage() {
  const { user, loading } = useSession();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('joinedAt'); // Default sort by join date

  useEffect(() => {
    if (!user) return;

    fetch('/api/admin/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [user]);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.globalName && user.globalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.id.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'joinedAt':
          return new Date(b.joinedAt) - new Date(a.joinedAt);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'username':
          return a.username.localeCompare(b.username);
        case 'roles':
          return b.roles.length - a.roles.length;
        default:
          return 0;
      }
    });

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Format date for tooltip
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Access denied or session expired.</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Discord Users</h1>
        <p className="text-gray-600">
          Showing {filteredUsers.length} users {searchTerm && 'matching filter'}
        </p>
      </div>

      {/* Controls Section */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full sm:w-96 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            {searchTerm && `(${filteredUsers.length})`}
          </span>
        </div>

        {/* Sort Dropdown */}
        <select
          className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="joinedAt">Sort by Join Date</option>
          <option value="createdAt">Sort by Account Age</option>
          <option value="username">Sort by Username</option>
          <option value="roles">Sort by Role Count</option>
        </select>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">Error loading users</div>
          <div className="text-sm text-gray-500">{error}</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(member => (
            <div 
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <img
                    src={member.avatar 
                      ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`
                      : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.id) % 5}.png`
                    }
                    alt="Avatar"
                    className="w-16 h-16 rounded-full"
                  />
                </div>

                {/* User Info Section */}
                <div className="flex-1 min-w-0">
                  {/* Username and Tags */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {member.globalName || member.username}
                    </h3>
                    {member.isBot && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        BOT
                      </span>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="text-sm text-gray-500 mb-2">
                    {member.globalName && (
                      <span className="mr-2">@{member.username}</span>
                    )}
                    <span className="font-mono">ID: {member.id}</span>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div title={formatDate(member.joinedAt)}>
                      <span className="text-gray-600">Joined:</span>{' '}
                      <span className="font-medium">{formatRelativeTime(member.joinedAt)}</span>
                    </div>
                    <div title={formatDate(member.createdAt)}>
                      <span className="text-gray-600">Created:</span>{' '}
                      <span className="font-medium">{formatRelativeTime(member.createdAt)}</span>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-1.5">
                    {member.roles.map(role => (
                      <span
                        key={role.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}15` : '#f3f4f6',
                          color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#4b5563',
                          border: `1px solid ${role.color ? `#${role.color.toString(16).padStart(6, '0')}30` : '#e5e7eb'}`
                        }}
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}