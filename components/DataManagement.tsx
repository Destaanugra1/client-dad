'use client';

import { useState } from 'react';

interface Hari {
  id: number;
  nama_hari: string;
  tanggal: string;
}

interface Materi {
  id: number;
  judul_materi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  locked: boolean;
}

interface DataManagementProps {
  hariList: Hari[];
  materiList: Materi[];
  onDeleteHari: (id: number) => Promise<void>;
  onDeleteMateri: (id: number) => Promise<void>;
  isLoading: boolean;
}

export default function DataManagement({ hariList, materiList, onDeleteHari, onDeleteMateri, isLoading }: DataManagementProps) {
  const [activeTab, setActiveTab] = useState<'hari' | 'materi'>('hari');
  const [showConfirm, setShowConfirm] = useState<{
    type: 'hari' | 'materi';
    id: number;
    name: string;
  } | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!showConfirm) return;
    
    try {
      if (showConfirm.type === 'hari') {
        await onDeleteHari(showConfirm.id);
      } else {
        await onDeleteMateri(showConfirm.id);
      }
      setShowConfirm(null);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-black/20 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('hari')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'hari'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Hari ({hariList.length})
          </button>
          <button
            onClick={() => setActiveTab('materi')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'materi'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Materi ({materiList.length})
          </button>
        </div>

        {/* Hari Tab */}
        {activeTab === 'hari' && (
          <div className="space-y-3">
            {hariList.length === 0 ? (
              <div className="text-center py-8 text-purple-300">
                No hari data available
              </div>
            ) : (
              hariList.map((hari) => (
                <div key={hari.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-purple-500/10 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{hari.nama_hari}</h3>
                    <p className="text-purple-200 text-sm">{formatDate(hari.tanggal)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-purple-300">ID: {hari.id}</span>
                    <button
                      onClick={() => setShowConfirm({ type: 'hari', id: hari.id, name: hari.nama_hari })}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Materi Tab */}
        {activeTab === 'materi' && (
          <div className="space-y-3">
            {materiList.length === 0 ? (
              <div className="text-center py-8 text-purple-300">
                No materi data available. Select a hari first to load materi.
              </div>
            ) : (
              materiList.map((materi) => (
                <div key={materi.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-purple-500/10 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-medium">{materi.judul_materi}</h3>
                      {materi.locked && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-200 border border-yellow-500/30">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Locked
                        </span>
                      )}
                    </div>
                    <div className="text-purple-200 text-sm space-y-1">
                      <p>
                        {formatTime(materi.waktu_mulai)} - {formatTime(materi.waktu_selesai)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-purple-300">ID: {materi.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowConfirm({ type: 'materi', id: materi.id, name: materi.judul_materi })}
                        disabled={isLoading || materi.locked}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        title={materi.locked ? 'Cannot delete locked materi' : 'Delete materi'}
                      >
                        {isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-purple-200 mb-4">
              Are you sure you want to delete this {showConfirm.type}?
            </p>
            
            <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-3 mb-6">
              <p className="text-white font-medium">{showConfirm.name}</p>
              <p className="text-purple-300 text-sm mt-1">ID: {showConfirm.id}</p>
            </div>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-sm">
                <strong>Warning:</strong> This action cannot be undone.
                {showConfirm.type === 'hari' && ' This will also delete all associated materi and keaktifan records.'}
                {showConfirm.type === 'materi' && ' This will also delete all associated keaktifan records.'}
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-purple-200 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}