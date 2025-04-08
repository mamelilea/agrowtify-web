'use client';

import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import React from 'react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              Agrowtify
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Home
              </Link>
              <Link href="/agrocare" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Agrocare
              </Link>
              <Link href="/agroevent" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Agroevent
              </Link>
              <Link href="/agroguide" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Agroguide
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="text-sm px-3 py-2">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hello, {user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}