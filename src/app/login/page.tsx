'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../components/auth/AuthProvider';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <LoginForm />
      <div className="text-center mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}