'use client';

import { useMemo, useState } from 'react';
import StatusToggle from './StatusToggle';

interface Peserta {
  id: number;
  nama: string;
  npm?: string;
  semester?: number;
}

interface KeaktifanStatus {
  peserta: { id: number; nama: string };
  status: 'HIJAU' | 'KUNING' | 'MERAH';
}

interface PesertaListProps {
  participants: Peserta[];
  statuses: KeaktifanStatus[];
  materiLocked: boolean;
  onStatusChange: (pesertaId: number, status: 'HIJAU' | 'KUNING' | 'MERAH') => void;
  onAdd?: (nama: string) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
}

export default function PesertaList({ participants, statuses, materiLocked, onStatusChange, onAdd, onDelete }: PesertaListProps) {
  const [query, setQuery] = useState('');
  const getStatusForPeserta = (pesertaId: number): 'HIJAU' | 'KUNING' | 'MERAH' | undefined => {
    const found = statuses.find(s => s.peserta.id === pesertaId);
    return found?.status;
  };

  const getStatusDisplay = (status: 'HIJAU' | 'KUNING' | 'MERAH' | undefined) => {
    if (!status || status === 'MERAH') {
      return { text: 'Tidak Aktif', color: 'text-gray-400', bg: 'bg-gray-800' };
    }
    if (status === 'HIJAU') {
      return { text: 'Aktif', color: 'text-gray-100', bg: 'bg-gray-600' };
    }
    if (status === 'KUNING') {
      return { text: 'Cukup', color: 'text-gray-200', bg: 'bg-gray-700' };
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(p => p.nama.toLowerCase().includes(q));
  }, [participants, query]);

  const showAddRow = useMemo(() => {
    const q = query.trim();
    if (!onAdd || !q) return false;
    return filtered.length === 0;
  }, [filtered.length, onAdd, query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama peserta..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>

      {showAddRow && (
        <button
          onClick={() => onAdd && onAdd(query.trim())}
          className="w-full text-left p-4 bg-gray-800/60 hover:bg-gray-800 rounded-lg border border-dashed border-gray-600 text-gray-200"
        >
          Tambah "{query.trim()}" sebagai peserta baru
        </button>
      )}

      {filtered.map((peserta) => {
        const currentStatus = getStatusForPeserta(peserta.id);
        const statusDisplay = getStatusDisplay(currentStatus);
        
        return (
          <div 
            key={peserta.id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100">{peserta.nama}</h3>
              {typeof peserta.npm !== 'undefined' && (
                <p className="text-sm text-gray-300">NPM: {peserta.npm || '-'}</p>
              )}
              {typeof peserta.semester !== 'undefined' && (
                <p className="text-sm text-gray-300">Semester: {peserta.semester ?? '-'}</p>
              )}
              
              {/* Status Display */}
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${statusDisplay?.bg} ${statusDisplay?.color}`}>
                {statusDisplay?.text}
              </div>
            </div>
            
            <div className="ml-4 flex items-center gap-3">
              <StatusToggle
                status={currentStatus}
                disabled={materiLocked}
                onChange={(status) => onStatusChange(peserta.id, status)}
              />
              {!!onDelete && (
                <button
                  onClick={() => {
                    if (confirm(`Hapus peserta \"${peserta.nama}\"?`)) {
                      onDelete?.(peserta.id)
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
                  title="Hapus peserta"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}