'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useMateriStore } from '@/lib/stores/useMateriStore';
import MateriCard from '@/components/MateriCard';
import ExportButton from '@/components/ExportButton';

interface HariDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HariDetailPage({ params }: HariDetailPageProps) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const router = useRouter();
  const { materiList, isLoading, fetchMateri, addMateri, editMateri, deleteMateri } = useMateriStore();
  const [showAddMateri, setShowAddMateri] = useState(false);
  const [editing, setEditing] = useState<null | { id: number; judul_materi: string; pemateri?: string; kelas?: 'A' | 'B' | 'C'; waktu_mulai: string; waktu_selesai: string }>(null);
  const [hariInfo, setHariInfo] = useState<{ nama_hari: string; tanggal: string } | null>(null);
  const [newMateri, setNewMateri] = useState({
    judul_materi: '',
    pemateri: '',
    kelas: 'A' as 'A' | 'B' | 'C',
    waktu_mulai: '',
    waktu_selesai: ''
  });

  const resolvedParams = use(params);
  const hariId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn && !isNaN(hariId)) {
      const fetchData = async () => {
        const token = await getToken();
        if (token) {
          fetchMateri(hariId, token);
          // In real implementation, you'd also fetch hari details
          // For now, we'll use placeholder data
          setHariInfo({ nama_hari: `Hari ${hariId}`, tanggal: new Date().toISOString().split('T')[0] });
        }
      };
      fetchData();
    }
  }, [isSignedIn, hariId, fetchMateri, getToken]);

  const handleAddMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMateri.judul_materi && newMateri.waktu_mulai && newMateri.waktu_selesai) {
      const token = await getToken();
      if (token) {
        await addMateri({
          id_hari: hariId,
          ...newMateri
        }, token);
        setNewMateri({ judul_materi: '', pemateri: '', kelas: 'A', waktu_mulai: '', waktu_selesai: '' });
        setShowAddMateri(false);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const token = await getToken();
    if (token) {
      await editMateri(hariId, editing.id, {
        judul_materi: editing.judul_materi,
        pemateri: editing.pemateri ?? '',
        kelas: editing.kelas,
        waktu_mulai: editing.waktu_mulai,
        waktu_selesai: editing.waktu_selesai,
      }, token);
      setEditing(null);
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
              <h1 className="text-3xl font-bold text-gray-100">
                {hariInfo?.nama_hari || 'Detail Hari'}
              </h1>
            </div>
            {hariInfo && (
              <ExportButton id_hari={hariId} nama_hari={hariInfo.nama_hari} />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Info */}
        {hariInfo && (
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8">
            <p className="text-gray-300">
              Tanggal: {new Date(hariInfo.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Add Materi Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddMateri(true)}
            className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500 transition-colors duration-200"
          >
            Tambah Materi
          </button>
        </div>

        {/* Add Materi Modal */}
        {showAddMateri && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-100">Tambah Materi Baru</h2>
              <form onSubmit={handleAddMateri} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Judul Materi
                  </label>
                  <input
                    type="text"
                    value={newMateri.judul_materi}
                    onChange={(e) => setNewMateri({ ...newMateri, judul_materi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Contoh: Pengenalan React"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Pemateri (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newMateri.pemateri}
                    onChange={(e) => setNewMateri({ ...newMateri, pemateri: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Nama pemateri"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kelas <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newMateri.kelas}
                    onChange={(e) => setNewMateri({ ...newMateri, kelas: e.target.value as 'A' | 'B' | 'C' })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  >
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Waktu Mulai
                    </label>
                    <input
                      type="time"
                      value={newMateri.waktu_mulai}
                      onChange={(e) => setNewMateri({ ...newMateri, waktu_mulai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Waktu Selesai
                    </label>
                    <input
                      type="time"
                      value={newMateri.waktu_selesai}
                      onChange={(e) => setNewMateri({ ...newMateri, waktu_selesai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMateri(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Materi List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : materiList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Belum ada materi yang ditambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiList.map((materi: any) => (
              <MateriCard
                key={materi.id}
                id={materi.id}
                judul_materi={materi.judul_materi}
                pemateri={materi.pemateri}
                kelas={materi.kelas}
                waktu_mulai={materi.waktu_mulai}
                waktu_selesai={materi.waktu_selesai}
                locked={materi.locked}
                onEdit={() => setEditing({ 
                  id: materi.id, 
                  judul_materi: materi.judul_materi, 
                  pemateri: materi.pemateri || '', 
                  kelas: materi.kelas || 'A',
                  waktu_mulai: materi.waktu_mulai, 
                  waktu_selesai: materi.waktu_selesai 
                })}
                onDelete={async (id) => {
                  const token = await getToken();
                  if (token) await deleteMateri(hariId, id, token);
                }}
              />
            ))}
          </div>
        )}
      </main>
      {/* Edit Materi Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-100">Edit Materi</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Judul Materi</label>
                <input
                  type="text"
                  value={editing.judul_materi}
                  onChange={(e) => setEditing({ ...editing, judul_materi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Pemateri (Opsional)</label>
                <input
                  type="text"
                  value={editing.pemateri || ''}
                  onChange={(e) => setEditing({ ...editing, pemateri: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Kelas <span className="text-red-400">*</span>
                </label>
                <select
                  value={editing.kelas || 'A'}
                  onChange={(e) => setEditing({ ...editing, kelas: e.target.value as 'A' | 'B' | 'C' })}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                >
                  <option value="A">Kelas A</option>
                  <option value="B">Kelas B</option>
                  <option value="C">Kelas C</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    value={editing.waktu_mulai}
                    onChange={(e) => setEditing({ ...editing, waktu_mulai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Waktu Selesai</label>
                  <input
                    type="time"
                    value={editing.waktu_selesai}
                    onChange={(e) => setEditing({ ...editing, waktu_selesai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Simpan</button>
                <button type="button" onClick={() => setEditing(null)} className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}