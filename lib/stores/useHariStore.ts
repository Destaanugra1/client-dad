import { create } from 'zustand';
import { getHari, addHari } from '@/lib/api';

interface Hari {
  id: number;
  nama_hari: string;
  tanggal: string;
}

interface HariStore {
  hariList: Hari[];
  isLoading: boolean;
  error: string | null;
  fetchHari: (token: string) => Promise<void>;
  addHari: (data: { nama_hari: string; tanggal: string }, token: string) => Promise<void>;
}

export const useHariStore = create<HariStore>((set, get) => ({
  hariList: [],
  isLoading: false,
  error: null,

  fetchHari: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const hariList = await getHari(token);
      set({ hariList, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addHari: async (data, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await addHari(data, token);
      // Refresh the list after adding
      await get().fetchHari(token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));