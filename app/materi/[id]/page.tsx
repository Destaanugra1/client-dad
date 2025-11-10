'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { usePesertaStore } from '@/lib/stores/usePesertaStore';
import PesertaList from '@/components/PesertaList';

interface MateriDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MateriDetailPage({ params }: MateriDetailPageProps) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const router = useRouter();
  const { 
    pesertaList, 
    keaktifanStatuses, 
    isLoading, 
    fetchPeserta, 
    fetchKeaktifanStatuses, 
    updateStatus,
    addPesertaManual,
    deletePesertaById,
  } = usePesertaStore();
  
  const [materiInfo, setMateriInfo] = useState<{
    judul_materi: string;
    waktu_mulai: string;
    waktu_selesai: string;
    locked: boolean;
  } | null>(null);

  const resolvedParams = use(params);
  const materiId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn && !isNaN(materiId)) {
      const fetchData = async () => {
        const token = await getToken();
        if (token) {
          fetchPeserta(token);
          fetchKeaktifanStatuses(materiId, token);
          // In real implementation, you'd also fetch materi details
          // For now, we'll use placeholder data
          setMateriInfo({
            judul_materi: `Materi ${materiId}`,
            waktu_mulai: '09:00',
            waktu_selesai: '11:00',
            locked: false
          });
        }
      };
      fetchData();
    }
  }, [isSignedIn, materiId, fetchPeserta, fetchKeaktifanStatuses, getToken]);

  const handleStatusChange = async (pesertaId: number, status: 'HIJAU' | 'KUNING' | 'MERAH') => {
    const token = await getToken();
    if (token) {
      await updateStatus({
        id_peserta: pesertaId,
        id_materi: materiId,
        status
      }, token);
    }
  };

  const handleAddPeserta = async (nama: string) => {
    const token = await getToken();
    if (token) {
      await addPesertaManual(nama, token);
      // Refresh keaktifan for current materi so the new peserta appears with default status
      await fetchKeaktifanStatuses(materiId, token);
    }
  };

  const handleDeletePeserta = async (id: number) => {
    const token = await getToken();
    if (token) {
      await deletePesertaById(id, token);
      await fetchKeaktifanStatuses(materiId, token);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-300 hover:text-gray-100"
              >
                ← Kembali
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-100">
                  {materiInfo?.judul_materi || 'Detail Materi'}
                </h1>
                {materiInfo && (
                  <p className="text-gray-400 mt-1">
                    {materiInfo.waktu_mulai} - {materiInfo.waktu_selesai}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Legend */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Keterangan Status:</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-300">Hijau - Aktif</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-gray-300">Kuning - Cukup</span>
            </div>
          </div>
          {materiInfo?.locked && (
            <div className="mt-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              <div className="flex items-center text-gray-300">
                <span className="mr-2">🔒</span>
                <span className="font-medium">Materi ini telah dikunci dan tidak dapat diubah</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Ringkasan:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-100">{pesertaList.length}</div>
              <div className="text-sm text-gray-400">Total Peserta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-100">
                {keaktifanStatuses.filter(s => s.status === 'HIJAU').length}
              </div>
              <div className="text-sm text-gray-400">Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-300">
                {keaktifanStatuses.filter(s => s.status === 'KUNING').length}
              </div>
              <div className="text-sm text-gray-400">Cukup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">
                {keaktifanStatuses.filter(s => s.status === 'MERAH').length + 
                 (pesertaList.length - keaktifanStatuses.length)}
              </div>
              <div className="text-sm text-gray-400">Tidak Aktif</div>
            </div>
          </div>
        </div>

        {/* Participant List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : pesertaList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Belum ada data peserta</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-100">Daftar Peserta:</h2>
            <PesertaList
              participants={pesertaList}
              statuses={keaktifanStatuses}
              materiLocked={materiInfo?.locked || false}
              onStatusChange={handleStatusChange}
              onAdd={handleAddPeserta}
              onDelete={handleDeletePeserta}
            />
          </div>
        )}
      </main>
    </div>
  );
}