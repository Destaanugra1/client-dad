'use client';

interface StatusToggleProps {
  status: 'HIJAU' | 'KUNING' | 'MERAH' | undefined;
  disabled?: boolean;
  onChange: (status: 'HIJAU' | 'KUNING' | 'MERAH') => void;
}

export default function StatusToggle({ status, disabled = false, onChange }: StatusToggleProps) {
  const currentStatus = status || 'MERAH'; // Default to MERAH if undefined

  return (
    <div className="flex gap-2">
      {/* Tombol AKTIF */}
      <button
        onClick={() => onChange('HIJAU')}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${currentStatus === 'HIJAU' 
            ? 'bg-green-600 text-gray-100 shadow-lg' 
            : 'bg-green-900 text-gray-400 hover:bg-green-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform active:scale-95'}
        `}
      >
        AKTIF
      </button>

      {/* Tombol CUKUP */}
      <button
        onClick={() => onChange('KUNING')}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${currentStatus === 'KUNING' 
            ? 'bg-gray-500 text-gray-100 shadow-lg' 
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform active:scale-95'}
        `}
      >
        CUKUP
      </button>
    </div>
  );
}