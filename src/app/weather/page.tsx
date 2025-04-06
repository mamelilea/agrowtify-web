'use client';

import React from 'react';
import { useAuth } from '../../components/auth/AuthProvider';

export default function WeatherPage() {
  const { user } = useAuth();

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Page</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <p className="mb-4">
          This page is only accessible to authenticated users. If you can see this, you're logged in!
        </p>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Your User Information:</h2>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
        
        <p className="mt-6">
          In a real application, this protected page could contain:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>User-specific data</li>
          <li>Account management options</li>
          <li>Premium content</li>
          <li>Administrative controls</li>
        </ul>
      </div>
    </div>
  );
}