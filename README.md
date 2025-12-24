# Mini SIMRS API - Patient Status Management

REST API untuk manajemen perubahan status pasien menggunakan NestJS dengan Redis sebagai in-memory database.

## Fitur

- REST API dengan method POST dan GET
- Soft Delete - Data tidak benar-benar dihapus, hanya ditandai sebagai deleted
- Redis sebagai in-memory database
- Validasi Input menggunakan class-validator
- Response Code Konsisten dengan format standar
- Error Handling dengan global exception filter
- RBAC (Role-Based Access Control) dengan 3 role berbeda
- Swagger/OpenAPI Documentation - Interactive API docs

## Swagger Documentation

Setelah menjalankan aplikasi, buka:

```
http://localhost:3000/api/docs
```

## Role-Based Access Control (RBAC)

| User | Password | Role | Akses |
|------|----------|------|-------|
| user-a | password123 | OPERATOR | POST only (Create, Update, Delete, Restore) |
| user-b | password123 | ADMIN | POST & GET (Full access) |
| user-c | password123 | VIEWER | GET only (Read only) |

## Instalasi

### Prasyarat

- Node.js >= 18.x
- npm atau yarn
- Redis Server (running on localhost:6379)

### Langkah Instalasi

```bash
# 1. Masuk ke direktori project
cd mini-simrs-api

# 2. Install dependencies
npm install

# 3. Pastikan Redis sudah berjalan
# Mac dengan Homebrew:
brew services start redis

# Linux:
redis-server

# Atau menggunakan Docker:
docker run -d -p 6379:6379 redis:alpine

# 4. Jalankan aplikasi dalam mode development
npm run start:dev
```

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Deskripsi | Role Required |
|--------|----------|-----------|---------------|
| GET | /patient-status | Mendapatkan semua data | ADMIN, VIEWER |
| GET | /patient-status/:id | Mendapatkan data by ID | ADMIN, VIEWER |
| GET | /patient-status/statistics | Mendapatkan statistik | ADMIN, VIEWER |
| POST | /patient-status | Membuat data baru | ADMIN, OPERATOR |
| POST | /patient-status/:id/update | Update data | ADMIN, OPERATOR |
| POST | /patient-status/:id/soft-delete | Soft delete data | ADMIN, OPERATOR |
| POST | /patient-status/:id/restore | Restore data | ADMIN, OPERATOR |

## Contoh Request

### Create Patient Status

```bash
curl -X POST http://localhost:3000/api/v1/patient-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic dXNlci1iOnBhc3N3b3JkMTIz" \
  -d '{
    "patientId": "P001",
    "patientName": "John Doe",
    "medicalRecordNumber": "MR-123456",
    "status": "REGISTERED",
    "department": "Emergency"
  }'
```

### Get All Patient Status

```bash
curl -X GET "http://localhost:3000/api/v1/patient-status" \
  -H "Authorization: Basic dXNlci1iOnBhc3N3b3JkMTIz"
```

## Status Pasien

| Status | Deskripsi |
|--------|-----------|
| REGISTERED | Pasien terdaftar |
| WAITING | Menunggu pemeriksaan |
| IN_EXAMINATION | Sedang diperiksa |
| LAB_TEST | Tes laboratorium |
| RADIOLOGY | Radiologi |
| PHARMACY | Mengambil obat |
| INPATIENT | Rawat inap |
| SURGERY | Operasi |
| RECOVERY | Pemulihan |
| DISCHARGED | Pulang |
| REFERRED | Dirujuk |
| CANCELLED | Dibatalkan |

## License

MIT License
