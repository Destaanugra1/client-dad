'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { uploadExcel } from '@/lib/api';

interface ExcelUploaderProps {
  onUploadSuccess: () => void;
}

export default function ExcelUploader({ onUploadSuccess }: ExcelUploaderProps) {
  const { getToken } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKelas, setSelectedKelas] = useState<'A' | 'B' | 'C'>('A');

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('File harus berformat Excel (.xlsx atau .xls)');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        await uploadExcel(file, token, selectedKelas);
        onUploadSuccess();
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsUploading(false);
    }
  }, [getToken, onUploadSuccess, selectedKelas]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Dropdown Kelas */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-100 mb-2">
          Pilih Kelas
        </label>
        <select
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value as 'A' | 'B' | 'C')}
          disabled={isUploading}
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          <option value="A">Kelas A</option>
          <option value="B">Kelas B</option>
          <option value="C">Kelas C</option>
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-gray-400 bg-gray-600/20 backdrop-blur-xl' 
            : 'border-gray-600/50 hover:border-gray-500/50 backdrop-blur-xl bg-gray-800/50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-700/20'}
        `}
      >
        {/* Background effect */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isDragging ? 'bg-gray-600/10' : 'bg-gray-700/10'
        }`}></div>
        
        <div className="relative z-10 space-y-6">
          <div className="text-5xl opacity-80">📄</div>
          <div>
            <p className="text-lg font-semibold text-gray-100 mb-2">
              {isUploading ? 'Mengupload...' : 'Drop file Excel di sini'}
            </p>
            <p className="text-sm text-gray-300">atau klik untuk memilih file</p>
          </div>
          
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className={`
              inline-block px-6 py-3 bg-gray-600 text-gray-100 rounded-xl cursor-pointer font-semibold
              hover:bg-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            Pilih File Excel
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl backdrop-blur-xl bg-gray-800/50 border border-gray-600/50">
          <p className="text-sm text-gray-300 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}