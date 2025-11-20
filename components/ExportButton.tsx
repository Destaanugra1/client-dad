'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { exportHariExcel } from '@/lib/api';

interface ExportButtonProps {
  id_hari: number;
  nama_hari: string;
}

export default function ExportButton({ id_hari, nama_hari }: ExportButtonProps) {
  const { getToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = await getToken();
      if (token) {
        const kelas = selectedKelas === 'ALL' ? undefined : selectedKelas;
        const blob = await exportHariExcel(id_hari, token, kelas);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const kelasLabel = kelas ? `_kelas_${kelas}` : '_semua_kelas';
        a.download = `keaktifan_${nama_hari}${kelasLabel}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengexport data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500 transition-colors duration-200"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Export Excel
      </button>

      {/* Modal Pilih Kelas */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-600/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-100 mb-4">Export Data ke Excel</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Pilih Kelas untuk Export
              </label>
              <div className="space-y-2">
                {['ALL', 'A', 'B', 'C'].map((kelas) => (
                  <label
                    key={kelas}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedKelas === kelas
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600/50 hover:border-gray-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kelas"
                      value={kelas}
                      checked={selectedKelas === kelas}
                      onChange={(e) => setSelectedKelas(e.target.value as any)}
                      className="mr-3"
                    />
                    <span className="text-gray-100 font-medium">
                      {kelas === 'ALL' ? '📊 Semua Kelas' : `🎓 Kelas ${kelas}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>Export</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}