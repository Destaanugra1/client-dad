'use client';

import { useRouter } from 'next/navigation';
import { useAdminRole } from '@/lib/hooks/useRole';

export default function AdminDashboardLink() {
  const { isAdmin, isLoading } = useAdminRole();
  const router = useRouter();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <button
      onClick={() => router.push('/admin')}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 border border-red-500/30"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Admin Panel
    </button>
  );
}