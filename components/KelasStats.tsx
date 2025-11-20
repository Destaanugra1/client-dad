'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { API_BASE_URL } from '@/lib/api';

interface KelasStatsData {
  kelas: string;
  total: number;
}

export default function KelasStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<KelasStatsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/peserta?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to load stats');
        
        const data = await response.json();
        const pesertaList = data.data || [];

        // Hitung per kelas
        const kelasCount: Record<string, number> = {
          'A': 0,
          'B': 0,
          'C': 0,
        };

        pesertaList.forEach((p: any) => {
          const kelas = p.kelas || 'A';
          kelasCount[kelas] = (kelasCount[kelas] || 0) + 1;
        });

        const statsData: KelasStatsData[] = Object.entries(kelasCount).map(([kelas, total]) => ({
          kelas,
          total,
        }));

        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [getToken]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl backdrop-blur-xl bg-gray-800/50 border border-gray-600/50 animate-pulse">
            <div className="h-8 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-6 bg-gray-700/50 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div 
          key={stat.kelas}
          className="p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50 hover:border-gray-500/50 transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Kelas {stat.kelas}</p>
              <p className="text-3xl font-bold text-gray-100">{stat.total}</p>
              <p className="text-xs text-gray-500 mt-1">peserta</p>
            </div>
            <div className="text-4xl opacity-50">
              {stat.kelas === 'A' ? '🅰️' : stat.kelas === 'B' ? '🅱️' : '©️'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
