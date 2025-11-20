'use client';

import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useAdminRole } from '@/lib/hooks/useRole';
import { useAdminStore } from '@/lib/stores/useAdminStore';
import { useHariStore } from '@/lib/stores/useHariStore';
import { usePesertaStore } from '@/lib/stores/usePesertaStore';
import { useMateriStore } from '@/lib/stores/useMateriStore';
import { getAllAdminMateri } from '@/lib/api';
import BulkDeletePeserta from '@/components/BulkDeletePeserta';
import DataManagement from '@/components/DataManagement';
import AdminTabs from '@/components/AdminTabs';
import MateriLockToggle from '@/components/MateriLockToggle';
import KelasStats from '@/components/KelasStats';

export default function AdminDashboardPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const router = useRouter();
  
  const { 
    users, 
    stats, 
    isLoading, 
    error, 
    fetchUsers, 
    fetchStats, 
    updateUserRole,
    deleteBulkPeserta,
    deleteHari,
    deleteMateri
  } = useAdminStore();
  
  const { hariList, fetchHari } = useHariStore();
  const { pesertaList, fetchPeserta } = usePesertaStore();
  const { materiList, fetchMateri } = useMateriStore();
  const [allMateri, setAllMateri] = useState<Array<{ id: number; id_hari: number; judul_materi: string; waktu_mulai: string; waktu_selesai: string; locked: boolean }>>([]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'data'>('overview');


  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !roleLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, roleLoading, isAdmin, router]);

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      const loadData = async () => {
        const token = await getToken();
        if (token) {
          await Promise.all([
            fetchUsers(token),
            fetchStats(token),
            fetchHari(token),
            fetchPeserta(token),
            getAllAdminMateri(token).then(setAllMateri)
          ]);
        }
      };
      loadData();
    }
  }, [isSignedIn, isAdmin, fetchUsers, fetchStats, fetchHari, fetchPeserta, getToken]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = await getToken();
    if (token) {
      await updateUserRole(userId, newRole, token);
    }
  };



  if (!isLoaded || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-200">Sistem Monitoring Kehadiran</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Dashboard Utama
            </button>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <AdminTabs 
          tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'User Management' },
            { key: 'data', label: 'Data Management' }
          ]}
          active={activeTab}
          onChange={(k) => setActiveTab(k as typeof activeTab)}
        />

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Kelas Statistics */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Statistik Per Kelas</h2>
              <KelasStats />
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8.196a4.5 4.5 0 00-6.364-4.364m0 0a4.5 4.5 0 105.196 9.364l2.374-2.374a4.5 4.5 0 001.264-3.122z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-200">Total Users</p>
                      <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-200">Total Peserta</p>
                      <p className="text-2xl font-semibold text-white">{stats.totalPeserta}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-200">Total Hari</p>
                      <p className="text-2xl font-semibold text-white">{stats.totalHari}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-200">Total Materi</p>
                      <p className="text-2xl font-semibold text-white">{stats.totalMateri}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-200">Total Keaktifan</p>
                      <p className="text-2xl font-semibold text-white">{stats.totalKeaktifan}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-300 border-t-transparent"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Last Sign In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/20">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={user.image_url || '/default-avatar.png'} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {user.first_name} {user.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-purple-200">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="bg-gray-800 border border-purple-500/30 text-white rounded px-3 py-1 text-sm"
                            >
                              <option value="user">User</option>
                              <option value="panitia">Panitia</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'panitia' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <BulkDeletePeserta
              pesertaList={pesertaList}
              onBulkDelete={async (pesertaIds) => {
                const token = await getToken();
                if (token) {
                  await deleteBulkPeserta(pesertaIds, token);
                  await fetchPeserta(token);
                  await fetchStats(token);
                }
              }}
              isLoading={isLoading}
            />

            <DataManagement
              hariList={hariList}
              materiList={materiList}
              onDeleteHari={async (hariId) => {
                const token = await getToken();
                if (token) {
                  await deleteHari(hariId, token);
                  await fetchHari(token);
                  await fetchStats(token);
                }
              }}
              onDeleteMateri={async (materiId) => {
                const token = await getToken();
                if (token) {
                  await deleteMateri(materiId, token);
                  await fetchStats(token);
                }
              }}
              isLoading={isLoading}
            />
            {/* Materi Lock Controls */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Materi Lock / Unlock</h2>
              {allMateri.length === 0 && (
                <p className="text-purple-300 text-sm">Tidak ada materi untuk ditampilkan.</p>
              )}
              <div className="space-y-3">
                {allMateri.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded bg-white/5">
                    <div>
                      <p className="text-white font-medium">{m.judul_materi}</p>
                      <p className="text-xs text-purple-300">Hari #{m.id_hari} • {m.waktu_mulai} - {m.waktu_selesai} • ID: {m.id}</p>
                    </div>
                    <MateriLockToggle 
                      materiId={m.id} 
                      locked={m.locked}
                      onChanged={async () => {
                        const token = await getToken();
                        if (token) {
                          await fetchStats(token);
                          const list = await getAllAdminMateri(token);
                          setAllMateri(list);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}



        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}