import { create } from 'zustand';
import { getPeserta, postKeaktifan, getKeaktifanMateri, addPeserta, removePeserta } from '@/lib/api';

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

interface PesertaStore {
  pesertaList: Peserta[];
  keaktifanStatuses: KeaktifanStatus[];
  isLoading: boolean;
  error: string | null;
  fetchPeserta: (token: string) => Promise<void>;
  fetchKeaktifanStatuses: (id_materi: number, token: string) => Promise<void>;
  updateStatus: (data: {
    id_peserta: number;
    id_materi: number;
    status: 'HIJAU' | 'KUNING' | 'MERAH';
  }, token: string) => Promise<void>;
  addPesertaManual: (nama: string, token: string) => Promise<void>;
  deletePesertaById: (id: number, token: string) => Promise<void>;
}

export const usePesertaStore = create<PesertaStore>((set, get) => ({
  pesertaList: [],
  keaktifanStatuses: [],
  isLoading: false,
  error: null,

  fetchPeserta: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const pesertaList = await getPeserta(token);
      set({ pesertaList, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchKeaktifanStatuses: async (id_materi: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const keaktifanStatuses = await getKeaktifanMateri(id_materi, token);
      set({ keaktifanStatuses, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateStatus: async (data, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await postKeaktifan(data, token);
      // Refresh the statuses after updating
      await get().fetchKeaktifanStatuses(data.id_materi, token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  addPesertaManual: async (nama: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const created = await addPeserta({ nama }, token);
      set({ pesertaList: [...get().pesertaList, created], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deletePesertaById: async (id: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await removePeserta(id, token);
      set({ pesertaList: get().pesertaList.filter(p => p.id !== id), isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));