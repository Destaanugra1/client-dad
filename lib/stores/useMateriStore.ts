import { create } from 'zustand';
import { getMateriByHari, addMateri, updateMateri as apiUpdateMateri, deleteMateri as apiDeleteMateri } from '@/lib/api';

interface Materi {
  id: number;
  judul_materi: string;
  pemateri?: string;
  kelas?: string;
  waktu_mulai: string;
  waktu_selesai: string;
  locked: boolean;
}

interface MateriStore {
  materiList: Materi[];
  isLoading: boolean;
  error: string | null;
  fetchMateri: (id_hari: number, token: string) => Promise<void>;
  addMateri: (data: {
    id_hari: number;
    judul_materi: string;
    pemateri?: string;
    kelas?: 'A' | 'B' | 'C';
    waktu_mulai: string;
    waktu_selesai: string;
  }, token: string) => Promise<void>;
  editMateri: (id_hari: number, id: number, data: {
    judul_materi?: string;
    pemateri?: string | null;
    kelas?: 'A' | 'B' | 'C';
    waktu_mulai?: string;
    waktu_selesai?: string;
  }, token: string) => Promise<void>;
  deleteMateri: (id_hari: number, id: number, token: string) => Promise<void>;
}

export const useMateriStore = create<MateriStore>((set, get) => ({
  materiList: [],
  isLoading: false,
  error: null,

  fetchMateri: async (id_hari: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const materiList = await getMateriByHari(id_hari, token);
      set({ materiList, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addMateri: async (data, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await addMateri(data, token);
      // Refresh the list after adding
      await get().fetchMateri(data.id_hari, token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  editMateri: async (id_hari, id, data, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiUpdateMateri(id, data, token);
      await get().fetchMateri(id_hari, token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteMateri: async (id_hari, id, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteMateri(id, token);
      await get().fetchMateri(id_hari, token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));