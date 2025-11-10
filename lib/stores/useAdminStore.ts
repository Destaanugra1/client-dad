import { create } from 'zustand'
import { getAdminUsers, updateAdminUserRole, getAdminStats, bulkDeletePeserta, deleteAdminHari, deleteAdminMateri } from '@/lib/api'

interface AdminUser {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  image_url?: string
  role: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
}

interface AdminStats {
  totalUsers: number
  totalPeserta: number
  totalHari: number
  totalMateri: number
  totalKeaktifan: number
}

interface AdminStore {
  users: AdminUser[]
  stats: AdminStats | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchUsers: (token: string) => Promise<void>
  updateUserRole: (userId: string, role: string, token: string) => Promise<void>
  deleteBulkPeserta: (pesertaIds: number[], token: string) => Promise<void>
  deleteHari: (hariId: number, token: string) => Promise<void>
  deleteMateri: (materiId: number, token: string) => Promise<void>
  fetchStats: (token: string) => Promise<void>
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchUsers: async (token: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await getAdminUsers(token)
      set({ users: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching users:', error)
      set({ error: 'Failed to fetch users', isLoading: false })
    }
  },

  updateUserRole: async (userId: string, role: string, token: string) => {
    set({ isLoading: true, error: null })
    try {
      await updateAdminUserRole(userId, role, token)
      const users = get().users.map(u => u.id === userId ? { ...u, role } : u)
      set({ users, isLoading: false })
    } catch (error) {
      console.error('Error updating user role:', error)
      set({ error: 'Failed to update user role', isLoading: false })
    }
  },

  deleteBulkPeserta: async (pesertaIds: number[], token: string) => {
    set({ isLoading: true, error: null })
    try {
      await bulkDeletePeserta(pesertaIds, token)
      set({ isLoading: false })
    } catch (error) {
      console.error('Error deleting peserta:', error)
      set({ error: 'Failed to delete peserta', isLoading: false })
    }
  },

  deleteHari: async (hariId: number, token: string) => {
    set({ isLoading: true, error: null })
    try {
      await deleteAdminHari(hariId, token)
      set({ isLoading: false })
    } catch (error) {
      console.error('Error deleting hari:', error)
      set({ error: 'Failed to delete hari', isLoading: false })
    }
  },

  deleteMateri: async (materiId: number, token: string) => {
    set({ isLoading: true, error: null })
    try {
      await deleteAdminMateri(materiId, token)
      set({ isLoading: false })
    } catch (error) {
      console.error('Error deleting materi:', error)
      set({ error: 'Failed to delete materi', isLoading: false })
    }
  },

  fetchStats: async (token: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await getAdminStats(token)
      set({ stats: data.stats, isLoading: false })
    } catch (error) {
      console.error('Error fetching stats:', error)
      set({ error: 'Failed to fetch stats', isLoading: false })
    }
  },
}))