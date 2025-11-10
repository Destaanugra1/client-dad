'use client';

import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useHariStore } from '@/lib/stores/useHariStore';
import { usePesertaStore } from '@/lib/stores/usePesertaStore';
import HariCard from '@/components/HariCard';
import ExcelUploader from '@/components/ExcelUploader';
import AdminDashboardLink from '@/components/AdminDashboardLink';

export default function DashboardPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const router = useRouter();
  const { hariList, isLoading, fetchHari, addHari } = useHariStore();
  const { pesertaList, fetchPeserta } = usePesertaStore();
  const [showAddHari, setShowAddHari] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [newHari, setNewHari] = useState({
    nama_hari: '',
    tanggal: ''
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn) {
      const fetchData = async () => {
        const token = await getToken();
        if (token) {
          fetchHari(token);
          fetchPeserta(token);
        }
      };
      fetchData();
    }
  }, [isSignedIn, fetchHari, fetchPeserta, getToken]);

  const handleAddHari = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHari.nama_hari && newHari.tanggal) {
      const token = await getToken();
      if (token) {
        await addHari(newHari, token);
        setNewHari({ nama_hari: '', tanggal: '' });
        setShowAddHari(false);
      }
    }
  };

  const handleUploadSuccess = async () => {
    const token = await getToken();
    if (token) {
      fetchPeserta(token);
    }
    setShowUploader(false);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-400 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-gray-500/20 blur-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with glass effect */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-800/80 border-b border-gray-600/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
                <span className="text-gray-200 font-bold text-lg">📊</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                Monitoring Absen
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <AdminDashboardLink />
              <UserButton 
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-gray-500/50 hover:ring-gray-400 transition-all duration-300",
                    userButtonPopoverCard: "backdrop-blur-xl bg-gray-800/80 border border-gray-600/50"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowAddHari(true)}
            className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 px-6 py-3 text-gray-100 font-semibold hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>➕</span>
              <span>Tambah Hari</span>
            </span>
          </button>
          
          {pesertaList.length === 0 && (
            <button
              onClick={() => setShowUploader(true)}
              className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-gray-600/50 border border-gray-500/50 px-6 py-3 text-gray-100 font-semibold hover:bg-gray-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-400/25"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>📁</span>
                <span>Upload Data Peserta</span>
              </span>
            </button>
          )}
        </div>

        {/* Add Hari Modal */}
        {showAddHari && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gray-800/80 border border-gray-600/50 p-6 w-full max-w-md shadow-2xl">
              <div className="absolute inset-0 bg-gray-700/20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Tambah Hari Baru</h2>
                <form onSubmit={handleAddHari} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Hari
                    </label>
                    <input
                      type="text"
                      value={newHari.nama_hari}
                      onChange={(e) => setNewHari({ ...newHari, nama_hari: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                      placeholder="Contoh: Hari 1, Senin, dll"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={newHari.tanggal}
                      onChange={(e) => setNewHari({ ...newHari, tanggal: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gray-600 text-gray-100 rounded-xl font-semibold hover:bg-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                    >
                      Tambah
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddHari(false)}
                      className="flex-1 px-6 py-3 backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gray-800/80 border border-gray-600/50 p-6 w-full max-w-lg shadow-2xl">
              <div className="absolute inset-0 bg-gray-700/20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Upload Data Peserta</h2>
                <ExcelUploader onUploadSuccess={handleUploadSuccess} />
                <button
                  onClick={() => setShowUploader(false)}
                  className="mt-6 w-full px-6 py-3 backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hari List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-gray-500/20 blur-xl"></div>
            </div>
          </div>
        ) : hariList.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="text-6xl mb-4 opacity-50">📅</div>
              <div className="absolute inset-0 bg-gray-500/20 blur-2xl rounded-full"></div>
            </div>
            <p className="text-xl text-gray-400 font-medium">Belum ada hari yang ditambahkan</p>
            <p className="text-gray-500 mt-2">Klik tombol &quot;Tambah Hari&quot; untuk memulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hariList.map((hari) => (
              <HariCard
                key={hari.id}
                id={hari.id}
                nama_hari={hari.nama_hari}
                tanggal={hari.tanggal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}