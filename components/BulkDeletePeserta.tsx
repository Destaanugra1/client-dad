'use client';

import { useState } from 'react';

interface Peserta {
  id: number;
  nama: string;
}

interface BulkDeletePesertaProps {
  pesertaList: Peserta[];
  onBulkDelete: (ids: number[]) => Promise<void>;
  isLoading: boolean;
}

export default function BulkDeletePeserta({ pesertaList, onBulkDelete, isLoading }: BulkDeletePesertaProps) {
  const [selectedPeserta, setSelectedPeserta] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPeserta(pesertaList.map(p => p.id));
    } else {
      setSelectedPeserta([]);
    }
  };

  const handleSelectPeserta = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPeserta([...selectedPeserta, id]);
    } else {
      setSelectedPeserta(selectedPeserta.filter(pid => pid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPeserta.length === 0) return;
    
    try {
      await onBulkDelete(selectedPeserta);
      setSelectedPeserta([]);
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting peserta:', error);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Bulk Delete Peserta</h3>
        <div className="text-sm text-purple-200">
          {selectedPeserta.length} of {pesertaList.length} selected
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center space-x-2 text-purple-200">
          <input
            type="checkbox"
            checked={selectedPeserta.length === pesertaList.length && pesertaList.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="rounded border-purple-500/30 bg-gray-800"
          />
          <span>Select All</span>
        </label>
        
        {selectedPeserta.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : `Delete Selected (${selectedPeserta.length})`}
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto border border-purple-500/20 rounded-lg">
        <div className="divide-y divide-purple-500/20">
          {pesertaList.map((peserta) => (
            <label key={peserta.id} className="flex items-center space-x-3 p-3 hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPeserta.includes(peserta.id)}
                onChange={(e) => handleSelectPeserta(peserta.id, e.target.checked)}
                className="rounded border-purple-500/30 bg-gray-800"
              />
              <span className="text-white flex-1">{peserta.nama}</span>
              <span className="text-xs text-purple-300">ID: {peserta.id}</span>
            </label>
          ))}
        </div>
      </div>

      {pesertaList.length === 0 && (
        <div className="text-center py-8 text-purple-300">
          No peserta data available
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Bulk Delete</h3>
            <p className="text-purple-200 mb-6">
              Are you sure you want to delete <span className="font-semibold text-red-400">{selectedPeserta.length}</span> peserta? 
              This will also delete all their keaktifan records. This action cannot be undone.
            </p>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-sm">
                <strong>Warning:</strong> This will permanently delete:
              </p>
              <ul className="text-red-200 text-sm mt-2 ml-4 list-disc">
                <li>{selectedPeserta.length} peserta records</li>
                <li>All associated keaktifan records</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-purple-200 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
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