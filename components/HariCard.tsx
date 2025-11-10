'use client';

import { useRouter } from 'next/navigation';

interface HariCardProps {
  id: number;
  nama_hari: string;
  tanggal: string;
}

export default function HariCard({ id, nama_hari, tanggal }: HariCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/hari/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gray-800/50 border border-gray-600/50 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer p-6 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20"
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors duration-300">
          {nama_hari}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {new Date(tanggal).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-violet-400 rounded-full opacity-40"></div>
    </div>
  );
}