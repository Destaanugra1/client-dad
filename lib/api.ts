const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic fetcher function with authentication
export async function fetcher(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
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
export async function uploadExcel(file: File, token: string): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/peserta/upload`, {
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
export async function getPeserta(token: string): Promise<Array<{ id: number; nama: string }>> {
  return fetcher('/api/peserta', token);
}

// Add peserta manually
export async function addPeserta(data: { nama: string }, token: string): Promise<{ id: number; nama: string }> {
  return fetcher('/api/peserta', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Delete peserta by id
export async function removePeserta(id: number, token: string): Promise<{ success: boolean }> {
  return fetcher(`/api/peserta/${id}`, token, {
    method: 'DELETE',
  });
}

// Add new hari
export async function addHari(data: { nama_hari: string; tanggal: string }, token: string): Promise<{ id: number; nama_hari: string; tanggal: string }> {
  return fetcher('/api/hari', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get all hari
export async function getHari(token: string): Promise<Array<{ id: number; nama_hari: string; tanggal: string }>> {
  return fetcher('/api/hari', token);
}

// Add new materi
export async function addMateri(data: {
  id_hari: number;
  judul_materi: string;
  pemateri?: string;
  waktu_mulai: string;
  waktu_selesai: string;
}, token: string): Promise<{ id: number; judul_materi: string; waktu_mulai: string; waktu_selesai: string; locked: boolean }> {
  return fetcher('/api/materi', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update materi
export async function updateMateri(id: number, data: {
  judul_materi?: string;
  pemateri?: string | null;
  waktu_mulai?: string; // HH:mm
  waktu_selesai?: string; // HH:mm
}, token: string): Promise<{ id: number; judul_materi: string; waktu_mulai: string; waktu_selesai: string; locked: boolean }>{
  return fetcher(`/api/materi/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete materi
export async function deleteMateri(id: number, token: string): Promise<{ success: boolean }>{
  return fetcher(`/api/materi/${id}`, token, {
    method: 'DELETE',
  });
}

// Get materi by hari ID
export async function getMateriByHari(id_hari: number, token: string): Promise<Array<{
  id: number;
  judul_materi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  locked: boolean;
}>> {
  return fetcher(`/api/materi/hari/${id_hari}`, token);
}

// Post keaktifan status
export async function postKeaktifan(data: {
  id_peserta: number;
  id_materi: number;
  status: 'HIJAU' | 'KUNING' | 'MERAH';
}, token: string): Promise<{ id: number; status: string }> {
  return fetcher('/api/keaktifan', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get keaktifan for specific materi
export async function getKeaktifanMateri(id_materi: number, token: string): Promise<Array<{
  peserta: { id: number; nama: string };
  status: 'HIJAU' | 'KUNING' | 'MERAH';
}>> {
  return fetcher(`/api/keaktifan/materi/${id_materi}`, token);
}

// Export hari as Excel file
export async function exportHariExcel(id_hari: number, token: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/api/export/hari/${id_hari}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Export failed! status: ${res.status}`);
  }

  return res.blob();
}