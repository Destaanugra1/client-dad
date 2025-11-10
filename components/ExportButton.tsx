'use client';

import { useAuth } from '@clerk/nextjs';
import { exportHariExcel } from '@/lib/api';

interface ExportButtonProps {
  id_hari: number;
  nama_hari: string;
}

export default function ExportButton({ id_hari, nama_hari }: ExportButtonProps) {
  const { getToken } = useAuth();

  const handleExport = async () => {
    try {
      const token = await getToken();
      if (token) {
        const blob = await exportHariExcel(id_hari, token);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `keaktifan_${nama_hari}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengexport data');
    }
  };

  return (
    <button
      onClick={handleExport}
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
  );
}