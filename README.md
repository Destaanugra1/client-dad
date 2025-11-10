# Monitoring Absen Frontend

Aplikasi frontend Next.js untuk sistem monitoring keaktifan peserta.

## Features

- ✅ **Authentication**: Clerk integration dengan JWT Bearer Token
- ✅ **State Management**: Zustand untuk state management
- ✅ **UI Components**: React components dengan Tailwind CSS
- ✅ **API Integration**: Fetch helper functions untuk backend communication
- ✅ **Upload Excel**: Drag & drop Excel upload untuk data peserta
- ✅ **Export Excel**: Download laporan keaktifan dalam format Excel
- ✅ **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **State Management**: Zustand
- **Runtime**: Edge (Vercel Compatible)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Buat file `.env.local` dan isi dengan:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 3. Clerk Setup

1. Buat akun di [Clerk.dev](https://clerk.dev)
2. Buat aplikasi baru
3. Copy publishable key dan secret key ke `.env.local`
4. Setup sign-in methods (email/password, Google, etc.)

### 4. Run Development Server

```bash
npm run dev
```

## Project Structure

```
app/
├── globals.css              # Global styles
├── layout.tsx              # Root layout dengan ClerkProvider
├── page.tsx                # Home page (redirect logic)
├── login/
│   └── page.tsx            # Login page dengan Clerk SignIn
├── dashboard/
│   └── page.tsx            # Dashboard utama
├── hari/[id]/
│   └── page.tsx            # Detail hari dan daftar materi
└── materi/[id]/
    └── page.tsx            # Detail materi dan status peserta

components/
├── HariCard.tsx            # Card component untuk tampilan hari
├── MateriCard.tsx          # Card component untuk tampilan materi
├── StatusToggle.tsx        # Toggle button untuk status keaktifan
├── PesertaList.tsx         # List component untuk daftar peserta
├── ExcelUploader.tsx       # Drag & drop Excel uploader
└── ExportButton.tsx        # Button untuk export Excel

lib/
├── api.ts                  # API helper functions
└── stores/
    ├── useHariStore.ts     # Zustand store untuk hari
    ├── useMateriStore.ts   # Zustand store untuk materi
    └── usePesertaStore.ts  # Zustand store untuk peserta
```

## API Endpoints

### Authentication
Semua endpoint menggunakan JWT Bearer Token dari Clerk:
```
Authorization: Bearer {token}
```

### Hari (Days)
- `GET /api/hari` - Get all hari
- `POST /api/hari` - Add new hari

### Materi (Materials)
- `GET /api/materi/hari/:id_hari` - Get materi by hari ID
- `POST /api/materi` - Add new materi

### Peserta (Participants)
- `GET /api/peserta` - Get all peserta
- `POST /api/peserta/upload` - Upload Excel file

### Keaktifan (Activity Status)
- `GET /api/keaktifan/materi/:id_materi` - Get status by materi
- `POST /api/keaktifan` - Update participant status

### Export
- `GET /api/export/hari/:id_hari` - Export hari as Excel

## UI Features

### Status Colors
- 🟢 **Hijau (HIJAU)**: Aktif
- 🟡 **Kuning (KUNING)**: Cukup
- 🔴 **Merah (MERAH)**: Tidak Aktif

### Auto-lock Logic
- Jika `materi.locked === true`, StatusToggle menjadi disabled
- Tampilan 🔒 "Terkunci" pada MateriCard yang terkunci

### Upload Behavior
- Jika peserta sudah ada di database, tombol Upload disembunyikan
- Support format .xlsx dan .xls
- Drag & drop interface

## Components Usage

### HariCard
```tsx
<HariCard
  id={1}
  nama_hari="Hari 1"
  tanggal="2024-01-01"
/>
```

### StatusToggle
```tsx
<StatusToggle
  status="HIJAU"
  disabled={false}
  onChange={(status) => handleStatusChange(status)}
/>
```

### ExcelUploader
```tsx
<ExcelUploader 
  onUploadSuccess={() => refreshData()} 
/>
```

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## Deployment

### Vercel (Recommended)
1. Connect repository ke Vercel
2. Set environment variables di Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables untuk Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-production-url.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## Troubleshooting

### Common Issues

1. **Auth Errors**: Pastikan Clerk keys sudah benar di `.env.local`
2. **API Errors**: Cek backend URL dan token authentication
3. **Upload Errors**: Pastikan backend endpoint `/api/peserta/upload` berfungsi
4. **Build Errors**: Jalankan `npm run lint` untuk fix linting issues

### Debug Tips
- Use browser DevTools untuk check network requests
- Check token validity di Clerk dashboard
- Verify backend CORS settings untuk frontend domain

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
