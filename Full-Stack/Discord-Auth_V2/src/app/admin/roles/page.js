// ---- /src/app/admin/roles/page.js ----

'use client';
import React, { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';

export default function AdminRolesPage() {
  const { user, loading } = useSession();
  const [roles, setRoles] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch both roles and members
    Promise.all([
      fetch('/api/admin/roles').then(res => res.json()),
      fetch('/api/admin/users').then(res => res.json())
    ])
      .then(([rolesData, membersData]) => {
        // Calculate member count for each role
        const roleMembers = rolesData.map(role => ({
          ...role,
          memberCount: membersData.filter(member => 
            member.roles.some(r => r.id === role.id)
          ).length
        }));
        
        // Sort roles by position (highest to lowest)
        roleMembers.sort((a, b) => b.position - a.position);
        
        setRoles(roleMembers);
        setMembers(membersData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      Access denied or session expired.
    </div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>
      <p className="text-gray-600 mb-6">
        Manage Discord server roles and permissions.
      </p>

      {isLoading ? (
        <div className="text-center py-4">Loading roles...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div className="grid gap-4">
          {roles.map(role => (
            <div 
              key={role.id} 
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              style={{
                borderLeft: `4px solid #${role.color.toString(16).padStart(6, '0')}`,
              }}
            >
              <div>
                <h3 className="font-semibold">{role.name}</h3>
                <p className="text-sm text-gray-500">ID: {role.id}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  Members: {role.memberCount}
                </span>
                {role.managed && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Bot Managed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
