// ---- /src/app/denied/page.js ----
import React from 'react';

export default function AccessDeniedPage() {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2 text-red-600">Access Denied</h1>
      <p className="text-gray-700">You do not have the required role to access this site.</p>
    </div>
  );
}