'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-transparent"></div>
        <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl"></div>
      </div>
    </div>
  );
}
