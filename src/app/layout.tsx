import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import '@/styles/globals.css';
import Navbar from '@/components/layouts/Navbar';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agrowtify',
  description: 'website petani',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}