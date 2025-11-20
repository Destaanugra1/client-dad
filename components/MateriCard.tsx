'use client';

import { useRouter } from 'next/navigation';

interface MateriCardProps {
  id: number;
  judul_materi: string;
  pemateri?: string;
  kelas?: string;
  waktu_mulai: string;
  waktu_selesai: string;
  locked: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function MateriCard({ id, judul_materi, pemateri, kelas, waktu_mulai, waktu_selesai, locked, onEdit, onDelete }: MateriCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!locked) {
      router.push(`/materi/${id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 p-6 ${
        locked 
          ? 'bg-gray-800/30 border-gray-700/30 opacity-70 cursor-not-allowed' 
          : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/60 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20'
      }`}
    >
      {/* Action icons */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {!!onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(id); }}
              className="px-2 py-1 rounded-lg bg-gray-700/60 hover:bg-gray-600/80 text-gray-200 border border-gray-600/50"
              title="Edit materi"
            >
              ✏️
            </button>
          )}
          {!!onDelete && (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                if (confirm(`Hapus materi \"${judul_materi}\"?`)) onDelete?.(id);
              }}
              className="px-2 py-1 rounded-lg bg-red-700/40 hover:bg-red-700/60 text-red-200 border border-red-600/50"
              title="Hapus materi"
            >
              🗑️
            </button>
          )}
        </div>
      )}
      {/* Glass effect overlay */}
      {!locked && (
        <div className="absolute inset-0 bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Lock indicator */}
      {locked && (
        <div className="flex items-center mb-3 text-red-400">
          <span className="mr-2 text-lg">🔒</span>
          <span className="text-sm font-semibold tracking-wide">TERKUNCI</span>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            locked 
              ? 'text-gray-400' 
              : 'text-gray-100 group-hover:text-white'
          }`}>
            {judul_materi}
          </h3>
          {kelas && (
            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
              kelas === 'A' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              kelas === 'B' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              Kelas {kelas}
            </span>
          )}
        </div>
        {pemateri && (
          <p className={`text-sm mb-2 ${locked ? 'text-gray-500' : 'text-gray-400'}`}>
            👤 {pemateri}
          </p>
        )}
        <div className={`text-sm ${locked ? 'text-gray-500' : 'text-gray-300'}`}>
          <p className="font-medium">⏰ {waktu_mulai} - {waktu_selesai} WIB</p>
        </div>
      </div>
      
      {/* Decorative elements */}
      {!locked && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-gray-500 rounded-full opacity-40"></div>
        </>
      )}
    </div>
  );
}