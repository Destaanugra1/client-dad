// Enforce API base exclusively from env, without any hardcoded fallback
// Accept values like:
//   - http://localhost:5000            -> will become http://localhost:5000/api
//   - http://localhost:5000/           -> will become http://localhost:5000/api
//   - http://localhost:5000/api        -> stays the same
//   - http://localhost:5000/api/       -> trimmed to http://localhost:5000/api
const RAW_API = process.env.NEXT_PUBLIC_API_URL || ''
if (!RAW_API) {
  // Help developers notice missing configuration early
  // Note: This will throw on client side if env not provided
  throw new Error('Missing NEXT_PUBLIC_API_URL. Please set it in .env.local (e.g., NEXT_PUBLIC_API_URL=http://localhost:5000)')
}
const TMP = RAW_API.replace(/\/$/, '')
export const API_BASE_URL = TMP.endsWith('/api') ? TMP : `${TMP}/api`

// Generic fetcher function with authentication
export async function fetcher(path: string, token: string, options?: RequestInit) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const res = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

// Upload Excel file for peserta
export async function uploadExcel(file: File, token: string, kelas: 'A' | 'B' | 'C' = 'A'): Promise<{ message: string; kelas: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kelas', kelas);

  const res = await fetch(`${API_BASE_URL}/peserta/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed! status: ${res.status}`);
  }

  return res.json();
}

// Get all peserta
export async function getPeserta(token: string, kelas?: 'A' | 'B' | 'C'): Promise<Array<{ id: number; nama: string; kelas: string }>> {
  const query = kelas ? `?kelas=${kelas}` : '';
  return fetcher(`/peserta${query}`, token);
}

// Add peserta manually
export async function addPeserta(data: { nama: string; kelas?: 'A' | 'B' | 'C' }, token: string): Promise<{ id: number; nama: string; kelas: string }> {
  return fetcher('/peserta', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Delete peserta by id
export async function removePeserta(id: number, token: string): Promise<{ success: boolean }> {
  return fetcher(`/peserta/${id}`, token, {
    method: 'DELETE',
  });
}

// Add new hari
export async function addHari(data: { nama_hari: string; tanggal: string }, token: string): Promise<{ id: number; nama_hari: string; tanggal: string }> {
  return fetcher('/hari', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get all hari
export async function getHari(token: string): Promise<Array<{ id: number; nama_hari: string; tanggal: string }>> {
  return fetcher('/hari', token);
}

// Add new materi
export async function addMateri(data: {
  id_hari: number;
  judul_materi: string;
  pemateri?: string;
  kelas?: 'A' | 'B' | 'C';
  waktu_mulai: string;
  waktu_selesai: string;
}, token: string): Promise<{ id: number; judul_materi: string; kelas: string; waktu_mulai: string; waktu_selesai: string; locked: boolean }> {
  return fetcher('/materi', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update materi
export async function updateMateri(id: number, data: {
  judul_materi?: string;
  pemateri?: string | null;
  kelas?: 'A' | 'B' | 'C';
  waktu_mulai?: string; // HH:mm
  waktu_selesai?: string; // HH:mm
}, token: string): Promise<{ id: number; judul_materi: string; kelas: string; waktu_mulai: string; waktu_selesai: string; locked: boolean }>{
  return fetcher(`/materi/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete materi
export async function deleteMateri(id: number, token: string): Promise<{ success: boolean }>{
  return fetcher(`/materi/${id}`, token, {
    method: 'DELETE',
  });
}

// Get materi by hari ID
export async function getMateriByHari(id_hari: number, token: string, kelas?: 'A' | 'B' | 'C'): Promise<Array<{
  id: number;
  judul_materi: string;
  kelas: string;
  waktu_mulai: string;
  waktu_selesai: string;
  locked: boolean;
}>> {
  const query = kelas ? `?kelas=${kelas}` : '';
  return fetcher(`/materi/hari/${id_hari}${query}`, token);
}

// Post keaktifan status
export async function postKeaktifan(data: {
  id_peserta: number;
  id_materi: number;
  status: 'HIJAU' | 'KUNING' | 'MERAH';
}, token: string): Promise<{ id: number; status: string }> {
  return fetcher('/keaktifan', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get keaktifan for specific materi
export async function getKeaktifanMateri(id_materi: number, token: string): Promise<Array<{
  peserta: { id: number; nama: string };
  status: 'HIJAU' | 'KUNING' | 'MERAH';
}>> {
  return fetcher(`/keaktifan/materi/${id_materi}`, token);
}

// Export hari as Excel file
export async function exportHariExcel(id_hari: number, token: string, kelas?: 'A' | 'B' | 'C'): Promise<Blob> {
  const query = kelas ? `?kelas=${kelas}` : '';
  const res = await fetch(`${API_BASE_URL}/export/hari/${id_hari}${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Export failed! status: ${res.status}`);
  }

  return res.blob();
}

// ===================== ADMIN HELPERS =====================
// All admin endpoints sit under /api/admin/* (API_BASE_URL already includes /api)

export interface AdminUserDto {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  image_url?: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
  role: string
}

export interface AdminStatsDto {
  stats: {
    totalUsers: number
    totalPeserta: number
    totalHari: number
    totalMateri: number
    totalKeaktifan: number
  }
  recent?: any
}

async function adminFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const res = await fetch(`${API_BASE_URL}/admin${normalized}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

export const getAdminUsers = (token: string) => adminFetch<AdminUserDto[]>('/users', token)
export const updateAdminUserRole = (userId: string, role: string, token: string) => adminFetch<{message:string}>(`/users/${userId}/role`, token, { method: 'PUT', body: JSON.stringify({ role }) })
export const getAdminStats = (token: string) => adminFetch<AdminStatsDto>('/stats', token)
export const bulkDeletePeserta = (ids: number[], token: string) => adminFetch<{deletedCount:number}>(`/peserta/bulk`, token, { method: 'DELETE', body: JSON.stringify({ pesertaIds: ids }) })
export const deleteAdminHari = (hariId: number, token: string) => adminFetch<{message:string}>(`/hari/${hariId}`, token, { method: 'DELETE' })
export const deleteAdminMateri = (materiId: number, token: string) => adminFetch<{message:string}>(`/materi/${materiId}`, token, { method: 'DELETE' })
export const lockAdminMateri = (materiId: number, token: string) => adminFetch<{message:string}>(`/materi/${materiId}/lock`, token, { method: 'POST' })
export const unlockAdminMateri = (materiId: number, token: string) => adminFetch<{message:string}>(`/materi/${materiId}/unlock`, token, { method: 'POST' })
export const getAllAdminMateri = (token: string) => adminFetch<Array<{id:number; id_hari:number; judul_materi:string; pemateri:string; kelas:string; waktu_mulai:string; waktu_selesai:string; locked:boolean}>>('/materi', token)